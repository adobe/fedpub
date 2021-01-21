import CONFIG from '../CONFIG.js';
import isNonEmptyString from '../lang/isNonEmptyString.js';
import createCustomElement from './createCustomElement.js';

/* This module is no longer used,
 * since sections have been replaced by components.
 * We're keeping it for reference and will remove it
 * if it proves it's not needed anymore.
 */

/**
 * Wraps all the elements identified by the selector
 * in a wrapper element with a specified class name
 * @param {String} selector Identifier for all the elements
 * that need to be wrapped
 * @param {String} className The class name for the wrapper element
 */
export default function wrapElements(selector, className) {
    if (!isNonEmptyString(selector)) {
        return;
    }

    const mainElement = document.querySelector(`${CONFIG.SELECTORS.MAIN}`);

    if (mainElement instanceof HTMLElement) {
        const elements = mainElement.querySelectorAll(selector);
        const attributeObj = !isNonEmptyString(className) ? undefined : {
            class: className,
        };

        elements.forEach((element) => {
            const wrapper = createCustomElement('div', attributeObj);

            if (wrapper instanceof HTMLElement
                && element.parentNode instanceof HTMLElement) {
                element.parentNode.replaceChild(wrapper, element);
                wrapper.appendChild(element);
            }
        });
    }
}
