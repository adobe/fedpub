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
/* eslint-disable no-underscore-dangle */
/* global window, document, fetch, btoa */
import { locales, getPathForLocale } from './config.js';

let trackerURL;

async function getTrackerURL() {
  if (trackerURL) return trackerURL;

  const location = new URL(document.location.href);
  trackerURL = location.searchParams.get('tracker');
  if (!trackerURL) {
    const sp = location.searchParams.get('sp');
    if (sp) {
      const lnk = `${location.origin}/hlx_${btoa(sp).replace(/\+/, '-').replace(/\//, '_')}.lnk`;
      const resp = await fetch(`${lnk}?hlx_report=true`);
      if (resp.ok) {
        const { webUrl } = await resp.json();
        if (webUrl) {
          const u = new URL(webUrl);
          trackerURL = `${location.origin}${u.pathname === '/index' ? '/' : u.pathname}`;
        }
      }
    }
  }

  if (!trackerURL) {
    throw new Error('Cannot find a valid tracker URL');
  }

  return trackerURL;
}

async function fetchTracker(url) {
  const tracker = {
    locales: [],
    urls: [],
    url,
    docs: {},
  };

  const resp = await fetch(url, { cache: 'no-store' });
  const json = await resp.json();
  if (json && json.data) {
    json.data.forEach((t) => {
      if (t.URL) {
        // const locales = [];
        locales.forEach((lObj) => {
          const l = lObj.name;
          if (t[l]) {
            const u = t.URL;
            let path = new URL(u).pathname;
            if (path.slice(-5) === '.html') {
              path = path.slice(0, -5);
            }
            const task = {
              URL: u,
              locale: l,
              path,
              filePath: `${path}.docx`,
              localePath: `/${getPathForLocale(l)}${path}`,
              localeFilePath: `/${getPathForLocale(l)}${path}.docx`,
            };

            tracker[u] = tracker[u] || [];
            tracker[u].push(task);
            tracker[l] = tracker[l] || [];
            tracker[l].push(task);

            if (tracker.locales.indexOf(l) === -1) {
              tracker.locales.push(l);
            }

            if (tracker.urls.indexOf(u) === -1) {
              tracker.urls.push(u);
            }

            if (!tracker.docs[u]) {
              tracker.docs[u] = {
                filePath: task.filePath,
              };
            }
          }
        });
      }
    });
  }

  // useful to debug
  window.tracker = tracker;

  return tracker;
}

export {
  fetchTracker,
  getTrackerURL,
};
