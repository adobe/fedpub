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
/* global window */

import ENV from './env.stage.js';

const locales = [{
  name: 'fr-FR',
  path: 'fr',
  workflow: 'HybridMT',
}, {
  name: 'de-DE',
  path: 'de',
  workflow: 'HybridMT',
}, {
  name: 'es-ES',
  path: 'es',
  workflow: 'HybridMT',
}, {
  name: 'it-IT',
  path: 'it',
  workflow: 'HybridMT',
}, {
  name: 'ru-RU',
  path: 'ru',
  workflow: 'HybridMT',
}, {
  name: 'jp-JP',
  path: 'jp',
  workflow: 'HybridMT',
}, {
  name: 'zh-Hans',
  path: 'cn',
  workflow: 'HybridMT',
}, {
  name: 'pt-BR',
  path: 'br',
  workflow: 'HybridMT',
}, {
  name: 'ko-KR',
  path: 'kr',
  workflow: 'Standard',
},{
  name: 'en-GB',
  path: 'uk',
  workflow: 'AltLang',
}];

function getPathForLocale(locale) {
  return locales.find((l) => l.name === locale).path;
}

function getWorkflowForLocale(locale) {
  const l = locales.find((l) => l.name === locale);
  const workflow = l && l.workflow ? l.workflow : 'Standard';
  return { 
    name: workflow,
    ...ENV.glaas.workflows[workflow],
  };
}

const location = new URL(window.location.href);

const glaas = {
  url: ENV.glaas.url,
  authorizeURI: '/api/common/sweb/oauth/authorize',
  clientId: '657acbf5-bf11-4698-827b-f17f4e7a388d',
  redirectURI: encodeURI(`${location.origin}/tools/translation/glaas.html`),
  accessToken: null,
  api: {
    session: {
      check: {
        uri: '/api/common/v1.0/checkSession',
      },
    },
  },
  localeApi: (locale) => {
    const workflow = getWorkflowForLocale(locale);
    const { product, project, workflowName } = workflow;
    return {
      tasks: {
        create: {
          uri: `/api/l10n/v1.1/tasks/${product}/${project}/create`,
          payload: {
            workflowName: workflowName,
            contentSource: 'Adhoc'
          },
        },
        get: {
          baseURI: `/api/l10n/v1.1/tasks/${product}/${project}`,
        },
        getAll: {
          uri: `/api/l10n/v1.1/tasks/${product}/${project}`,
        },
        updateStatus: {
          baseURI: `/api/l10n/v1.1/tasks/${product}/${project}`,
        },
        assets: {
          baseURI: `/api/l10n/v1.1/tasks/${product}/${project}`,
        },
      }
    };
  }
};

const graphURL = 'https://graph.microsoft.com/v1.0';

const spSiteRootAPI = ENV.sp.site;
const spRootFolders = ENV.sp.rootFolders;

const sp = {
  clientApp: {
    auth: {
      clientId: ENV.sp.clientId,
      authority: ENV.sp.authority,
    },
  },
  login: {
    redirectUri: '/tools/translation/spauth',
  },
  api: {
    url: graphURL,
    file: {
      get: {
        baseURI: `${spSiteRootAPI}/drive/root:${spRootFolders}`,
      },
      download: {
        baseURI: `${spSiteRootAPI}/drive/items`,
      },
      upload: {
        baseURI: `${spSiteRootAPI}/drive/root:${spRootFolders}`,
        method: 'PUT',
      },
      createUploadSession: {
        baseURI: `${spSiteRootAPI}/drive/root:${spRootFolders}`,
        method: 'POST',
        payload: {
          '@microsoft.graph.conflictBehavior': 'replace',
        },
      },
    },
    directory: {
      create: {
        baseURI: `${spSiteRootAPI}/drive/root:${spRootFolders}`,
        method: 'PATCH',
        payload: {
          folder: {},
        },
      },
    },
    batch: {
      uri: `${graphURL}/$batch`,
    },
  },
};

const adminServerURL = 'https://admin.hlx3.page';
const admin = {
  api: {
    preview: {
      baseURI: `${adminServerURL}/preview`,
    }
  }
}

export {
  locales,
  glaas,
  sp,
  getPathForLocale,
  getWorkflowForLocale,
  admin,
};
