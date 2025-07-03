const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const darkMode = document.querySelector('.dark-mode');

menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
});

darkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode-variables');
    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
});

function scrollCarousel(level, direction) {
    const carousel = document.getElementById(`carousel-${level}`);
    // Calcul dynamique de la largeur d'une carte + gap
    const card = carousel.querySelector('.course-card');
    const carouselStyle = getComputedStyle(carousel);
    const gap = parseInt(carouselStyle.gap) || 0;
    const cardWidth = card.offsetWidth + gap;
    const scrollAmount = direction * cardWidth * 2; // Faire défiler 2 cards à la fois

    carousel.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.course-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';

            }, 150);
        });
    });
});

