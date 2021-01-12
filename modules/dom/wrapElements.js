import {CONFIG} from '../CONFIG.js';
import {isNonEmptyString} from '../lang/isNonEmptyString.js';
import {createElement} from './createElement.js';

/**
 * Wraps all the elements identified by the selector
 * in a wrapper element with a specified class name
 * @param {String} selector Identifier for all the elements
 * that need to be wrapped
 * @param {String} className The class name for the wrapper element
 */
export function wrapElements(selector, className) {
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
            const wrapper = createElement('div', attributeObj);

            if (wrapper instanceof HTMLElement
                && element.parentNode instanceof HTMLElement) {
                element.parentNode.replaceChild(wrapper, element);
                wrapper.appendChild(element);
            }
        });
    }
}
