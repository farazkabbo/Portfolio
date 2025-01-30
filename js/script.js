// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Essential DOM elements
    const header = document.querySelector('.header');
    const menuBtn = document.querySelector('.menu-btn');
    const navbar = document.querySelector('.navbar');
    const darkModeIcon = document.querySelector('#darkMode-icon');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Typed.js Animation
    const typed = new Typed('.multiple-text', {
        strings: [
            'Web Developer',
            'Software Engineer',
            'Data Analyst',
            'ML Engineer'
        ],
        typeSpeed: 100,
        backSpeed: 100,
        backDelay: 1000,
        loop: true
    });

    // Mobile Menu Functionality
    menuBtn?.addEventListener('click', () => {
        navbar.classList.toggle('active');
        menuBtn.classList.toggle('bx-x');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !menuBtn.contains(e.target)) {
            navbar.classList.remove('active');
            menuBtn.classList.remove('bx-x');
        }
    });

    // Navigation link click handlers
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            menuBtn.classList.remove('bx-x');
        });
    });

    // Scroll Handling with Performance Optimization
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
                    menuBtn?.classList.remove('bx-x');
                }
                
                lastScroll = currentScroll;
                scrollTimeout = null;
            }, 50); // Throttle scroll events
        }
    });

    // Dark Mode Toggle with Local Storage
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

    // Initialize dark mode on load
    initializeDarkMode();

    // FAQ Accordion
    const faqs = document.querySelectorAll('.faq');
    faqs.forEach(faq => {
        faq.addEventListener('click', () => {
            const icon = faq.querySelector('.faq_icon i');
            const isOpen = faq.classList.contains('open');
            
            // Close other FAQs
            faqs.forEach(otherFaq => {
                if (otherFaq !== faq && otherFaq.classList.contains('open')) {
                    otherFaq.classList.remove('open');
                    otherFaq.querySelector('.faq_icon i').className = 'bx bx-plus';
                }
            });
            
            // Toggle current FAQ
            faq.classList.toggle('open');
            icon.className = isOpen ? 'bx bx-plus' : 'bx bx-minus';
        });
    });

    // Form Validation and Handling
    if (jQuery) {
        jQuery("#frm").validate({
            rules: {
                fname: "required",
                lname: "required",
                number: {
                    required: true,
                    minlength: 10,
                    maxlength: 15
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
                    maxlength: "Phone number is too long"
                },
                msg: {
                    required: "Please enter your message",
                    minlength: "Message must be at least 50 characters"
                },
                email: {
                    required: "Please enter your email address",
                    email: "Please enter a valid email address"
                }
            },
            submitHandler: function(form) {
                const formData = new FormData(form);
                const emailConfig = {
                    to: "kabbofaraz@gmail.com",
                    subject: encodeURIComponent("Portfolio Contact Form"),
                    body: encodeURIComponent(
                        Array.from(formData.entries())
                            .map(([key, value]) => `${key}: ${value}`)
                            .join('\n')
                    )
                };

                window.location.href = `mailto:${emailConfig.to}?subject=${emailConfig.subject}&body=${emailConfig.body}`;
            }
        });
    }

    // ScrollReveal Animations
    const sr = ScrollReveal({
        reset: true,
        distance: '70px',
        duration: 1800,
        delay: 150,
        mobile: true,
        useDelay: 'onload'
    });

   // Batch reveal animations for performance
sr.reveal('.home-content, .heading', { origin: 'top' });
sr.reveal('.home-img img, .about-content, .education-row, .skills-row, .portfolio-container, .contact form', 
    { origin: 'bottom' });
sr.reveal('.home-content h1', { origin: 'left' });
sr.reveal('.home-content h3, .home-content p, .about-content', { origin: 'right' });
sr.reveal('.social-media', { origin: 'bottom', interval: 200 });
sr.reveal('.profession-box', { origin: 'right', interval: 200 });

// Add animation classes for skill bars
document.querySelectorAll('.skills-content .progress').forEach((progress) => {
    const bar = progress.querySelector('.bar span');
    const percent = progress.querySelector('h3 span').textContent;
    bar.style.width = percent;
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Back to top button functionality
const footerIcon = document.querySelector('.footer-iconTop a');
footerIcon?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Intersection Observer for section animations
const sections = document.querySelectorAll('section[id]');
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            updateActiveNavLink(id);
        }
    });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

// Update active navigation link
function updateActiveNavLink(sectionId) {
    document.querySelectorAll('.navbar a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

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
        menuBtn?.classList.remove('bx-x');
    }
}, { passive: true });

document.addEventListener('touchend', () => {
    touchStartY = null;
}, { passive: true });

// Initialize ScrollReveal animations when everything is loaded
window.addEventListener('load', () => {
    // Re-run ScrollReveal
    sr.reveal('.home-content, .heading', { origin: 'top', reset: true });
    sr.reveal('.home-img img, .about-content, .education-row, .skills-row, .portfolio-container, .contact form', 
        { origin: 'bottom', reset: true });
    sr.reveal('.home-content h1', { origin: 'left', reset: true });
    sr.reveal('.home-content h3, .home-content p, .about-content', { origin: 'right', reset: true });
})});