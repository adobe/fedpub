import CONFIG from './modules/CONFIG.js';
import handlePageDetails from './modules/handlePageDetails.js';
import initializeFEDS from './modules/initializeFEDS.js';
import initializeIMS from './modules/initializeIMS.js';
import initializeLaunch from './modules/initializeLaunch.js';
import convertTables from './modules/dom/convertTables.js';

// Attach a 'ready' class to the main `div` once transformations are complete
function markPageAsReady() {
    const mainElement = document.querySelector('main');

    if (mainElement instanceof HTMLElement) {
        const mainDiv = mainElement.children[0];

        if (mainDiv instanceof HTMLElement && mainDiv.matches('div')) {
            mainDiv.classList.add(CONFIG.SELECTORS.READY);
        }
    }
}

// Transform default markup to a richer structure
function initTransformations() {
    handlePageDetails();
    initializeFEDS();
    initializeIMS();
    initializeLaunch();
    convertTables();
    markPageAsReady();
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
