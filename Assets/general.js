// ===== MOBILE MENU FUNCTIONALITY =====
const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

function openMenu() {
    mobileMenu.classList.add('active');
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    mobileMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

menuToggle.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
mobileMenuOverlay.addEventListener('click', closeMenu);

// Close menu when clicking on a link
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMenu();
    }
});

// ===== NAVBAR SCROLL BEHAVIOR =====
const navbar = document.querySelector('.navbar');
const heroSection = document.querySelector('.hero-section');
let lastScrollY = window.scrollY;
let navbarTicking = false;

function updateNavbar() {
    const currentScrollY = window.scrollY;
    const heroHeight = heroSection ? heroSection.offsetHeight : 0;

    // Only apply hide/show behavior after scrolling past the hero section
    if (currentScrollY > heroHeight) {
        if (currentScrollY > lastScrollY) {
            // Scrolling down - hide navbar
            navbar.classList.add('hidden');
        } else {
            // Scrolling up - show navbar
            navbar.classList.remove('hidden');
        }
    } else {
        // Still in hero section - always show navbar
        navbar.classList.remove('hidden');
    }

    lastScrollY = currentScrollY;
    navbarTicking = false;
}

// Use requestAnimationFrame for better performance
window.addEventListener('scroll', () => {
    if (!navbarTicking) {
        window.requestAnimationFrame(updateNavbar);
        navbarTicking = true;
    }
});
