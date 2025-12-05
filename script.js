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
 * 4. LOGO CLICK ANIMATION
 *    - Click/tap detection with scroll gesture differentiation
 *    - Smooth scroll animation to move logo out of view
 *
 * Browser Support: Modern browsers with ES6 support
 * Dependencies: None (vanilla JavaScript)
 *
 * ====================================================================
 */

// ===== DOM ELEMENT REFERENCES =====

// About section elements
const sectionTitle = document.querySelector('.section-title');

// Team section elements
const teamWrapper = document.querySelector('.team-section');
const teamStickyWrapper = document.querySelector('.team-sticky-wrapper');
const teamHorizontal = document.getElementById('team-sticky-content');

// Services section elements
const servicesWrapper = document.querySelector('.services-section');
const servicesStickyWrapper = document.querySelector('.services-sticky-wrapper');
const servicesHorizontal = document.getElementById('services-sticky-content');

// Contact form elements
const contactForm = document.getElementById('contactForm');
const nameInput = contactForm ? document.getElementById('name') : null;
const emailInput = contactForm ? document.getElementById('email') : null;
const phoneInput = contactForm ? document.getElementById('phone') : null;
const messageInput = contactForm ? document.getElementById('message') : null;
const gdprConsent = contactForm ? document.getElementById('gdprConsent') : null;
const nameError = contactForm ? document.getElementById('nameError') : null;
const emailError = contactForm ? document.getElementById('emailError') : null;
const phoneError = contactForm ? document.getElementById('phoneError') : null;
const messageError = contactForm ? document.getElementById('messageError') : null;
const gdprError = contactForm ? document.getElementById('gdprError') : null;

// Logo click animation elements
const logoReveal = document.querySelector('.logo-reveal');

// ===== CHARACTER ANIMATION FUNCTIONS =====

/**
 * Configuration for character animation.
 * Adjust these values to control when and how the animation occurs.
 */
const charAnimationConfig = {
    // Start animation when element top is at this % of viewport height from top (1.0 = bottom, 0.0 = top)
    startScrollPercent: 0.7,
    // End animation when element top is at this % of viewport height from top
    endScrollPercent: -0.13,
    // Minimum opacity (starting value)
    minOpacity: 0.3,
    // Maximum opacity (ending value)
    maxOpacity: 1.0
};

/**
 * Wraps each character in the section title with a span for individual animation.
 * Words are wrapped in word containers to prevent breaking across lines.
 * Spaces are preserved between words.
 *
 * @returns {void}
 */
function initCharacterAnimation() {
    if (!sectionTitle) return;

    const text = sectionTitle.textContent;
    sectionTitle.textContent = '';

    // Split by words (preserve spaces)
    const words = text.split(' ');

    words.forEach((word, wordIndex) => {
        // Create a word container to keep letters together
        const wordSpan = document.createElement('span');
        wordSpan.classList.add('word');

        // Wrap each character in the word
        word.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.classList.add('char');
            charSpan.textContent = char;
            wordSpan.appendChild(charSpan);
        });

        sectionTitle.appendChild(wordSpan);

        // Add space after word (except for last word)
        if (wordIndex < words.length - 1) {
            const spaceSpan = document.createElement('span');
            spaceSpan.classList.add('char', 'space');
            spaceSpan.innerHTML = '&nbsp;';
            sectionTitle.appendChild(spaceSpan);
        }
    });
}

/**
 * Updates the opacity of each character based on scroll position.
 * Characters animate sequentially from minOpacity to maxOpacity as the section scrolls.
 * Each character's animation is staggered based on its position in the text.
 *
 * @returns {void}
 */
