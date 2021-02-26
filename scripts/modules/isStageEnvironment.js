/**
* Determine whether the current environment is a staging one.
* This can occur either when previewing a page from the Git `stage` branch
* or when a Fedpub page is visited from Adobe's regular staging environment.
* The assets are loaded from the staging endpoints on localhost as well.
*/
export default function isStageEnvironment() {
    const { hostname } = window.location;

    return hostname.indexOf('stage--') > -1
        || hostname.indexOf('.stage.') > -1
        || hostname === 'localhost';
}
