document.addEventListener('DOMContentLoaded', () => {
    // --- Carousel Logic ---
    const slides = document.querySelectorAll('.slide-bg');
    const contents = document.querySelectorAll('.slide-content');
    const indicators = document.querySelectorAll('.indicator');
    const hero = document.getElementById('hero');
    let currentSlide = 0;
    const slideCount = slides.length;
    let autoplayInterval;

    function goToSlide(index) {
        // Remove active class from current
        slides[currentSlide].classList.remove('active');
        contents[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');

        // Update currentSlide
        currentSlide = index;

        // Add active class to new
        slides[currentSlide].classList.add('active');
        contents[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slideCount);
    }

    function startAutoplay() {
        // Clear any existing interval to prevent duplicates
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, 6500); // 6.5 seconds
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }

    // Initialize Autoplay
    startAutoplay();

    // Pause on hover
    hero.addEventListener('mouseenter', stopAutoplay);
    hero.addEventListener('mouseleave', startAutoplay);

    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            // Optional: reset autoplay timer on manual click
            startAutoplay();
        });
    });

    // Control clicks
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide((currentSlide - 1 + slideCount) % slideCount);
            startAutoplay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoplay();
        });
    }

    // --- Stats Counter Logic ---
    // Easing function: easeOutExpo
    function easeOutExpo(x) {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }

    function animateCount(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 2000;
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easeProgress = easeOutExpo(percentage);
            
            const currentCount = Math.floor(easeProgress * target);
            el.innerText = currentCount;

            if (progress < duration) {
                window.requestAnimationFrame(step);
            } else {
                el.innerText = target;
            }
        }
        window.requestAnimationFrame(step);
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-counted')) {
                entry.target.setAttribute('data-counted', 'true');
                const sectionCounts = entry.target.querySelectorAll('.count');
                sectionCounts.forEach(el => animateCount(el));
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsSection1 = document.getElementById('stats');
    const statsSection2 = document.getElementById('estatisticas-secundarias');
    
    if (statsSection1) observer.observe(statsSection1);
    if (statsSection2) observer.observe(statsSection2);

    // --- Process Cards Animation ---
    const processCards = document.querySelectorAll('.process-card');
    const processObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger slightly earlier
    };

    const processObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered delay based on index
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 150);
                obs.unobserve(entry.target);
            }
        });
    }, processObserverOptions);

    processCards.forEach(card => {
        processObserver.observe(card);
    });

    // --- FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            // Open clicked item if it wasn't already active
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
});