function updateCharacterOpacity() {
    if (!sectionTitle) return;

    const rect = sectionTitle.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const chars = sectionTitle.querySelectorAll('.char');

    if (chars.length === 0) return;

    // Calculate overall scroll progress (0 to 1)
    const startPoint = windowHeight * charAnimationConfig.startScrollPercent;
    const endPoint = windowHeight * charAnimationConfig.endScrollPercent;

    let scrollProgress = 0;

    if (rect.top <= startPoint && rect.top >= endPoint) {
        scrollProgress = (startPoint - rect.top) / (startPoint - endPoint);
    } else if (rect.top < endPoint) {
        scrollProgress = 1;
    }

    // Animate each character sequentially
    chars.forEach((char, index) => {
        // Calculate the progress range for this specific character
        // Each character starts animating at a different point in the scroll
        const charStartProgress = index / chars.length;
        const charEndProgress = (index + 1) / chars.length;

        let charProgress = 0;

        if (scrollProgress >= charEndProgress) {
            // Character animation complete
            charProgress = 1;
        } else if (scrollProgress >= charStartProgress) {
            // Character is currently animating
            charProgress = (scrollProgress - charStartProgress) / (charEndProgress - charStartProgress);
        }

        // Map character progress to opacity range
        const opacity = charAnimationConfig.minOpacity +
            (charProgress * (charAnimationConfig.maxOpacity - charAnimationConfig.minOpacity));

        char.style.opacity = opacity;
    });
}

// ===== HORIZONTAL SCROLL FUNCTIONS =====

/**
 * Updates the horizontal scroll position of the team section based on vertical scroll.
 *
 * Creates a scroll-linked animation where vertical scrolling translates to horizontal movement.
 * The animation operates in three phases:
 * 1. Before start threshold (0-20%): Content stays at initial position
 * 2. Active zone (20%-80%): Content scrolls horizontally based on progress
 * 3. After end threshold (80%-100%): Content stays at final position
 *
 * On mobile (viewport ≤ 768px), horizontal scrolling is disabled and content displays normally.
 *
 * @returns {void}
 */
function updateTeamScroll() {
    // Early exit if required DOM elements are not found
    if (!teamWrapper || !teamHorizontal || !teamStickyWrapper) return;

    // Disable horizontal scroll on mobile devices (viewport width ≤ 768px)
    if (window.innerWidth <= 768) {
        teamHorizontal.style.transform = 'translateX(0px)';
        return;
    }

    // Get the section's position relative to the viewport
    const rect = teamWrapper.getBoundingClientRect();
    const wrapperHeight = teamWrapper.offsetHeight;
    const windowHeight = window.innerHeight;

    // Section is in active scroll zone (scrolled past top but not past bottom)
    if (rect.top <= 0 && rect.bottom >= windowHeight) {
        // Calculate base scroll progress (0 to 1)
        let baseProgress = -rect.top / (wrapperHeight - windowHeight);
        baseProgress = Math.max(0, Math.min(1, baseProgress));

        // Define animation window (20% to 80% of total scroll)
        const start = 0.2;
        const end = 0.8;

        // Before animation window: keep content at initial position
        if (baseProgress <= start) {
            teamHorizontal.style.transform = 'translateX(0px)';
            return;
        }

        // After animation window: keep content at final position
        if (baseProgress >= end) {
            const stickyWidth = teamStickyWrapper.offsetWidth;
            const contentWidth = teamHorizontal.scrollWidth;
            const maxTranslate = Math.max(0, contentWidth - stickyWidth);
            teamHorizontal.style.transform = `translateX(-${maxTranslate}px)`;
            return;
        }

        // Within animation window: apply smooth horizontal scroll
        const mappedProgress = (baseProgress - start) / (end - start);
        const stickyWidth = teamStickyWrapper.offsetWidth;
        const contentWidth = teamHorizontal.scrollWidth;
        const maxTranslate = Math.max(0, contentWidth - stickyWidth);
        const translateX = mappedProgress * maxTranslate;
        teamHorizontal.style.transform = `translateX(-${translateX}px)`;
    } else {
        // Section has scrolled completely past the viewport (above it)
        if (rect.bottom < 0) {
            const stickyWidth = teamStickyWrapper.offsetWidth;
            const contentWidth = teamHorizontal.scrollWidth;
            const maxTranslate = Math.max(0, contentWidth - stickyWidth);
            teamHorizontal.style.transform = `translateX(-${maxTranslate}px)`;
        }
        // Section hasn't reached the viewport yet (below it)
        else if (rect.top > windowHeight) {
            teamHorizontal.style.transform = 'translateX(0px)';
        }
    }
}

