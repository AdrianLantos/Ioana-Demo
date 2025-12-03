/**
 * ====================================================================
 * MAIN JAVASCRIPT FILE
 * ====================================================================
 *
 * This file handles the interactive functionality for the website, including:
 *
 * 1. HORIZONTAL SCROLL SECTIONS
 *    - Team section: Converts vertical scrolling to horizontal content movement
 *    - Services section: Similar effect optimized for wider content
 *    - Both use scroll-linked animations with timing windows (20%-80% of section)
 *    - Responsive: Disabled on smaller viewports for better mobile UX
 *
 * 2. PERFORMANCE OPTIMIZATIONS
 *    - requestAnimationFrame throttling for scroll events
 *    - Debounced resize handlers
 *    - Prevents excessive recalculations during user interaction
 *
 * 3. CONTACT FORM VALIDATION
 *    - Client-side validation with real-time feedback
 *    - Name, email, phone (optional), message, and GDPR consent validation
 *    - Auto-focus on first error field
 *    - All error messages in Romanian
 *
 * Browser Support: Modern browsers with ES6 support
 * Dependencies: None (vanilla JavaScript)
 *
 * ====================================================================
 */

/**
 * ===== TEAM SECTION HORIZONTAL SCROLL =====
 *
 * This section handles the horizontal scrolling effect for the team section.
 * As the user scrolls vertically through the page, the team content scrolls horizontally
 * within a fixed viewport, creating a parallax-like effect.
 */

// DOM element references for the team section
const teamWrapper = document.querySelector('.team-section');
const teamStickyWrapper = document.querySelector('.team-sticky-wrapper');
const teamHorizontal = document.getElementById('team-sticky-content');

/**
 * Updates the horizontal scroll position of the team section based on vertical scroll.
 *
 * This function creates a scroll-linked animation where vertical scrolling translates
 * to horizontal movement of content. The animation only occurs within a specific scroll
 * range (20%-80% of the section's height) for better timing and user experience.
 *
 * The function operates in three phases:
 * 1. Before start threshold (0-20%): Content stays at initial position
 * 2. Active zone (20%-80%): Content scrolls horizontally
 * 3. After end threshold (80%-100%): Content stays at final position
 *
 * @returns {void}
 */
function updateTeamScroll() {
    // Early exit if required DOM elements are not found
    if (!teamWrapper || !teamHorizontal || !teamStickyWrapper) return;

    // Disable horizontal scroll on mobile devices (viewport width ≤ 768px)
    // Mobile users will see standard vertical scrolling instead
    if (window.innerWidth <= 768) {
        teamHorizontal.style.transform = 'translateX(0px)';
        return;
    }

    // Get the section's position relative to the viewport
    const rect = teamWrapper.getBoundingClientRect();
    const wrapperHeight = teamWrapper.offsetHeight;
    const windowHeight = window.innerHeight;

    // Horizontal scroll should only happen while section is "active"
    // Active means: section has scrolled past top of viewport AND hasn't fully scrolled past bottom
    if (rect.top <= 0 && rect.bottom >= windowHeight) {

        // Step 1: Calculate base scroll progress (0 to 1)
        // When rect.top is 0 (section just reaches top), progress = 0
        // When rect.top is -(wrapperHeight - windowHeight), progress = 1
        let baseProgress = -rect.top / (wrapperHeight - windowHeight);

        // Step 2: Clamp progress to valid range [0, 1] to prevent overflow
        baseProgress = Math.max(0, Math.min(1, baseProgress));

        // Step 3: Define animation window within the scroll range
        // Animation only occurs between 20% and 80% of total scroll
        // This creates buffer zones at start and end for smoother experience
        const start = 0.2;  // Animation starts at 20% scroll
        const end = 0.8;    // Animation ends at 80% scroll

        // Before animation start zone: keep content at initial position
        if (baseProgress <= start) {
            teamHorizontal.style.transform = `translateX(0px)`;
            return;
        }

        // After animation end zone: keep content at final position
        if (baseProgress >= end) {
            const stickyWidth = teamStickyWrapper.offsetWidth;    // Visible container width
            const contentWidth = teamHorizontal.scrollWidth;       // Total content width
            const maxTranslate = Math.max(0, contentWidth - stickyWidth);  // Maximum scroll distance
            teamHorizontal.style.transform = `translateX(-${maxTranslate}px)`;
            return;
        }

        // Step 4: Re-normalize progress to 0-1 within the animation zone (0.2 to 0.8)
        // This maps the 20%-80% range to 0%-100% for smooth animation
        const mappedProgress = (baseProgress - start) / (end - start);

        // Step 5: Calculate and apply horizontal scroll transformation
        const stickyWidth = teamStickyWrapper.offsetWidth;      // Visible container width
        const contentWidth = teamHorizontal.scrollWidth;         // Total content width including overflow
        const maxTranslate = Math.max(0, contentWidth - stickyWidth);  // Maximum horizontal scroll distance
        const translateX = mappedProgress * maxTranslate;        // Current scroll position based on progress

        // Apply the horizontal translation (negative value scrolls content left)
        teamHorizontal.style.transform = `translateX(-${translateX}px)`;
    } else {
        // Reset position when section is out of active view

        // Section has scrolled completely past the viewport (above it)
        if (rect.bottom < 0) {
            // Set to final position (fully scrolled)
            const stickyWidth = teamStickyWrapper.offsetWidth;
            const contentWidth = teamHorizontal.scrollWidth;
            const maxTranslate = Math.max(0, contentWidth - stickyWidth);
            teamHorizontal.style.transform = `translateX(-${maxTranslate}px)`;
        }
        // Section hasn't reached the viewport yet (below it)
        else if (rect.top > windowHeight) {
            // Set to initial position (not scrolled)
            teamHorizontal.style.transform = `translateX(0px)`;
        }
    }
}

