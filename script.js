fetch('images.json')
  .then(res => res.json())
  .then(images => {
    const gallery = document.getElementById('gallery');

    images.forEach(img => {
      const el = document.createElement('img');
      el.src = 'images/' + img;

      el.addEventListener('click', () => {
        openLightbox(el.src);
      });

      gallery.appendChild(el);
    });
  });

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('close');

function openLightbox(src) {
  lightbox.style.display = 'flex';
  lightboxImg.src = src;
}

closeBtn.onclick = () => lightbox.style.display = 'none';
lightbox.onclick = (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = 'none';
  }
};
