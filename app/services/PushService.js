import { showNotification } from '^/actions/AppActions';
import { setLoginRoute, navigateTo } from '^/actions/NavigationActions';
import { subscribe } from '^/services/Subscriptions';
import Api from '^/services/Api';
import _ from 'lodash';

let store;
let push;

function onNotification(notification) {
  const data = notification.additionalData;
  /* Some notifications should be displayed in app if received
  when the app is in the foreground */
  if (data.foreground && data.showInApp) {
    const action = showNotification({
      id: _.uniqueId(),
      body: notification.message,
      title: notification.title,
      route: data.route,
    });
    store.dispatch(action);
  }
  /* If the app is launched from an notification, navigate to
  the correct route either on open or on login */
  if (!data.foreground && data.route) {
    let action;
    const state = store.getState();
    if (state.user.get('isLoggedIn')) {
      action = navigateTo(data.route);
    } else {
      action = setLoginRoute(data.route);
    }
    store.dispatch(action);
  }

  if (data.totalNewMessages) {
    push.setApplicationIconBadgeNumber(() => {}, () => {}, totalNewMessages);
  }
}

function onRegistration(data) {
  const state = store.getState();
  const id = data.registrationId;
  if (
    id
    && !state.user.getIn(['profile', 'devices']).includes(id)
    && window.device.platform !== 'browser'
  ) {
    Api.refreshDevice(id);
  }
}

function onError(error) {
  //console.log("[Push error]", error);
}

function register() {
  push = window.PushNotification.init({
    android: {
      senderID: process.env.ANDROID_SENDER_ID,
      icon: 'ic_stat_clikd',
      iconColor: '#25282D',
    },
    browser: {
      pushServiceURL: 'http://push.api.phonegap.com/v1/push',
    },
    ios: {
      alert: 'true',
      badge: 'false',
      sound: 'true',
    },
  });
  push.on('registration', onRegistration);
  push.on('notification', onNotification);
  push.on('error', onError);
}

function unregister() {
  push.off('registration', onRegistration);
  push.off('notification', onNotification);
  push.off('error', onError);
}

export default {

  init(storeObj) {
    store = storeObj;
    // Subscribe to login state
    subscribe('user', ['isLoggedIn'], (wasLoggedIn, isLoggedIn) => {
      if (!wasLoggedIn && isLoggedIn && !push) {
        register();
      } else if (wasLoggedIn && !isLoggedIn && push) {
        unregister();
      }
    });
  },

};
