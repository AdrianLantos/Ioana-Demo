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

// Initialize 3D Carousel
let currentSlideIndex = 0;

function initialize3DCarousel() {
    const slides = document.querySelectorAll('.carousel-3d-slide');
    const dots = document.querySelectorAll('.carousel-3d-dot');

    if (slides.length === 0) return;

    // Click on slides to navigate
    slides.forEach((slide, index) => {
        slide.addEventListener('click', function (e) {
            // Don't trigger if clicking on a link
            if (e.target.tagName === 'A') return;

            const slideClass = this.className;
            if (slideClass.includes('next')) {
                rotate3DCarousel(1);
            } else if (slideClass.includes('prev')) {
                rotate3DCarousel(-1);
            }
        });
    });

    // Click on dots to navigate
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function () {
            goToSlide3D(index);
        });
    });
}

function rotate3DCarousel(direction) {
    const slides = document.querySelectorAll('.carousel-3d-slide');
    const dots = document.querySelectorAll('.carousel-3d-dot');
    const totalSlides = slides.length;

    currentSlideIndex = (currentSlideIndex + direction + totalSlides) % totalSlides;
    update3DSlides();
}

function goToSlide3D(index) {
    currentSlideIndex = index;
    update3DSlides();
}

function update3DSlides() {
    const slides = document.querySelectorAll('.carousel-3d-slide');
    const dots = document.querySelectorAll('.carousel-3d-dot');
    const totalSlides = slides.length;

    slides.forEach(slide => {
        slide.classList.remove('active', 'prev', 'next', 'hidden');
    });

    dots.forEach(dot => {
        dot.classList.remove('active');
    });

    // Calculate indices with wrapping
    const prevIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    const nextIndex = (currentSlideIndex + 1) % totalSlides;

    // Set classes
    slides[currentSlideIndex].classList.add('active');
    slides[prevIndex].classList.add('prev');
    slides[nextIndex].classList.add('next');

    // Hide other slides
    slides.forEach((slide, index) => {
        if (index !== currentSlideIndex && index !== prevIndex && index !== nextIndex) {
            slide.classList.add('hidden');
        }
    });

    // Update active dot
    dots[currentSlideIndex].classList.add('active');
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initialize3DCarousel();
    initializeFiltering();
    initializeShareButtons();
});