/**
 * Updates the horizontal scroll position of the services section based on vertical scroll.
 *
 * Mirrors the team section scroll behavior but is optimized for the services section layout.
 * Uses identical scroll logic with the following key difference:
 * - Breakpoint is 1000px instead of 768px (due to wider service cards)
 *
 * @returns {void}
 */
function updateServicesScroll() {
    // Early exit if required DOM elements are not found
    if (!servicesWrapper || !servicesHorizontal || !servicesStickyWrapper) return;

    // Disable horizontal scroll on smaller devices (viewport width ≤ 1000px)
    if (window.innerWidth <= 1000) {
        servicesHorizontal.style.transform = 'translateX(0px)';
        return;
    }

    // Get the section's position relative to the viewport
    const rect = servicesWrapper.getBoundingClientRect();
    const wrapperHeight = servicesWrapper.offsetHeight;
    const windowHeight = window.innerHeight;

    // Section is in active scroll zone (scrolled past top but not past bottom)
    if (rect.top <= 0 && rect.bottom >= windowHeight) {
        // Calculate base scroll progress (0 to 1)
        let baseProgress = -rect.top / (wrapperHeight - windowHeight);
        baseProgress = Math.max(0, Math.min(1, baseProgress));

        // Define animation window (20% to 80% of total scroll)
        const start = 0.2;
        const end = 0.8;

        // Before animation window: keep content at initial position
        if (baseProgress <= start) {
            servicesHorizontal.style.transform = 'translateX(0px)';
            return;
        }

        // After animation window: keep content at final position
        if (baseProgress >= end) {
            const stickyWidth = servicesStickyWrapper.offsetWidth;
            const contentWidth = servicesHorizontal.scrollWidth;
            const maxTranslate = Math.max(0, contentWidth - stickyWidth);
            servicesHorizontal.style.transform = `translateX(-${maxTranslate}px)`;
            return;
        }

        // Within animation window: apply smooth horizontal scroll
        const mappedProgress = (baseProgress - start) / (end - start);
        const stickyWidth = servicesStickyWrapper.offsetWidth;
        const contentWidth = servicesHorizontal.scrollWidth;
        const maxTranslate = Math.max(0, contentWidth - stickyWidth);
        const translateX = mappedProgress * maxTranslate;
        servicesHorizontal.style.transform = `translateX(-${translateX}px)`;
    } else {
        // Section has scrolled completely past the viewport (above it)
        if (rect.bottom < 0) {
            const stickyWidth = servicesStickyWrapper.offsetWidth;
            const contentWidth = servicesHorizontal.scrollWidth;
            const maxTranslate = Math.max(0, contentWidth - stickyWidth);
            servicesHorizontal.style.transform = `translateX(-${maxTranslate}px)`;
        }
        // Section hasn't reached the viewport yet (below it)
        else if (rect.top > windowHeight) {
            servicesHorizontal.style.transform = 'translateX(0px)';
        }
    }
}

// ===== CONTACT FORM VALIDATION FUNCTIONS =====

/**
 * Displays an error message for a form field and marks it as invalid.
 *
 * @param {HTMLElement} input - The input element that has the error
 * @param {HTMLElement} errorElement - The element where error message will be displayed
 * @param {string} message - The error message to display to the user
 * @returns {void}
 */
function showError(input, errorElement, message) {
    input.classList.add('invalid');
    errorElement.textContent = message;
}

