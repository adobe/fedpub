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
/* eslint-disable no-use-before-define */
/*  global window, document */

import { glaas, getPathForLocale } from './config.js';
import { asyncForEach, createTag } from './utils.js';

import {
  saveFile,
  connect as connectToSP,
  updateTracker as updateTrackerWithSPStatus,
} from './sharepoint.js';

import {
  fetchTracker,
  getTrackerURL,
  purge,
} from './tracker.js';

import {
  connect as connectToGLaaS,
  createHandoff,
  getFile as getFileFromGLaaS,
  updateTracker as updateTrackerWithGLaaSStatus,
} from './glaas.js';

let tracker;
const status = document.getElementById('status');
const loading = document.getElementById('loading');
const STATUS_LEVELS = ['error', 'info'];

function setStatus(msg, level = 'info') {
  status.classList.remove(STATUS_LEVELS.filter((l) => l !== level));
  status.classList.add(level);
  status.innerHTML = msg;
}

function loadingON(txt) {
  loading.classList.remove('hidden');
  setStatus(txt);
}

function loadingOFF() {
  loading.classList.add('hidden');
}

function setError(msg) {
  // TODO UI
  // eslint-disable-next-line no-console
  console.error(msg);
}

function setTrackerURL(url) {
  const u = new URL(url);
  document.getElementById('trackerURL').innerHTML = `${u.pathname.slice(0, -5)}.xlsx`;
}

async function preview(task, locale) {
  loadingON('Downloading file from GLaaS');
  const file = await getFileFromGLaaS(task);

  const trackerURL = await getTrackerURL();
  const u = new URL(trackerURL);
  const dest = `${u.pathname.slice(0, -5)}_preview/${getPathForLocale(locale)}${task.filePath}`.toLowerCase();

  loadingON('Saving file to Sharepoint');
  await saveFile(file, dest);

  loadingOFF();
  window.open(`${u.origin}${dest.slice(0, -5)}`);
}

function drawTracker() {
  if (!tracker) {
    return;
  }

  const container = document.getElementsByClassName('tracker')[0];
  container.innerHTML = '';

  const $table = createTag('table');
  let $tr = createTag('tr', { class: 'header' });
  let $th = createTag('th', { class: 'header' });
  $th.innerHTML = 'URL';
  $tr.appendChild($th);

  $th = createTag('th', { class: 'header' });
  $th.innerHTML = 'Source file';
  $tr.appendChild($th);

  tracker.locales.forEach((e) => {
    $th = createTag('th', { class: 'header' });
    $th.innerHTML = e;
    $tr.appendChild($th);
  });
  $table.appendChild($tr);

  let taskFoundInGLaaS = false;
  let canSaveAll = false;

  tracker.urls.forEach((url) => {
    $tr = createTag('tr', { class: 'row' });
    $th = createTag('th', { class: 'row' });
    const u = new URL(url);
    $th.innerHTML = `<a href="${url}" target="_new">${u.pathname}</a>`;
    $tr.appendChild($th);

    $th = createTag('th');
    $th.innerHTML = 'Connect to Sharepoint';
    const doc = tracker.docs[url];
    let hasSourceFile = false;
    if (doc && doc.sp) {
      if (doc.sp.status === 200) {
        $th.innerHTML = `${doc.filePath}`;
        hasSourceFile = true;
      } else {
        $th.innerHTML = 'Source file not found!';
      }
    }
    $tr.appendChild($th);

    tracker.locales.forEach((locale) => {
      const $td = createTag('td');
      $td.innerHTML = 'N/A';
      const task = tracker[locale].find((t) => t.URL === url);
      if (task) {
        if (task.glaas && task.glaas.status) {
          taskFoundInGLaaS = true;
          if (task.glaas.status === 'COMPLETED') {
            $td.innerHTML = '';
            const $download = createTag('button', { type: 'button' });
            $download.innerHTML = 'Download';
            $download.addEventListener('click', () => {
              window.open(`${glaas.url}${glaas.api.tasks.assets.baseURI}/${task.glaas.assetPath}`);
            });
            $td.appendChild($download);
            const $preview = createTag('button', { type: 'button' });
            $preview.innerHTML = 'Preview';
            $preview.addEventListener('click', () => {
              preview(task, locale);
            });
            $td.appendChild($preview);

            if (task.sp) {
              canSaveAll = true;
              const $saveToLocalSP = createTag('button', { type: 'button' });
              if (task.sp.status !== 200) {
                $saveToLocalSP.innerHTML = 'Create in Sharepoint';
              } else {
                $saveToLocalSP.innerHTML = 'Overwrite version in Sharepoint';
              }
              $saveToLocalSP.addEventListener('click', () => {
                save(task);
              });
              $td.appendChild($saveToLocalSP);
            }
          } else {
            $td.innerHTML = task.glaas.status;
          }
        } else if (glaas.accessToken) {
          if (task.sp) {
            if (hasSourceFile) {
              $td.innerHTML = 'Ready for translation';
            } else {
              $td.innerHTML = 'No source';
            }
          }
        } else {
          $td.innerHTML = 'Connect to GLaaS first';
        }

        // if (task.sp && task.sp.status === 200) {
        //   $td.innerHTML += ' | File exists in Sharepoint, be careful';
        // }
      }

      $tr.appendChild($td);
    });

    $table.appendChild($tr);
  });

  if (canSaveAll) {
    $tr = createTag('tr', { class: 'row' });
    $th = createTag('th');
    $tr.appendChild($th);

    $th = createTag('th');
    $tr.appendChild($th);

    tracker.locales.forEach((locale) => {
      const $td = createTag('td');
      const $saveAllSP = createTag('button', { type: 'button' });
      $saveAllSP.innerHTML = `Save all ${locale} files in Sharepoint`;
      $saveAllSP.addEventListener('click', () => {
        saveAll(locale);
      });
      $td.appendChild($saveAllSP);
      $tr.appendChild($td);
    });

    $table.appendChild($tr);
  }

  container.appendChild($table);

  const sendPanel = document.getElementById('send');
  const refreshPanel = document.getElementById('refresh');
  const reloadPanel = document.getElementById('reload');
  if (!taskFoundInGLaaS) {
    // show the send button only if task has not been found in GLaaS
    sendPanel.classList.remove('hidden');
    reloadPanel.classList.remove('hidden');
    refreshPanel.classList.add('hidden');
  } else {
    sendPanel.classList.add('hidden');
    reloadPanel.classList.add('hidden');
    refreshPanel.classList.remove('hidden');
  }
}

