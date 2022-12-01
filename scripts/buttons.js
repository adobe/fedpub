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

export default function decorateButtons() {
    document.querySelectorAll('main a').forEach(($a) => {
        const $up = $a.parentElement;
        const $twoup = $a.parentElement.parentElement;
        if ($up.childNodes.length === 1 && $up.tagName === 'P') {
            // Setting CTA parent element to `flex` in order to be able
            // to apply all the suggested Spectrum styling.
            // CTA buttons should not normally occur in the normal text,
            // they should be present in the card component, so this
            // is just a temporary solution for demo purposes
            $up.style.display = 'flex';
            $a.className = 'fedpub-cta fedpub-cta--secondary';
        }
        if ($up.childNodes.length === 1 && $up.tagName === 'STRONG'
    && $twoup.childNodes.length === 1 && $twoup.tagName === 'P') {
            $twoup.style.display = 'flex';
            $a.className = 'fedpub-cta fedpub-cta--primary';
        }
    });
}
