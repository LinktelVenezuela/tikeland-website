document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect (mostly for potential shadow now)
    if (document.getElementById('main-header')) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                (document.getElementById('main-header')).classList.add('sticky');
            } else {
                (document.getElementById('main-header')).classList.remove('sticky');
            }
        });
    }


    // Animated Search Input
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    const searchContainer = document.querySelector('.search-container');

    if (searchBtn && searchInput && searchContainer) {
        searchBtn.addEventListener('click', () => {
            searchContainer.classList.toggle('active');
            if (searchContainer.classList.contains('active')) {
                searchInput.focus(); // Focus on input when active
            } else {
                searchInput.value = ''; // Clear input when closing
            }
        });

        // Close search if clicked outside
        document.addEventListener('click', (event) => {
            if (!searchContainer.contains(event.target) && event.target !== searchBtn) {
                searchContainer.classList.remove('active');
                searchInput.value = '';
            }
        });
    }

    // Login/Register Modals
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn'); // Get the new register button
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeButtons = document.querySelectorAll('.close-button');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const body = document.body; // Reference to body for no-scroll

    function openModal(modal) {
        modal.classList.add('show');
        body.classList.add('no-scroll'); // Add class to prevent body scroll
    }

    function closeModal(modal) {
        modal.classList.remove('show');
        body.classList.remove('no-scroll'); // Remove class to re-enable body scroll
    }

    // Event listeners for opening modals
    if (loginBtn) {
        loginBtn.addEventListener('click', () => openModal(loginModal));
    }
    if (registerBtn) {
        registerBtn.addEventListener('click', () => openModal(registerModal));
    }

    // Event listeners for closing modals
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (e.target.closest('#loginModal')) {
                closeModal(loginModal);
            } else if (e.target.closest('#registerModal')) {
                closeModal(registerModal);
            }
        });
    });

    // Event listeners for switching between modals
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(loginModal);
            openModal(registerModal);
        });
    }
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(registerModal);
            openModal(loginModal);
        });
    }

    // Close modal if clicked outside
    window.addEventListener('click', (event) => {
        if (event.target == loginModal) {
            closeModal(loginModal);
        }
        if (event.target == registerModal) {
            closeModal(registerModal);
        }
    });


    // Universal Carousel Functionality for Hero Carousel
    function setupCarousel(carouselId, dotsContainerId, autoplayBtnId, autoplayInterval = 3000) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        const slides = carousel.children;
        const dotsContainer = document.getElementById(dotsContainerId);
        let currentIndex = 0;
        let intervalId;
        let isPlaying = true;

        // Create dots
        if (dotsContainer) {
            for (let i = 0; i < slides.length; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToSlide(i);
                    pauseAutoplay();
                });
                dotsContainer.appendChild(dot);
            }
        }

        const dots = dotsContainer ? dotsContainer.children : [];

        function goToSlide(index) {
            if (index < 0) {
                index = slides.length - 1;
            } else if (index >= slides.length) {
                index = 0;
            }
            carousel.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
            updateDots();
        }

        function updateDots() {
            if (dots.length > 0) {
                Array.from(dots).forEach((dot, i) => {
                    if (i === currentIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        }

        // Add swipe functionality
        let startX;
        let isDragging = false;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            pauseAutoplay();
        });

        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault(); // Prevent vertical scrolling while swiping horizontally
        });

        carousel.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (diff > 50) { // Swiped left
                goToSlide(currentIndex + 1);
            } else if (diff < -50) { // Swiped right
                goToSlide(currentIndex - 1);
            }
            isDragging = false;
        });

        // Autoplay functions
        function startAutoplay() {
            if (intervalId) clearInterval(intervalId);
            intervalId = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, autoplayInterval);
            isPlaying = true;
            if (autoplayBtnId) {
                const btn = document.getElementById(autoplayBtnId);
                if (btn) btn.innerHTML = '<i class="fas fa-pause"></i>';
            }
        }

        function pauseAutoplay() {
            clearInterval(intervalId);
            isPlaying = false;
            if (autoplayBtnId) {
                const btn = document.getElementById(autoplayBtnId);
                if (btn) btn.innerHTML = '<i class="fas fa-play"></i>';
            }
        }

        if (autoplayBtnId) {
            const autoplayButton = document.getElementById(autoplayBtnId);
            if (autoplayButton) {
                autoplayButton.addEventListener('click', () => {
                    if (isPlaying) {
                        pauseAutoplay();
                    } else {
                        startAutoplay();
                    }
                });
            }
        }

        // Setup controls (prev/next buttons)
        const prevButton = document.querySelector(`.carousel-control.prev[data-carousel="${carouselId}"]`);
        const nextButton = document.querySelector(`.carousel-control.next[data-carousel="${carouselId}"]`);

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
                pauseAutoplay();
            });
        }
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
                pauseAutoplay();
            });
        }

        // Start autoplay on load for the main hero carousel
        if (carouselId === 'heroCarousel') {
            startAutoplay();
        }
    }

    // Initialize Hero Carousel
    setupCarousel('heroCarousel', 'heroCarouselDots', 'heroAutoplayBtn');


    // Featured Events Main Slider (no autoplay controls)
    const featuredMainSlider = document.getElementById('featuredMainSlider');
    if (featuredMainSlider) {
        featuredMainSlider.addEventListener('scroll', () => {
            // No specific logic needed here for auto-updating thumbnails,
            // as the thumbnail click drives the main slider.
        });
    }

    // Featured Events Thumbnail Slider
    const featuredThumbSlider = document.getElementById('featuredThumbSlider');
    if (featuredThumbSlider) {
        const thumbItems = featuredThumbSlider.children;
        const mainSlider = document.getElementById('featuredMainSlider');
        let currentActiveThumb = 0;

        function updateFeaturedDisplay(index) {
            if (!mainSlider || !thumbItems[index]) return;

            // Update main slider position
            mainSlider.scrollTo({
                left: mainSlider.offsetWidth * index,
                behavior: 'smooth'
            });

            // Update active class on thumbnails
            if (thumbItems[currentActiveThumb]) {
                thumbItems[currentActiveThumb].classList.remove('active');
            }
            thumbItems[index].classList.add('active');
            currentActiveThumb = index;
        }

        // Add click listeners to thumbnails
        Array.from(thumbItems).forEach((item, index) => {
            item.addEventListener('click', () => updateFeaturedDisplay(index));
        });

        // Update active thumbnail when main slider is scrolled manually
        let scrollTimeout;
        if (mainSlider) {
            mainSlider.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    const scrollLeft = mainSlider.scrollLeft;
                    const itemWidth = mainSlider.offsetWidth;
                    let newIndex = Math.round(scrollLeft / itemWidth);

                    if (newIndex !== currentActiveThumb) {
                        updateFeaturedDisplay(newIndex);
                    }
                }, 150);
            });
        }
        // Ensure first thumbnail is active on load
        if (thumbItems.length > 0) {
            thumbItems[0].classList.add('active');
        }
    }
    /* ========================= */
    /* === HEADER SCROLL EFFECT === */
    /* ========================= */
    const header = document.getElementById('main-header');
    
    // Función para añadir o quitar la clase 'scrolled'
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // El número 50 es la cantidad de píxeles que necesitas desplazarte para que cambie
            (document.getElementById('main-header')).classList.add('scrolled');
        } else {
            (document.getElementById('main-header')).classList.remove('scrolled');
        }
    });

}); // Cierre del addEventListener
