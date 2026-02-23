// Modern Portfolio Interactive Features with Three.js Particles
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    initThreeParticles();
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
    initProjectCards3D();
});

// Three.js Floating Particles
function initThreeParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas || window.matchMedia('(pointer: coarse)').matches) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Elegant color palette
    const colors = [
        new THREE.Color(0x667eea), // Primary purple-blue
        new THREE.Color(0x764ba2), // Secondary purple
        new THREE.Color(0xf093fb), // Accent pink
        new THREE.Color(0x4facfe), // Light blue
        new THREE.Color(0x00f2fe)  // Cyan
    ];
    
    // Create particles
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colorsArray = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const speeds = [];
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        colorsArray[i * 3] = color.r;
        colorsArray[i * 3 + 1] = color.g;
        colorsArray[i * 3 + 2] = color.b;
        
        sizes[i] = Math.random() * 0.1 + 0.05;
        speeds.push({
            x: (Math.random() - 0.5) * 0.01,
            y: (Math.random() - 0.5) * 0.01,
            z: (Math.random() - 0.5) * 0.005
        });
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    // Add connecting lines
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x667eea,
        transparent: true,
        opacity: 0.1
    });
    
    camera.position.z = 5;
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation loop
    let animationId;
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;
        
        const positions = geometry.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            // Update positions
            positions[i * 3] += speeds[i].x + (targetX * 0.01);
            positions[i * 3 + 1] += speeds[i].y + (targetY * 0.01);
            positions[i * 3 + 2] += speeds[i].z;
            
            // Boundary check
            if (Math.abs(positions[i * 3]) > 10) speeds[i].x *= -1;
            if (Math.abs(positions[i * 3 + 1]) > 10) speeds[i].y *= -1;
            if (Math.abs(positions[i * 3 + 2]) > 5) speeds[i].z *= -1;
            
            // Mouse attraction
            const dx = targetX * 5 - positions[i * 3];
            const dy = targetY * 5 - positions[i * 3 + 1];
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 3) {
                positions[i * 3] += dx * 0.01;
                positions[i * 3 + 1] += dy * 0.01;
            }
        }
        
        geometry.attributes.position.needsUpdate = true;
        
        // Rotate entire system slowly
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

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
            cursorOutline.style.background = 'rgba(102, 126, 234, 0.1)';
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
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
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
    
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX) / 50;
        const y = (window.innerHeight - e.pageY) / 50;
        
        if (heroImage) {
            heroImage.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
        }
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

// 3D Project Cards with Tilt Effect
function initProjectCards3D() {
    const cards = document.querySelectorAll('.project-card');
    
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    cards.forEach(card => {
        const wrapper = card.querySelector('.project-3d-wrapper');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            wrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            wrapper.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            card.style.transform = 'translateY(0)';
        });
    });
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
                output += `<span style="background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${char}</span>`;
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