import isNonEmptyString from './lang/isNonEmptyString.js';
import localeMAP from './localeMAP.js';

/**
 * Parses the page URL and retrieves the locale, cloud and category.
 * Page details are updated based on these values.
 */
export default function handlePageDetails() {
    const paths = window.location.pathname.replace('/bench', '')
        .split('/').filter(isNonEmptyString);
    // Identify hub placement in order to split paths
    const hubPosition = paths.indexOf('hub');
    const pageDetails = paths.slice(0, hubPosition);

    let localeDetails = localeMAP[pageDetails[0]];
    let locale;

    if (typeof localeDetails === 'object') {
        // Locale is part of the URL
        locale = pageDetails.shift();
    } else {
        // Locale is not part of URL or unsupported
        locale = 'en';
        localeDetails = localeMAP[locale];
    }

    const cloud = pageDetails.shift();
    const category = pageDetails.shift();

    window.fedPub = {
        language: localeDetails.language,
        country: localeDetails.country,
        locale,
    };

    if (isNonEmptyString(cloud)) {
        window.fedPub.cloud = cloud;
    }

    if (isNonEmptyString(category)) {
        window.fedPub.category = category;
    }

    /** Set details */
    document.querySelector('html').setAttribute('lang', window.fedPub.language);
}
