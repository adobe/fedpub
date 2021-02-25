import isNonEmptyString from '../lang/isNonEmptyString.js';

/**
 * Generates a `script` or `style` element, based on a configuration object
 * @param {Object} config Configuration object containing information around
 * what resource needs to be created, along with its properties
 * @private
 * @return {Element} The generated resource element
 */
const generateResource = (config) => {
    let resourceElement;

    if (config.type === 'script') {
        resourceElement = document.createElement('script');
        resourceElement.src = config.path;
        // Dynamically inserted scripts load asynchronously by default,
        // so to turn on synchronous loading 'async' should be set to 'false'
        if (typeof config.async === 'boolean') {
            resourceElement.async = config.async;
        }
    } else if (config.type === 'style') {
        resourceElement = document.createElement('link');
        resourceElement.type = 'text/css';
        resourceElement.rel = 'stylesheet';
        resourceElement.href = config.path;
    }

    if (isNonEmptyString(config.id)) {
        // Ensure that the ID about to be added is unique
        if (document.querySelector(`#${config.id}`) === null) {
            resourceElement.id = config.id;
        }
    }

    return resourceElement;
};

/**
 * Based on a specified configuration object, it loads a script or style resource
 * in the `head` section of the document
 * @param {Object} config The resource configuration object
 * @param {String} config.path The path from where the resource will be loaded from
 * @param {'script' | 'style'} config.type The type of resource to be created
 * @param {Boolean} [config.async] Specifies whether the resource should be loaded in
 * an asynchronous (`true`) or synchronous (`false`) manner. This is only applied if
 * the `config.type` value is `script`. It should be noted that dynamically inserted
 * scripts load asynchronously by default, meaning that this option should be used only
 * in special cases, where resources should be loaded synchronously
 * @param {String} [config.id] The ID attribute value of the resource. Please note
 * that this should be a unique identifier. Otherwise, this property will be ignored
 * @return {Promise} This is so that multiple resources can be loaded together,
 * using the `Promise.all` method
 */
const loadResource = (config) => {
    if (typeof config !== 'object'
        || !isNonEmptyString(config.path)
        || ['script', 'style'].indexOf(config.type) === -1) {
        return undefined;
    }

    return new Promise((resolve, reject) => {
        const resourceElement = generateResource(config);

        resourceElement.addEventListener('load', () => {
            resolve(resourceElement);
        });

        resourceElement.addEventListener('error', (error) => {
            reject(error);
        });

        document.head.appendChild(resourceElement);
    });
};

export default loadResource;
