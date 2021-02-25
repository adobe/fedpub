import isStageEnvironment from './isStageEnvironment.js';
import loadResource from './dom/loadResource.js';

/**
 * Defines the IMS initialization configuration
 * and exposes it to the global namespace
 */
export default function initializeIMS() {
    // Define the IMS configuration object
    window.adobeid = {
        client_id: 'fedpub',
        scope: 'AdobeID,openid,gnav',
        locale: window.fedPub.locale,
    };

    // Define the IMS script path based on the current environment
    const imsPath = `https://static.adobelogin.com/imslib/${!isStageEnvironment ? '' : 'stg1/'}imslib.min.js`;

    // Load the IMS library
    loadResource({
        path: imsPath,
        type: 'script',
        id: 'ims-script',
    });
}
