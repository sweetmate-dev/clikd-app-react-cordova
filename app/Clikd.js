import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';

import Routing from './services/Routing';
import Store from './services/Store';
import AppService from './services/AppService';
import Requests from './services/Requests';
import Facebook from './services/Facebook';
import Geolocation from './services/Geolocation';
import RecommendationsService from './services/RecommendationsService';
import BackButton from './services/BackButton';
import ChatService from './services/ChatService';
import BranchService from './services/BranchService';
import InstagramService from './services/InstagramService';
import PushService from './services/PushService';
import TestService from './services/TestService';

import './assets/scss/main.scss';

function onDeviceReady() {
  console.log('onDeviceReady');
  const store = Store.init();

  AppService.init(store);
  Requests.init(store);
  Facebook.init(store);
  Geolocation.init(store);
  BackButton.init(store);
  ChatService.init(store);
  InstagramService.init(store);
  BranchService.init(store);
  RecommendationsService.init(store);
  PushService.init(store);
  TestService.init(store);

  window.location.hash = '/';
  window.open = function (...args) {
    // Un-hijack window.open from Cordva's inAppBrowser
    return window.origOpen(...args);
  };

  try {
    window.cordova.plugins.firebase.analytics.setEnabled(true);
  } catch (error) {
    console.log(error);
  }


  render((
    <Provider store={store}>
      <Router history={hashHistory} routes={Routing} />
    </Provider>
  ), document.getElementById('app'));
}

document.addEventListener('deviceready', onDeviceReady, false);
