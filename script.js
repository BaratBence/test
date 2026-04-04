const CONFIG = {
    imagesFolder: './images/',
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],

    // példa: { filename: 'image.jpg', title: 'Optional Title', category: 'portrait' }
    staticImages: [
        //{ filename: 'DSC_5932.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding' , cover: false },
        //{ filename: 'DSC_5948.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding' , cover: true },
        //{ filename: 'DSC_6240.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding'  ,cover: true},
        //{ filename: 'DSC_6252.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding' , cover: true},
        //{ filename: 'DSC_6269.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding' , cover: true},
        //{ filename: 'DSC_6270.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding' , cover: true},
        //{ filename: 'DSC_6276.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding' , cover: true},
        //{ filename: 'DSC_6340.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding', cover: true },
        //{ filename: 'DSC_6436.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding', cover: true },
        //{ filename: 'DSC_6503.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding', cover: true },
        //{ filename: 'DSC_6574.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding', cover: true },
        //{ filename: 'DSC_6596.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding' , cover: true},
        //{ filename: 'DSC_6649.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding', cover: true },
       // { filename: 'DSC_6752.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding' , cover: true},
       // { filename: 'DSC_6766.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding', cover: true },
        //{ filename: 'DSC_6791.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding' , cover: true},
       // { filename: 'DSC_6847.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding' , cover: true},
       // { filename: 'DSC_6864.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding' , cover: true},
       // { filename: 'DSC_6890.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding' , cover: true},
       // { filename: 'DSC_6895.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding' , cover: true},
       // { filename: 'DSC_6901.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding' , cover: true},
       // { filename: 'DSC_6907.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding' , cover: true},
       // { filename: 'DSC_6913.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding' , cover: true},
       // { filename: 'DSC_6946.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding' , cover: true},
       // { filename: 'DSC_6962.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding', cover: true },
       // { filename: 'DSC_7082.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding', cover: true },
        { filename: 'DSC_7091.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding'},
        { filname: 'cover.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding', path: 'Lilla és Robi esküvő/', pictures: [
                'cover.jpeg', 'DSC_5932.jpeg'
        ]},
        { filname: 'cover.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding', path: 'test/', pictures: [
                'cover.jpeg', 'DSC_5932.jpeg'
        ]},
    ]
};

class PhotoGallery {
    constructor() {
        this.images = [];
        this.filteredImages = [];
        this.currentFilter = 'portrait';
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

    init() {
        this.loadImagesNew();
        this.loadImages();
        this.filterImages('portrait');
        this.setupEventListeners();
        this.setupScrollEffects();
        this.startHeroRotation();
    }

    loadImagesNew() {
        let images = CONFIG.staticImages.map(img => ({
            src: CONFIG.imagesFolder + img.path + img.filename,
            title: img.title,
            category: img.category,
            pictures: img.pictures
        }));
        this.images = images;
    }

    loadImages() {
        let images = CONFIG.staticImages.map(img => ({
            src: CONFIG.imagesFolder + img.filename,
            title: img.title,
            category: img.category
        }));

        this.images = images;
        //let filtered = images.filter(image => image.category === this.currentFilter)
        //this.filteredImages = [...this.images];
        //this.renderGallery();
        //TODO: filter these too
        this.setHeroBackground();
    }

    renderGallery() {
        this.loading.style.display = 'none';
        this.gallery.innerHTML = '';

        this.filteredImages.forEach((image, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item fade-in';
            item.dataset.index = index;
            console.log("image" + image.src);
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

    setHeroBackground(index = 0) {
        const image = this.images[index];
        this.heroBg.style.opacity = 0;
        setTimeout(() => {
            this.heroBg.style.backgroundImage = `url(${image.src})`;
            this.heroBg.style.opacity = 0.15;
        }, 1000);
        
    }


    startHeroRotation() {
        if (this.images.length === 0) return;

        let index = 0;
        this.setHeroBackground(index);

        setInterval(() => {
            index = (index + 1) % this.images.length;
            this.setHeroBackground(index);
        }, 10000);
    }

    filterImages(category) {
        this.currentFilter = category;
        this.filteredImages = this.images.filter(img => img.category === category );
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
