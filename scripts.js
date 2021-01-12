import {CONFIG} from './modules/CONFIG.js';
import {wrapElements} from './modules/dom/wrapElements.js';
import {convertTables} from './modules/dom/convertTables.js';

function decoratePage() {
    const mainElement = document.querySelector(`${CONFIG.SELECTORS.MAIN}`);

    if (mainElement instanceof HTMLElement) {
        // Wrap all `div` elements in a wrapper
        wrapElements(`${CONFIG.SELECTORS.MAIN} > div`, CONFIG.SELECTORS.SECTION);
        // Mark the content as 'ready'
        mainElement.classList.add(CONFIG.SELECTORS.READY);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    decoratePage();
    convertTables();
});
