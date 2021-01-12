import {isNonEmptyString} from './isNonEmptyString.js';

/**
 * Transforms a given string to a safe class name to be used in HTML
 * @param {String} str The string to be transformed into a class name
 * @return {String} Safe class name to be used as part of HTML templates
 * @example
 * // returns 'quote-component'
 * stringToClassname('Quote component');
 * // returns 'quote-component'
 * stringToClassname('Quote #$% component');
 */
export function stringToClassname(str) {
    // Stop execution if a valid string is not provided
    if (!isNonEmptyString(str)) {
        return;
    }

    // Make the string lower case;
    // then transform all the special characters to '-';
    // a longer sequence of special characters will be replaced by a single '-'
    return str.toLowerCase().replace(/[^0-9a-z]{1,}/gi, '-');
}
