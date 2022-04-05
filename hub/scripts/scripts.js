/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const localeMAP = {
    ae_ar: { country: 'ae', language: 'ar' },
    ae_en: { country: 'ae', language: 'en' },
    africa: { country: 'africa', language: 'en' },
    at: { country: 'at', language: 'de' },
    au: { country: 'au', language: 'en' },
    be_en: { country: 'be', language: 'en' },
    be_fr: { country: 'be', language: 'fr' },
    be_nl: { country: 'be', language: 'nl' },
    bg: { country: 'bg', language: 'bg' },
    br: { country: 'br', language: 'pt' },
    ca: { country: 'ca', language: 'en' },
    ca_fr: { country: 'ca', language: 'fr' },
    ch_de: { country: 'ch', language: 'de' },
    ch_fr: { country: 'ch', language: 'fr' },
    ch_it: { country: 'ch', language: 'it' },
    cis_en: { country: 'cis', language: 'en' },
    cis_ru: { country: 'cis', language: 'ru' },
    cl: { country: 'cl', language: 'es' },
    cn: { country: 'cn', language: 'zh' },
    cy_en: { country: 'cy', language: 'en' },
    cz: { country: 'cz', language: 'cs' },
    de: { country: 'de', language: 'de' },
    dk: { country: 'dk', language: 'da' },
    eeurope: { country: 'eeurope', language: 'en' },
    ee: { country: 'ee', language: 'et' },
    en: { country: 'us', language: 'en' },
    es: { country: 'es', language: 'es' },
    fi: { country: 'fi', language: 'fi' },
    fr: { country: 'fr', language: 'fr' },
    gr_en: { country: 'gr', language: 'en' },
    hk_en: { country: 'hk', language: 'en' },
    hk_zh: { country: 'hk', language: 'zh' },
    hu: { country: 'hu', language: 'hu' },
    ie: { country: 'ie', language: 'en' },
    il_en: { country: 'il', language: 'en' },
    il_he: { country: 'il', language: 'he' },
    in: { country: 'in', language: 'en' },
    it: { country: 'it', language: 'it' },
    jp: { country: 'jp', language: 'ja' },
    kr: { country: 'kr', language: 'ko' },
    la: { country: 'la', language: 'es' },
    lt: { country: 'lt', language: 'lt' },
    lu_de: { country: 'lu', language: 'de' },
    lu_en: { country: 'lu', language: 'en' },
    lu_fr: { country: 'lu', language: 'fr' },
    lv: { country: 'lv', language: 'lv' },
    mena_ar: { country: 'mena', language: 'ar' },
    mena_en: { country: 'mena', language: 'en' },
    mena_fr: { country: 'mena', language: 'fr' },
    mt: { country: 'mt', language: 'en' },
    mx: { country: 'mx', language: 'es' },
    nl: { country: 'nl', language: 'nl' },
    no: { country: 'no', language: 'nb' },
    nz: { country: 'nz', language: 'en' },
    pl: { country: 'pl', language: 'pl' },
    pt: { country: 'pt', language: 'pt' },
    ro: { country: 'ro', language: 'ro' },
    ru: { country: 'ru', language: 'ru' },
    sa_ar: { country: 'sa', language: 'ar' },
    sa_en: { country: 'sa', language: 'en' },
    se: { country: 'se', language: 'sv' },
    sea: { country: 'sea', language: 'en' },
    sg: { country: 'sg', language: 'en' },
    si: { country: 'si', language: 'sl' },
    sk: { country: 'sk', language: 'sk' },
    th_en: { country: 'th', language: 'en' },
    th_th: { country: 'th', language: 'th' },
    tr: { country: 'tr', language: 'tr' },
    tw: { country: 'tw', language: 'zh' },
    ua: { country: 'ua', language: 'uk' },
    uk: { country: 'uk', language: 'en' },
};

const blocks = {
    callout: {
        css: '/hub/blocks/callout/callout.css',
    },
    promotion: {
        js: '/hub/blocks/promotion/promotion.js',
    },
};

function debug(msg) {
    if (new URLSearchParams(window.location.search).has('debug')) {
        console.log(msg);
    }
}

function getEnvironment() {
    let environment = (new URLSearchParams(window.location.search).get('hlx-env'))
        || window.sessionStorage.getItem('hlx-env');
    if (!environment) {
        environment = 'prod';
    }

    return environment;
}

function isNonEmptyString(str) {
    return typeof str === 'string' && !!str.length;
}

