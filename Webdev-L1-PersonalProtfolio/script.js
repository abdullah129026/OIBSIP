document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('navbar');
    const footer = document.getElementById('footer');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuTrigger = document.querySelector('.mobile-menu-trigger');
    const navLinksContainer = document.querySelector('.nav-links');

    // Toggle Mobile Menu
    mobileMenuTrigger.addEventListener('click', () => {
        navLinksContainer.classList.toggle('show');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksContainer.classList.contains('show')) {
                navLinksContainer.classList.remove('show');
            }
        });
    });

    // Header scroll effects and active link highlighting
    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Header glassmorphism
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Dark glass header when over footer
        if (footer) {
            const footerTop = footer.getBoundingClientRect().top;
            if (footerTop < 100) {
                header.classList.add('dark-glass');
            } else {
                header.classList.remove('dark-glass');
            }
        }

        // Active link highlighting
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on load

    // Contact Form handling
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload
            
            // In a real app, you would send data to a backend here.
            // For now, just show the success message.
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
        });
    }
});