/**
 * Scroll event listener with requestAnimationFrame throttling.
 *
 * Uses the "ticking" pattern to throttle scroll events and ensure updates
 * only happen once per animation frame. This improves performance by preventing
 * excessive function calls during rapid scrolling.
 *
 * The pattern works as follows:
 * 1. User scrolls → event fires
 * 2. If not already scheduled (ticking = false), schedule an animation frame
 * 3. Set ticking = true to prevent additional scheduling
 * 4. On next frame: run updates and reset ticking to false
 */
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        // Schedule updates for the next animation frame (typically 60fps)
        window.requestAnimationFrame(() => {
            updateTeamScroll();
            updateServicesScroll();
            ticking = false;  // Allow new updates to be scheduled
        });
        ticking = true;  // Prevent additional scheduling until current update completes
    }
});

/**
 * ===== SERVICES SECTION HORIZONTAL SCROLL =====
 *
 * This section handles the horizontal scrolling effect for the services section.
 * Functions identically to the team section but with a higher viewport breakpoint (1000px)
 * to accommodate the different content layout requirements.
 */

// DOM element references for the services section
const servicesWrapper = document.querySelector('.services-section');
const servicesStickyWrapper = document.querySelector('.services-sticky-wrapper');
const servicesHorizontal = document.getElementById('services-sticky-content');

/**
 * Updates the horizontal scroll position of the services section based on vertical scroll.
 *
 * This function mirrors the team section scroll behavior but is optimized for
 * the services section layout. The animation creates a synchronized horizontal
 * scroll effect triggered by vertical page scrolling.
 *
 * Key differences from team section:
 * - Breakpoint is 1000px instead of 768px (different content width requirements)
 * - Otherwise uses identical scroll logic and animation timing
 *
 * @returns {void}
 */