async function sendTracker() {
  await asyncForEach(tracker.locales, async (locale) => {
    loadingON(`Creating ${locale} handoff in GLaaS`);
    await createHandoff(tracker, locale);
  });
  loadingON('Handoffs created in GLaaS. Updating the tracker status with status from GLaaS...');
  await updateTrackerWithGLaaSStatus(tracker);
  loadingON('Status updated! Updating UI.');
  drawTracker();
  loadingOFF();
}

async function reloadTracker() {
  const url = await getTrackerURL();
  loadingON(`Purging tracker`);
  await purge(url);
  let res;
  do {
    loadingON('Waiting for tracker to be available');
    res = await fetch(url);
  } while(!res.ok);

  loadingON('Reloading tracker');
  tracker = await fetchTracker(url);
  await refresh();

}

async function refresh() {
  loadingON('Updating the tracker status with status from Sharepoint...');
  await updateTrackerWithSPStatus(tracker);
  loadingON('Updating the tracker status with status from GLaaS...');
  await updateTrackerWithGLaaSStatus(tracker);
  loadingON('Status updated! Updating UI.');
  drawTracker();
  loadingOFF();
}

async function save(task) {
  const dest = `${task.localeFilePath}`.toLowerCase();

  if (task.sp && task.sp.status === 200) {
    // file exists in Sharepoint, confirm overwrite
    // eslint-disable-next-line no-alert
    const confirm = window.confirm(`File ${dest} exists already. Are you sure you want to overwrite the current production version ?`);
    if (!confirm) return;
  }
  loadingON(`Downloading ${dest} file from GLaaS`);
  const file = await getFileFromGLaaS(task);

  loadingON(`Saving ${dest} file to Sharepoint`);
  await saveFile(file, dest);

  loadingON(`File ${dest} is now in Sharepoint`);

  loadingOFF();
  refresh();
  // window.open(`${u.origin}${dest.slice(0, -5)}`);
}

async function saveAll(locale) {
  return asyncForEach(tracker[locale], async (task) => {
    if (task.glaas) {
      await save(task);
    }
  });
}

function setListeners() {
  document.querySelector('#send button').addEventListener('click', sendTracker);
  document.querySelector('#refresh button').addEventListener('click', refresh);
  document.querySelector('#reload button').addEventListener('click', reloadTracker);
}

async function init() {
  loadingON('Initializing the application');
  setListeners();
  let trackerURL;
  try {
    trackerURL = await getTrackerURL();
  } catch (err) {
    setError('Could not find a valid tracker URL', 'error');
    return;
  }
  loadingON(`Fetching the tracker ${trackerURL}`);
  setTrackerURL(trackerURL);
  tracker = await fetchTracker(trackerURL);
  loadingON('Tracker loaded.');
  drawTracker();
  loadingON('Connecting now to Sharepoint...');
  await connectToSP(async () => {
    loadingON('Connected to Sharepoint! Updating the tracker status with status from Sharepoint...');
    await updateTrackerWithSPStatus(tracker, () => {
      loadingON('Status updated! Updating UI.');
      drawTracker();
    });
  });
  loadingON('Connecting now to GLaaS...');
  await connectToGLaaS(async () => {
    loadingON('Connected to GLaaS! Updating the tracker status with status from GLaaS...');
    await updateTrackerWithGLaaSStatus(tracker, () => {
      loadingON('Status updated! Updating UI.');
      drawTracker();
    });
  });
  loadingON('Application loaded.');
  loadingOFF();
}

export {
  // eslint-disable-next-line import/prefer-default-export
  init,
};
