import Immutable from 'immutable';
import _ from 'lodash';

import {
  SET_USER_LOCATION,
  SET_USER_LOCATION_FAILED,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILED,
  GET_AUTH_SUCCESS,
  GET_SELF_SUCCESS,
  UPDATE_INSTAGRAM_TOKEN,
  MARK_NUDGE_READ,
} from '^/actions/UserActions';
import { apiType } from '^/actions/ApiActions';
import { INSTAGRAM_DISCONNECT_SUCCESS } from '^/actions/PhotosActions';

const UPDATE_REQUEST = apiType('updateSelf', 'REQUEST');
const UPDATE_SUCCESS = apiType('updateSelf', 'SUCCESS');
const UPDATE_FAILED = apiType('updateSelf', 'FAILED');
const UPDATE_ABORT = apiType('updateSelf', 'ABORT');

const SAVE_TEST_REQUEST = apiType('saveTest', 'REQUEST');
const SAVE_TEST_SUCCESS = apiType('saveTest', 'SUCCESS');
const SAVE_TEST_FAILED = apiType('saveTest', 'FAILED');
const SAVE_TEST_ABORT = apiType('saveTest', 'ABORT');

const UPDATE_LOCATION_FAILED = apiType('updateSelfLocation', 'FAILED');
const SUBMIT_TEST_SUCCESS = apiType('submitTest', 'SUCCESS');
const GET_ACTIVITY_SUCCESS = apiType('getActivity', 'SUCCESS');

const MARKTHREADREAD_SUCCESS = apiType('markThreadRead', 'SUCCESS');
const GET_THREADS_SUCCESS = apiType('getThreads', 'SUCCESS');

const GET_ACTIVITY_REQUEST = apiType('getActivity', 'REQUEST');

const localAuth = window.localStorage.auth;

const initialState = Immutable.fromJS({
  auth: localAuth ? JSON.parse(localAuth) : null,
  profile: {
    interests: [],
    purposes: [],
    photos: [],
    genderChoices: [],
  },
  test: [],
  isLoggedIn: false,
  signupComplete: false,
  shouldReset: false,
  loginBusy: false,
  loginError: null,
  updateSelfBusy: false,
  updateSelfError: null,
  saveTestBusy: false,
  saveTestError: null,
  locationError: false,
  totalNewMessages: 0,
  unreadMessagesCount: 0,
  newNudges: 0,
});


