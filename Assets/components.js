// ================================
// LOAD NAVIGATION & FOOTER
// ================================
function loadNavigation() {
    const navHTML = `
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-logo">
                <img src="/Assets/Img/logo.svg" alt="Balog & Stoica - Cabinet Avocatură București">
            </a>

            <div class="nav-links desktop">
                <a href="/#about">Despre noi</a>
                <a href="/#team">Echipa</a>
                <a href="/#services">Specializări</a>
                <a href="/#contact">Contact</a>
            </div>

            <button class="nav-toggle mobile" aria-label="Toggle navigation" id="menuToggle">
                <img src="/Assets/Img/Hamburger_icon.svg.png" alt="Menu">
            </button>
        </div>
    </nav>

    <div class="mobile-menu-overlay" id="mobileMenuOverlay"></div>

    <div class="mobile-menu" id="mobileMenu">
        <div class="mobile-menu-header">
            <img src="/Assets/Img/logo.svg" class="mobile-menu-logo">
            <button class="mobile-menu-close" id="menuClose">
                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>

        <nav class="mobile-menu-nav">
            <a href="/#about" class="mobile-menu-link">Despre noi</a>
            <a href="/#team" class="mobile-menu-link">Echipă</a>
            <a href="/#services" class="mobile-menu-link">Specializări</a>
            <a href="/#contact" class="mobile-menu-link">Contact</a>
        </nav>
    </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', navHTML);
    fixNavigationPaths();
}

function loadFooter() {
    const footerHTML = `
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-column">
                <h3 class="footer-heading">CONTACT</h3>
                <p>Tel: <a href="tel:+40747486549" class='footer-contact-link'>+40 747 486 549</a> /
                       <a href="tel:+40754503681" class='footer-contact-link'>+40 754 503 681</a></p>
                <p>Email: <a href="mailto:office@balog-stoica.com" class='footer-contact-link'>office@balog-stoica.com</a></p>
            </div>

            <div class="footer-column">
                <h3 class="footer-heading">ADRESĂ</h3>
                <p>Str. Stockholm 19, Sector 1</p>
                <p>București, 011786</p>
                <p>România</p>
            </div>

            <div class="footer-column">
                <h3 class="footer-heading">LINK-URI UTILE</h3>
                <a class="footer-link" href="/ToS/">Termeni și condiții</a>
                <a class="footer-link" href="/PrivacyPolicy/">Politica de confidențialitate</a>
            </div>
        </div>

        <div class="footer-bottom">
            <p>© 2025 Balog & Stoica – Societate Civilă Profesională de Avocați.</p>
        </div>
    </footer>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
    fixFooterPaths();
}

// ================================
// PATH FIXING
// ================================
function getPageDepth() {
    const segments = window.location.pathname
        .replace(/^\/|\/$/g, "")
        .split("/")
        .filter(s => s && s !== "index.html");
    return segments.length;
}

function fixNavigationPaths() {
    const depth = getPageDepth();
    const prefix = depth === 0 ? "./" : "../".repeat(depth);

    // Fix only images inside nav
    document.querySelectorAll(".navbar img, .mobile-menu-logo").forEach(img => {
        img.src = img.src.replace(/^\/Assets/, prefix + "Assets");
    });
}

function fixFooterPaths() {
    const depth = getPageDepth();
    const prefix = depth === 0 ? "./" : "../".repeat(depth);

    document.querySelectorAll(".footer-link").forEach(link => {
        const path = new URL(link.href).pathname;

        if (path.includes("/ToS")) link.href = prefix + "ToS/";
        if (path.includes("/PrivacyPolicy")) link.href = prefix + "PrivacyPolicy/";
    });
}

// ================================
// NAVIGATION INTERACTION
// ================================
function initNavigationBehavior() {
    const menuToggle = document.getElementById("menuToggle");
    const menuClose = document.getElementById("menuClose");
    const mobileMenu = document.getElementById("mobileMenu");
    const overlay = document.getElementById("mobileMenuOverlay");

    const openMenu = () => {
        mobileMenu.classList.add("active");
        overlay.classList.add("active");
        document.body.style.overflow = "hidden";
    };

    const closeMenu = () => {
        mobileMenu.classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
    };

    menuToggle.onclick = openMenu;
    menuClose.onclick = closeMenu;
    overlay.onclick = closeMenu;

    document.querySelectorAll(".mobile-menu-link").forEach(link =>
        link.addEventListener("click", closeMenu)
    );

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeMenu();
    });

    // NAVBAR HIDING ON SCROLL
    const navbar = document.querySelector(".navbar");
    const hero = document.querySelector(".hero-section");

    let lastY = scrollY;

    window.addEventListener("scroll", () => {
        const currentY = scrollY;
        const heroH = hero ? hero.offsetHeight : 0;

        if (currentY > heroH) {
            navbar.classList.toggle("hidden", currentY > lastY);
        } else {
            navbar.classList.remove("hidden");
        }

        lastY = currentY;
    });
}

// ================================
// INITIALIZATION
// ================================
document.addEventListener("DOMContentLoaded", () => {
    loadNavigation();
    loadFooter();
    initNavigationBehavior();
});
