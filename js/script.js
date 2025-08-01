// Enhanced Portfolio JavaScript with improved animations and interactions

// DOM Elements
const menuBtn = document.querySelector('.mobile-menu-btn');
const navbar = document.querySelector('.navbar');
const header = document.querySelector('.header');
const darkModeIcon = document.querySelector('#darkMode-icon');
const navLinks = document.querySelectorAll('.navbar a');
const backToTop = document.querySelector('.back-to-top');
const loadingScreen = document.querySelector('.loading-screen');

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

// Loading Screen Management
const hideLoadingScreen = () => {
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            document.body.style.overflow = 'visible';
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    }
};

// Particles Canvas Animation
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 50;
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.3 + 0.1
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Cursor Glow Effect
class CursorGlow {
    constructor() {
        this.cursor = document.querySelector('.cursor-glow');
        if (!this.cursor) {
            this.cursor = document.createElement('div');
            this.cursor.className = 'cursor-glow';
            document.body.appendChild(this.cursor);
        }
        
        this.init();
    }
    
    init() {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        const updateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            this.cursor.style.left = cursorX + 'px';
            this.cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(updateCursor);
        };
        
        updateCursor();
        
        // Hide cursor on touch devices
        document.addEventListener('touchstart', () => {
            this.cursor.style.display = 'none';
        });
        
        document.addEventListener('touchend', () => {
            this.cursor.style.display = 'block';
        });
    }
}

// Enhanced Mobile Menu
class MobileMenu {
    constructor() {
        this.menuBtn = menuBtn;
        this.navbar = navbar;
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.menuBtn || !this.navbar) return;
        
        this.menuBtn.addEventListener('click', () => this.toggle());
        
        // Close menu when clicking links
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.close());
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target) && !this.menuBtn.contains(e.target)) {
                this.close();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    toggle() {
        this.isOpen ? this.close() : this.open();
    }
    
    open() {
        this.navbar.classList.add('active');
        this.menuBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isOpen = true;
    }
    
    close() {
        this.navbar.classList.remove('active');
        this.menuBtn.classList.remove('active');
        document.body.style.overflow = '';
        this.isOpen = false;
    }
}

// Enhanced Typing Animation
class TypeWriter {
    constructor(element, words, options = {}) {
        this.element = element;
        this.words = words;
        this.speed = options.speed || 100;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.pauseTime = options.pauseTime || 2000;
        this.currentWordIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        
        this.type();
    }
    
    type() {
        const currentWord = this.words[this.currentWordIndex];
        
        if (this.isDeleting) {
            this.currentText = currentWord.substring(0, this.currentText.length - 1);
        } else {
            this.currentText = currentWord.substring(0, this.currentText.length + 1);
        }
        
        this.element.textContent = this.currentText;
        
        let timeout = this.isDeleting ? this.deleteSpeed : this.speed;
        
        if (!this.isDeleting && this.currentText === currentWord) {
            timeout = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            this.isDeleting = false;
            this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
            timeout = 500;
        }
        
        setTimeout(() => this.type(), timeout);
    }
}

// Enhanced FAQ System
class FAQSystem {
    constructor() {
        this.faqs = document.querySelectorAll('.faq');
        this.init();
    }
    
    init() {
        this.faqs.forEach(faq => {
            const question = faq.querySelector('.faq-question');
            const answer = faq.querySelector('.faq-answer');
            
            question.addEventListener('click', () => {
                const isActive = faq.classList.contains('active');
                
                // Close all other FAQs
                this.faqs.forEach(otherFaq => {
                    if (otherFaq !== faq) {
                        otherFaq.classList.remove('active');
                    }
                });
                
                // Toggle current FAQ
                faq.classList.toggle('active', !isActive);
            });
        });
    }
}

