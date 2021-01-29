import CONFIG from './modules/CONFIG.js';
import convertTables from './modules/dom/convertTables.js';

// Attach basic classes to the default content
function decoratePage() {
    const mainElement = document.querySelector(`${CONFIG.SELECTORS.MAIN}`);

    if (mainElement instanceof HTMLElement) {
        // Attach a class to the main 'div' in the 'main' section
        const mainDiv = mainElement.children[0];

        if (mainDiv instanceof HTMLElement
            && mainDiv.matches('div')) {
            mainDiv.classList.add(CONFIG.SELECTORS.WRAPPER);
        }

        // Mark the content as 'ready'
        mainElement.classList.add(CONFIG.SELECTORS.READY);
    }
}

// Transform default markup to a richer structure
function initTransformations() {
    decoratePage();
    convertTables();
}

// Decide when the start the markup transformation process
if (document.readyState === 'interactive'
    || document.readyState === 'complete') {
    // If the HTMl has already been loaded,
    // start the transformation process
    initTransformations();
} else {
    // Otherwise, wait until the content is ready to be transformed
    window.addEventListener('DOMContentLoaded', () => {
        initTransformations();
    });
}
