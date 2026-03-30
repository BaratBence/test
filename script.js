// ============================================
// CONFIGURATION - Edit these values
// ============================================
const CONFIG = {
        imagesFolder: './images/',
        supportedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
            
        // példa: { filename: 'image.jpg', title: 'Optional Title', category: 'portrait' }
        images: [
                { filename: 'photo1.png', title: 'Clair obscur', category: 'portrait' },
                { filename: 'photo2.png', title: 'Meow', category: 'landscape' },
        ]
};

class PhotoGallery {
      constructor() {
                this.images = [];
                this.filteredImages = [];
                this.currentFilter = 'all';
                this.currentLightboxIndex = 0;
                
                this.gallery = document.getElementById('gallery');
                this.loading = document.getElementById('loading');
                this.lightbox = document.getElementById('lightbox');
                this.lightboxImg = document.getElementById('lightboxImg');
                this.lightboxTitle = document.getElementById('lightboxTitle');
                this.lightboxCategory = document.getElementById('lightboxCategory');
                this.heroBg = document.getElementById('heroBg');
                
                this.init();
            }

            async init() {
                await this.loadImages();
                this.setupEventListeners();
                this.setupScrollEffects();
            }

            async loadImages() {
                try {
                    // Method 1: Try fetching from a server endpoint (Node.js, PHP, etc.)
                    let images = await this.fetchFromServer();
                    
                    // Method 2: Fall back to static image list
                    if (!images.length && CONFIG.staticImages.length) {
                        images = CONFIG.staticImages.map(img => ({
                            src: CONFIG.imagesFolder + img.filename,
                            title: img.title || this.generateTitle(img.filename),
                            category: img.category || this.detectCategory(img.filename)
                        }));
                    }
                    
                    // Method 3: Demo images for preview
                    if (!images.length) {
                        images = this.getDemoImages();
                    }
                    
                    this.images = images;
                    this.filteredImages = [...this.images];
                    this.renderGallery();
                    this.setHeroBackground();
                    
                } catch (error) {
                    console.error('Error loading images:', error);
                    this.images = this.getDemoImages();
                    this.filteredImages = [...this.images];
                    this.renderGallery();
                }
            }

