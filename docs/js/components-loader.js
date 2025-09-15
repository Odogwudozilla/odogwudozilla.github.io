/**
 * Component Loader - Dynamically loads HTML partials
 * This script loads modular HTML components into their respective containers
 */
document.addEventListener('DOMContentLoaded', function() {

    // Define components to load
    const components = [
        {
            container: '#navigation-container',
            partial: 'partials/navigation.html'
        },
        {
            container: '#hero-container',
            partial: 'partials/hero-section.html'
        },
        {
            container: '#experience-container',
            partial: 'partials/experience-section.html'
        },
        {
            container: '#skills-container',
            partial: 'partials/skills-section.html'
        },
        {
            container: '#portfolio-container',
            partial: 'partials/portfolio-section.html'
        },
        {
            container: '#education-container',
            partial: 'partials/education-section.html'
        },
        {
            container: '#contact-container',
            partial: 'partials/contact-section.html'
        }
    ];

    // Load each component
    components.forEach(component => {
        loadComponent(component.container, component.partial);
    });

    // Function to load HTML partial into container
    function loadComponent(containerSelector, partialPath) {
        const container = document.querySelector(containerSelector);

        if (!container) {
            console.warn(`Container ${containerSelector} not found`);
            return;
        }

        fetch(partialPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${partialPath}: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                container.innerHTML = html;

                // Trigger custom event when component is loaded
                const event = new CustomEvent('componentLoaded', {
                    detail: { container: containerSelector, partial: partialPath }
                });
                document.dispatchEvent(event);
            })
            .catch(error => {
                console.error(`Error loading component ${partialPath}:`, error);
                container.innerHTML = `<div class="error">Failed to load ${partialPath}</div>`;
            });
    }

    // Listen for all components loaded
    let loadedComponents = 0;
    document.addEventListener('componentLoaded', function() {
        loadedComponents++;

        // When all components are loaded, initialize navigation functionality
        if (loadedComponents === components.length) {
            setTimeout(() => {
                initializeNavigation();
            }, 100); // Small delay to ensure DOM is ready
        }
    });

    // Initialize navigation functionality after components are loaded
    function initializeNavigation() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('#navbarResponsive');
        const backdrop = document.querySelector('#navbarBackdrop');
        const sideNav = document.querySelector('#sideNav');

        if (!navbarToggler || !navbarCollapse || !sideNav) {
            console.warn('Navigation elements not found');
            return;
        }

        // Toggle mobile menu functionality
        navbarToggler.addEventListener('click', function(e) {
            e.preventDefault();

            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            if (isExpanded) {
                // Close menu
                navbarCollapse.classList.remove('show');
                sideNav.classList.remove('show');
                if (backdrop) backdrop.classList.remove('show');
                this.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            } else {
                // Open menu
                navbarCollapse.classList.add('show');
                sideNav.classList.add('show');
                if (backdrop) backdrop.classList.add('show');
                this.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            }
        });

        // Close menu when clicking backdrop
        if (backdrop) {
            backdrop.addEventListener('click', function() {
                navbarCollapse.classList.remove('show');
                sideNav.classList.remove('show');
                backdrop.classList.remove('show');
                navbarToggler.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        }

        // Close menu on window resize if screen becomes large
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 992) {
                navbarCollapse.classList.remove('show');
                sideNav.classList.remove('show');
                if (backdrop) backdrop.classList.remove('show');
                navbarToggler.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('#sideNav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992) {
                    navbarCollapse.classList.remove('show');
                    sideNav.classList.remove('show');
                    if (backdrop) backdrop.classList.remove('show');
                    navbarToggler.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });

        console.log('Navigation initialized successfully');
    }
});