/**
 * Clears the error state and message for a form field.
 *
 * @param {HTMLElement} input - The input element to clear error from
 * @param {HTMLElement} errorElement - The error message element to clear
 * @returns {void}
 */
function clearError(input, errorElement) {
    input.classList.remove('invalid');
    errorElement.textContent = '';
}

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
    }
    if (name.length < 2) {
        showError(nameInput, nameError, 'Numele trebuie să conțină cel puțin 2 caractere.');
        return false;
    }
    clearError(nameInput, nameError);
    return true;
}

/**
 * Validates the email input field.
 *
 * Validation rules:
 * - Field cannot be empty
 * - Must match standard email format (local@domain.tld)
 * - No whitespace allowed anywhere in the email
 *
 * @returns {boolean} True if validation passes, false otherwise
 */
function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === '') {
        showError(emailInput, emailError, 'Adresa de email este obligatorie.');
        return false;
    }
    if (!emailRegex.test(email)) {
        showError(emailInput, emailError, 'Vă rugăm să introduceți o adresă de email validă.');
        return false;
    }
    clearError(emailInput, emailError);
    return true;
}

/**
 * Validates the phone input field.
 *
 * Validation rules:
 * - Field is OPTIONAL (empty is valid)
 * - If provided, must contain at least 10 digits
 * - Allows formatting characters: +, spaces, hyphens, and parentheses
 *
 * Valid format examples:
 * - 0723456789
 * - +40 723 456 789
 * - (07) 2345-6789
 * - +40-723-456-789
 *
 * @returns {boolean} True if validation passes, false otherwise
 */
