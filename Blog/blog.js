// Blog page JavaScript - Carousel and filtering

// Initialize category filtering
function initializeFiltering() {
    const categoryButtons = document.querySelectorAll('.category-btn');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function () {
            const category = this.getAttribute('data-category');

            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter posts
            filterPosts(category);
        });
    });
}

// Filter posts by category
function filterPosts(category) {
    const postCards = document.querySelectorAll('.post-card');

    postCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (category === 'all' || cardCategory === category) {
            card.style.display = 'flex';
            card.style.opacity = '1';
        } else {
            card.style.display = 'none';
        }
    });
}

// Share buttons functionality
function initializeShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');

    shareButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const title = this.getAttribute('title');

            // Handle copy link button
            if (title === 'Copiază link') {
                e.preventDefault();
                const url = window.location.href;

                // Try to use the modern clipboard API
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(url).then(() => {
                        // Show feedback
                        const originalHTML = this.innerHTML;
                        this.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                        this.style.backgroundColor = 'var(--color-text)';
                        this.style.color = 'var(--color-bg)';

                        setTimeout(() => {
                            this.innerHTML = originalHTML;
                            this.style.backgroundColor = '';
                            this.style.color = '';
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy:', err);
                        alert('Link copiat: ' + url);
                    });
                } else {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = url;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.select();
                    try {
                        document.execCommand('copy');
                        alert('Link copiat în clipboard!');
                    } catch (err) {
                        console.error('Failed to copy:', err);
                        alert('Link: ' + url);
                    }
                    document.body.removeChild(textArea);
                }
            }
            // For social media shares, construct proper URLs
            else if (title === 'Facebook') {
                e.preventDefault();
                const url = window.location.href;
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
            }
            else if (title === 'LinkedIn') {
                e.preventDefault();
                const url = window.location.href;
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
            }
            else if (title === 'Twitter') {
                e.preventDefault();
                const url = window.location.href;
                const text = document.querySelector('.article-title') ? document.querySelector('.article-title').textContent : '';
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
            }
        });
    });
}

/* ========================================
   3D CAROUSEL - INITIALIZATION & STATE
   ======================================== */

// Global state variables for carousel
let currentSlideIndex = 0;           // Tracks which slide is currently active (0-based index)
let isCarouselTransitioning = false; // Prevents spam-clicking during animations

/**
 * Initialize the 3D carousel
 * Sets up all event listeners and generates navigation dots
 * Runs once when the page loads
 */
