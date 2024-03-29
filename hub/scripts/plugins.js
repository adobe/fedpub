/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* globals fetch */

function translateFromTracker({ detail }) {
    const { config, location } = detail.data;
    window.open(`https://main--fedpub--adobe.hlx.page/tools/translation/index.html?sp=${encodeURIComponent(location.href)}&owner=${config.owner}&repo=${config.repo}&ref=${config.ref}`, 'hlx-sidekick-spark-translation');
}

function linkChecker({ detail }) {
    const { config } = detail.data;

    // clean up
    document.querySelectorAll('.sk-linkchecker span').forEach((e) => {
        e.parentNode.classList.remove('sk-linkchecker');
        e.parentNode.classList.remove('sk-linkchecker-ok');
        e.parentNode.classList.remove('sk-linkchecker-localediff');
        e.parentNode.classList.remove('sk-linkchecker-brokenlink');
        e.remove();
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
        const isTargetExternal = config.host !== targetURL.host;
        promises.push(new Promise((resolve) => fetch(a.href).then((res) => {
            a.classList.add('sk-linkchecker');
            if (res.status === 200) {
                if (isTargetExternal || (isCurrentLocale && isTargetLocale)
                  || (!isCurrentLocale && !isTargetLocale)) {
                    a.classList.add('sk-linkchecker-ok');
                    if (isTargetExternal) {
                        a.innerHTML = `${a.innerHTML} <span>(External link)<span>`;
                    }
                } else {
                    a.classList.add('sk-linkchecker-localediff');
                    a.innerHTML = `${a.innerHTML} <span>(Link valid but locale does not match)<span>`;
                }
            } else {
                a.classList.add('sk-linkchecker-brokenlink');
                a.innerHTML = `${a.innerHTML} <span>(Broken link)<span>`;
            }
            resolve();
        })));
    });

    Promise.all(promises);
}

const sk = document.querySelector('helix-sidekick');
sk.addEventListener('custom:translate', translateFromTracker);
sk.addEventListener('custom:linkchecker', linkChecker);
