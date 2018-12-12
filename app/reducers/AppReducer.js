import Immutable from 'immutable';

import {
  GO_OFFLINE, 
  GO_ONLINE,
  GO_INTO_BACKGROUND,
  GO_INTO_FOREGROUND,
  SET_REGISTRATION_STEP,
  TOGGLE_LOADER,
  SHOW_NOTIFICATION,
  DISMISS_NOTIFICATION,
  SHOW_ALERT,
  DISMISS_ALERT,
  SHOW_SLIDE_ALERT,
  DISMISS_SLIDE_ALERT,
} from '^/actions/AppActions' ;
import { LOGOUT_SUCCESS } from '^/actions/UserActions';

const initialState = Immutable.fromJS({
  online: false,
  inBackground: false,
  registrationStep: null,
  loaderVisible: false,
  notificationIds: [],
  notifications: {},
  alertIds: [],
  alerts: {},
  slideAlertIds: [],
  slideAlerts: {},
});


export default function appReducers(state = initialState, action) {
  switch (action.type) {
    case GO_OFFLINE: {
      return state.set('online', false);
    }
    case GO_ONLINE: {
      return state.set('online', true);
    }
    case GO_INTO_BACKGROUND: {
      return state.set('inBackground', true);
    }
    case GO_INTO_FOREGROUND: {
      return state.set('inBackground', false);
    }
    case LOGOUT_SUCCESS: {
      const output = initialState;
      return output.merge({
        online: state.get('online'),
      });
    }
    case TOGGLE_LOADER: {
      return state.set('loaderVisible', action.shouldShow);
    }
    case SET_REGISTRATION_STEP: {
      return state.set('registrationStep', action.step);
    }
    case SHOW_NOTIFICATION: {
      const notification = action.notification;
      const ids = state.get('notificationIds').push(notification.id);
      const output = state.mergeIn(['notifications', notification.id], notification);
      return output.set('notificationIds', ids);
    }
    case DISMISS_NOTIFICATION: {
      let ids = state.get('notificationIds');
      const index = ids.indexOf(action.id);
      if (index === -1) {
        return state;
      }
      ids = ids.delete(index);
      const notifications = state.get('notifications').delete(action.id);
      return state.merge({
        notificationIds: ids,
        notifications,
      });
    }
    case SHOW_ALERT: {
      const alert = Immutable.fromJS(action.alert);
      const ids = state.get('alertIds').push(action.id);
      const output = state.mergeIn(['alerts', action.id], alert);
      return output.set('alertIds', ids);
    }
    case DISMISS_ALERT: {
      let ids = state.get('alertIds');
      const index = ids.indexOf(action.id);
      if (index === -1) {
        return state;
      }
      ids = ids.delete(index);
      const alerts = state.get('alerts').delete(action.id);
      return state.merge({
        alertIds: ids,
        alerts,
      });
    }
    case SHOW_SLIDE_ALERT: {
        const slideAlert = Immutable.fromJS(action.slideAlert);
        const ids = state.get('slideAlertIds').push(action.id);
        const output = state.mergeIn(['slideAlerts', action.id], slideAlert);
        return output.set('slideAlertIds', ids);
    }
    case DISMISS_SLIDE_ALERT: {
        let ids = state.get('slideAlertIds');
        const index = ids.indexOf(action.id);
        if (index === -1) {
            return state;
        }
        ids = ids.delete(index);
        const slideAlerts = state.get('slideAlerts').delete(action.id);
        return state.merge({
            slideAlertIds: ids,
            slideAlerts,
        });
    }
    default:
      return state;
  }
}