function validatePhone() {
    const phone = phoneInput.value.trim();

    if (phone !== '') {
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
 * - Ensures users provide meaningful messages, not just single words
 *
 * @returns {boolean} True if validation passes, false otherwise
 */
function validateMessage() {
    const message = messageInput.value.trim();

    if (message === '') {
        showError(messageInput, messageError, 'Mesajul este obligatoriu.');
        return false;
    }
    if (message.length < 10) {
        showError(messageInput, messageError, 'Mesajul trebuie să conțină cel puțin 10 caractere.');
        return false;
    }
    clearError(messageInput, messageError);
    return true;
}

/**
 * Validates the GDPR consent checkbox.
 *
 * Validation rules:
 * - Checkbox must be checked
 * - Required for GDPR compliance before processing user data
 *
 * @returns {boolean} True if checkbox is checked, false otherwise
 */
function validateGdpr() {
    if (!gdprConsent.checked) {
        showError(gdprConsent, gdprError, 'Trebuie să acceptați politica de confidențialitate pentru a trimite formularul.');
        return false;
    }
    clearError(gdprConsent, gdprError);
    return true;
}

/**
 * Handles form submission with comprehensive validation and AJAX submission.
 *
 * Process:
 * 1. Prevents default form submission to handle validation client-side
 * 2. Runs all validation functions
 * 3. If all pass: sends data via AJAX to PHP backend (explained in more detail in comments)
 * 4. If any fail: scrolls to and focuses on the first invalid field
 * 
 *  IMPORTANT: This function uses modern AJAX with JSON responses.
 * See inline comments for detailed explanation of possible bugs/errors
 * (that returns HTML/JavaScript) is incompatible with this approach.
 *
 * @param {Event} e - The form submit event
 * @returns {void}
 */
function handleFormSubmit(e) {
    e.preventDefault();

    // Run all validation functions
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isMessageValid = validateMessage();
    const isGdprValid = validateGdpr();

    // Check if all validations passed
    if (isNameValid && isEmailValid && isPhoneValid && isMessageValid && isGdprValid) {
        // Disable submit button to prevent double submission
        const submitButton = contactForm.querySelector('.submit-button');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'SE TRIMITE...';

        // ===== STEP 1: PREPARE FORM DATA =====
        // Create a FormData object to package all form inputs for transmission
        // FormData automatically handles proper encoding for POST requests
        const formData = new FormData();
        formData.append('name', nameInput.value.trim());
        formData.append('email', emailInput.value.trim());
        formData.append('phone', phoneInput.value.trim());
        formData.append('message', messageInput.value.trim());
        formData.append('gdprConsent', gdprConsent.checked);

        // ===== STEP 2: SEND AJAX REQUEST =====
        // Use Fetch API to send data asynchronously (no page reload)
        // This provides a modern, smooth user experience compared to traditional form submission
        console.log('Sending form data to send_mail.php...');
        fetch('send_mail.php', {
            method: 'POST',
            body: formData
        })
            // ===== STEP 3: PARSE JSON RESPONSE =====
            // CRITICAL: This line expects the server to return valid JSON data
            // Modern PHP (send_mail.php) returns: {"success": true, "message": "..."}
            // This is because HTML tags like "<script>" are not valid JSON syntax.
            .then(response => {
                return response.json();
            })

            // ===== STEP 4: HANDLE SUCCESS/ERROR RESPONSES =====
            // Process the parsed JSON data from the server
            // Modern PHP sends a structured object: {success: boolean, message: string}
            .then(data => {
                console.log('Received data from server:', data);
                if (data.success) {
                    // ===== SUCCESS PATH =====
                    // Show the success message from the server
                    alert(data.message);

                    // Reset all form fields to empty
                    contactForm.reset();

                    // Clear any validation states (red borders, error messages)
                    const invalidFields = contactForm.querySelectorAll('.invalid');
                    invalidFields.forEach(field => field.classList.remove('invalid'));
                    const errorMessages = contactForm.querySelectorAll('.error-message');
                    errorMessages.forEach(msg => msg.textContent = '');


                    // AJAX prevents traditional page navigation by design
                } else {
                    // ===== ERROR PATH =====
                    // Server returned an error (validation failed, rate limit, etc.)
                    alert(data.message || 'A apărut o eroare. Vă rugăm încercați din nou.');
                }
            })

            // ===== STEP 5: HANDLE NETWORK/PARSING ERRORS =====
            // This catches:
            // - Network failures (server down, no internet)
            // - JSON parsing errors (if server doesn't return valid JSON)
            // - Any other JavaScript errors in the promise chain
            .catch(error => {
                console.error('Fetch error details:', error);
                console.error('Error name:', error.name);
                console.error('Error message:', error.message);
                alert('A apărut o eroare la trimiterea formularului. Vă rugăm încercați din nou sau contactați-ne direct la office@balog-stoica.com.');
            })
            .finally(() => {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
    } else {
        // Validation failed - scroll to and focus on first error
        const firstError = contactForm.querySelector('.invalid');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }
}

// ===== LOGO CLICK ANIMATION FUNCTIONS =====

/**
 * Stores the starting position and time of a user interaction.
 * Used to distinguish between clicks/taps and scroll gestures.
 * @type {{x: number, y: number, time: number}}
 */
let startPos = { x: 0, y: 0, time: 0 };

/**
 * Handles the start of a user interaction (mouse down or touch start).
 * Records the starting position and timestamp for later comparison.
 *
 * @param {MouseEvent|TouchEvent} e - The mouse or touch event
 * @returns {void}
 */
function handleInteractionStart(e) {
    const point = e.touches?.[0] || e;
    startPos = { x: point.clientX, y: point.clientY, time: Date.now() };
}

/**
 * Handles the end of a user interaction (mouse up or touch end).
 * Determines if the interaction was a click/tap or a scroll gesture.
 *
 * If the interaction qualifies as a click/tap (movement < 10px and duration < 500ms),
 * it smoothly scrolls the page to move the logo out of view.
 *
 * @param {MouseEvent|TouchEvent} e - The mouse or touch event
 * @returns {void}
 */
function handleInteractionEnd(e) {
    const point = e.changedTouches?.[0] || e;
    const dx = point.clientX - startPos.x;
    const dy = point.clientY - startPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const duration = Date.now() - startPos.time;

    // Trigger scroll animation only for quick clicks/taps with minimal movement
    if (distance < 10 && duration < 500) {
        window.scrollTo({
            top: logoReveal.offsetHeight,
            behavior: 'smooth'
        });
    }
}

// ===== EVENT LISTENERS =====

/**
 * Flag to track if a scroll update is already scheduled.
 * Prevents multiple simultaneous requestAnimationFrame calls.
 * @type {boolean}
 */
let ticking = false;

/**
 * Throttled scroll event listener using requestAnimationFrame.
 *
 * Uses the "ticking" pattern to ensure updates only happen once per animation frame,
 * improving performance by preventing excessive function calls during rapid scrolling.
 *
 * Updates both team and services horizontal scroll positions.
 */
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateCharacterOpacity();
            updateTeamScroll();
            updateServicesScroll();
            ticking = false;
        });
        ticking = true;
    }
});