function initialize3DCarousel() {
    // Get all the DOM elements we need
    const slides = document.querySelectorAll('.carousel-3d-slide');
    const dotsContainer = document.querySelector('.carousel-3d-dots');
    const prevBtn = document.querySelector('.carousel-3d-prev');
    const nextBtn = document.querySelector('.carousel-3d-next');
    const carouselContainer = document.querySelector('.carousel-3d-container');

    // Safety check: exit if no slides exist
    if (slides.length === 0) return;

    /* === DOT NAVIGATION === */
    // Dynamically create one dot for each slide
    if (dotsContainer) {
        dotsContainer.innerHTML = ''; // Clear existing dots first
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-3d-dot');
            if (index === 0) dot.classList.add('active'); // First dot is active by default
            dot.setAttribute('data-index', index);
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`); // Accessibility
            dot.addEventListener('click', () => goToSlide3D(index)); // Jump to this slide when clicked
            dotsContainer.appendChild(dot);
        });
    }

    /* === SLIDE CLICK NAVIGATION === */
    // Allow clicking on prev/next slides to navigate to them
    slides.forEach((slide, index) => {
        slide.addEventListener('click', function (e) {
            // Don't navigate if user clicked on a link - let the link work normally
            if (e.target.tagName === 'A' || e.target.closest('a')) return;

            // Check which slide was clicked
            const slideClass = this.className;
            if (slideClass.includes('next')) {
                rotate3DCarousel(1);  // Clicked the next slide, go forward
            } else if (slideClass.includes('prev')) {
                rotate3DCarousel(-1); // Clicked the previous slide, go backward
            }
        });
    });

    /* === BUTTON NAVIGATION === */
    // Previous button (←)
    if (prevBtn) {
        prevBtn.addEventListener('click', () => rotate3DCarousel(-1));
    }
    // Next button (→)
    if (nextBtn) {
        nextBtn.addEventListener('click', () => rotate3DCarousel(1));
    }

    /* === TOUCH & MOUSE DRAG SUPPORT === */
    if (carouselContainer) {
        // Mouse drag support for desktop only (screen wider than 768px)
        let isDragging = false;  // Track if user is currently dragging
        let startX = 0;          // Where the drag started
        let currentX = 0;        // Where the mouse currently is

        // Mouse down - start dragging
        carouselContainer.addEventListener('mousedown', (e) => {
            // Only enable on desktop (screen wider than 768px)
            if (window.innerWidth > 768) {
                isDragging = true;
                startX = e.clientX;
                carouselContainer.style.cursor = 'grabbing'; // Change cursor to indicate dragging
            }
        });

        // Mouse move - update position while dragging
        carouselContainer.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            currentX = e.clientX;
        });

        // Mouse up - finish dragging and check if it was a swipe
        carouselContainer.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            carouselContainer.style.cursor = 'grab';

            // Calculate how far the mouse moved
            const diff = startX - currentX;

            // If moved more than 50 pixels, consider it a swipe
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    rotate3DCarousel(1);  // Dragged left → go to next
                } else {
                    rotate3DCarousel(-1); // Dragged right → go to previous
                }
            }
        });

        // Mouse leave - cancel drag if mouse leaves the carousel
        carouselContainer.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                carouselContainer.style.cursor = 'grab';
            }
        });
    }

    /* === KEYBOARD NAVIGATION === */
    document.addEventListener('keydown', handleCarouselKeyboard);

    // Initialize the first slide as active
    update3DSlides();
}

/* ========================================
   KEYBOARD NAVIGATION
   ======================================== */

/**
 * Handle keyboard arrow keys
 * @param {KeyboardEvent} e - The keyboard event
 */
function handleCarouselKeyboard(e) {
    const carouselSection = document.querySelector('.carousel-3d-section');
    if (!carouselSection) return; // Exit if carousel doesn't exist

    if (e.key === 'ArrowLeft') {
        e.preventDefault(); // Prevent page scroll
        rotate3DCarousel(-1); // Go to previous slide
    } else if (e.key === 'ArrowRight') {
        e.preventDefault(); // Prevent page scroll
        rotate3DCarousel(1);  // Go to next slide
    }
}

/* ========================================
   NAVIGATION FUNCTIONS
   ======================================== */

/**
 * Rotate the carousel in a given direction
 * @param {number} direction - Direction to rotate: 1 for next, -1 for previous
 */
function rotate3DCarousel(direction) {
    // Prevent multiple transitions at once
    if (isCarouselTransitioning) return;

    const slides = document.querySelectorAll('.carousel-3d-slide');
    const totalSlides = slides.length;

    // Lock transitions
    isCarouselTransitioning = true;

    // Calculate new slide index with wrapping
    // Example: if currentSlideIndex is 2 (last of 3), adding 1 should wrap to 0
    // Formula: (current + direction + total) % total ensures positive result
    currentSlideIndex = (currentSlideIndex + direction + totalSlides) % totalSlides;

    // Apply the new slide positions
    update3DSlides();

    // Unlock transitions after animation completes (0.7 seconds)
    setTimeout(() => {
        isCarouselTransitioning = false;
    }, 700); // Must match CSS transition duration!
}

/**
 * Jump directly to a specific slide (used by dot navigation)
 * @param {number} index - The slide index to jump to (0-based)
 */
function goToSlide3D(index) {
    // Prevent multiple transitions at once
    if (isCarouselTransitioning) return;

    isCarouselTransitioning = true;
    currentSlideIndex = index;
    update3DSlides();

    // Unlock after animation
    setTimeout(() => {
        isCarouselTransitioning = false;
    }, 700);
}

/* ========================================
   UPDATE SLIDE POSITIONS
   ======================================== */

/**
 * Update which slides are visible and where they're positioned
 * Applies CSS classes: active, prev, next, hidden
 */
function update3DSlides() {
    const slides = document.querySelectorAll('.carousel-3d-slide');
    const dots = document.querySelectorAll('.carousel-3d-dot');
    const totalSlides = slides.length;

    // Safety check
    if (totalSlides === 0) return;

    // Step 1: Remove all positioning classes from all slides
    slides.forEach(slide => {
        slide.classList.remove('active', 'prev', 'next', 'hidden');
    });

    // Step 2: Remove active state from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });

    // Step 3: Calculate which slides should be prev/next using modulo for wrapping
    // Example with 3 slides (indices 0,1,2):
    //   If currentSlideIndex is 0: prevIndex = 2, nextIndex = 1
    //   If currentSlideIndex is 2: prevIndex = 1, nextIndex = 0
    const prevIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    const nextIndex = (currentSlideIndex + 1) % totalSlides;

    // Step 4: Apply positioning classes
    slides[currentSlideIndex].classList.add('active'); // Center slide
    slides[prevIndex].classList.add('prev');           // Left slide
    slides[nextIndex].classList.add('next');           // Right slide

    // Step 5: Hide all other slides (only if we have more than 3)
    // With 3 or fewer slides, all slides are always visible
    if (totalSlides > 3) {
        slides.forEach((slide, index) => {
            // If this slide is not active, prev, or next, hide it
            if (index !== currentSlideIndex && index !== prevIndex && index !== nextIndex) {
                slide.classList.add('hidden');
            }
        });
    }

    // Step 6: Mark the current dot as active
    if (dots[currentSlideIndex]) {
        dots[currentSlideIndex].classList.add('active');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initialize3DCarousel();
    initializeFiltering();
    initializeShareButtons();
});
