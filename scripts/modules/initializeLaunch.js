import isStageEnvironment from './isStageEnvironment.js';
import loadResource from './dom/loadResource.js';

/**
 * Defines the Launch initialization configuration
 * and exposes it to the global namespace
 */
export default function initializeLaunch() {
    // Define the Launch configuration object
    window.marketingtech = {
        adobe: {
            launch: {
                property: 'global',
                environment: !isStageEnvironment ? 'production' : 'stage',
            },
            target: true,
            audienceManager: true,
        },
    };

    // Define the Launch script path based on the current environment
    const launchPath = `https://www.adobe.com/marketingtech/main.no-promise.${!isStageEnvironment ? '' : 'stage.'}min.js`;

    // Load the Launch library
    loadResource({
        path: launchPath,
        type: 'script',
        id: 'launch-script',
    });
}
