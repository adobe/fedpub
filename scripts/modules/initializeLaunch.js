/**
 * Defines the Launch initialization configuration
 * and exposes it to the global namespace
 */
export default function initializeLaunch() {
    window.marketingtech = {
        adobe: {
            launch: {
                property: 'global',
                environment: 'production',
            },
            target: true,
            audienceManager: true,
        },
    };
}
