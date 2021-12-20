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
  pushDownSelector: '#feds-header',
  hlx3: true,
  plugins: [
    // TAGGER -----------------------------------------------------------------------
    {
      id: 'tagger',
      condition: (sk) => sk.isEditor()
        && (sk.location.search.includes('.docx&') || sk.location.search.includes('.md&')),
      button: {
        text: 'Tagger',
        action: (_, sk) => {
          const { config } = sk;
          window.open(`https://${config.innerHost}/tools/tagger/index.html`, 'hlx-sidekick-tagger');
        },
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
    },
    // link checker
    {
      id: 'linkchecker',
      condition: (s) => !s.isEditor(),
      button: {
        text: 'Linkchecker',
        action: (_, sk) => {
          // clean up
          document.querySelectorAll('.sk-linkchecker span').forEach(e => {
            e.parentNode.classList.remove('sk-linkchecker');
            e.parentNode.classList.remove('sk-linkchecker-ok');
            e.parentNode.classList.remove('sk-linkchecker-localediff');
            e.parentNode.classList.remove('sk-linkchecker-brokenlink');
            e.remove()
          });

          // init
          const addStyle = (css) => {
            const style = document.createElement('style');
            document.head.appendChild(style);
            style.appendChild(document.createTextNode(css));
          };

          addStyle(`
            a.sk-linkchecker {
              padding: 2px;
              border: 5px solid;
            }

            a.sk-linkchecker-ok {
              border-color: green;
            }

            a.sk-linkchecker-ok span {
              color: green;
            }
            
            a.sk-linkchecker-localediff {
              border-color: orange;
            }

            a.sk-linkchecker-localediff span {
              color: orange;
            }

            a.sk-linkchecker-brokenlink {
              border-color: red;
            }

            a.sk-linkchecker-brokenlink span {
              color: red;
            }
          `);

          const currentURL = new URL(window.location.href);
          const isCurrentLocale = currentURL.pathname.split('/')[1].length === 2;

          const promises = [];
          document.querySelectorAll('main a').forEach((a) => {
            const targetURL = new URL(a.href);
            const isTargetLocale = targetURL.pathname.split('/')[1].length === 2;
            const isTargetExternal = sk.config.host !== targetURL.host;
            promises.push(new Promise((resolve) => {
              return fetch(a.href).then((res) => {
                a.classList.add('sk-linkchecker');
                if (res.status === 200) {
                  if (isTargetExternal || (isCurrentLocale && isTargetLocale) || (!isCurrentLocale && !isTargetLocale)) {
                    a.classList.add('sk-linkchecker-ok');
                    if (isTargetExternal) {
                      a.innerHTML = `${a.innerHTML} <span>(External link)<span>`
                    }
                  } else {
                    a.classList.add('sk-linkchecker-localediff');
                    a.innerHTML = `${a.innerHTML} <span>(Link valid but locale does not match)<span>`
                  }
                } else {
                  a.classList.add('sk-linkchecker-brokenlink');
                  a.innerHTML = `${a.innerHTML} <span>(Broken link)<span>`
                }
                resolve();
              });
            }));
          });

          Promise.all(promises);
        },
      },
    },
  ]
});
