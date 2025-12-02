// Mobile menu functionality
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

        // ===== TEAM SECTION HORIZONTAL SCROLL =====
        const teamWrapper = document.querySelector('.team-section');
        const teamStickyWrapper = document.querySelector('.team-sticky-wrapper');
        const teamHorizontal = document.getElementById('team-sticky-content');

        function updateTeamScroll() {
            if (!teamWrapper || !teamHorizontal || !teamStickyWrapper) return;
            
            // Only run on desktop (viewport > 768px)
            if (window.innerWidth <= 768) {
                teamHorizontal.style.transform = 'translateX(0px)';
                return;
            }
            
            const rect = teamWrapper.getBoundingClientRect();
            const wrapperHeight = teamWrapper.offsetHeight;
            const windowHeight = window.innerHeight;

            // horizontal scroll should only happen while section is "active"
            if (rect.top <= 0 && rect.bottom >= windowHeight) {

                // 1. Base progress: 0 → 1 through full wrapper scroll
                let baseProgress = -rect.top / (wrapperHeight - windowHeight);

                // 2. Clamp to [0, 1]
                baseProgress = Math.max(0, Math.min(1, baseProgress));

                // 3. We want animation ONLY between 0.2 → 0.8 so it can be better timed
                const start = 0.2;
                const end = 0.8;

                // If before start → translate = 0
                if (baseProgress <= start) {
                    teamHorizontal.style.transform = `translateX(0px)`;
                    return;
                }

                // If after end → translate = max
                if (baseProgress >= end) {
                    const stickyWidth = teamStickyWrapper.offsetWidth;
                    const contentWidth = teamHorizontal.scrollWidth;
                    const maxTranslate = Math.max(0, contentWidth - stickyWidth);
                    teamHorizontal.style.transform = `translateX(-${maxTranslate}px)`;
                    return;
                }

                // 4. Re-normalize to 0 → 1 INSIDE the 0.2–0.8 band:
                const mappedProgress = (baseProgress - start) / (end - start);

                // 5. Calculate horizontal scroll
                const stickyWidth = teamStickyWrapper.offsetWidth;
                const contentWidth = teamHorizontal.scrollWidth;
                const maxTranslate = Math.max(0, contentWidth - stickyWidth);
                const translateX = mappedProgress * maxTranslate;

                teamHorizontal.style.transform = `translateX(-${translateX}px)`;
            } else {
                // Reset when out of view
                if (rect.bottom < 0) {
                    const stickyWidth = teamStickyWrapper.offsetWidth;
                    const contentWidth = teamHorizontal.scrollWidth;
                    const maxTranslate = Math.max(0, contentWidth - stickyWidth);
                    teamHorizontal.style.transform = `translateX(-${maxTranslate}px)`;
                } else if (rect.top > windowHeight) {
                    teamHorizontal.style.transform = `translateX(0px)`;
                }
            }
        }

        // Run on scroll with throttling for better performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateTeamScroll();
                    updateServicesScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Run on load and resize
        window.addEventListener('load', () => {
            updateTeamScroll();
            updateServicesScroll();
        });
        // window.addEventListener('resize', () => {
        //     updateTeamScroll();
        //     updateServicesScroll();
        // });

        // ===== SERVICES SECTION HORIZONTAL SCROLL =====
        const servicesWrapper = document.querySelector('.services-section');
        const servicesStickyWrapper = document.querySelector('.services-sticky-wrapper');
        const servicesHorizontal = document.getElementById('services-sticky-content');

        function updateServicesScroll() {
            if (!servicesWrapper || !servicesHorizontal || !servicesStickyWrapper) return;
            
            // Only run on desktop (viewport > 1000px)
            if (window.innerWidth <= 1000) {
                servicesHorizontal.style.transform = 'translateX(0px)';
                return;
            }
            
            const rect = servicesWrapper.getBoundingClientRect();
            const wrapperHeight = servicesWrapper.offsetHeight;
            const windowHeight = window.innerHeight;

            // horizontal scroll should only happen while section is "active"
            if (rect.top <= 0 && rect.bottom >= windowHeight) {

                // 1. Base progress: 0 → 1 through full wrapper scroll
                let baseProgress = -rect.top / (wrapperHeight - windowHeight);

                // 2. Clamp to [0, 1]
                baseProgress = Math.max(0, Math.min(1, baseProgress));

                // 3. We want animation ONLY between 0.2 → 0.8 so it can be better timed
                const start = 0.2;
                const end = 0.8;

                // If before start → translate = 0
                if (baseProgress <= start) {
                    servicesHorizontal.style.transform = `translateX(0px)`;
                    return;
                }

                // If after end → translate = max
                if (baseProgress >= end) {
                    const stickyWidth = servicesStickyWrapper.offsetWidth;
                    const contentWidth = servicesHorizontal.scrollWidth;
                    const maxTranslate = Math.max(0, contentWidth - stickyWidth);
                    servicesHorizontal.style.transform = `translateX(-${maxTranslate}px)`;
                    return;
                }

                // 4. Re-normalize to 0 → 1 INSIDE the 0.2–0.8 band:
                const mappedProgress = (baseProgress - start) / (end - start);

                // 5. Calculate horizontal scroll
                const stickyWidth = servicesStickyWrapper.offsetWidth;
                const contentWidth = servicesHorizontal.scrollWidth;
                const maxTranslate = Math.max(0, contentWidth - stickyWidth);
                const translateX = mappedProgress * maxTranslate;

                servicesHorizontal.style.transform = `translateX(-${translateX}px)`;
            } else {
                // Reset when out of view
                if (rect.bottom < 0) {
                    const stickyWidth = servicesStickyWrapper.offsetWidth;
                    const contentWidth = servicesHorizontal.scrollWidth;
                    const maxTranslate = Math.max(0, contentWidth - stickyWidth);
                    servicesHorizontal.style.transform = `translateX(-${maxTranslate}px)`;
                } else if (rect.top > windowHeight) {
                    servicesHorizontal.style.transform = `translateX(0px)`;
                }
            }
        }