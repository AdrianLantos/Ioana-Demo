/**
 * ====================================================================
 * GOOGLE MAPS CONSENT LOADER
 * ====================================================================
 *
 * This script handles loading Google Maps only after user consent
 *
 * ====================================================================
 */

// ===== GOOGLE MAPS LOADER =====

/**
 * Loads Google Maps iframe after user consent
 */
function loadGoogleMaps() {
    const mapIframe = document.getElementById('mapIframe');
    const mapPlaceholder = document.getElementById('mapPlaceholder');

    if (!mapIframe || !mapPlaceholder) return;

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2847.9485261266113!2d26.0966516!3d44.454726699999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1f9c1a3bf34f3%3A0x513d36574e1790c1!2sBalog%20%26%20Stoica%20-%20Societate%20civil%C4%83%20profesional%C4%83%20de%20avoca%C8%9Bi!5e0!3m2!1sen!2sro!4v1764867913152!5m2!1sen!2sro';
    iframe.width = '100%';
    iframe.height = '450';
    iframe.style.border = '0';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.setAttribute('aria-label', 'Locația Balog & Stoica pe Google Maps');

    // Show iframe, hide placeholder
    mapIframe.appendChild(iframe);
    mapPlaceholder.style.display = 'none';
    mapIframe.style.display = 'block';

    console.log('Google Maps loaded with user consent');
}

/**
 * Initialize map consent handler
 */
function initMapConsentHandler() {
    const loadMapBtn = document.getElementById('loadMapConsent');

    if (!loadMapBtn) return;

    // Button click - open consent preferences
    loadMapBtn.addEventListener('click', () => {
        if (window.cookieConsentManager) {
            window.cookieConsentManager.showPreferences();
            // Auto-check the maps toggle
            setTimeout(() => {
                const mapsToggle = document.getElementById('mapsToggle');
                if (mapsToggle) {
                    mapsToggle.checked = true;
                }
            }, 100);
        }
    });

    // Listen for consent update
    document.addEventListener('googleMapsConsent', (event) => {
        if (event.detail.granted) {
            loadGoogleMaps();
        }
    });

    // Check if already consented
    if (window.cookieConsentManager && window.cookieConsentManager.isAllowed('maps')) {
        loadGoogleMaps();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMapConsentHandler);
} else {
    initMapConsentHandler();
}
