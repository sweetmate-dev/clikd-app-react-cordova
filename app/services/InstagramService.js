import { updateInstagramToken } from '^/actions/UserActions';

import Requests from './Requests';
import Api from './Api';

let store;

function init(storeObj) {
  store = storeObj;
}

function authorize() {
  return new Promise((resolve, reject) => {
    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    const redirectUri = encodeURI(process.env.INSTAGRAM_REDIRECT_URI);
    const url = `https://api.instagram.com/oauth/authorize/?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token`;
    if (window.device.platform === 'browser') {
      browserAuth(url, resolve, reject);
    } else {
      deviceAuth(url, resolve, reject);
    }
  });
}

function browserAuth(url, resolve, reject) {
  const win = window.open(url, '_system');
  function onMsg(e) {
    if (e.data[0] === 'instagramAuthSuccess') {
      window.removeEventListener('message', onMsg);
      win.close();
      handleAuthResponse(e.data[1], resolve, reject);
    }
  }
  window.addEventListener('message', onMsg);
}

function deviceAuth(url, resolve, reject) {
  /* For devices use the InAppBrowser and 'executeScript' */
  const win = cordova.InAppBrowser.open(url, '_blank');
  function onExit() {
    win.removeEventListener('exit', onExit);
    win.removeEventListener('loadstop', onLoadStop);
    reject(new Error('User cancelled'));
  }
  function onLoadStop(ev) {
    if (ev.url.indexOf(process.env.INSTAGRAM_REDIRECT_URI) === 0) {
      win.removeEventListener('exit', onExit);
      win.removeEventListener('loadstop', onLoadStop);
      win.close();
      handleAuthResponse(ev.url, resolve, reject);
    }
  }
  win.addEventListener('exit', onExit);
  win.addEventListener('loadstop', onLoadStop);
}

function handleAuthResponse(authString, resolve, reject) {
  const parts = authString.split('#access_token=');
  if (parts.length > 1) {
    const token = parts[1];
    Api.updateSelf({
      instagramToken: token,
    })
    .then(() => {
      const action = updateInstagramToken(token);
      store.dispatch(action);
      resolve(token);
    })
    .catch(reject);
  } else {
    reject(new Error('Authorization failed - no access token'));
  }
}

function getToken() {
  return new Promise((resolve, reject) => {
    const state = store.getState();
    const token = state.user.getIn(['profile', 'instagramToken']);
    if (token) resolve(token);
    else authorize().then(resolve).catch(reject);
  });
}

function getMedia(url = 'https://api.instagram.com/v1/users/self/media/recent', reattempt = true) {
  return new Promise((resolve, reject) => {
    getToken()
    .then(token =>
      Requests.request(url, {
        jsonp: true,
        query: {
          access_token: token,
          count: 24,
        },
      })
    )
    .then((response) => {
      const error = response.meta ? response.meta.error_type : null;
      if (error === 'OAuthAccessTokenException' && reattempt) {
        /* Reauthorize and the reattempt with the same promise */
        authorize()
        .then(() => getMedia(url, false).then(resolve).catch(reject))
        .catch(reject);
      } else if (error) {
        reject(new Error('Instagram error'));
      } else {
        resolve(response);
      }
    })
    .catch(reject);
  });
}

export default {
  init,
  authorize,
  getMedia,
};

