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
    // "hide" all button for demo feature only
    {
      id: 'edit',
      condition: false,
      button: {
        action: () => {},
      },
    },
    {
      id: 'preview',
      condition: false,
      button: {
        action: () => {},
      },
    },
    {
      id: 'live',
      condition: false,
      button: {
        action: () => {},
      },
    },
    {
      id: 'prod',
      condition: false,
      button: {
        action: () => {},
      },
    },
    {
      id: 'tagger',
      condition: false,
      button: {
        action: () => {},
      },
    },
    // TRANSLATE
    {
      id: 'translate',
      condition: (s) => s.isEditor() && s.location.href.includes('/:x'),
      button: {
        text: 'Translate from tracker',
        action: (_, sk) => {
          const { config } = sk;
          window.open(`${config.pluginHost ? config.pluginHost : `http://${config.innerHost}` }/tools/translation/?sp=${encodeURIComponent(window.location.href)}&owner=${config.owner}&repo=${config.repo}&ref=${config.ref}`, 'hlx-sidekick-spark-translation');
        },
      },
    }
  ],
});