function loadCSS(config = {}) {
    if (!config.path || document.querySelector(`head > link[href='${config.path}']`)) {
        return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = config.path;
    document.head.append(link);
}

function loadJS(config = {}) {
    if (!config.path || document.querySelector(`head > script[src='${config.path}']`)) {
        return;
    }

    const script = document.createElement('script');
    script.src = config.path;
    script.type = config.type || 'text/javascript';
    if (config.id) {
        script.id = config.id;
    }
    document.head.append(script);
}

function addFavIcon() {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = '/hub/icons/adobe.svg';
    const existingLink = document.querySelector('head link[rel="icon"]');
    if (existingLink) {
        existingLink.parentElement.replaceChild(link, existingLink);
    } else {
        document.head.appendChild(link);
    }
}

function loadFonts() {
    loadCSS({
        path: '/hub/styles/lazy-styles.css',
    });
}

async function loadBlock(block, callback) {
    if (!block.getAttribute('data-block-loaded')) {
        const name = block.getAttribute('data-block-name');
        if (!name) {
            return;
        }
        const config = blocks[name];
        if (!config) {
            return;
        }

        try {
            if (config.css) {
                loadCSS({
                    path: config.css,
                });
            }

            if (config.js) {
                const mod = await import(config.js);
                if (!mod.default) {
                    return;
                }

                await mod.default(block, name, document, callback);
            }
        } catch (e) {
            debug(`failed to load block ${name}`, config);
        }
    }
}

function loadBlocks() {
    document.querySelectorAll('main > div > .block')
        .forEach(async (block) => loadBlock(block));
}

async function postLCP() {
    await loadBlocks();
    loadFonts();
    addFavIcon();
}

function setLCPTrigger() {
    postLCP();
}

function handlePageDetails() {
    const paths = window.location.pathname.replace('/bench', '').replace('/_draft', '')
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

    window.fedPub = {
        language: localeDetails.language,
        country: localeDetails.country,
        locale,
    };
      
    const cloudValueMetadata = document.head.querySelector('meta[name="cloud"]');

    // Assumption, if there's a cloud attribute
    // the URL is different and we don't need to shift the array
    // Example 1: /sign/hub/how-to/best-way-to-invoice-customers.html (should have the 'cloud' metadata)
    // Example 2: /it/documentcloud/sign/hub/document-types/invoice-vs-receipt.html (extract cloud from URL)
    window.fedPub.cloud = cloudValueMetadata ? cloudValueMetadata.getAttribute('content') : pageDetails.shift();

    const category = pageDetails[pageDetails.length - 1];
    if (isNonEmptyString(category)) {
        window.fedPub.category = category;
    }
  
    /** Set details */
    document.querySelector('html').setAttribute('lang', window.fedPub.language);
}

function loadIMS() {
    function getClientId() {
        let id = 'fedpub';
        if (window.location.host.indexOf('adobe.com') !== -1) {
            switch (window.fedPub.cloud) {
            case 'creativecloud':
                id = 'adobedotcom-cc';
                break;
            case 'documentcloud':
                id = 'DocumentCloud1';
                break;
            default:
                break;
            }
        }

        return id;
    }

    window.adobeid = {
        client_id: getClientId(),
        scope: 'AdobeID,openid,gnav',
        locale: `${window.fedPub.language}_${window.fedPub.country.toUpperCase()}`,
        environment: (getEnvironment() !== 'prod' ? 'stg1' : 'prod'),
    };

    loadJS({
        path: 'https://auth.services.adobe.com/imslib/imslib.min.js',
    });
}

function loadLaunch() {

    const params = new URLSearchParams(window.location.search);
    const skipLaunch = params.has('skipLaunch');
    const environment = getEnvironment();
    const isDev = environment !== 'prod';
    const env = isDev ? `${environment}.` : '';
    // const useAlloy = params.get('alloy') === 'on';
    const useAlloy = true;

    // alloy optimized implementation
    if (useAlloy) {

        const languageLocale = window.fedPub && (
            (
                window.fedPub.language
                ? window.fedPub.language
                : 'en'
            ) + (
                window.fedPub.country
                ? '-' + window.fedPub.country.toUpperCase()
                : '-US'
            )
        );
        // optimized datastream
        const edgeConfigId = (
            isDev
            ? '46815e4c-db87-4b73-907e-ee6e7db1c9e7:dev'
            : '46815e4c-db87-4b73-907e-ee6e7db1c9e7'
        );
        // optimized launch property
        const launchUrl = (
            isDev
            ? 'https://assets.adobedtm.com/d4d114c60e50/cf25c910a920/launch-9e8f94c77339.min.js'
            : 'https://assets.adobedtm.com/d4d114c60e50/cf25c910a920/launch-1bba233684fa-development.js'
        );
        const bootstrapScript = (isDev ? 'main.stage.alloy.js' : 'main.alloy.min.js');

        window.alloy_all = {
            xdm: {
                _adobe_corpnew: {
                    digitalData: {
                        page: {
                            pageInfo: {
                                language: languageLocale,
                                legacyMarketSegment: 'COM',
                            },
                        },
                    },
                },
            },
        };
        window.alloy_deferred = {
            xdm: {
                _adobe_corpnew: {
                    digitalData: {
                    },
                },
            },
            promises: [],
        };
        window.marketingtech = {
            adobe: {
                target: false,
                audienceManager: true,
                alloy: {
                    edgeConfigId: edgeConfigId,
                },
                launch: {
                    url: launchUrl,
                    load: (l) => {
                        const delay = () => (
                            setTimeout(l, 3500)
                        );
                        if (document.readyState === 'complete') {
                            delay();
                        } else {
                            window.addEventListener('load', delay);
                        }
                    },
                },
            },
        };

        if (!skipLaunch) {
            loadJS({
                path: `https://www.${env}adobe.com/marketingtech/${bootstrapScript}`,
                id: 'AdobeLaunch',
            });
        }

    // legacy martech implementation 
    } else {

        window.marketingtech = {
            adobe: {
                launch: {
                    property: 'global',
                    environment: 'production',
                },
                target: false,
                audienceManager: true,
            },
        };

        if (!skipLaunch) {
            loadJS({
                path: `https://www.${env}adobe.com/marketingtech/main.no-promise.min.js`,
                id: 'AdobeLaunch',
            });
        }

    }
    
}

function loadFEDS() {
    function getOtDomainId() {
        const domains = {
            'adobe.com': '7a5eb705-95ed-4cc4-a11d-0cc5760e93db',
            'hlx.page': '3a6a37fe-9e07-4aa9-8640-8f358a623271',
        };

        const currentDomain = Object.keys(domains)
            .find((domain) => window.location.host.indexOf(domain) > -1);

        return `${domains[currentDomain] || domains[Object.keys(domains)[0]]}`;
    }

    function getExperience() {
        let experience = 'fedpub';
        if (isNonEmptyString(window.fedPub.cloud) && isNonEmptyString(window.fedPub.category)) {
            experience += `/${window.fedPub.cloud}/${window.fedPub.category}`;
        }

        return experience;
    }

    window.fedsConfig = {
        locale: window.fedPub.locale,
        content: {
            experience: getExperience(),
        },
        privacy: {
            otDomainId: getOtDomainId(),
            footerLinkSelector: '[data-feds-action="open-adchoices-modal"]',
        },
    };
    document.querySelector('body > header').innerHTML = '<div><div id="feds-header"></div></div>';
    document.querySelector('body > footer').innerHTML = '<div id="feds-footer"></div>';

    window.addEventListener('feds.events.experience.loaded', () => {
        // Part of FEDS
        document.querySelector('body').classList.add('feds--loaded');
    });

    const env = (getEnvironment() !== 'prod') ? `${getEnvironment()}.` : '';

    loadJS({
        path: `https://www.${env}adobe.com/etc.clientlibs/globalnav/clientlibs/base/feds.js`,
        id: 'feds-script',
    });
}

function decorateBlock(block) {
    const name = block.classList[0];
    if (!name) {
        return;
    }

    block.classList.add('block');
    block.setAttribute('data-block-name', name);
}

function decorateBlocks() {
    document.querySelectorAll('main > div > div').forEach(decorateBlock);
}

function decoratePromotion() {
    if (document.querySelector('main .promotion') instanceof HTMLElement) {
        // A promotion has already been defined on the page.
        // Do not inject another one.
        delete blocks.promotion.js;
        return;
    }

    const promotionElement = document.querySelector('head meta[name="promotion"]');
    if (!promotionElement) {
        return;
    }

    const promo = document.createElement('div');
    promo.classList.add('promotion');
    promo.setAttribute('data-promotion', promotionElement.getAttribute('content').toLowerCase());
    document.querySelector('main > div').appendChild(promo);
}

function decoratePage() {
    decoratePromotion();
    decorateBlocks();
    handlePageDetails();
    setLCPTrigger();
    loadIMS();
    loadFEDS();
    loadLaunch();
}

decoratePage();
