/**
 * Defines the IMS initialization configuration
 * and exposes it to the global namespace
 */
export default function initializeIMS() {
    window.adobeid = {
        client_id: 'fedpub',
        scope: 'AdobeID,openid,gnav',
        locale: window.fedPub.locale,
    };
}
