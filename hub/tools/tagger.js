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
import getTaxonomy from '../taxonomy.js';

let taxonomy;
const currentLocale = new URLSearchParams(window.location.search).get('locale') || 'en';
const selectedTags = [];
const colors = ['fc5c65', 'fd9644', 'fed330', '26de81', '2bcbba', '45aaf2'];
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

function generateLocaleSwitcher() {
  const localeSelector = document.getElementById('locale');
  Object.keys(localeMAP).forEach((locale) => {
    localeSelector.insertAdjacentHTML('beforeend',
      `<option value="${locale}" ${locale === currentLocale ? 'selected' : ''}>${locale}</option>`);
  });

  localeSelector.addEventListener('change', (event) => {
    const url = new URL(window.location.href);
    url.searchParams.set('locale', event.target.value);
    window.location.href = url.toString();
  });
}

function filterTags(searchTerm = '') {
  let html = '';

  Object.entries(taxonomy.getFilters()).forEach(([filterName, tags], index) => {
    html += '<div class="filter">';
    html += `<h2>${filterName}</h2>`;
    html += `<style>[data-filter="${filterName}"] .tag--name { background-color: #${colors[index]} }</style>`;
    tags.forEach((tagName) => {
      const tag = taxonomy.getTag(tagName);
      if (typeof tag === 'object') {
        const offset = tag.name.toLowerCase().indexOf(searchTerm.toLowerCase());
        let path = '';
        if (tag.level2 !== null) {
          // Sub-tag, need to show parent tag
          path = `${tag.level1}/`;
        }

        // Tag contains part of search term
        if (offset !== -1) {
          html += `<span class="tag" data-path="${path}"
                        data-filter="${tag.filter}"
                        data-category="${tag.category}"
                        data-name="${tag.name}">`;
          if (path.length) {
            html += `<span class="tag--path">${path}</span>`;
          }
          html += `<span class="tag--name">${tag.name}</span>`;
          html += '</span>';
        }
      }
    });
    html += '</div>';
  });

  document.getElementById('results').innerHTML = html;
}

function updateSelection() {
  const filters = Object.keys(taxonomy.getFilters());
  const categories = Object.keys(taxonomy.getCategories());
  const selection = document.getElementById('selection');
  const selectionValues = {};
  let html = '';

  selectedTags.sort((a, b) => {
    // Compare by category first
    const categoryPositionItemA = categories.indexOf(a.category);
    const categoryPositionItemB = categories.indexOf(b.category);
    if (categoryPositionItemA < categoryPositionItemB) {
      return -1;
    }
    if (categoryPositionItemA > categoryPositionItemB) {
      return 1;
    }

    // Compare by filter
    const filterPositionItemA = filters.indexOf(a.filter);
    const filterPositionItemB = filters.indexOf(b.filter);
    if (filterPositionItemA < filterPositionItemB) {
      return -1;
    }
    if (filterPositionItemA > filterPositionItemB) {
      return 1;
    }

    // Compare by path
    if (a.path < b.path) {
      return -1;
    }

    if (a.path > b.path) {
      return 1;
    }

    // Compare by name
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }

    return -1;
  });

  selectedTags.forEach((tag) => {
    html += `<span class="selectedTag" data-filter="${tag.filter}">`;
    if (tag.path.length) {
      html += `<span class="tag--path">${tag.path}</span>`;
    }
    html += `<span class="tag--name">${tag.name}</span>`;
    html += '</span>';

    // Add to selected category input
    if (!Object.prototype.hasOwnProperty.call(selectionValues, tag.category)) {
      selectionValues[tag.category] = [];
    }
    selectionValues[tag.category].push(tag.name);
  });

  // Build the text to be copied and button actions
  html += '<div class="copy-buttons">Copy tags for:';
  Object.entries(selectionValues).forEach(([key, value]) => {
    html += `<button data-target="selection-${key}" class="copy-button">${key}</button>`;
    html += `<input type="text" id="selection-${key}" value="${value.join(',')}" class="notInViewport" />`;
  });
  html += '<div>';

  document.addEventListener('click', (event) => {
    const element = event.target;
    if (element.closest('.copy-button')) {
      const target = document.getElementById(`${element.getAttribute('data-target')}`);
      if (target instanceof HTMLElement) {
        target.select();
        document.execCommand('copy');
        element.setAttribute('disabled', 'disabled');
      }
    }
  });

  selection.innerHTML = html;
  selection.classList.toggle('visible', !!selectedTags.length);
}

async function init() {
  generateLocaleSwitcher();
  taxonomy = await getTaxonomy(currentLocale);
  filterTags();

  const searchTerm = document.getElementById('search');
  searchTerm.addEventListener('input', (event) => {
    filterTags(event.target.value);
  });

  document.addEventListener('click', (event) => {
    const element = event.target.closest('.tag');
    if (element instanceof HTMLElement) {
      const selected = element.classList.contains('selected');
      const name = element.getAttribute('data-name');
      const category = element.getAttribute('data-category');
      const filter = element.getAttribute('data-filter');
      const path = element.getAttribute('data-path');
      if (!selected) {
        // Set selected class
        element.classList.add('selected');
        // Addd to selection
        selectedTags.push({
          name,
          category,
          filter,
          path,
        });
      } else {
        element.classList.remove('selected');
        selectedTags.splice(selectedTags
          .findIndex((el) => el.name === name
                        && el.category === category
                        && el.filter === filter
                        && el.path === path), 1);
      }
      updateSelection();
    }
  });
}

init();
