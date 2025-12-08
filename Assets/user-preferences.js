/**
 * ====================================================================
 * GDPR COOKIE CONSENT MANAGER
 * ====================================================================
 *
 * This script handles:
 * 1. Cookie consent banner display and interaction
 * 2. User preference storage (localStorage)
 * 3. Google Maps conditional loading based on consent
 * 4. Cookie preferences modal
 * 5. GDPR-compliant consent management
 *
 * ====================================================================
 */

// ===== CONFIGURATION =====

const CONSENT_CONFIG = {
    cookieName: 'cookie_consent',
    version: '1.0',
    expiryDays: 365,
    categories: {
        necessary: {
            name: 'Cookie-uri Necesare',
            description: 'Esențiale pentru funcționarea site-ului (CSRF, securitate)',
            required: true,
            enabled: true
        },
        maps: {
            name: 'Google Maps',
            description: 'Hartă interactivă pentru localizarea biroului',
            required: false,
            enabled: false
        }
    }
};

// ===== CONSENT MANAGER CLASS =====

class CookieConsentManager {
    constructor() {
        this.consent = this.loadConsent();
        this.bannerElement = null;
        this.preferencesModal = null;
        this.init();
    }

    /**
     * Initialize the consent manager
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    /**
     * Setup consent banner and handlers
     */
    setup() {
        this.createBanner();
        this.createPreferencesModal();
        this.createSettingsButton();
        this.attachEventListeners();

        // Show banner if no consent given
        if (!this.hasConsent()) {
            setTimeout(() => this.showBanner(), 500);
        } else {
            // Apply saved preferences
            this.applyConsent();
        }
    }

