const CONFIG = {
    imagesFolder: './images/',
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],

    // példa: { filename: 'image.jpg', title: 'Optional Title', category: 'portrait' }
    staticImages: [
        { filename: 'cover.jpeg', title: 'Lilla és Robi esküvő', category: 'wedding', path: 'Lilla és Robi esküvő/', pictures: [
                'cover.jpeg', 'DSC_5932.jpeg', 'DSC_5948.jpeg', 'DSC_6240.jpeg', 'DSC_6252.jpeg', 'DSC_6269.jpeg', 'DSC_6270.jpeg', 'DSC_6276.jpeg', 'DSC_6340.jpeg',
                'DSC_6436.jpeg', 'DSC_6503.jpeg', 'DSC_6574.jpeg', 'DSC_6596.jpeg', 'DSC_6649.jpeg', 'DSC_6752.jpeg', 'DSC_6766.jpeg', 'DSC_6791.jpeg', 'DSC_6847.jpeg',
                'DSC_6864.jpeg', 'DSC_6890.jpeg', 'DSC_6895.jpeg', 'DSC_6901.jpeg', 'DSC_6907.jpeg', 'DSC_6913.jpeg', 'DSC_6946.jpeg', 'DSC_6962.jpeg', 'DSC_7082.jpeg', 'DSC_7091.jpeg'
        ]},
         { filename: '', title: '', category: 'title', path: 'title/', pictures: [
                'DSC_5948.jpeg', 'DSC_6946.jpeg'
        ]}
    ]
};

class PhotoGallery {
    constructor() {
        this.images = [];
        this.filteredImages = [];
        this.collectionImages = [];
        this.titleImage = [];
        this.currentFilter = '';
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
        this.loadImages();
        this.setHeroBackground();
        this.setupEventListeners();
        this.setupScrollEffects();
        this.startHeroRotation();
    }

    loadImages() {
        let images = CONFIG.staticImages.map(img => ({
            src: CONFIG.imagesFolder + img.path + img.filename,
            title: img.title,
            category: img.category,
            pictures: img.pictures,
            path: CONFIG.imagesFolder + img.path
        }));
        this.images = images;
        this.titleImage = this.images.filter(img => img.category == 'title');
        this.filteredImages = this.images.filter(img => img.category === 'wedding');
    }

    loadImagesOld() {
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

    loadCollection(index) {
        const coverImage = this.filteredImages[index];

        this.collectionImages = coverImage.pictures.map(name => ({
                src: coverImage.path + name,
                title: coverImage.title,
                category: coverImage.category
            }
        ));
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
                            <p>${this.getCategory(image.category)}</p>
                        </div>
                    `;
            this.gallery.appendChild(item);
        });
    }

    getCategory(categoryName) {
        switch(categoryName) {
            case 'wedding': return 'esküvő';
            case 'portrait': return 'portré';
            case 'event' : return 'rendezvény';
        }
    }

    setHeroBackground(index = 0) {
        const imageSrc = this.titleImage[0].path + this.titleImage[0].pictures[index];
        this.heroBg.style.opacity = 0;

        setTimeout(() => {
            this.heroBg.style.backgroundImage = `url(${imageSrc})`;
            this.heroBg.style.opacity = 0.3; //0.15;
        }, 1000);
        
    }

    startHeroRotation() {
        if (this.titleImage.length === 0) return;

        let index = 0;
        setInterval(() => {
            index = (index + 1) % this.titleImage[0].pictures.length;
            this.setHeroBackground(index);
        }, 10000);
    }

    filterCategories(category) {
        this.currentFilter = category;
        this.filteredImages = this.images.filter(img => img.category === category );
        this.renderGallery();
    }

    openLightbox(index) {
        this.loadCollection(index)
        this.currentLightboxIndex = index;
        const image = this.collectionImages[index];
        this.lightboxImg.src = image.src;
        this.lightboxTitle.textContent = image.title;
        this.lightboxCategory.textContent = this.getCategory(image.category);
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    navigateLightbox(direction) {
        this.currentLightboxIndex += direction;
        if (this.currentLightboxIndex < 0) this.currentLightboxIndex = this.collectionImages.length - 1;
        if (this.currentLightboxIndex >= this.collectionImages.length) this.currentLightboxIndex = 0;

        const image = this.collectionImages[this.currentLightboxIndex];
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
                this.filterCategories(btn.dataset.filter);
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
