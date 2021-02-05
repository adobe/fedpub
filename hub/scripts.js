/*
 * Copyright 2020 Adobe. All rights reserved.
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
      NAMESPACE: 'fedpub',
      WRAPPER: 'fedpub-wrapper',
      MAIN: 'main',
      READY: 'fedpub--ready',
      METADATA: 'fedpub--metadata',
    },
  };

  /**
   * Checks whether a given parameter is a non-empty string
   * @param {String} str The parameter requiring validation
   * @return {Boolean} Whether the provided parameter is a non-empty string
   */
  function isNonEmptyString(str) {
    return typeof str === 'string' && !!str.length;
  }

  /**
   * Transforms a given string to a safe class name to be used in HTML
   * @param {String} str The string to be transformed into a class name
   * @return {String} Safe class name to be used as part of HTML templates
   * @example
   * // returns 'quote-component'
   * toClassName('Quote component');
   * // returns 'quote-component'
   * toClassName('Quote #$% component');
   */
  function toClassName(str) {
    // Stop execution if a valid string is not provided
    if (!isNonEmptyString(str)) {
      return undefined;
    }

    // Make the string lower case;
    // then transform all the special characters to '-';
    // a longer sequence of special characters will be replaced by a single '-'
    return str.toLowerCase().replace(/[^0-9a-z]{1,}/gi, '-');
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
   * Reads key/value pairs from a block.
   * @param {HTMLElement} $block The block
   * @returns {Object} The configuration
   */
  function readBlockConfig($block) {
    const config = {};
    $block.querySelectorAll(':scope>div').forEach(($row) => {
      if ($row.children && $row.children[1]) {
        const name = toClassName($row.children[0].textContent);
        const $a = $row.children[1].querySelector('a');
        let value = '';
        if ($a) value = $a.href;
        else value = $row.children[1].textContent;
        config[name] = value;
      }
    });
    return config;
  }

  /**
   * Moves the metadata from the document into META tags.
   */
  function handleMetadata() {
    const $metaBlock = document.querySelector(`.${CONFIG.SELECTORS.METADATA}`);
    if (!$metaBlock) return;
    const md = [];
    const config = readBlockConfig($metaBlock);
    Object.entries(config).forEach(([key, value]) => {
      switch (key.toLowerCase()) {
        case 'tags':
          value
            .split(',') // split comma-separated tags
            .filter((tag) => tag !== '') // remove empty values
            .map((tag) => tag.trim()) // remove whitespace
            .forEach((content) => md.push({
              property: 'article:tag',
              content,
            }));
          break;
        case 'title':
          md.push({
            property: 'og:title',
            content: value,
          });
          break;
        case 'description':
          md.push({
            property: 'og:description',
            content: value,
          });
          // description to fall through to default
          // eslint-disable-next-line no-fallthrough
        default:
          md.push({
            name: key,
            content: value,
          });
      }
    });
    const $tags = Array.from(document.head.querySelectorAll('meta'));
    const $frag = document.createDocumentFragment();
    md.forEach((m) => {
      const $tag = $tags.find((t) => t.getAttribute('name') === m.name || t.getAttribute('property') === m.property);
      if ($tag) {
        // update existing meta tag
        $tag.setAttribute('content', m.content);
      } else {
        // add new meta tag
        $frag.appendChild(createTag('meta', m));
      }
    });
    if ($frag.childNodes.length) {
      document.head.appendChild($frag);
    }
    $metaBlock.remove();
  }

  /**
   * Converts tables that have a single `th` element with text content inside
   * to a namespaced `div` wrapper that acts like a pseudo-component
   */
  function decorateTables() {
    const tables = document.querySelectorAll(`${CONFIG.SELECTORS.MAIN} table`);

    tables.forEach((table) => {
      // Remove all empty `th` elements
      const emptyTableHeadings = table.querySelectorAll('thead th:empty');

      emptyTableHeadings.forEach((emptyTableHeading) => {
        emptyTableHeading.remove();
      });
      // Initialize table conversion only if there is just one authored `th` element
      const tableHeading = table.querySelector('thead th:only-child');

      if (tableHeading instanceof HTMLElement) {
        const sectionName = tableHeading.textContent;

        if (isNonEmptyString(sectionName)) {
          // Turn the `th` string into a valid HTML class name
          const sectionIdentifier = toClassName(sectionName);

          // Add a starting performance marker
          const startMarkerName = `start-tableConversion--${sectionIdentifier}`;
          window.performance.mark(startMarkerName);

          // Create a specific class name for the component
          const sectionClass = `${CONFIG.SELECTORS.NAMESPACE}--${sectionIdentifier}`;
          // Create a placeholder element
          // where all the transformed table markup will be added
          const sectionMarkup = createTag('div', {
            class: sectionClass,
          });

          // Identify all the rows of the table
          const tableRows = table.querySelectorAll('tbody tr');

          tableRows.forEach((tableRow) => {
            // For each row, create a `div` element
            const sectionRow = createTag('div', {
              class: `${sectionClass}-row`,
            });

            // Identify all the columns of the row
            const rowColumns = tableRow.querySelectorAll('td');

            rowColumns.forEach((rowColumn) => {
              // Get the column's content
              const sectionEntryContent = rowColumn.innerHTML;

              if (isNonEmptyString(sectionEntryContent)) {
                // For each column that has content, create a `div` element
                const sectionEntry = createTag('div', {
                  class: `${sectionClass}-entry`,
                });

                // Append the column content to the previously created `div` element
                sectionEntry.innerHTML = rowColumn.innerHTML;
                // Append the transformed column to its row
                sectionRow.appendChild(sectionEntry);
              }
            });

            // If the row has been populated with at least one element,
            // coming from inner-columns, append the transformed row to the section `div`
            if (sectionRow.hasChildNodes()) {
              sectionMarkup.appendChild(sectionRow);
            }
          });

          // If the section has been populated with at least one element,
          // replace the original table with the transformed markup
          if (sectionMarkup.hasChildNodes()) {
            // Replace the table with the transformed markup
            // (we can be sure the table's parent exists based on the initial selector)
            table.parentNode.replaceChild(sectionMarkup, table);
          }

          // Measure the time, in ms, required for the table transformation
          window.performance.measure(`tableConversionTime--${sectionIdentifier}`, startMarkerName);
        }
      }
    });
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
        $a.className = 'button secondary';
      }
      if ($up.childNodes.length === 1 && $up.tagName === 'STRONG'
        && $twoup.childNodes.length === 1 && $twoup.tagName === 'P') {
        $a.className = 'button primary';
      }
    });
  }

  function markReadyAfterDecorations() {
    const mainElement = document.querySelector(`${CONFIG.SELECTORS.MAIN}`);

    if (mainElement instanceof HTMLElement) {
      // Attach a class to the main 'div' in the 'main' section
      const mainDiv = mainElement.children[0];

      if (mainDiv instanceof HTMLElement
          && mainDiv.matches('div')) {
        mainDiv.classList.add(CONFIG.SELECTORS.WRAPPER);
      }

      // Mark the content as 'ready'
      mainElement.classList.add(CONFIG.SELECTORS.READY);
    }
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

    window.fedsConfig = {
      locale: 'en', // TODO: add locale based on URL
      content: {
        experience: 'acom', // TODO: use fedPub experience
      },
      privacy: {
        otDomainId: getOtDomainId(),
      },
    };
  }

  async function decoratePage() {
    decorateTables();
    handleMetadata();
    decorateEmbeds();
    decorateButtons();
    markReadyAfterDecorations();
  }

  initializeFEDS();
  decoratePage();
})();
