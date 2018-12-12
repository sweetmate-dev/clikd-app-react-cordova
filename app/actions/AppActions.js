import _ from 'lodash';

export const GO_OFFLINE = 'APP.GO_OFFLINE';
export const GO_ONLINE = 'APP.GO_ONLINE';
export const GO_INTO_BACKGROUND = 'APP.GO_INTO_BACKGROUND';
export const GO_INTO_FOREGROUND = 'APP.GO_INTO_FOREGROUND';
export const SET_REGISTRATION_STEP = 'APP.SET_REGISTRATION_STEP';
export const TOGGLE_LOADER = 'APP.TOGGLE_LOADER';
export const SHOW_NOTIFICATION = 'APP.SHOW_NOTIFICATION';
export const DISMISS_NOTIFICATION = 'APP.DISMISS_NOTIFICATION';
export const SHOW_ALERT = 'APP.SHOW_ALERT';
export const DISMISS_ALERT = 'APP.DISMISS_ALERT';
export const SHOW_SLIDE_ALERT = 'APP.SHOW_SLIDE_ALERT';
export const DISMISS_SLIDE_ALERT = 'APP.DISMISS_SLIDE_ALERT';

export function goOffline() {
  return {
    type: GO_OFFLINE,
  };
}

export function goOnline() {
  return {
    type: GO_ONLINE,
  };
}

export function goIntoBackground() {
  return {
    type: GO_INTO_BACKGROUND,
  };
}

export function goIntoForeground() {
  return {
    type: GO_INTO_FOREGROUND,
  };
}

export function toggleLoader(shouldShow) {
  return {
    type: TOGGLE_LOADER,
    shouldShow,
  };
}

export function setRegistrationStep(step) {
  return {
    type: SET_REGISTRATION_STEP,
    step,
  };
}

export function showNotification(notification) {
  return {
    type: SHOW_NOTIFICATION,
    notification,
  };
}

export function dismissNotification(notificationId) {
  return {
    type: DISMISS_NOTIFICATION,
    id: notificationId,
  };
}

export function showAlert(alertOpts) {
  const id = _.uniqueId();
  /* Assign default button opts */
  const alert = Object.assign({ buttons: [{}] }, alertOpts, { id });
  alert.buttons = alert.buttons.map(button =>
    Object.assign({ label: 'OK',  closeOnTap: true }, button)
  );
  return {
    id,
    alert,
    type: SHOW_ALERT,
  };
}

export function dismissAlert(alertId) {
  return {
    type: DISMISS_ALERT,
    id: alertId,
  };
}

export function slideAlert(alertOpts) {
    const id = _.uniqueId();
  /* Assign default button opts */
    const slideAlert = Object.assign({ buttons: [{}] }, alertOpts, { id });
    slideAlert.buttons = slideAlert.buttons.map(button =>
        Object.assign({ label: 'OK',  closeOnTap: true }, button)
    );
    return {
        id,
        slideAlert,
        type: SHOW_SLIDE_ALERT,
    };
}

export function dismissSlideAlert(alertId) {
    return {
        type: DISMISS_SLIDE_ALERT,
        id: alertId,
    };
}