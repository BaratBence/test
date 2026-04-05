const CONFIG = {
    imagesFolder: './images/',
};

class PhotoGallery {
    constructor() {
        this.collections = [];
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

    async init() {
        await this.loadImages();
        this.setHeroBackground();
        this.setupEventListeners();
        this.setupScrollEffects();
        this.startHeroRotation();
    }

    async loadImages() {
        let generatedArray = []
        const response =  await fetch('images.json');
        generatedArray = await response.json();
        
        let collections = generatedArray.map(img => ({
            src: CONFIG.imagesFolder + img.path + img.filename,
            title: img.title,
            category: img.category,
            pictures: img.pictures,
            path: CONFIG.imagesFolder + img.path
        }));
        
        this.collections = collections;
        this.titleImage = this.collections.filter(img => img.category == 'title');
        this.filteredImages = this.collections.filter(img => img.category === 'wedding');
        this.renderGallery();
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
        this.filteredImages = this.collections.filter(img => img.category === category );
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

// Active nav link on scroll
const sections = [
    //document.getElementById('hero'),
    document.getElementById('about'),
    document.getElementById('pictures'),
    document.getElementById('contacts')
].filter(Boolean);

const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + window.innerHeight * 0.4; // trigger at 40% down the viewport

    let current = sections[0];
    sections.forEach(section => {
        if (section.offsetTop <= scrollY) {
            current = section;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current.id) {
            link.classList.add('active');
        }
    });
});