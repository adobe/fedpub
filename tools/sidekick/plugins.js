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

// This file contains the blog-specific plugins for the sidekick.
(() => {
  const sk = window.hlx && window.hlx.sidekick ? window.hlx.sidekick : window.hlxSidekick;
  if (typeof sk !== 'object') return;

  // PREVIEW ----------------------------------------------------------------------

  sk.add({
    id: 'preview',
    override: true,
    condition: (s) => s.isEditor() || s.isHelix(),
    button: {
      action: (evt) => {
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
      isPressed: () => sk.isInner(),
    },
  });

  // TAGGER -----------------------------------------------------------------------
  sk.add({
    id: 'tagger',
    condition: (sidekick) => sidekick.isEditor() && (sidekick.location.search.includes('.docx&') || sidekick.location.search.includes('.md&')),
    button: {
      text: 'Tagger',
      action: () => {
        const { config } = sk;
        window.open(`https://${config.innerHost}/tools/tagger/`, 'hlx-sidekick-tagger');
      },
    },
  });
})();
