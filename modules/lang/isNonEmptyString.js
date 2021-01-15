/**
 * Checks whether a given parameter is a non-empty string
 * @param {String} str The parameter requiring validation
 * @return {Boolean} Whether the provided parameter is a non-empty string
 */
export default function isNonEmptyString(str) {
    return typeof str === 'string' && !!str.length;
}
