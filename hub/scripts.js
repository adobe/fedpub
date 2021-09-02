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
(() => {
  const CONFIG = {
    SELECTORS: {
      READY: 'fedpub--ready',
      HEADER_FEDS_LOADED: 'fedpub-header--fedsLoaded',
      CTA: 'fedpub-cta',
      PRIMARY_CTA: 'fedpub-cta--primary',
      SECONDARY_CTA: 'fedpub-cta--secondary',
    },
    EVENTS: {
      FEDS_EXPERIENCE_LOADED: 'feds.events.experience.loaded',
    },
  };

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

  /**
   * Determine whether the current environment is a staging one.
   * This can occur either when previewing a page from the Git `stage` branch
   * or when a Fedpub page is visited from Adobe's regular staging environment
   */
  const isStageEnvironment = window.location.hostname.indexOf('stage--') > -1
      || window.location.hostname.indexOf('.stage.') > -1
      || window.location.hostname === 'localhost';

  /**
   * Checks whether a given parameter is a non-empty string
   * @param {String} str The parameter requiring validation
   * @return {Boolean} Whether the provided parameter is a non-empty string
   */
  function isNonEmptyString(str) {
    return typeof str === 'string' && !!str.length;
  }

  /**
   * Creates and returns an element based on a provided tag name and attributes
   * @param {String} tagName The tag name of the desired element
   * @param {Object} attributes Object containing key/value pairs
   * for the attributes to be attached to the created element
   * @return {Element} The resulting HTML element
   */
  function createTag(tagName, attributes) {
    // If no tag name is provided, no element is created
    if (!isNonEmptyString(tagName)) {
      return undefined;
    }

    const element = document.createElement(tagName);

    if (typeof attributes === 'object') {
      for (const [key, value] of Object.entries(attributes)) {
        if (isNonEmptyString(key)) {
          // The value needs to be a string. If another type
          // is used, it will be transformed into an empty string
          element.setAttribute(key, !isNonEmptyString(value) ? '' : value);
        }
      }
    }

    return element;
  }

  /**
   * Loads a JS file on the page
   * @param {String} src The path to the JS file
   * @param {Object} params The parameters used to load the file
   */
  function loadJS(src, params) {
    if (isNonEmptyString(src)) {
      const script = document.createElement('script');
      script.setAttribute('src', src);
      script.setAttribute('type', 'text/javascript');
      if (typeof params === 'object' && isNonEmptyString(params.id)) {
        script.setAttribute('id', params.id);
      }

      document.head.appendChild(script);
    }
  }

  function decorateEmbeds() {
    document.querySelectorAll('a[href]').forEach(($a) => {
      const url = new URL($a.href);
      const usp = new URLSearchParams(url.search);
      let embedHTML = '';
      let type = '';

      if ($a.href.startsWith('https://www.youtube.com/watch')) {
        const vid = usp.get('v');

        type = 'youtube';
        embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
          <iframe src="https://www.youtube.com/embed/${vid}?rel=0&amp;v=${vid}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen="" scrolling="no" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture" title="content from youtube" loading="lazy"></iframe>
          </div>
        `;
      }

      if (type) {
        const $embed = createTag('div', { class: `embed embed-oembed embed-${type}` });
        const $div = $a.closest('div');
        $embed.innerHTML = embedHTML;
        $div.parentElement.replaceChild($embed, $div);
      }
    });
  }

  function decorateButtons() {
    document.querySelectorAll('main a').forEach(($a) => {
      const $up = $a.parentElement;
      const $twoup = $a.parentElement.parentElement;
      if ($up.childNodes.length === 1 && $up.tagName === 'P') {
        // Setting CTA parent element to `flex` in order to be able
        // to apply all the suggested Spectrum styling.
        // CTA buttons should not normally occur in the normal text,
        // they should be present in the card component, so this
        // is just a temporary solution for demo purposes
        $up.style.display = 'flex';
        $a.className = `${CONFIG.SELECTORS.CTA} ${CONFIG.SELECTORS.SECONDARY_CTA}`;
      }
      if ($up.childNodes.length === 1 && $up.tagName === 'STRONG'
        && $twoup.childNodes.length === 1 && $twoup.tagName === 'P') {
        $twoup.style.display = 'flex';
        $a.className = `${CONFIG.SELECTORS.CTA} ${CONFIG.SELECTORS.PRIMARY_CTA}`;
      }
    });
  }

  // Attach a 'ready' class to the main `div` once transformations are complete
  function markPageAsReady() {
    const mainElement = document.querySelector('main');

    if (mainElement instanceof HTMLElement) {
      const mainDiv = mainElement.children[0];

      if (mainDiv instanceof HTMLElement && mainDiv.matches('div')) {
        mainDiv.classList.add(CONFIG.SELECTORS.READY);
      }
    }
  }

  /**
   * Parses the page URL and retrieves the locale, cloud and category.
   * Page details are updated based on these values.
   */
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

  /**
   * Initializes IMS library
   */
  function initializeIMS() {
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
    };

    loadJS(`https://static.adobelogin.com/imslib/${!isStageEnvironment ? '' : 'stg1/'}imslib.min.js`);
  }

  /**
   * Initialize FEDS library
   */
  function initializeFEDS() {
    function getOtDomainId() {
      const domains = {
        'adobe.com': '7a5eb705-95ed-4cc4-a11d-0cc5760e93db',
        'hlx.page': '3a6a37fe-9e07-4aa9-8640-8f358a623271',
        'project-helix.page': '45a95a10-dff7-4048-a2f3-a235b5ec0492',
        'helix-demo.xyz': 'ff276bfd-1218-4a19-88d4-392a537b6ce3',
        'adobeaemcloud.com': '70cd62b6-0fe3-4e20-8788-ef0435b8cdb1',
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
      },
    };

    window.addEventListener(CONFIG.EVENTS.FEDS_EXPERIENCE_LOADED, () => {
      const header = document.querySelector('body > header');

      if (header instanceof HTMLElement) {
        header.classList.add(CONFIG.SELECTORS.HEADER_FEDS_LOADED);
      }
    });

    document.querySelector('body > header').innerHTML = '<div><div id="feds-header"></div></div>';
    document.querySelector('body > footer').innerHTML = '<div id="feds-footer"></div>';

    loadJS(`https://www.${!isStageEnvironment ? '' : 'stage.'}adobe.com/etc.clientlibs/globalnav/clientlibs/base/feds.js`, {
      id: 'feds-script',
    });
  }

  /**
   * Initialize Launch
   */
  function initializeLaunch() {
    window.marketingtech = {
      adobe: {
        launch: {
          property: 'global',
          environment: !isStageEnvironment ? 'production' : 'stage',
        },
        target: false,
        audienceManager: true,
      },
    };

    loadJS(`https://www.adobe.com/marketingtech/main.no-promise.${!isStageEnvironment ? '' : 'stage.'}min.js`, {
      id: 'AdobeLaunch',
    });
  }

  async function decoratePage() {
    decorateEmbeds();
    decorateButtons();
    markPageAsReady();
  }

  handlePageDetails();
  initializeFEDS();
  initializeIMS();
  initializeLaunch();
  decoratePage();
})();