function parseTest(questions) {
  let test = new Immutable.List();
  questions.forEach((question) => {
    test = test.push(new Immutable.Map({
      questionId: question.questionId,
      answerId: question.answerId,
      categoryId: question.categoryId,
    }));
  });
  return test;
}

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case LOGOUT_SUCCESS: {
      window.localStorage.clear();
      window.localStorage.setItem('login-returning', true);
      return initialState.merge({
        shouldReset: action.shouldReset,
        auth: null,
      });
    }

    case LOGOUT_REQUEST:
      return state.merge({
        logoutBusy: true,
        logoutError: false,
      });

    case LOGOUT_FAILED:
      return state.merge({
        logoutBusy: false,
        logoutError: action.error,
      });

    /* Login */

    case LOGIN_REQUEST: {
      return state.merge({
        loginBusy: true,
        loginError: false,
      });
    }

    case LOGIN_FAILED: {
      delete window.localStorage.auth;
      return initialState.merge({
        loginError: action.error,
        shouldReset: action.error === 'missing_permissions',
      });
    }

    case LOGIN_SUCCESS: {
      window.localStorage.setItem('login-returning', true);
      return state.merge({
        shouldReset: false,
        loginBusy: false,
        isLoggedIn: true,
        signupComplete: state.getIn(['profile', 'interests']).size > 0,
      });
    }

    case GET_AUTH_SUCCESS: {
      const auth = action.auth;
      if (auth) {
        window.localStorage.auth = JSON.stringify(auth);
        return state.set('auth', new Immutable.Map(auth));
      }
      delete window.localStorage.auth;
      return state.set('auth', null);
    }

    case GET_SELF_SUCCESS: {
      /* Parse user's test */
      let test = new Immutable.List();
      if (action.test && _.isArray(action.test.questions)) {
        test = parseTest(action.test.questions);
      }
      return state.merge({
        test,
        profile: action.profile,
        totalNewMessages: action.profile.newNudges + action.profile.unreadMessagesCount,
        unreadMessagesCount: action.profile.unreadMessagesCount,
        newNudges: action.profile.newNudges,
      });
    }

    /* Update user */

    case UPDATE_REQUEST: {
      return state.merge({
        updateSelfBusy: true,
        updateSelfError: false,
      });
    }

    case UPDATE_FAILED: {
      return state.merge({
        updateSelfBusy: false,
        updateSelfError: action.error,
      });
    }

    case UPDATE_SUCCESS: {
      const profile = state.get('profile').merge(action.response.profile);
      return state.merge({
        profile,
        updateSelfBusy: false,
        signupComplete: profile.getIn(['interests']).size > 0,
      });
    }

    case UPDATE_ABORT: {
      return state.merge({
        updateSelfBusy: false,
        updateSelfError: false,
      });
    }

    /* Update test */

    case SAVE_TEST_REQUEST: {
      return state.merge({
        saveTestBusy: true,
        saveTestError: false,
      });
    }

    case SAVE_TEST_FAILED: {
      return state.merge({
        saveTestBusy: false,
        saveTestError: action.error,
      });
    }

    case SAVE_TEST_SUCCESS: {
      const test = parseTest(action.response.test.questions);
      return state.merge({
        test,
        saveTestBusy: false,
      });
    }

    case SAVE_TEST_ABORT: {
      return state.merge({
        saveTestBusy: false,
        saveTestError: false,
      });
    }

    /* Positioning */

    case SET_USER_LOCATION: {
      return state.mergeIn(['profile'], {
        locationLat: action.latitude,
        locationLong: action.longitude,
      });
    }

    case UPDATE_LOCATION_FAILED:
    case SET_USER_LOCATION_FAILED:
      return state.set('locationError', action.error);

    /* Instagram auth */

    case UPDATE_INSTAGRAM_TOKEN: {
      return state.setIn(['profile', 'instagramToken'], action.token);
    }

    case INSTAGRAM_DISCONNECT_SUCCESS: {
      return state.setIn(['profile', 'instagramToken'], null);
    }

    /* Activity */

    case GET_ACTIVITY_SUCCESS: {
      return state.merge({
        newNudges: action.response.newNudges,
        totalNewMessages: action.response.newNudges + state.get('unreadMessagesCount'),
      });
    }

    /* Tests */

    case SUBMIT_TEST_SUCCESS: {
      let output = state.setIn(['profile', 'totalTestsTaken'], action.response.totalTestsTaken);
      output = output.setIn(['profile', 'remainingTests'], action.response.remainingTests);
      return output.merge({
        totalNewMessages: action.response.newNudges + output.get('unreadMessagesCount'),
        newNudges: action.response.newNudges,
      });
    }

    /* Chat threads */

    case MARKTHREADREAD_SUCCESS:
    case GET_THREADS_SUCCESS: {
      return state.merge({
        totalNewMessages: action.response.unreadMessagesCount + state.get('newNudges'),
        unreadMessagesCount: action.response.unreadMessagesCount,
      });
    }

    case MARK_NUDGE_READ: {
      const newNudgeCount = state.get('newNudges') - 1;
      return state.merge({
        newNudges: newNudgeCount,
        totalNewMessages: newNudgeCount + state.get('unreadMessagesCount'),
        refreshActivities: true,
      });
    }

    case GET_ACTIVITY_REQUEST: {
      return state.merge({
        refreshActivities: false,
      });
    }

    default:
      return state;
  }
}
