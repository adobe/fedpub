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

// This file contains the project-specific configuration for the sidekick.
window.hlx.initSidekick({
  project: 'FedPub',
  host: 'www.adobe.com',
  byocdn: true,
  plugins: [
    // PREVIEW ----------------------------------------------------------------------
    {
      id: 'preview',
      override: true,
      condition: (sk) => sk.isEditor() || sk.isHelix(),
      button: {
        action: (evt, sk) => {
          const { config, location } = sk;
          let url;
          if (sk.isEditor()) {
            url = new URL('https://adobeioruntime.net/api/v1/web/helix/helix-services/content-proxy@2.7.0');
            url.search = new URLSearchParams([
              ['owner', config.owner],
              ['repo', config.repo],
              ['ref', config.ref || 'main'],
              ['path', '/'],
              ['lookup', location.href],
            ]).toString();
          } else {
            const host = location.host === config.innerHost ? config.host : config.innerHost;
            url = new URL(`https://${host}${location.pathname}`);
          }
          if (evt.metaKey || evt.which === 2) {
            window.open(url.toString());
          } else {
            window.location.href = url.toString();
          }
        },
        isPressed: (sk) => sk.isInner(),
      },
    },
    // TAGGER -----------------------------------------------------------------------
    {
      id: 'tagger',
      condition: (sk) => sk.isEditor()
        && (sk.location.search.includes('.docx&') || sk.location.search.includes('.md&')),
      button: {
        text: 'Tagger',
        action: (_, sk) => {
          const { config } = sk;
          window.open(`https://${config.innerHost}/tools/tagger/`, 'hlx-sidekick-tagger');
        },
      },
    },
  ],
});
