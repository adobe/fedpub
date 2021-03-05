/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

module.exports = {
    root: true,
    extends: '@adobe/helix',
    plugins: ['file-progress'],
    rules: {
        // Allow reassigning param
        'no-param-reassign': [2, { props: false }],
        // Indent with four spaces
        indent: [2, 4],
        // Allow modules to load from a path containing '.js'
        'import/extensions': [2, { js: 'always' }],
        // TODO: re-enable header
        'header/header': [0],
        'file-progress/activate': 1,
    },
    ignorePatterns: [
        '/bench/**/*.min.js',
        '/tools/**/*.min.js',
    ],
    parserOptions: {
        // Allow the use of JS modules (import/export statements)
        sourceType: 'module',
    },
    globals: {
        document: true,
        window: true,
        HTMLElement: true,
        HTMLLinkElement: true,
        HTMLScriptElement: true,
        NodeList: true,
    },
};