function updateServicesScroll() {
    // Early exit if required DOM elements are not found
    if (!servicesWrapper || !servicesHorizontal || !servicesStickyWrapper) return;

    // Disable horizontal scroll on smaller devices (viewport width ≤ 1000px)
    // Higher threshold than team section due to wider service cards
    if (window.innerWidth <= 1000) {
        servicesHorizontal.style.transform = 'translateX(0px)';
        return;
    }

    // Get the section's position relative to the viewport
    const rect = servicesWrapper.getBoundingClientRect();
    const wrapperHeight = servicesWrapper.offsetHeight;
    const windowHeight = window.innerHeight;

    // Horizontal scroll should only happen while section is "active"
    // Active means: section has scrolled past top of viewport AND hasn't fully scrolled past bottom
    if (rect.top <= 0 && rect.bottom >= windowHeight) {

        // Step 1: Calculate base scroll progress (0 to 1)
        // When rect.top is 0 (section just reaches top), progress = 0
        // When rect.top is -(wrapperHeight - windowHeight), progress = 1
        let baseProgress = -rect.top / (wrapperHeight - windowHeight);

        // Step 2: Clamp progress to valid range [0, 1] to prevent overflow
        baseProgress = Math.max(0, Math.min(1, baseProgress));

        // Step 3: Define animation window within the scroll range
        // Animation only occurs between 20% and 80% of total scroll
        // This creates buffer zones at start and end for smoother experience
        const start = 0.2;  // Animation starts at 20% scroll
        const end = 0.8;    // Animation ends at 80% scroll

        // Before animation start zone: keep content at initial position
        if (baseProgress <= start) {
            servicesHorizontal.style.transform = `translateX(0px)`;
            return;
        }

        // After animation end zone: keep content at final position
        if (baseProgress >= end) {
            const stickyWidth = servicesStickyWrapper.offsetWidth;    // Visible container width
            const contentWidth = servicesHorizontal.scrollWidth;       // Total content width
            const maxTranslate = Math.max(0, contentWidth - stickyWidth);  // Maximum scroll distance
            servicesHorizontal.style.transform = `translateX(-${maxTranslate}px)`;
            return;
        }

        // Step 4: Re-normalize progress to 0-1 within the animation zone (0.2 to 0.8)
        // This maps the 20%-80% range to 0%-100% for smooth animation
        const mappedProgress = (baseProgress - start) / (end - start);

        // Step 5: Calculate and apply horizontal scroll transformation
        const stickyWidth = servicesStickyWrapper.offsetWidth;      // Visible container width
        const contentWidth = servicesHorizontal.scrollWidth;         // Total content width including overflow
        const maxTranslate = Math.max(0, contentWidth - stickyWidth);  // Maximum horizontal scroll distance
        const translateX = mappedProgress * maxTranslate;        // Current scroll position based on progress

        // Apply the horizontal translation (negative value scrolls content left)
        servicesHorizontal.style.transform = `translateX(-${translateX}px)`;
    } else {
        // Reset position when section is out of active view

        // Section has scrolled completely past the viewport (above it)
        if (rect.bottom < 0) {
            // Set to final position (fully scrolled)
            const stickyWidth = servicesStickyWrapper.offsetWidth;
            const contentWidth = servicesHorizontal.scrollWidth;
            const maxTranslate = Math.max(0, contentWidth - stickyWidth);
            servicesHorizontal.style.transform = `translateX(-${maxTranslate}px)`;
        }
        // Section hasn't reached the viewport yet (below it)
        else if (rect.top > windowHeight) {
            // Set to initial position (not scrolled)
            servicesHorizontal.style.transform = `translateX(0px)`;
        }
    }
}


/**
 * Initialize scroll positions on page load.
 *
 * This ensures that horizontal scroll sections are positioned correctly
 * if the page loads at a scroll position other than the top (e.g., when
 * user refreshes mid-page or uses browser back button).
 */
window.addEventListener('load', () => {
    updateTeamScroll();
    updateServicesScroll();
});

/**
 * Handle window resize events with debouncing.
 *
 * Debouncing prevents excessive recalculations during continuous resize events
 * (e.g., when user drags window edge). The function waits 150ms after the last
 * resize event before recalculating, reducing performance overhead.
 *
 * This is important for:
 * - Viewport width changes that might trigger/disable horizontal scrolling
 * - Container width changes that affect scroll distance calculations
 */
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);  // Cancel previous pending recalculation
    resizeTimeout = setTimeout(() => {
        // Only execute after 150ms of no resize events
        updateTeamScroll();
        updateServicesScroll();
    }, 150);
});

/**
 * ===== CONTACT FORM VALIDATION =====
 *
 * This section handles client-side validation for the contact form.
 * It provides real-time feedback to users and prevents invalid submissions.
 *
 * Features:
 * - Real-time validation on blur (when user leaves a field)
 * - Immediate feedback when correcting errors
 * - GDPR consent checkbox validation
 * - Comprehensive error messages in Romanian
 * - Auto-scroll to first error on submit
 */

