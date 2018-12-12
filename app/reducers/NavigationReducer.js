import Immutable from 'immutable';
import { findIndex } from 'lodash';

import {
  NAVIGATION_FORWARDS,
  NAVIGATION_BACKWARDS,
  NAVIGATE_TO,
  NAVIGATE_BACK,
  NAVIGATE_BACK_TO,
  SET_LOGIN_ROUTE,
} from '^/actions/NavigationActions';
import { LOGOUT_SUCCESS } from '^/actions/UserActions';
import { NO_TRANSITION, getReverseTransition } from '^/constants/Transitions';

const initialState = Immutable.fromJS({
  history: [],
  direction: NAVIGATION_FORWARDS,
  route: '/',
  loginRoute: null,
  transition: NO_TRANSITION,
});

function updateState({ state, route, transition, direction, options }) {
  let history = state.get('history').toJS();
  if (options.clear) history = [];
  const clearRoute = options.clearFrom || route;
  let routeIndex = findIndex(history, { route: clearRoute });
  if (clearRoute === options.clearFrom && routeIndex !== -1) routeIndex++;
  if (routeIndex !== -1) history.splice(routeIndex);
  history.push({
    route,
    transitionType: transition.transitionType,
  });
  return state.merge({ route, history, direction, transition });
}

export default function navigationReducers(state = initialState, action) {
  switch (action.type) {

    case LOGOUT_SUCCESS: {
      return initialState;
    }

    case SET_LOGIN_ROUTE: {
      return state.set('loginRoute', action.route);
    }

    case NAVIGATE_BACK: {
      // Get previous route, or fallback to the default route
      const history = state.get('history');
      const previousRoute = history.size > 1 ? history.get(history.size - 2) : new Immutable.Map();
      const route = previousRoute.get('route') || action.defaultRoute;
      // Get transition
      let transition = action.options.transition;
      if (!transition) {
        const currentRoute = history.size ? history.get(history.size - 1) : new Immutable.Map();
        const transitionType = currentRoute.get('transitionType') || NO_TRANSITION;
        transition = getReverseTransition(transitionType);
      }
      return updateState({
        state,
        route,
        transition,
        options: action.options,
        direction: NAVIGATION_BACKWARDS,
      });
    }

    case NAVIGATE_BACK_TO: {
      let transition = action.options.transition;
      if (!transition) {
        const history = state.get('history');
        const currentRoute = history.get(history.size - 1);
        const transitionType = currentRoute.get('transitionType');
        transition = getReverseTransition(transitionType);
      }
      return updateState({
        state,
        transition,
        route: action.route,
        options: action.options,
        direction: NAVIGATION_BACKWARDS,
      });
    }

    case NAVIGATE_TO: {
      return updateState({
        state,
        route: action.route,
        transition: action.options.transition,
        direction: NAVIGATION_FORWARDS,
        options: action.options,
      });
    }

    default:
      return state;
  }
}