    /**
     * Load consent from localStorage
     */
    loadConsent() {
        const stored = localStorage.getItem(CONSENT_CONFIG.cookieName);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    /**
     * Save consent to localStorage
     */
    saveConsent(preferences) {
        const consent = {
            version: CONSENT_CONFIG.version,
            timestamp: new Date().toISOString(),
            preferences: preferences
        };
        localStorage.setItem(CONSENT_CONFIG.cookieName, JSON.stringify(consent));
        this.consent = consent;
    }

    /**
     * Check if user has given consent
     */
    hasConsent() {
        return this.consent !== null && this.consent.version === CONSENT_CONFIG.version;
    }

    /**
     * Create consent banner HTML
     */
    createBanner() {
        const banner = document.createElement('div');
        banner.className = 'cookie-consent-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Consimțământ cookie-uri');
        banner.innerHTML = `
            <div class="cookie-consent-container">
                <div class="cookie-consent-content">
                    <h2 class="cookie-consent-title">🍪 Respectăm confidențialitatea dvs.</h2>
                    <p class="cookie-consent-text">
                        Folosim cookie-uri pentru a asigura securitatea site-ului și pentru a încărca
                        harta Google Maps (opțional). Datele pot fi transmise către Google (SUA).
                        <a href="/PrivacyPolicy" target="_blank">Politica de confidențialitate</a> |
                        <a href="/CookiePolicy" target="_blank">Cookie-uri</a>
                    </p>
                </div>
                <div class="cookie-consent-actions">
                    <button class="cookie-consent-btn cookie-consent-btn-primary" id="acceptAllCookies">
                        Accept tot
                    </button>
                    <button class="cookie-consent-btn cookie-consent-btn-secondary" id="acceptNecessary">
                        Doar necesare
                    </button>
                    <button class="cookie-consent-btn cookie-consent-btn-text" id="customizePreferences">
                        Personalizează
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);
        this.bannerElement = banner;
    }

    /**
     * Create preferences modal
     */
    createPreferencesModal() {
        const modal = document.createElement('div');
        modal.className = 'cookie-preferences-overlay';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-label', 'Preferințe cookie-uri');
        modal.innerHTML = `
            <div class="cookie-preferences-modal">
                <div class="cookie-preferences-header">
                    <h2>Preferințe Cookie-uri</h2>
                    <button class="cookie-preferences-close" id="closePreferences" aria-label="Închide">
                        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div class="cookie-preferences-body">
                    <p class="cookie-preferences-intro">
                        Puteți controla ce tipuri de cookie-uri acceptați. Cookie-urile necesare nu pot fi dezactivate
                        deoarece sunt esențiale pentru funcționarea corectă a site-ului.
                    </p>

                    <!-- Necessary Cookies -->
                    <div class="cookie-category" data-category="necessary">
                        <div class="cookie-category-header">
                            <div class="cookie-category-info">
                                <div class="cookie-category-name">
                                    Cookie-uri Necesare
                                    <span class="cookie-category-required">OBLIGATORII</span>
                                </div>
                                <p class="cookie-category-description">
                                    Cookie-uri esențiale pentru securitate și funcționare
                                </p>
                            </div>
                            <label class="cookie-toggle">
                                <input type="checkbox" checked disabled data-category="necessary">
                                <span class="cookie-toggle-slider"></span>
                            </label>
                        </div>
                        <div class="cookie-category-details">
                            <p><strong>Ce includ:</strong></p>
                            <ul>
                                <li><strong>PHPSESSID:</strong> Cookie de sesiune pentru protecție CSRF și securitate formular contact</li>
                                <li><strong>Durată:</strong> Se șterge la închiderea browser-ului</li>
                                <li><strong>Temei legal:</strong> Interes legitim (Art. 6(1)(f) GDPR)</li>
                            </ul>
                            <p>Aceste cookie-uri nu pot fi dezactivate deoarece site-ul nu ar funcționa corect fără ele.</p>
                        </div>
                    </div>

                    <!-- Google Maps Cookies -->
                    <div class="cookie-category" data-category="maps">
                        <div class="cookie-category-header">
                            <div class="cookie-category-info">
                                <div class="cookie-category-name">
                                    Google Maps
                                </div>
                                <p class="cookie-category-description">
                                    Hartă interactivă pentru localizarea biroului nostru
                                </p>
                            </div>
                            <label class="cookie-toggle">
                                <input type="checkbox" data-category="maps" id="mapsToggle">
                                <span class="cookie-toggle-slider"></span>
                            </label>
                        </div>
                        <div class="cookie-category-details">
                            <p><strong>Ce face Google Maps:</strong></p>
                            <ul>
                                <li>Afișează locația biroului pe hartă interactivă</li>
                                <li>Colectează adresa IP, tip browser, sistem operare</li>
                                <li>Setează cookie-uri de tracking (NID, CONSENT, 1P_JAR, DV)</li>
                                <li>Transmite date către Google LLC în SUA</li>
                                <li>Folosește date pentru publicitate personalizată</li>
                            </ul>
                            <p><strong>Transfer internațional:</strong> Datele sunt transferate în Statele Unite (SCC).</p>
                            <p><strong>Temei legal:</strong> Consimțământul dvs. (Art. 6(1)(a) GDPR)</p>
                            <p><strong>Mai multe informații:</strong>
                                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Politica Google</a>
                            </p>
                        </div>
                    </div>
                </div>

                <div class="cookie-preferences-footer">
                    <button class="cookie-consent-btn cookie-consent-btn-secondary" id="rejectAll">
                        Respinge tot
                    </button>
                    <button class="cookie-consent-btn cookie-consent-btn-primary" id="savePreferences">
                        Salvează preferințe
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.preferencesModal = modal;

        // Make categories expandable
        modal.querySelectorAll('.cookie-category-header').forEach(header => {
            header.addEventListener('click', (e) => {
                if (!e.target.closest('.cookie-toggle')) {
                    header.parentElement.classList.toggle('expanded');
                }
            });
        });
    }