// Main form element reference
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    // Input field references
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const gdprConsent = document.getElementById('gdprConsent');

    // Error message element references
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const messageError = document.getElementById('messageError');
    const gdprError = document.getElementById('gdprError');

    /**
     * ===== VALIDATION FUNCTIONS =====
     */

    /**
     * Validates the name input field.
     *
     * Validation rules:
     * - Field cannot be empty
     * - Must contain at least 2 characters (after trimming whitespace)
     *
     * @returns {boolean} True if validation passes, false otherwise
     */
    function validateName() {
        const name = nameInput.value.trim();
        if (name === '') {
            showError(nameInput, nameError, 'Numele este obligatoriu.');
            return false;
        } else if (name.length < 2) {
            showError(nameInput, nameError, 'Numele trebuie să conțină cel puțin 2 caractere.');
            return false;
        } else {
            clearError(nameInput, nameError);
            return true;
        }
    }

    /**
     * Validates the email input field.
     *
     * Validation rules:
     * - Field cannot be empty
     * - Must match standard email format (local@domain.tld)
     *
     * Uses a regex pattern that checks for:
     * - At least one character before @
     * - At least one character between @ and .
     * - At least one character after the final .
     * - No whitespace anywhere in the email
     *
     * @returns {boolean} True if validation passes, false otherwise
     */
    function validateEmail() {
        const email = emailInput.value.trim();
        // Email validation regex: ensures basic email structure
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === '') {
            showError(emailInput, emailError, 'Adresa de email este obligatorie.');
            return false;
        } else if (!emailRegex.test(email)) {
            showError(emailInput, emailError, 'Vă rugăm să introduceți o adresă de email validă.');
            return false;
        } else {
            clearError(emailInput, emailError);
            return true;
        }
    }

    /**
     * Validates the phone input field.
     *
     * Validation rules:
     * - Field is OPTIONAL (empty is valid)
     * - If provided, must contain at least 10 digits
     * - Allows formatting characters: +, spaces, hyphens, and parentheses
     *
     * Examples of valid formats:
     * - 0723456789
     * - +40 723 456 789
     * - (07) 2345-6789
     * - +40-723-456-789
     *
     * @returns {boolean} True if validation passes, false otherwise
     */
    function validatePhone() {
        const phone = phoneInput.value.trim();

        // Phone is optional, but if provided, it should be valid
        if (phone !== '') {
            // Regex allows digits, +, spaces, hyphens, and parentheses (minimum 10 characters)
            const phoneRegex = /^[0-9+\s\-()]{10,}$/;
            if (!phoneRegex.test(phone)) {
                showError(phoneInput, phoneError, 'Vă rugăm să introduceți un număr de telefon valid (minim 10 cifre).');
                return false;
            }
        }
        clearError(phoneInput, phoneError);
        return true;
    }

    /**
     * Validates the message textarea field.
     *
     * Validation rules:
     * - Field cannot be empty
     * - Must contain at least 10 characters (after trimming whitespace)
     * - This ensures users provide meaningful messages, not just single words
     *
     * @returns {boolean} True if validation passes, false otherwise
     */
    function validateMessage() {
        const message = messageInput.value.trim();

        if (message === '') {
            showError(messageInput, messageError, 'Mesajul este obligatoriu.');
            return false;
        } else if (message.length < 10) {
            showError(messageInput, messageError, 'Mesajul trebuie să conțină cel puțin 10 caractere.');
            return false;
        } else {
            clearError(messageInput, messageError);
            return true;
        }
    }

    /**
     * Validates the GDPR consent checkbox.
     *
     * Validation rules:
     * - Checkbox must be checked
     * - This is required for GDPR compliance before processing user data
     *
     * @returns {boolean} True if checkbox is checked, false otherwise
     */
    function validateGdpr() {
        if (!gdprConsent.checked) {
            showError(gdprConsent, gdprError, 'Trebuie să acceptați politica de confidențialitate pentru a trimite formularul.');
            return false;
        } else {
            clearError(gdprConsent, gdprError);
            return true;
        }
    }

    /**
     * Displays an error message for a form field.
     *
     * @param {HTMLElement} input - The input element that has the error
     * @param {HTMLElement} errorElement - The element where error message will be displayed
     * @param {string} message - The error message to display
     * @returns {void}
     */
    function showError(input, errorElement, message) {
        input.classList.add('invalid');  // Add visual styling to indicate error
        errorElement.textContent = message;  // Display error message to user
    }

    /**
     * Clears the error state and message for a form field.
     *
     * @param {HTMLElement} input - The input element to clear error from
     * @param {HTMLElement} errorElement - The error message element to clear
     * @returns {void}
     */
    function clearError(input, errorElement) {
        input.classList.remove('invalid');  // Remove error styling
        errorElement.textContent = '';  // Clear error message
    }

    /**
     * ===== EVENT LISTENERS FOR REAL-TIME VALIDATION =====
     */

    /**
     * Validate fields when user leaves them (blur event).
     * This provides immediate feedback after the user finishes entering data.
     */
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    phoneInput.addEventListener('blur', validatePhone);
    messageInput.addEventListener('blur', validateMessage);
    // Use 'change' for checkbox instead of 'blur' for better UX
    gdprConsent.addEventListener('change', validateGdpr);

    /**
     * Re-validate fields as user types (input event), but only if field is already marked invalid.
     * This allows users to see errors clear in real-time as they correct them,
     * without being annoying by showing errors while they're still typing initially.
     */
    nameInput.addEventListener('input', () => {
        // Only validate if field already has an error
        if (nameInput.classList.contains('invalid')) {
            validateName();
        }
    });

    emailInput.addEventListener('input', () => {
        // Only validate if field already has an error
        if (emailInput.classList.contains('invalid')) {
            validateEmail();
        }
    });

    phoneInput.addEventListener('input', () => {
        // Only validate if field already has an error
        if (phoneInput.classList.contains('invalid')) {
            validatePhone();
        }
    });

    messageInput.addEventListener('input', () => {
        // Only validate if field already has an error
        if (messageInput.classList.contains('invalid')) {
            validateMessage();
        }
    });

    /**
     * ===== FORM SUBMISSION HANDLER =====
     */

    /**
     * Handle form submission with comprehensive validation.
     *
     * Process:
     * 1. Prevent default form submission to handle validation client-side
     * 2. Run all validation functions
     * 3. If all pass: log data and show success message (placeholder for actual submission)
     * 4. If any fail: scroll to and focus on the first invalid field
     *
     * @param {Event} e - The form submit event
     */
    contactForm.addEventListener('submit', function(e) {
        // Prevent default form submission (page refresh)
        e.preventDefault();

        // Run all validation functions and store results
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isMessageValid = validateMessage();
        const isGdprValid = validateGdpr();

        // Check if all validations passed
        if (isNameValid && isEmailValid && isPhoneValid && isMessageValid && isGdprValid) {
            // === SUCCESSFUL VALIDATION ===
            // Here you would normally send the form data to your server
            // For now, we'll just log it and show a success message
            console.log('Form is valid and ready to submit');
            console.log({
                name: nameInput.value,
                email: emailInput.value,
                phone: phoneInput.value,
                message: messageInput.value,
                gdprConsent: gdprConsent.checked
            });

            // TODO: Add actual form submission logic here
            // Example implementation:
            /*
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: nameInput.value,
                    email: emailInput.value,
                    phone: phoneInput.value,
                    message: messageInput.value,
                    gdprConsent: gdprConsent.checked
                })
            })
            .then(response => response.json())
            .then(data => {
                alert('Mulțumim pentru mesaj! Vă vom contacta în curând.');
                contactForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('A apărut o eroare. Vă rugăm să încercați din nou.');
            });
            */

            // Show success message and reset form
            alert('Mulțumim pentru mesaj! Vă vom contacta în curând.');
            contactForm.reset();
        } else {
            // === VALIDATION FAILED ===
            // Find the first invalid field in the form
            const firstError = contactForm.querySelector('.invalid');
            if (firstError) {
                // Scroll to the field smoothly and center it in viewport
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Set focus to the field so user can immediately start correcting
                firstError.focus();
            }
        }
    });
}
