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
}, {
  name: 'de-DE',
  path: 'de',
}, {
  name: 'es-ES',
  path: 'es',
}, {
  name: 'it-IT',
  path: 'it',
}, {
  name: 'ru-RU',
  path: 'ru',
}];

function getPathForLocale(locale) {
  return locales.find((l) => l.name === locale).path;
}

const glaasProduct = ENV.glass.product;
const glaasProject = ENV.glass.project;

const location = new URL(window.location.href);

const glaas = {
  url: ENV.glass.url,
  authorizeURI: '/api/common/sweb/oauth/authorize',
  clientId: '657acbf5-bf11-4698-827b-f17f4e7a388d',
  redirectURI: encodeURI(`${location.origin}/tools/translation/glaas.html`),
  accessToken: null,
  product: glaasProduct,
  project: glaasProject,
  api: {
    tasks: {
      create: {
        uri: `/api/l10n/v1.1/tasks/${glaasProduct}/${glaasProject}/create`,
        payload: {
          workflowName: ENV.glass.workflowName,
          contentSource: 'Adhoc'
        },
      },
      get: {
        baseURI: `/api/l10n/v1.1/tasks/${glaasProduct}/${glaasProject}`,
      },
      getAll: {
        uri: `/api/l10n/v1.1/tasks/${glaasProduct}/${glaasProject}`,
      },
      updateStatus: {
        baseURI: `/api/l10n/v1.1/tasks/${glaasProduct}/${glaasProject}`,
      },
      assets: {
        baseURI: `/api/l10n/v1.1/tasks/${glaasProduct}/${glaasProject}`,
      },
    },
    session: {
      check: {
        uri: '/api/common/v1.0/checkSession',
      },
    },
  },
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
  admin,
};
