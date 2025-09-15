/*!
* Start Bootstrap - Resume v7.0.0 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/

window.addEventListener('DOMContentLoaded', () => {
    // Custom scroll spy implementation for sidebar navigation
    const navLinks = document.querySelectorAll('#sideNav .nav-link');
    const sections = document.querySelectorAll('.resume-section');

    // Function to update active nav link
    function updateActiveNavLink() {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            // Add some offset to account for the fixed sidebar
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        // Remove active class from all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current section's nav link
        if (current) {
            const activeLink = document.querySelector(`#sideNav .nav-link[href="#${current}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    // Add scroll event listener
    window.addEventListener('scroll', updateActiveNavLink);

    // Update on page load
    updateActiveNavLink();

    // Smooth scrolling for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 20; // Small offset for better positioning
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
});
