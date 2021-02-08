import isNonEmptyString from './lang/isNonEmptyString.js';

const MAP = {
    ca: { country: 'CA', language: 'en' },
    ca_fr: { country: 'CA', language: 'fr' },
    en: { country: 'US', language: 'en' },
};

/**
 * Parses the page URL and retrieves the locale, cloud and category.
 * Page details are updated based on these values.
 */
export default function handlePageDetails() {
    const [locale, cloud, category] = window.location.pathname
        .split('/').filter(isNonEmptyString);
    let localeDetails = MAP[locale];
    let currentLocale = locale;

    if (typeof localeDetails !== 'object') {
        // Locale is undefined or unsupported, default to "en"
        currentLocale = 'en';
        localeDetails = MAP[currentLocale];
    }

    window.fedPub = {
        language: localeDetails.language,
        country: localeDetails.country,
        locale: currentLocale,
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
