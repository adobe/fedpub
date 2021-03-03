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

// This file contains the blog-specific plugins for the sidekick.
(() => {
  const sk = window.hlx && window.hlx.sidekick ? window.hlx.sidekick : window.hlxSidekick;
  if (typeof sk !== 'object') return;

  const path = sk.location.pathname;
  if (!path.includes('/publish/') && /\d{4}\/\d{2}\/\d{2}/.test(path)) {
    // post URL without publish in the path, add it back
    const segs = path.split('/');
    segs.splice(2, 0, 'publish');
    sk.location = new URL(segs.join('/'), sk.location.origin);
  }

  // PREVIEW ----------------------------------------------------------------------

  sk.add({
    id: 'preview',
    override: true,
    condition: (s) => s.isEditor() || s.location.host === s.config.host,
    button: {
      action: () => {
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
        window.open(url.toString(), `hlx-sk-preview-${window.btoa(location.href)}`);
      },
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
        window.open(`https://${config.host}/tools/tagger/`, 'hlx-sidekick-tagger');
      },
    },
  });
})();
