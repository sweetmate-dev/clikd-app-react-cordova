import React from 'react';
import Promise from 'bluebird';

import Requests from './Requests';

let store;

const IMAGE_SIZES = {
  "small": "?width=100&height=100",
  "medium": "?width=300&height=300",
  "large": "?width=600&height=600",
}

function getAccessToken(){
  return store.getState().user.getIn(['auth', 'accessToken']);
}

/**
 * A promise interface for the Facebook API
 */

const Facebook = {

  init(storeObj){
    store = storeObj;
  },

  getImageUrl(edgeId, size = 'medium') {
    const accessToken = getAccessToken();
    return `https://graph.facebook.com/v2.8/${edgeId}/picture${IMAGE_SIZES[size]}&access_token=${accessToken}`;
  },
   
  login(scope) {
    return new Promise((resolve, reject) => {
      return facebookConnectPlugin.login(scope, (response) => {
        if(response.status === 'connected') {
          resolve(response);
        } else {
          console.warn("Facebook login error", response);
          reject(new Error("facebook_login_error"));
        }
      }, (error) => {
        console.warn("Facebook login error", error);
        reject(new Error("facebook_login_error"));
      });
    });
  },

  logout() {
    return new Promise((resolve, reject) => {
      /* Clear the cache of the facebook sdk if necessary */
      this.getLoginStatus().then((response) => {
        if (response.authResponse) {
          facebookConnectPlugin.logout(() => {
            resolve();
          }, () => {
            reject(new Error('Facebok logout error'));
          });
        } else {
          resolve();
        }
      }).catch(reject);
    });
  },

  getLoginStatus() {
    return new Promise((resolve, reject) => {
      facebookConnectPlugin.getLoginStatus((response) => {
        resolve(response);
      }, (error) => {
        reject(new Error("facebook_login_status_error"));
      });
    });
  },

  api(path, method = "get") {
    if (path.indexOf('https://graph') !== -1) {
      return Requests.request(path, { method });
    }
    const joiner = path.indexOf('?') === -1 ? '?' : '&';
    const url = `https://graph.facebook.com/v2.5/${path}${joiner}access_token=${getAccessToken()}`;
    return Requests.request(url, { method });
  },
    
};

export default Facebook;
