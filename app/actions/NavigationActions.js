import { extend } from 'lodash';

import { SLIDE_IN_HORIZONTAL } from '^/constants/Transitions';

export const NAVIGATE_TO = 'NAVIGATION.NAVIGATE_TO';
export const NAVIGATE_BACK = 'NAVIGATION.NAVIGATE_BACK';
export const NAVIGATE_BACK_TO = 'NAVIGATION.NAVIGATE_BACK_TO';

export const SET_LOGIN_ROUTE = 'NAVIGATION.SET_LOGIN_ROUTE';

export const NAVIGATION_FORWARDS = 'NAVIGATION.FORWARDS';
export const NAVIGATION_BACKWARDS = 'NAVIGATION.BACKWARDS';


/**
 * @typedef {Object} NavigationOptions
 * @property {Object} transition - Override the default transition for this navigation.
 * @property {Boolean} clear - If set, resets the history so the user can't navigate back
 * @property {String} clearfrom - Will clear the history from this route
 */

const defaultOptions = {
  clear: false,
};

function sanitize(route) {
  let output = route;
  if (output[0] !== '/') output = `/${route}`;
  return output;
}

export function setLoginRoute(route) {
  return { type: SET_LOGIN_ROUTE, route };
}

export function navigateTo(route, navigationOptions) {
  const path = route ? sanitize(route) : null;
  const options = extend({}, defaultOptions, navigationOptions);
  if (options.clearFrom) options.clearFrom = sanitize(options.clearFrom);
  options.transition = options.transition || SLIDE_IN_HORIZONTAL;
  return {
    type: NAVIGATE_TO,
    route: path,
    options,
  };
}

export function navigateBackTo(route, navigationOptions = {}) {
  if (!route) {
    console.error('Route is required for navigateBackTo');
    return {};
  }
  const options = extend({}, defaultOptions, navigationOptions);
  if (options.clearFrom) options.clearFrom = sanitize(options.clearFrom);
  return {
    type: NAVIGATE_BACK_TO,
    route: sanitize(route),
    options,
  };
}

export function navigateBack(defaultRoute, navigationOptions = {}) {
  if (!defaultRoute) {
    console.error('Default route should be defined for navigateBack');
    return {};
  }
  const options = extend({}, defaultOptions, navigationOptions);
  if (options.clearFrom) options.clearFrom = sanitize(options.clearFrom);
  return {
    type: NAVIGATE_BACK,
    defaultRoute: sanitize(defaultRoute),
    options,
  };
}


