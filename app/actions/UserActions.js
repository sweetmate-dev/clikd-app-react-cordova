import Api from '^/services/Api';
import Facebook from '^/services/Facebook';
import RecommendationsService from '^/services/RecommendationsService';
import _ from 'lodash';

export const LOGIN_REQUEST = 'USER.LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'USER.LOGIN_SUCCESS';
export const LOGIN_FAILED = 'USER.LOGIN_FAILED';
export const LOGOUT_REQUEST = 'USER.LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'USER.LOGOUT_SUCCESS';
export const LOGOUT_FAILED = 'USER.LOGOUT_FAILED';
export const GET_AUTH_SUCCESS = 'USER.GET_AUTH_SUCCESS';
export const GET_SELF_SUCCESS = 'USER.GET_SELF_SUCCESS';
export const SET_USER_LOCATION = 'USER.SET_LOCATION';
export const SET_USER_LOCATION_FAILED = 'USER.SET_LOCATION_FAILED';
export const UPDATE_INSTAGRAM_TOKEN = 'USER.UPDATE_INSTAGRAM_TOKEN';
export const MARK_NUDGE_READ = 'USER.MARK_NUDGE_READ';

const FB_SCOPE = [
  'public_profile',
  'email',
  'user_location',
  'user_birthday',
  'user_photos'
];

const defaultLoginOptions = {
  getRecommendations: false,
  getAuth: true,
  reset: false,
};

/**
 * Generate a promise that initiates the facebook authentication process.   
 * @param  {Object} options
 * @param  {Functions} dispatch
 * @return {Promise}
 */
function getAuthPromise(options, dispatch) {
  return Facebook.login(FB_SCOPE).then((res) => {
    dispatch({ type: GET_AUTH_SUCCESS, auth: res.authResponse });
    return null;
  });
}

/**
 * Generate a promise that gets the user's status from the server and connects
 * them to the chat servce.
 * @param  {Function} dispatch 
 * @return {Promise}          
 */
function getLoginPromise(dispatch) {
  return Api.getSelf().then((res) => {
    dispatch({ type: GET_SELF_SUCCESS, profile: res.profile, test: res.test });
  });
}

export function login(loginOptions = {}) {
  const options = _.defaults(loginOptions, defaultLoginOptions);
  return (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    let promise;
    if (options.getAuth) {
      promise = getAuthPromise(options, dispatch).then(() => getLoginPromise(dispatch));
    } else {
      promise = getLoginPromise(dispatch);
    }
    promise.then(() => {
      if (options.getRecommendations) {
        return RecommendationsService.getRecommendations();
      } else {
        return null;
      }
    }).then(() => {
      dispatch({ type: LOGIN_SUCCESS });
      return null;
    }).catch((error) => {
      const message = error && error.message ? error.message : true;
      dispatch({ type: LOGIN_FAILED, error: message });
      return null;
    });
  };
}


export function logout() {
  return (dispatch) => {
    dispatch({ type: LOGOUT_REQUEST });
    Facebook.logout().then(() => {
      dispatch({ type: LOGOUT_SUCCESS });
    }).catch((error) => {
      const message = error && error.message ? error.message : true;
      dispatch({ type: LOGOUT_FAILED, error: message });
    });
  };
}

export function resetAndLogout() {
  return (dispatch) => {
    dispatch({ type: LOGOUT_REQUEST });
    Api.deleteUser().then(() => {
      dispatch({ type: LOGOUT_SUCCESS, shouldReset: true });
    }).catch((error) => {
      const message = error && error.message ? error.message : true;
      dispatch({ type: LOGOUT_FAILED, error: message });
    });
  };
}

export function setUserLocation(latitude, longitude) {
  return {
    type: SET_USER_LOCATION,
    latitude,
    longitude,
  };
}

export function setUserLocationFailed(error) {
  return {
    type: SET_USER_LOCATION_FAILED,
    error: error && error.message ? error.message : 'location_error',
  };
}

export function updateInstagramToken(token) {
  return {
    type: UPDATE_INSTAGRAM_TOKEN,
    token,
  };
}
export function markNudgeRead(userId) {
  return {
    type: MARK_NUDGE_READ,
    userId,
  };
}