// Enhanced Form Handler
class ContactForm {
    constructor() {
        this.form = document.querySelector('#frm');
        this.submitBtn = document.querySelector('.btn-submit');
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearErrors(input));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        switch (field.name) {
            case 'fname':
            case 'lname':
                if (!value) {
                    isValid = false;
                    errorMessage = 'This field is required';
                } else if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Must be at least 2 characters';
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    isValid = false;
                    errorMessage = 'Email is required';
                } else if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email';
                }
                break;
                
            case 'number':
                const phoneRegex = /^\d{10,15}$/;
                if (!value) {
                    isValid = false;
                    errorMessage = 'Phone number is required';
                } else if (!phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
                
            case 'msg':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Message is required';
                } else if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters';
                }
                break;
        }
        
        this.showFieldError(field, isValid, errorMessage);
        return isValid;
    }
    
    showFieldError(field, isValid, message) {
        this.clearErrors(field);
        
        if (!isValid) {
            field.classList.add('error');
            const errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.textContent = message;
            field.parentNode.appendChild(errorEl);
        }
    }
    
    clearErrors(field) {
        field.classList.remove('error');
        const errorEl = field.parentNode.querySelector('.error-message');
        if (errorEl) {
            errorEl.remove();
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Validate all fields
        let isFormValid = true;
        const fields = this.form.querySelectorAll('input[required], textarea[required]');
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) return;
        
        this.showLoading();
        
        // Create mailto link
        const emailConfig = {
            to: "kabbofaraz@gmail.com",
            subject: encodeURIComponent(`Portfolio Contact from ${data.fname} ${data.lname}`),
            body: encodeURIComponent(
                `Name: ${data.fname} ${data.lname}\n` +
                `Email: ${data.email}\n` +
                `Phone: ${data.number}\n\n` +
                `Message:\n${data.msg}`
            )
        };
        
        setTimeout(() => {
            this.hideLoading();
            window.location.href = `mailto:${emailConfig.to}?subject=${emailConfig.subject}&body=${emailConfig.body}`;
            this.showSuccess();
        }, 1000);
    }
    
    showLoading() {
        if (this.submitBtn) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.disabled = true;
        }
    }
    
    hideLoading() {
        if (this.submitBtn) {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
        }
    }
    
    showSuccess() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = '<i class="bx bx-check-circle"></i> Thank you for your message!';
        this.form.appendChild(successMessage);
        
        setTimeout(() => {
            successMessage.remove();
            this.form.reset();
        }, 3000);
    }
}

// Dark Mode Manager
class DarkModeManager {
    constructor() {
        this.darkModeIcon = darkModeIcon;
        this.isDark = localStorage.getItem('darkMode') === 'true';
        
        this.init();
    }
    
    init() {
        // Set initial state
        this.updateTheme();
        
        if (this.darkModeIcon) {
            this.darkModeIcon.addEventListener('click', () => this.toggle());
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (localStorage.getItem('darkMode') === null) {
                this.isDark = e.matches;
                this.updateTheme();
            }
        });
    }
    
    toggle() {
        this.isDark = !this.isDark;
        localStorage.setItem('darkMode', this.isDark);
        this.updateTheme();
    }
    
    updateTheme() {
        if (this.isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (this.darkModeIcon) {
                this.darkModeIcon.classList.replace('bx-moon', 'bx-sun');
            }
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (this.darkModeIcon) {
                this.darkModeIcon.classList.replace('bx-sun', 'bx-moon');
            }
        }
    }
}

// Scroll Progress Manager
class ScrollProgress {
    constructor() {
        this.progressBar = document.querySelector('.scroll-progress');
        this.init();
    }
    
    init() {
        if (!this.progressBar) return;
        
        const updateProgress = throttle(() => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = window.scrollY;
            const progress = Math.min((scrolled / totalScroll) * 100, 100);
            this.progressBar.style.width = `${progress}%`;
        }, 10);
        
        window.addEventListener('scroll', updateProgress);
    }
}

// Navigation Manager
class NavigationManager {
    constructor() {
        this.header = header;
        this.navLinks = navLinks;
        this.sections = document.querySelectorAll('section[id]');
        this.backToTop = backToTop;
        
        this.init();
    }
    
    init() {
        // Sticky header
        const handleScroll = throttle(() => {
            const currentScroll = window.scrollY;
            
            if (this.header) {
                this.header.classList.toggle('scrolled', currentScroll > 100);
            }
            
            if (this.backToTop) {
                this.backToTop.classList.toggle('visible', currentScroll > 300);
            }
            
            this.updateActiveNavLink();
        }, 10);
        
        window.addEventListener('scroll', handleScroll);
        
        // Smooth scroll for navigation
        this.navLinks.forEach(link => {
            if (link.getAttribute('href').startsWith('#')) {
                link.addEventListener('click', (e) => this.smoothScroll(e, link));
            }
        });
        
        // Back to top functionality
        if (this.backToTop) {
            this.backToTop.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }
    
    smoothScroll(e, link) {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        
        if (target) {
            const headerHeight = this.header?.offsetHeight || 80;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    updateActiveNavLink() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// Enhanced Portfolio Effects
class PortfolioEffects {
    constructor() {
        this.portfolioItems = document.querySelectorAll('.portfolio-item');
        this.init();
    }
    
    init() {
        this.portfolioItems.forEach((item, index) => {
            // Intersection Observer for scroll animations
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, index * 100);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(item);
            
            // 3D tilt effect for desktop
            if (window.innerWidth > 768) {
                this.add3DTiltEffect(item);
            }
            
            // Particle effect on hover
            item.addEventListener('mouseenter', (e) => {
                this.createParticleEffect(e);
            });
        });
    }
    
    add3DTiltEffect(item) {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });
    }
    
    createParticleEffect(e) {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'hover-particle';
                particle.style.cssText = `
                    position: fixed;
                    width: 4px;
                    height: 4px;
                    background: var(--primary-color);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    left: ${e.clientX + (Math.random() - 0.5) * 50}px;
                    top: ${e.clientY + (Math.random() - 0.5) * 50}px;
                    animation: particleFloat 1s ease-out forwards;
                `;
                
                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 1000);
            }, i * 50);
        }
    }
}

