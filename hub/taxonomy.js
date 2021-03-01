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

const INTERNALS = 'Internals';
const TOPICS = 'Topics';
const HEADERS = {
  level1: 'Tags level 1',
  level2: 'Tags level 2',
  filter: 'Hub filters',
  category: 'Word doc label',
  excludeFromMetadata: 'ExcludeFromMetadata',
};

let taxonomy;
const currentData = {
  filters: {},
  categories: {},
  tags: {},
};

function escapeValue(str) {
  let escaped = null;
  if (typeof str === 'string' && !!str.length) {
    escaped = str.replace(/\n/gm, ' ').trim();
  }

  return escaped;
}

function addToTags(item) {
  if (!Object.prototype.hasOwnProperty.call(currentData.tags, item.name) && item.name !== null) {
    currentData.tags[item.name] = item;
  }
}

function addToCategories(item) {
  // Category does not exist, need to create it
  if (!Object.prototype.hasOwnProperty.call(currentData.categories, item.category)
    && item.category !== null) {
    currentData.categories[item.category] = [];
  }

  // Item is not in the corresponding category yet, need to add it
  if (currentData.categories[item.category].indexOf(item.name) === -1 && item.name !== null) {
    currentData.categories[item.category].push(item.name);
  }
}

function addToFilters(item) {
  // Type does not exist, need to create it
  if (!Object.prototype.hasOwnProperty.call(currentData.filters, item.filter)
    && item.filter !== null) {
    currentData.filters[item.filter] = [];
  }

  // Item is not in the corresponding filter yet, need to add it
  if (currentData.filters[item.filter].indexOf(item.name) === -1 && item.name !== null) {
    currentData.filters[item.filter].push(item.name);
  }
}

export default async function getTaxonomy() {
  if (taxonomy) {
    return taxonomy;
  }

  taxonomy = window.fetch('/_taxonomy.json')
    .then((response) => response.json())
    .then((json) => {
      if (json && json.data && !!json.data.length) {
        let topLevel;
        json.data.forEach((row) => {
          let level1 = escapeValue(row[HEADERS.level1]);
          const level2 = escapeValue(row[HEADERS.level2]);
          const isEmptyRow = !(level2 || level1);
          if (isEmptyRow) {
            return;
          }

          if (level1 !== null) {
            // Set new toplevel
            topLevel = level1;
          } else {
            // Set last available level 1
            level1 = topLevel;
          }

          const name = level2 || level1;
          const filter = escapeValue(row[HEADERS.filter]) || INTERNALS;
          const category = escapeValue(row[HEADERS.category]) || TOPICS;
          const exclude = !!escapeValue(row[HEADERS.excludeFromMetadata]);
          const item = {
            name,
            filter,
            category,
            // children: [],
            level1,
            level2,
            exclude,
          };

          addToTags(item);
          addToCategories(item);
          addToFilters(item);
        });

        return {
          CONSTANTS: {},
          getCategories: function getCategories() {
            return currentData.categories;
          },
          getFilters: function getFilters() {
            return currentData.filters;
          },
          getTag: function getTag(name) {
            return currentData.tags[name];
          },
        };
      } else {
        return {};
      }
    });

  return taxonomy;
}
