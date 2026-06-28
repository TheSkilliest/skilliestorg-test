// ===================================
// Skilliest.org - JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {

    // ===== Mobile Menu Toggle =====
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // ===== Smooth Scrolling for Anchor Links =====
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            }
        });
    });

    // ===== FAQ Accordion =====
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                item.classList.toggle('active');
            });
        }
    });

    // ===== Navbar Background on Scroll =====
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 100) navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
        else navbar.style.boxShadow = 'none';
    });

    // ===== Scroll Reveal Animation =====
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.solution-card, .feature-item, .include-card, .timeline-item, .magnet-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // ===== Dynamic Year =====
    const currentYear = new Date().getFullYear();
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) footerYear.innerHTML = footerYear.innerHTML.replace('2026', currentYear);

    // ===== Glow Effect Primary Buttons =====
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('mouseenter', function() { this.style.boxShadow = '0 0 60px rgba(242, 135, 5, 0.5)'; });
        btn.addEventListener('mouseleave', function() { this.style.boxShadow = '0 4px 15px rgba(242, 135, 5, 0.3)'; });
    });

    // ===== Stat Counter Animation =====
    function animateCounter(element, targetStr, duration = 2000) {
        const target = parseInt(targetStr);
        if (isNaN(target)) return;
        const suffix = targetStr.includes('+') ? '+' : '';
        let current = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 16);
    }
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                animateCounter(entry.target, entry.target.textContent);
                entry.target.dataset.animated = 'true';
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-number').forEach(stat => statsObserver.observe(stat));

    // ===== SUCCESS STORIES LOGIC & LIGHTBOX =====
    const CATEGORY_MAP = {
        'cold-emailing': { title: 'Cold Emailing Success', theme: 'theme-orange' },
        'phd-admissions': { title: 'PhD Admissions', theme: 'theme-orange' },
        'ms-admissions': { title: 'MS Acceptances', theme: 'theme-orange' },
        'erasmus-mundus': { title: 'Erasmus Mundus Programs', theme: 'theme-orange' },
        'applications': { title: 'Applications Made', theme: 'theme-orange' },
        'fee-waivers-successes': { title: 'Fee Waiver Wins', theme: 'theme-orange' },
        'more-successes': { title: 'More Successes', theme: 'theme-orange' },
        'more-stories': { title: 'Other Stories', theme: 'theme-orange' }
    };

    let lightboxData = [];
    let currentImageIndex = 0;

    async function loadSuccessStories() {
        try {
            const response = await fetch('cdn-media.json');
            const data = await response.json();
            
            // Sort by priority globally
            data.sort((a, b) => parseInt(a.story_priority) - parseInt(b.story_priority));

            const featuredContainer = document.getElementById('featured-success-stories');
            const bootcampContainer = document.getElementById('bootcamp-success-stories');
            const fullGalleryContainer = document.getElementById('full-success-stories');

            if (featuredContainer) renderFeatured(data, featuredContainer);
            if (bootcampContainer) renderBootcampStories(data, bootcampContainer);
            if (fullGalleryContainer) renderFullGallery(data, fullGalleryContainer);

        } catch (error) {
            console.error('Error loading stories JSON:', error);
        }
    }

    // Render Home Page Featured
    function renderFeatured(data, container) {
        const cat1 = data.find(item => item.category_tag === 'cold-emailing' && item.hero_story === 'Yes');
        const cat2 = data.find(item => item.category_tag === 'phd-admissions' && item.hero_story === 'Yes');
        const cat3 = data.find(item => item.category_tag === 'ms-admissions' && item.hero_story === 'Yes');

        const featured = [cat1, cat2, cat3].filter(Boolean);
        
        // Custom titles for the Home Page featured section
        const featuredTitles = {
            'cold-emailing': 'Cold Emailing',
            'phd-admissions': 'PhD Offers',
            'ms-admissions': 'MS Acceptances'
        };

        container.innerHTML = featured.map(story => {
            // Apply the custom title to the story card
            const storyForHome = { ...story, title: featuredTitles[story.category_tag] || story.title };
            return createCardHTML(storyForHome);
        }).join('');
        
        attachCardListeners();
    }

    // Render Bootcamp Row
    function renderBootcampStories(data, container) {
        const bootcampStories = data.filter(s => s.hero_story === 'Yes').slice(0, 4);
        container.innerHTML = bootcampStories.map(story => createCardHTML(story)).join('');
        attachCardListeners();
    }

    // Render Full Page
    function renderFullGallery(data, container) {
        // Group by category based on predefined mapping sequence
        let html = '';
        for (const [tag, meta] of Object.entries(CATEGORY_MAP)) {
            const stories = data.filter(s => s.category_tag === tag);
            if (stories.length > 0) {
                html += `
                    <div class="gallery-category">
                        <h3 class="category-title ${meta.theme}-text">${meta.title}</h3>
                        <div class="stories-grid full-grid">
                            ${stories.map(story => createCardHTML(story)).join('')}
                        </div>
                    </div>
                `;
            }
        }
        container.innerHTML = html;
        attachCardListeners();
    }

    function createCardHTML(story) {
        const theme = CATEGORY_MAP[story.category_tag] ? CATEGORY_MAP[story.category_tag].theme : 'theme-orange';
        const titleText = story.title ? `<h4>${story.title}</h4>` : '';
        // Package all images for this story
        const images = [];
        for(let i=1; i<=5; i++) {
            if(story[`image_${i}`]) images.push(story[`image_${i}`]);
        }
        const imgsJson = JSON.stringify(images).replace(/"/g, '&quot;');
        
        return `
            <div class="success-card ${theme}" data-images="${imgsJson}">
                <div class="card-img-wrapper">
                    <img src="${story.image_1}" alt="${story.title || 'Success Story'}" loading="lazy">
                    <div class="card-overlay"><span>Click to view</span></div>
                </div>
                ${titleText}
            </div>
        `;
    }

    // Lightbox Logic
    function attachCardListeners() {
        document.querySelectorAll('.success-card').forEach(card => {
            card.addEventListener('click', function() {
                const images = JSON.parse(this.getAttribute('data-images'));
                if(images && images.length > 0) openLightbox(images);
            });
        });
    }

    function buildLightboxDOM() {
        if (document.getElementById('lightbox-overlay')) return;
        const html = `
            <div id="lightbox-overlay" class="lightbox-overlay">
                <div class="lightbox-close">&times;</div>
                <div class="lightbox-nav lightbox-prev">&#10094;</div>
                <div class="lightbox-content">
                    <img id="lightbox-img" src="" alt="Success Proof">
                </div>
                <div class="lightbox-nav lightbox-next">&#10095;</div>
                <div id="lightbox-dots" class="lightbox-dots"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);

        const overlay = document.getElementById('lightbox-overlay');
        document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        document.querySelector('.lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(-1); });
        document.querySelector('.lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(1); });
        
        // Close on clicking outside image
        overlay.addEventListener('click', (e) => {
            if (e.target.id === 'lightbox-overlay' || e.target.classList.contains('lightbox-content')) closeLightbox();
        });

        // Swipe support
        let touchstartX = 0;
        let touchendX = 0;
        overlay.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; });
        overlay.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            if (touchendX < touchstartX - 50) navigateLightbox(1); // Swipe left
            if (touchendX > touchstartX + 50) navigateLightbox(-1); // Swipe right
        }
    }

    function openLightbox(imagesArray) {
        buildLightboxDOM();
        lightboxData = imagesArray;
        currentImageIndex = 0;
        document.getElementById('lightbox-overlay').classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent scrolling
        updateLightboxView();
    }

    function closeLightbox() {
        document.getElementById('lightbox-overlay').classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function navigateLightbox(direction) {
        currentImageIndex += direction;
        if (currentImageIndex < 0) currentImageIndex = lightboxData.length - 1;
        if (currentImageIndex >= lightboxData.length) currentImageIndex = 0;
        updateLightboxView();
    }

    function updateLightboxView() {
        const imgEl = document.getElementById('lightbox-img');
        imgEl.src = lightboxData[currentImageIndex];

        // Controls visibility
        const prev = document.querySelector('.lightbox-prev');
        const next = document.querySelector('.lightbox-next');
        const dotsContainer = document.getElementById('lightbox-dots');

        if (lightboxData.length > 1) {
            prev.style.display = 'flex';
            next.style.display = 'flex';
            dotsContainer.innerHTML = lightboxData.map((_, i) => 
                `<span class="dot ${i === currentImageIndex ? 'active' : ''}" data-idx="${i}"></span>`
            ).join('');
            
            // attach dot clicks
            document.querySelectorAll('#lightbox-dots .dot').forEach(dot => {
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentImageIndex = parseInt(e.target.getAttribute('data-idx'));
                    updateLightboxView();
                });
            });
        } else {
            prev.style.display = 'none';
            next.style.display = 'none';
            dotsContainer.innerHTML = '';
        }
    }

    // Init data load
    loadSuccessStories();

});

// External Link Handler
document.addEventListener('click', function(e) {
    let target = e.target.closest('a');
    if (target) {
        const href = target.getAttribute('href');
        if (href && (href.startsWith('http') || href.startsWith('https')) && !href.includes('skilliest.org')) {
            target.setAttribute('target', '_blank');
            target.setAttribute('rel', 'noopener noreferrer');
        }
    }
});
