/*!
* Start Bootstrap - Resume v7.0.6 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/

// Scripts for smooth scrolling and navigation highlighting
(function() {
    'use strict';

    // Smooth scrolling for anchor links
    document.querySelectorAll('a.js-scroll-trigger[href*="#"]:not([href="#"])').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 74; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu after clicking a link
                const navbarCollapse = document.querySelector('#navbarResponsive');
                const navbarToggler = document.querySelector('.navbar-toggler');
                const backdrop = document.querySelector('#navbarBackdrop');

                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                    navbarToggler.setAttribute('aria-expanded', 'false');
                    backdrop.classList.remove('show');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    // Mobile navigation toggle functionality
    document.addEventListener('DOMContentLoaded', function() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('#navbarResponsive');
        const backdrop = document.querySelector('#navbarBackdrop');
        const sideNav = document.querySelector('#sideNav');

        if (navbarToggler && navbarCollapse && backdrop) {
            // Toggle mobile menu
            navbarToggler.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';

                if (isExpanded) {
                    // Close menu
                    navbarCollapse.classList.remove('show');
                    sideNav.classList.remove('show');
                    backdrop.classList.remove('show');
                    this.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                } else {
                    // Open menu
                    navbarCollapse.classList.add('show');
                    sideNav.classList.add('show');
                    backdrop.classList.add('show');
                    this.setAttribute('aria-expanded', 'true');
                    document.body.style.overflow = 'hidden';
                }
            });

            // Close menu when clicking backdrop
            backdrop.addEventListener('click', function() {
                navbarCollapse.classList.remove('show');
                sideNav.classList.remove('show');
                backdrop.classList.remove('show');
                navbarToggler.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });

            // Close menu on window resize if screen becomes large
            window.addEventListener('resize', function() {
                if (window.innerWidth >= 992) {
                    navbarCollapse.classList.remove('show');
                    sideNav.classList.remove('show');
                    backdrop.classList.remove('show');
                    navbarToggler.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        }
    });

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#sideNav');
    if (mainNav) {
        // Manual scrollspy implementation for better control
        const navLinks = document.querySelectorAll('#sideNav .nav-link');
        const sections = document.querySelectorAll('section[id]');

        function updateActiveNav() {
            let current = '';
            const scrollPosition = window.pageYOffset + 100; // Offset for better triggering

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            // Update active states
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        }

        // Update on scroll
        window.addEventListener('scroll', updateActiveNav);

        // Update on load
        window.addEventListener('load', updateActiveNav);

        // Update immediately
        updateActiveNav();
    }

    // Add smooth reveal animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all sections for animation
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

})();
