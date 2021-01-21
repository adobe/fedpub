import isNonEmptyString from '../lang/isNonEmptyString.js';

/**
 * Creates and returns an element based on a provided tag name and attributes
 * @param {String} tagName The tag name of the desired element
 * @param {Object} attributes Object containing key/value pairs
 * for the attributes to be attached to the created element
 * @return {Element} The resulting HTML element
 */
export default function createCustomElement(tagName, attributes) {
    // If no tag name is provided, no element is created
    if (!isNonEmptyString(tagName)) {
        return undefined;
    }

    const element = document.createElement(tagName);

    if (typeof attributes === 'object') {
        for (const [key, value] of Object.entries(attributes)) {
            if (isNonEmptyString(key)) {
                // The value needs to be a string. If another type
                // is used, it will be transformed into an empty string
                const parsedValue = !isNonEmptyString(value) ? '' : value;

                element.setAttribute(key, parsedValue);
            }
        }
    }

    return element;
}