            async fetchFromServer() {
                try {
                    // Try to fetch image list from server
                    const response = await fetch('/api/images');
                    if (response.ok) {
                        return await response.json();
                    }
                } catch (e) {
                    // Server endpoint not available
                }
                
                // Alternative: Try to read directory (requires server-side support)
                try {
                    const response = await fetch(CONFIG.imagesFolder);
                    if (response.ok) {
                        const text = await response.text();
                        // Parse directory listing (works with some servers)
                        const matches = text.match(/href="([^"]+\.(jpg|jpeg|png|webp|gif))"/gi);
                        if (matches) {
                            return matches.map(match => {
                                const filename = match.match(/href="([^"]+)"/)[1];
                                return {
                                    src: CONFIG.imagesFolder + filename,
                                    title: this.generateTitle(filename),
                                    category: this.detectCategory(filename)
                                };
                            });
                        }
                    }
                } catch (e) {
                    // Directory listing not available
                }
                
                return [];
            }

            generateTitle(filename) {
                return filename
                    .replace(/\.[^/.]+$/, '')
                    .replace(/[-_]/g, ' ')
                    .replace(/\b\w/g, c => c.toUpperCase());
            }

            detectCategory(filename) {
                const lower = filename.toLowerCase();
                if (lower.includes('portrait') || lower.includes('face') || lower.includes('person')) return 'portrait';
                if (lower.includes('landscape') || lower.includes('mountain') || lower.includes('sky')) return 'landscape';
                if (lower.includes('street') || lower.includes('city') || lower.includes('urban')) return 'street';
                if (lower.includes('nature') || lower.includes('flower') || lower.includes('animal')) return 'nature';
                return ['portrait', 'landscape', 'street', 'nature'][Math.floor(Math.random() * 4)];
            }

            getDemoImages() {
                // Beautiful demo images from Unsplash
                return [
                    { src: '[images.unsplash.com](https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800)', title: 'Ethereal Light', category: 'portrait' },
                    { src: '[images.unsplash.com](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800)', title: 'Alpine Dawn', category: 'landscape' },
                    { src: '[images.unsplash.com](https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800)', title: 'Natural Beauty', category: 'portrait' },
                    { src: '[images.unsplash.com](https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800)', title: 'Starlit Peaks', category: 'landscape' },
                    { src: '[images.unsplash.com](https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800)', title: 'Urban Portrait', category: 'portrait' },
                    { src: '[images.unsplash.com](https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800)', title: 'Tokyo Nights', category: 'street' },
                    { src: '[images.unsplash.com](https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800)', title: 'Forest Light', category: 'nature' },
                    { src: '[images.unsplash.com](https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800)', title: 'Confident', category: 'portrait' },
                    { src: '[images.unsplash.com](https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800)', title: 'Character Study', category: 'portrait' },
                    { src: '[images.unsplash.com](https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800)', title: 'Misty Valley', category: 'landscape' },
                    { src: '[images.unsplash.com](https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800)', title: 'City Pulse', category: 'street' },
                    { src: '[images.unsplash.com](https://images.unsplash.com/photo-1518173946687-a4c036bc1bc5?w=800)', title: 'Bloom', category: 'nature' },
                ];
            }

            renderGallery() {
                this.loading.style.display = 'none';
                this.gallery.innerHTML = '';
                
                this.filteredImages.forEach((image, index) => {
                    const item = document.createElement('div');
                    item.className = 'gallery-item fade-in';
                    item.dataset.index = index;
                    item.innerHTML = `
                        <img src="${image.src}" alt="${image.title}" loading="lazy">
                        <div class="overlay">
                            <h3>${image.title}</h3>
                            <p>${image.category}</p>
                        </div>
                    `;
                    this.gallery.appendChild(item);
                });
            }

            setHeroBackground() {
                if (this.images.length > 0) {
                    //const randomImage = this.images[Math.floor(Math.random() * this.images.length)];
                    const randomImage = this.images[0];    
                    this.heroBg.style.backgroundImage = `url(${randomImage.src})`;
                }
            }

            filterImages(category) {
                this.currentFilter = category;
                this.filteredImages = category === 'all' 
                    ? [...this.images]
                    : this.images.filter(img => img.category === category);
                this.renderGallery();
            }

            openLightbox(index) {
                this.currentLightboxIndex = index;
                const image = this.filteredImages[index];
                this.lightboxImg.src = image.src;
                this.lightboxTitle.textContent = image.title;
                this.lightboxCategory.textContent = image.category;
                this.lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            closeLightbox() {
                this.lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }

            navigateLightbox(direction) {
                this.currentLightboxIndex += direction;
                if (this.currentLightboxIndex < 0) this.currentLightboxIndex = this.filteredImages.length - 1;
                if (this.currentLightboxIndex >= this.filteredImages.length) this.currentLightboxIndex = 0;
                
                const image = this.filteredImages[this.currentLightboxIndex];
                this.lightboxImg.src = image.src;
                this.lightboxTitle.textContent = image.title;
                this.lightboxCategory.textContent = image.category;
            }

            setupEventListeners() {
                // Filter buttons
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        this.filterImages(btn.dataset.filter);
                    });
                });

                // Gallery click
                this.gallery.addEventListener('click', (e) => {
                    const item = e.target.closest('.gallery-item');
                    if (item) {
                        this.openLightbox(parseInt(item.dataset.index));
                    }
                });

                // Lightbox controls
                document.getElementById('lightboxClose').addEventListener('click', () => this.closeLightbox());
                document.getElementById('lightboxPrev').addEventListener('click', () => this.navigateLightbox(-1));
                document.getElementById('lightboxNext').addEventListener('click', () => this.navigateLightbox(1));
                
                // Keyboard navigation
                document.addEventListener('keydown', (e) => {
                    if (!this.lightbox.classList.contains('active')) return;
                    if (e.key === 'Escape') this.closeLightbox();
                    if (e.key === 'ArrowLeft') this.navigateLightbox(-1);
                    if (e.key === 'ArrowRight') this.navigateLightbox(1);
                });

                // Click outside to close
                this.lightbox.addEventListener('click', (e) => {
                    if (e.target === this.lightbox) this.closeLightbox();
                });
            }

            setupScrollEffects() {
                const header = document.querySelector('header');
                window.addEventListener('scroll', () => {
                    header.classList.toggle('scrolled', window.scrollY > 50);
                });
            }
        }

        // Initialize gallery
        new PhotoGallery();