    /**
     * Create settings button
     */
    createSettingsButton() {
        const button = document.createElement('button');
        button.className = 'cookie-settings-btn';
        button.id = 'cookieSettingsBtn';
        button.setAttribute('aria-label', 'Setări cookie-uri');
        button.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
            Cookie-uri
        `;
        document.body.appendChild(button);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Accept all button
        document.getElementById('acceptAllCookies')?.addEventListener('click', () => {
            this.acceptAll();
        });

        // Accept necessary only
        document.getElementById('acceptNecessary')?.addEventListener('click', () => {
            this.acceptNecessary();
        });

        // Customize button
        document.getElementById('customizePreferences')?.addEventListener('click', () => {
            this.showPreferences();
        });

        // Save preferences
        document.getElementById('savePreferences')?.addEventListener('click', () => {
            this.savePreferences();
        });

        // Reject all
        document.getElementById('rejectAll')?.addEventListener('click', () => {
            this.acceptNecessary();
        });

        // Close modal
        document.getElementById('closePreferences')?.addEventListener('click', () => {
            this.hidePreferences();
        });

        // Cookie settings button
        document.getElementById('cookieSettingsBtn')?.addEventListener('click', () => {
            this.showPreferences();
        });

        // Close modal on overlay click
        this.preferencesModal?.addEventListener('click', (e) => {
            if (e.target === this.preferencesModal) {
                this.hidePreferences();
            }
        });

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.preferencesModal?.classList.contains('show')) {
                this.hidePreferences();
            }
        });
    }

    /**
     * Show consent banner
     */
    showBanner() {
        this.bannerElement?.classList.add('show');
    }

    /**
     * Hide consent banner
     */
    hideBanner() {
        this.bannerElement?.classList.remove('show');
    }

    /**
     * Show preferences modal
     */
    showPreferences() {
        // Load current preferences
        if (this.hasConsent()) {
            const mapsToggle = document.getElementById('mapsToggle');
            if (mapsToggle) {
                mapsToggle.checked = this.consent.preferences.maps || false;
            }
        }

        this.preferencesModal?.classList.add('show');
        this.hideBanner();
    }

    /**
     * Hide preferences modal
     */
    hidePreferences() {
        this.preferencesModal?.classList.remove('show');
    }

    /**
     * Accept all cookies
     */
    acceptAll() {
        const preferences = {
            necessary: true,
            maps: true
        };
        this.saveConsent(preferences);
        this.hideBanner();
        this.hidePreferences();
        this.applyConsent();
    }

    /**
     * Accept necessary cookies only
     */
    acceptNecessary() {
        const preferences = {
            necessary: true,
            maps: false
        };
        this.saveConsent(preferences);
        this.hideBanner();
        this.hidePreferences();
        this.applyConsent();
    }

    /**
     * Save custom preferences
     */
    savePreferences() {
        const mapsToggle = document.getElementById('mapsToggle');
        const preferences = {
            necessary: true, // Always true
            maps: mapsToggle?.checked || false
        };
        this.saveConsent(preferences);
        this.hidePreferences();
        this.applyConsent();
    }

    /**
     * Apply consent preferences
     */
    applyConsent() {
        if (!this.hasConsent()) return;

        const preferences = this.consent.preferences;

        // Google Maps
        if (preferences.maps) {
            this.enableGoogleMaps();
        } else {
            this.disableGoogleMaps();
        }

        // Dispatch event for other scripts
        document.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
            detail: { preferences }
        }));
    }

    /**
     * Enable Google Maps
     */
    enableGoogleMaps() {
        // Set flag for map loading
        window.cookieConsent = window.cookieConsent || {};
        window.cookieConsent.maps = true;

        // Dispatch event
        document.dispatchEvent(new CustomEvent('googleMapsConsent', {
            detail: { granted: true }
        }));

        // If on contact page, load map
        if (typeof loadGoogleMaps === 'function') {
            loadGoogleMaps();
        }
    }

    /**
     * Disable Google Maps
     */
    disableGoogleMaps() {
        window.cookieConsent = window.cookieConsent || {};
        window.cookieConsent.maps = false;

        // Remove Google Maps iframe if present
        const mapIframe = document.getElementById('mapIframe');
        if (mapIframe) {
            mapIframe.innerHTML = '';
            mapIframe.style.display = 'none';
        }

        // Show placeholder again
        const placeholder = document.getElementById('mapPlaceholder');
        if (placeholder) {
            placeholder.style.display = 'block';
        }
    }

    /**
     * Check if specific category is allowed
     */
    isAllowed(category) {
        if (!this.hasConsent()) return false;
        return this.consent.preferences[category] === true;
    }
}

// ===== GLOBAL INITIALIZATION =====

// Create global instance
window.cookieConsentManager = new CookieConsentManager();

// Export for external use
window.checkCookieConsent = function(category) {
    return window.cookieConsentManager.isAllowed(category);
};