// Skills Animation Manager
class SkillsAnimation {
    constructor() {
        this.skillSections = document.querySelectorAll('.skills-grid');
        this.init();
    }
    
    init() {
        this.skillSections.forEach(section => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateSkills(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(section);
        });
    }
    
    animateSkills(skillsGrid) {
        const skillItems = skillsGrid.querySelectorAll('.skill-item');
        const progressBars = skillsGrid.querySelectorAll('.progress-bar');
        
        skillItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.width = '85%';
            }, index * 200);
        });
    }
}

// Add particle animation CSS
const addParticleCSS = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-50px) scale(0);
            }
        }
        
        .error-message {
            color: var(--error-color, #ef4444);
            font-size: 1.2rem;
            margin-top: 0.5rem;
            display: block;
        }
        
        .form-input.error,
        .form-textarea.error {
            border-color: var(--error-color, #ef4444);
        }
        
        .success-message {
            background: var(--success-color, #10b981);
            color: white;
            padding: 1rem;
            border-radius: var(--radius-lg, 0.5rem);
            margin-top: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideInUp 0.3s ease;
        }
        
        .loading-shimmer {
            position: relative;
            overflow: hidden;
        }
        
        .loading-shimmer::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }
    `;
    document.head.appendChild(style);
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add required CSS
    addParticleCSS();
    
    // Initialize all systems
    new DarkModeManager();
    new MobileMenu();
    new NavigationManager();
    new ScrollProgress();
    new FAQSystem();
    new ContactForm();
    new PortfolioEffects();
    new SkillsAnimation();
    
    // Initialize cursor glow (desktop only)
    if (window.innerWidth > 768) {
        new CursorGlow();
    }
    
    // Initialize particle system
    const particlesCanvas = document.querySelector('#particles-canvas');
    if (particlesCanvas) {
        new ParticleSystem(particlesCanvas);
    }
    
    // Initialize typing animation
    const typingElement = document.querySelector('.multiple-text');
    if (typingElement) {
        new TypeWriter(typingElement, [
            'Software Developer',
            'Full Stack Developer', 
            'Data Analyst',
            'Competitive Programmer'
        ], {
            speed: 120,
            deleteSpeed: 80,
            pauseTime: 2000
        });
    }
    
    // Hide loading screen
    hideLoadingScreen();
    
    // Mark body as loaded
    document.body.classList.add('loaded');
    
    console.log('Enhanced Portfolio initialized successfully! 🚀');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        document.body.classList.add('paused');
    } else {
        // Resume animations when page is visible
        document.body.classList.remove('paused');
    }
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    });
}

// pore remove korbe ei part
document.addEventListener('DOMContentLoaded', function() {
    // Video overlay click handler
    const videoOverlay = document.querySelector('.video-overlay');
    const video = document.querySelector('.showcase-video');
    
    if (videoOverlay && video) {
        videoOverlay.addEventListener('click', function() {
            video.play();
            videoOverlay.style.opacity = '0';
            videoOverlay.style.pointerEvents = 'none';
        });
        
        // Show overlay again when video is paused
        video.addEventListener('pause', function() {
            videoOverlay.style.opacity = '1';
            videoOverlay.style.pointerEvents = 'auto';
        });
        
        video.addEventListener('ended', function() {
            videoOverlay.style.opacity = '1';
            videoOverlay.style.pointerEvents = 'auto';
        });
    }
    
    // Lazy loading for video
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '50px'
    };
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                if (video.dataset.src) {
                    video.src = video.dataset.src;
                    video.load();
                    videoObserver.unobserve(video);
                }
            }
        });
    }, observerOptions);
    
    // Observe videos for lazy loading
    document.querySelectorAll('video[data-src]').forEach(video => {
        videoObserver.observe(video);
    });
});

// upto this 