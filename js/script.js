// Modern Portfolio Interactive Features
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    initCustomCursor();
    initLiquidNav();
    initMagneticButtons();
    initTypingEffect();
    initScrollAnimations();
    initAccordion();
    initFormHandler();
    initThemeToggle();
    initParallax();
    initCounter();
});

// Custom Cursor
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (window.matchMedia('(pointer: coarse)').matches) {
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
        return;
    }
    
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });
    
    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .magnetic-btn, .project-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.background = 'rgba(99, 102, 241, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.background = 'transparent';
        });
    });
}

// Liquid Navigation
function initLiquidNav() {
    const nav = document.querySelector('.liquid-nav');
    const menu = document.querySelector('.nav-menu');
    const links = document.querySelectorAll('.nav-link');
    const mobileToggle = document.getElementById('mobileToggle');
    const liquidBg = document.querySelector('.liquid-bg');
    
    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
        
        // Update scroll progress
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (currentScroll / docHeight) * 100;
        document.querySelector('.scroll-progress').style.width = `${progress}%`;
    });
    
    // Liquid hover effect
    links.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            const rect = link.getBoundingClientRect();
            const menuRect = menu.getBoundingClientRect();
            
            liquidBg.style.width = `${rect.width}px`;
            liquidBg.style.height = `${rect.height}px`;
            liquidBg.style.left = `${rect.left - menuRect.left}px`;
            liquidBg.style.top = `${rect.top - menuRect.top}px`;
            liquidBg.style.opacity = '1';
        });
    });
    
    menu.addEventListener('mouseleave', () => {
        liquidBg.style.opacity = '0';
    });
    
    // Mobile menu toggle
    mobileToggle?.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        menu.classList.toggle('active');
    });
    
    // Close mobile menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            menu.classList.remove('active');
        });
    });
    
    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Magnetic Buttons
function initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.magnetic-btn, .magnetic-icon');
    
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    magneticElements.forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            elem.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        elem.addEventListener('mouseleave', () => {
            elem.style.transform = 'translate(0, 0)';
        });
    });
}

// Typing Effect
function initTypingEffect() {
    const textElement = document.getElementById('typingText');
    const words = ['Software Developer', 'Full Stack Developer', 'Data Analyst', 'Competitive Programmer'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    type();
}

// Scroll Animations using Intersection Observer
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
        revealObserver.observe(el);
    });
    
    // Add revealed class styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        [data-reveal].revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        [data-reveal="left"].revealed { transform: translateX(0) !important; }
        [data-reveal="left"] { transform: translateX(-50px); }
        [data-reveal="right"].revealed { transform: translateX(0) !important; }
        [data-reveal="right"] { transform: translateX(50px); }
        [data-reveal="up"].revealed { transform: translateY(0) !important; }
        [data-reveal="up"] { transform: translateY(50px); }
    `;
    document.head.appendChild(style);
    
    // Timeline animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Update timeline progress
                const visible = Array.from(timelineItems).filter(item => 
                    item.classList.contains('visible')
                ).length;
                const progress = (visible / timelineItems.length) * 100;
                document.querySelector('.timeline-progress').style.height = `${progress}%`;
                
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach(item => timelineObserver.observe(item));
    
    // Skill bars animation
    const skillItems = document.querySelectorAll('.skill-category');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate skill fills
                const fills = entry.target.querySelectorAll('.skill-fill');
                fills.forEach((fill, index) => {
                    const skillValue = fill.parentElement.parentElement.dataset.skill;
                    setTimeout(() => {
                        fill.style.width = `${skillValue}%`;
                    }, index * 100);
                });
                
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    skillItems.forEach(item => skillObserver.observe(item));
}

// Accordion
function initAccordion() {
    const items = document.querySelectorAll('.accordion-item');
    
    items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            items.forEach(i => i.classList.remove('active'));
            
            // Open clicked if not active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Form Handler
function initFormHandler() {
    const form = document.getElementById('contactForm');
    
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('.btn-submit');
        const btnText = btn.querySelector('.btn-text');
        const btnLoading = btn.querySelector('.btn-loading');
        const originalText = btnText.textContent;
        
        // Show loading
        btnText.style.opacity = '0';
        btnLoading.style.display = 'block';
        btn.disabled = true;
        
        // Simulate submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success
        btnLoading.style.display = 'none';
        btnText.textContent = 'Message Sent!';
        btnText.style.opacity = '1';
        btn.style.background = 'var(--success-color, #10b981)';
        
        form.reset();
        
        setTimeout(() => {
            btnText.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    });
}

// Theme Toggle
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const icon = toggle?.querySelector('i');
    const body = document.body;
    
    // Check saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        icon?.classList.replace('bx-moon', 'bx-sun');
    }
    
    toggle?.addEventListener('click', () => {
        const isDark = body.getAttribute('data-theme') === 'dark';
        
        if (isDark) {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            icon?.classList.replace('bx-sun', 'bx-moon');
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            icon?.classList.replace('bx-moon', 'bx-sun');
        }
    });
}

// Parallax Effect
function initParallax() {
    const heroImage = document.querySelector('.image-container');
    const blobs = document.querySelectorAll('.gradient-blob');
    
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX) / 50;
        const y = (window.innerHeight - e.pageY) / 50;
        
        if (heroImage) {
            heroImage.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
        }
        
        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 10;
            blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
}

// Counter Animation
function initCounter() {
    const badge = document.querySelector('.years');
    if (!badge) return;
    
    let counted = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                counted = true;
                let current = 0;
                const target = 3;
                const increment = target / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        badge.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        badge.textContent = Math.floor(current);
                    }
                }, 30);
                
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(badge);
}

// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 100;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Tilt Effect for project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Text Scramble Effect for hero greeting
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span style="color: var(--primary)">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Initialize scramble effect
const greeting = document.querySelector('[data-scramble]');
if (greeting) {
    const fx = new TextScramble(greeting);
    let counter = 0;
    const phrases = ['Hello, I\'m', 'Hola, soy', 'Bonjour, je suis'];
    
    const next = () => {
        fx.setText(phrases[counter]).then(() => {
            setTimeout(next, 3000);
        });
        counter = (counter + 1) % phrases.length;
    };
    
    setTimeout(next, 2000);
}