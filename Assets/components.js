// Reusable site components - Navigation and Footer

// Navigation Component
function loadNavigation() {
    const navHTML = `
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <a href="/index.html" class="nav-logo">
                <img src="/Assets/Img/logo.svg" alt="Balog & Stoica - Cabinet Avocatură București">
            </a>
            <div class="nav-links desktop">
                <a href="/index.html#about">Despre noi</a>
                <a href="/index.html#team">Echipa</a>
                <a href="/index.html#services">Specializări</a>
                <a href="/index.html#contact">Contact</a>
            </div>
            <button class="nav-toggle mobile" aria-label="Toggle navigation" id="menuToggle">
                <img src="/Assets/Img/Hamburger_icon.svg.png" alt="Menu">
            </button>
        </div>
    </nav>

    <!-- Mobile Menu Modal -->
    <div class="mobile-menu-overlay" id="mobileMenuOverlay"></div>
    <div class="mobile-menu" id="mobileMenu">
        <div class="mobile-menu-header">
            <img src="/Assets/Img/logo.svg" alt="Balog & Stoica" class="mobile-menu-logo">
            <button class="mobile-menu-close" id="menuClose" aria-label="Close menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <nav class="mobile-menu-nav">
            <a href="/index.html#about" class="mobile-menu-link">Despre noi</a>
            <a href="/index.html#team" class="mobile-menu-link">Echipă</a>
            <a href="/index.html#services" class="mobile-menu-link">Specializări</a>
            <a href="/index.html#contact" class="mobile-menu-link">Contact</a>
        </nav>
    </div>
    `;

    // Insert at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', navHTML);

    // Fix paths based on current page depth
    fixNavigationPaths();
}

// Footer Component
function loadFooter() {
    const footerHTML = `
    <!-- Footer -->
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-column">
                <h3 class="footer-heading">CONTACT</h3>
                <p>Tel: <a href="tel:+40747486549" class="footer-contact-link">+40 747 486 549</a>
                    / <a href="tel:+40754503681" class="footer-contact-link">+40 754 503 681</a>
                </p>
                <p>Email: <a href="mailto:office@balog-stoica.com"
                        class="footer-contact-link">office@balog-stoica.com</a>
                </p>
            </div>
            <div class="footer-column">
                <h3 class="footer-heading">ADRESĂ</h3>
                <p>Str. Stockholm 19, Sector 1</p>
                <p>București, 011786</p>
                <p>România</p>
            </div>
            <div class="footer-column">
                <h3 class="footer-heading">LINK-URI UTILE</h3>
                <a href="/ToS/index.html" class="footer-link">Termeni și condiții</a>
                <a href="/PrivacyPolicy/index.html" class="footer-link">Politica de confidențialitate</a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>© 2025 Balog & Stoica - Societate Civilă Profesională de Avocați. Toate drepturile rezervate.</p>
        </div>
    </footer>
    `;

    // Insert at the end of body
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // Fix paths based on current page depth
    fixFooterPaths();
}

// Helper function to fix navigation paths based on page depth
function fixNavigationPaths() {
    const depth = getPageDepth();
    const prefix = depth === 0 ? './' : '../'.repeat(depth);

    // Fix all navigation links
    document.querySelectorAll('.nav-logo, .mobile-menu-logo').forEach(img => {
        const imgElement = img.tagName === 'IMG' ? img : img.querySelector('img');
        if (imgElement) {
            imgElement.src = imgElement.src.replace(/^\/Assets/, prefix + 'Assets');
        }
    });

    document.querySelectorAll('.nav-logo').forEach(link => {
        link.href = link.href.replace(/^\/index\.html/, prefix + 'index.html');
    });
}

// Helper function to fix footer paths based on page depth
function fixFooterPaths() {
    const depth = getPageDepth();
    const prefix = depth === 0 ? './' : '../'.repeat(depth);

    // Fix footer links
    document.querySelectorAll('.footer-link').forEach(link => {
        if (link.href.includes('/ToS/')) {
            link.href = prefix + 'ToS/index.html';
        } else if (link.href.includes('/PrivacyPolicy/')) {
            link.href = prefix + 'PrivacyPolicy/index.html';
        }
    });
}

// Helper function to determine page depth (0 = root, 1 = one level deep, etc.)
function getPageDepth() {
    const path = window.location.pathname;
    // Remove leading/trailing slashes and count segments
    const segments = path.replace(/^\/|\/$/g, '').split('/').filter(s => s && s !== 'index.html');
    return segments.length;
}

// Initialize components when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        loadNavigation();
        loadFooter();
    });
} else {
    loadNavigation();
    loadFooter();
}