/**
 * Initialize scroll positions and animations on page load.
 *
 * Ensures that horizontal scroll sections are positioned correctly if the page
 * loads at a scroll position other than the top (e.g., when user refreshes mid-page
 * or uses browser back button).
 */
window.addEventListener('load', () => {
    initCharacterAnimation();
    updateCharacterOpacity();
    updateTeamScroll();
    updateServicesScroll();
});

/**
 * Timeout ID for debounced resize handler.
 * @type {number|undefined}
 */
let resizeTimeout;

/**
 * Debounced resize event handler.
 *
 * Debouncing prevents excessive recalculations during continuous resize events
 * (e.g., when user drags window edge). The function waits 150ms after the last
 * resize event before recalculating, reducing performance overhead.
 *
 * This is important for:
 * - Viewport width changes that might trigger/disable horizontal scrolling
 * - Container width changes that affect scroll distance calculations
 */
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        updateCharacterOpacity();
        updateTeamScroll();
        updateServicesScroll();
    }, 150);
});

/**
 * Contact form event listeners.
 *
 * Sets up validation triggers:
 * - Blur validation: Validates when user leaves a field
 * - Input validation: Re-validates only if field is already marked invalid (for real-time feedback)
 * - Submit handler: Comprehensive validation before form submission
 */
if (contactForm) {
    // Blur validation - validates when user leaves a field
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    phoneInput.addEventListener('blur', validatePhone);
    messageInput.addEventListener('blur', validateMessage);
    gdprConsent.addEventListener('change', validateGdpr);

    // Real-time validation for fields with errors
    // Only validates if field is already marked invalid, preventing annoying premature errors
    nameInput.addEventListener('input', () => {
        if (nameInput.classList.contains('invalid')) validateName();
    });

    emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('invalid')) validateEmail();
    });

    phoneInput.addEventListener('input', () => {
        if (phoneInput.classList.contains('invalid')) validatePhone();
    });

    messageInput.addEventListener('input', () => {
        if (messageInput.classList.contains('invalid')) validateMessage();
    });

    // Form submission handler
    contactForm.addEventListener('submit', handleFormSubmit);
}

/**
 * Logo click animation event listeners.
 *
 * Handles both mouse and touch events to support desktop and mobile devices.
 * The { passive: true } option on touch events improves scroll performance.
 *
 * Also sets cursor style to indicate the element is clickable.
 */
if (logoReveal) {
    logoReveal.addEventListener('mousedown', handleInteractionStart);
    logoReveal.addEventListener('mouseup', handleInteractionEnd);
    logoReveal.addEventListener('touchstart', handleInteractionStart, { passive: true });
    logoReveal.addEventListener('touchend', handleInteractionEnd, { passive: true });
    logoReveal.style.cursor = 'pointer';
}
