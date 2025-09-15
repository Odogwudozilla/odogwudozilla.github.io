/**
 * Component Loader - Dynamically loads HTML partials
 * This script loads modular HTML components into their respective containers
 */
document.addEventListener('DOMContentLoaded', function() {

    /**
     * Load HTML partial into a container
     * @param {string} partialPath - Path to the HTML partial file
     * @param {string} containerId - ID of the container element
     */
    async function loadComponent(partialPath, containerId) {
        try {
            const response = await fetch(partialPath);
            if (!response.ok) {
                throw new Error(`Failed to load ${partialPath}: ${response.status}`);
            }
            const html = await response.text();
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = html;
            } else {
                console.warn(`Container ${containerId} not found`);
            }
        } catch (error) {
            console.error(`Error loading component ${partialPath}:`, error);
            // Fallback: show error message or load from backup
        }
    }

    // Component loading configuration
    const components = [
        { partial: 'partials/navigation.html', container: 'navigation-container' },
        { partial: 'partials/hero-section.html', container: 'hero-container' },
        { partial: 'partials/experience-section.html', container: 'experience-container' },
        { partial: 'partials/skills-section.html', container: 'skills-container' },
        { partial: 'partials/portfolio-section.html', container: 'portfolio-container' },
        { partial: 'partials/education-section.html', container: 'education-container' },
        { partial: 'partials/contact-section.html', container: 'contact-container' }
    ];

    // Load all components
    Promise.all(
        components.map(({ partial, container }) =>
            loadComponent(partial, container)
        )
    ).then(() => {
        console.log('All components loaded successfully');

        // Re-initialize scripts that depend on the loaded content
        if (typeof window.updateActiveNavLink === 'function') {
            window.updateActiveNavLink();
        }

        // Trigger custom event for other scripts
        const event = new CustomEvent('componentsLoaded');
        document.dispatchEvent(event);
    }).catch(error => {
        console.error('Error loading components:', error);
    });
});
