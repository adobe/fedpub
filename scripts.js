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
/* global document */

/**
 * Creates a tag with the given name and attributes.
 * @param {string} name The tag name
 * @param {object} attrs An object containing the attributes
 * @returns The new tag
 */
function createTag(name, attrs) {
  const el = document.createElement(name);
  if (typeof attrs === 'object') {
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, value);
    }
  }
  return el;
}

function toClassName(name) {
  return (name.toLowerCase().replace(/[^0-9a-z]/gi, '-'));
}

/**
 * Loads a CSS file.
 * @param {string} href The path to the CSS file
 */
function loadCSS(href) {
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', href);
  document.head.appendChild(link);
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
  const $metaBlock = document.querySelector('main div.metadata');
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
 * Turn tables to DIV.
 * @param {object} $table Table element
 */
function tableToDivs($table) {
  const $rows = $table.querySelectorAll('tbody tr');
  const blockname = $table.querySelector('th').textContent;
  const $block = createTag('div', { class: `${toClassName(blockname)}` });
  $rows.forEach(($tr) => {
    const $row = createTag('div');
    $tr.querySelectorAll('td').forEach(($td) => {
      const $div = createTag('div');
      $div.innerHTML = $td.innerHTML;
      $row.append($div);
    });
    $block.append($row);
  });
  return ($block);
}

function decorateTables() {
  document.querySelectorAll('main div>table').forEach(($table) => {
    const $div = tableToDivs($table);
    $table.parentNode.replaceChild($div, $table);
  });
}

function decorateBlocks() {
  document.querySelectorAll('main>div.section-wrapper>div>div').forEach(($block) => {
    const classes = Array.from($block.classList.values());
    if (classes[0]) {
      loadCSS(`/styles/blocks/${classes[0]}.css`);
    }
  });
}

function decorateBackgroundImageBlocks() {
  document.querySelectorAll('main div.background-image').forEach(($bgImgDiv) => {
    const $images = $bgImgDiv.querySelectorAll('img');
    const $lastImage = $images[$images.length - 1];
    const $section = $bgImgDiv.closest('.section-wrapper');
    if ($section && $lastImage) {
      $section.style.backgroundImage = `url(${$lastImage.src})`;
      let $caption = $lastImage.nextElementSibling;
      if ($caption) {
        if ($caption.textContent === '') $caption = $caption.nextElementSibling;
        if ($caption) $caption.classList.add('background-image-caption');
      }
      $lastImage.remove();
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

function wrapSections(element) {
  document.querySelectorAll(element).forEach(($div) => {
    const $wrapper = createTag('div', { class: 'section-wrapper' });
    $div.parentNode.appendChild($wrapper);
    $wrapper.appendChild($div);
  });
}

async function decoratePage() {
  decorateTables();
  handleMetadata();
  wrapSections('main>div');
  decorateBlocks();
  wrapSections('header>div, footer>div');
  decorateEmbeds();
  decorateButtons();
  decorateBackgroundImageBlocks();
}

decoratePage();
