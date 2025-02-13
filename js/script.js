// DOM Elements
const menuBtn = document.querySelector('.mobile-menu-btn');
const navbar = document.querySelector('.navbar');
const header = document.querySelector('.header');
const darkModeIcon = document.querySelector('#darkMode-icon');
const navLinks = document.querySelectorAll('.navbar a');

// Mobile Menu Functionality
menuBtn?.addEventListener('click', () => {
    navbar.classList.toggle('active');
    menuBtn.querySelector('i').classList.toggle('bx-x');
});

// Close menu when clicking links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
        menuBtn?.querySelector('i').classList.remove('bx-x');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !menuBtn?.contains(e.target)) {
        navbar.classList.remove('active');
        menuBtn?.querySelector('i').classList.remove('bx-x');
    }
});

// Typed text animation
const typed = new Typed('.multiple-text', {
    strings: ['Software Developer', 'Full Stack Developer', 'Data Analyst', 'Competitive Programmer'],
    typeSpeed: 120,
    backSpeed: 120,
    backDelay: 1300,
    loop: true
});

// Sticky header with scroll optimization
let lastScroll = 0;
let scrollTimeout;

window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            const currentScroll = window.scrollY;
            
            // Sticky header
            header.classList.toggle('sticky', currentScroll > 100);
            
            // Close mobile menu on scroll
            if (Math.abs(currentScroll - lastScroll) > 30) {
                navbar.classList.remove('active');
                menuBtn?.querySelector('i').classList.remove('bx-x');
            }
            
            lastScroll = currentScroll;
            scrollTimeout = null;
        }, 50);
    }
});

// FAQ Functionality
const faqs = document.querySelectorAll('.faq');
faqs.forEach(faq => {
    faq.addEventListener('click', () => {
        // Close other FAQs
        faqs.forEach(otherFaq => {
            if (otherFaq !== faq && otherFaq.classList.contains('open')) {
                otherFaq.classList.remove('open');
                otherFaq.querySelector('.faq_icon i').className = 'bx bx-plus';
            }
        });

        // Toggle current FAQ
        faq.classList.toggle('open');
        const icon = faq.querySelector('.faq_icon i');
        icon.className = faq.classList.contains('open') ? 'bx bx-minus' : 'bx bx-plus';
    });
});

// Form Validation with improved error handling
jQuery("#frm").validate({
    rules: {
        fname: "required",
        lname: "required",
        number: {
            required: true,
            minlength: 10,
            maxlength: 15,
            digits: true
        },
        msg: {
            required: true,
            minlength: 50
        },
        email: {
            required: true,
            email: true
        }
    },
    messages: {
        fname: "Please enter your first name",
        lname: "Please enter your last name",
        number: {
            required: "Please enter your contact number",
            minlength: "Please enter a valid phone number",
            maxlength: "Phone number is too long",
            digits: "Please enter only numbers"
        },
        msg: {
            required: "Please enter your message",
            minlength: "Message must be at least 50 characters long"
        },
        email: {
            required: "Please enter your email address",
            email: "Please enter a valid email address"
        }
    },
    errorPlacement: function(error, element) {
        error.insertAfter(element);
        error.addClass('error-message');
    },
    submitHandler: function(form) {
        // Capture form data
        const formData = {
            fname: form.fname.value,
            lname: form.lname.value,
            email: form.email.value,
            number: form.number.value,
            msg: form.msg.value
        };

        // Create mailto link
        const emailConfig = {
            to: "kabbofaraz@gmail.com",
            subject: encodeURIComponent("Portfolio Contact Form"),
            body: encodeURIComponent(
                Object.entries(formData)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('\n')
            )
        };

        window.location.href = `mailto:${emailConfig.to}?subject=${emailConfig.subject}&body=${emailConfig.body}`;
    }
});

// Dark/Light mode with localStorage
const initializeDarkMode = () => {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeIcon.classList.add('bx-sun');
    }
};

darkModeIcon.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkModeIcon.classList.toggle('bx-sun');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Initialize dark mode
initializeDarkMode();

// ScrollReveal Animations with performance optimization
const sr = ScrollReveal({
    reset: true,
    distance: '70px',
    duration: 1800,
    delay: 150,
    mobile: true,
    useDelay: 'onload',
    viewFactor: 0.2
});

// Reveal animations
sr.reveal('.home-content, .heading', { origin: 'top' });
sr.reveal('.home-img img, .about-content, .education-row, .skills-row, .portfolio-container, .container .contact form', 
    { origin: 'bottom' });
sr.reveal('.home-content h1', { origin: 'left' });
sr.reveal('.home-content h3, .home-content p, .about-content', { origin: 'right' });
sr.reveal('.social-media', { origin: 'bottom', interval: 200 });

// Add smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize skill bar animations when in view
const observeSkills = () => {
    const skillBars = document.querySelectorAll('.skills-content .progress .bar span');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const percent = progressBar.parentElement.previousElementSibling.querySelector('span').textContent;
                progressBar.style.width = percent;
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
};

// Call skill bar animation
observeSkills();

// Add touch event handling for mobile
let touchStartY;
document.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', e => {
    if (!touchStartY) return;
    
    const touchEndY = e.touches[0].clientY;
    const diff = touchStartY - touchEndY;
    
    // Close mobile menu on scroll
    if (Math.abs(diff) > 30) {
        navbar.classList.remove('active');
        menuBtn?.querySelector('i').classList.remove('bx-x');
    }
}, { passive: true });

document.addEventListener('touchend', () => {
    touchStartY = null;
}, { passive: true });

// Add this to your JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Fix for all clickable elements
    const clickableElements = document.querySelectorAll('a, button, .faq, .portfolio-layer');
    
    clickableElements.forEach(element => {
        element.addEventListener('touchstart', function() {}, {passive: true});
        
        // Prevent ghost clicks
        element.addEventListener('touchend', function(e) {
            e.preventDefault();
            element.click();
        }, {passive: false});
    });
    
    // Fix for portfolio hover on mobile
    const portfolioBoxes = document.querySelectorAll('.portfolio-box');
    portfolioBoxes.forEach(box => {
        box.addEventListener('touchstart', function() {
            this.classList.add('touch-hover');
        }, {passive: true});
        
        box.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-hover');
            }, 300);
        }, {passive: true});
    });
});

// Add to your existing JavaScript

// Scroll reveal animation
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', reveal);

// Project cards animation
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
        }
    });
}, observerOptions);

document.querySelectorAll('.portfolio-box').forEach(box => {
    observer.observe(box);
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Particle background (add this if you want a cool background effect)
particlesJS('particles-js', {
    particles: {
        number: { value: 80 },
        color: { value: '#4a90e2' },
        opacity: { value: 0.5 },
        size: { value: 3 },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#4a90e2',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 6
        }
    }
});

const updateScrollProgress = () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / totalScroll) * 100;
    document.querySelector('.scroll-progress').style.width = `${progress}%`;
};

window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('resize', updateScrollProgress);

// Add to your script.js - Change the variable name to avoid conflicts
const fadeObserverOptions = {
    threshold: 0.2
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, fadeObserverOptions);

document.querySelectorAll('.section-fade').forEach(section => {
    fadeObserver.observe(section);
});