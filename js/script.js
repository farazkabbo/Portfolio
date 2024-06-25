// typed text animation

const typed = new Typed('.multiple-text',{
    strings: ['Web Developer', 'Frontend Developer', 'Youtuber', 'Web Designer'],
    typeSpeed:120,
    backSpeed:120,
    backDelay:1300,
    loop:true
});


// sticky header 
window.onscroll = () => {
    let header = document.querySelector('.header');
    header.classList.toggle('sticky', window.scrollY > 100);


}



// show |  hide FAQs anser
const faqs = document.querySelectorAll('.faq');

faqs.forEach((data) => {
    data.addEventListener('click', () => {
        data.classList.toggle('open');

        // change icon
        const icon = data.querySelector('.faq_icon i');

        if(icon.className === 'bx bx-plus'){
            icon.className = 'bx bx-minus'
        }else {
            icon.className = 'bx bx-plus'
        }
    });
});



// Form Jquery Validation

jQuery("#frm").validate({
    rules: {
        fname: "required",
        lname: "required",
        number: "required",
        msg : {
            required : true,
            minlength: 50,
        },
        email : {
            required : true,
            email: true,
        }

    },
    messages : {
        fname : "Please Enter Your First Name",
        lname : "Please Enter Your Last Name",
        number : "Please Enter Your Contact Number",
        msg: {
            required:" Please Enter Your Message",
            minlength: "Message must be at least 50 character along",
        },
        email: {
            required:" Please Enter Your Email address",
            minlength: "Please Enter a Valid Email Address",
        }
    },

    submitHandler: function(form) {
        // Capture form data
        const fname = form.fname.value;
        const lname = form.lname.value;
        const email = form.email.value;
        const number = form.number.value;
        const msg = form.msg.value;

        // Create mailto link
        const emailTo = "recipient@example.com"; // Replace with your email address
        const emailCC = ""; // CC address if needed
        const emailSubject = encodeURIComponent("Contact Form Submission");
        const emailBody = encodeURIComponent(`First Name: ${fname}\nLast Name: ${lname}\nEmail: ${email}\nPhone Number: ${number}\nMessage: ${msg}`);

        // Open default email client with populated content
        window.location.href = `mailto:${emailTo}?cc=${emailCC}&subject=${emailSubject}&body=${emailBody}`;
    }
});




// dark light mode
let darkModeIcon = document.querySelector('#darkMode-icon');

darkModeIcon.onclick=() => {
    darkModeIcon.classList.toggle('bx-sun');
    document.body.classList.toggle('dark-mode');
}


// ScrollRevel
ScrollReveal({
    reset: true,
    distance: '70px',
    duration:1800,
    delay:150
});

ScrollReveal().reveal('.home-content, .heading', {origin: 'top'});
ScrollReveal().reveal('.home-img img, .about-content, .education-row, .skills-row, .portfolio-container, .container .contact form', {origin: 'bottom'});

ScrollReveal().reveal('.home-content h1', {origin: 'left'});
ScrollReveal().reveal('.home-content h3, .home-content p, .about-content', {origin: 'right'});
