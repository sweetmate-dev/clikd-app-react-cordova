import Immutable from 'immutable';
import _ from 'lodash';

import { apiType } from '^/actions/ApiActions';
import { LOGOUT_SUCCESS } from '^/actions/UserActions';

const SEARCH_USERS_SUCCESS = apiType('getUsers', 'SUCCESS');
const GET_ACTIVITY_SUCCESS = apiType('getActivity', 'SUCCESS');
const GET_RECOMMENDATIONS_SUCCESS = apiType('getRecommendations', 'SUCCESS');
const SUBMIT_TEST_SUCCESS = apiType('submitTest', 'SUCCESS');
const GET_THREADS_SUCCESS = apiType('getThreads', 'SUCCESS');

const GET_USER_REQUEST = apiType('getUser', 'REQUEST');
const GET_USER_SUCCESS = apiType('getUser', 'SUCCESS');
const GET_USER_FAILED = apiType('getUser', 'FAILED');
const GET_USER_ABORT = apiType('getUser', 'ABORT');

const NUDGE_USER_REQUEST = apiType('nudgeUser', 'REQUEST');
const NUDGE_USER_SUCCESS = apiType('nudgeUser', 'SUCCESS');
const NUDGE_USER_FAILED = apiType('nudgeUser', 'FAILED');
const NUDGE_USER_ABORT = apiType('nudgeUser', 'ABORT');

const BLOCK_USER_REQUEST = apiType('blockUser', 'REQUEST');
const BLOCK_USER_SUCCESS = apiType('blockUser', 'SUCCESS');
const BLOCK_USER_FAILED = apiType('blockUser', 'FAILED');
const BLOCK_USER_ABORT = apiType('blockUser', 'ABORT');

const REPORT_USER_REQUEST = apiType('reportUser', 'REQUEST');
const REPORT_USER_SUCCESS = apiType('reportUser', 'SUCCESS');
const REPORT_USER_FAILED = apiType('reportUser', 'FAILED');
const REPORT_USER_ABORT = apiType('reportUser', 'ABORT');

const initialState = new Immutable.Map();

function merger(prev, next) {
  if (prev instanceof Immutable.List) return next;
  if (prev instanceof Immutable.Map) return prev.mergeWith(merger, next);
  return next;
}

/**
 * Create or update the profile for a given user with new values
 * @param  {Immutable.Map} state
 * @param  {Number} userId
 * @param  {Object} newData
 * @return {Immutable.Map}
 */
export function addOrUpdateProfile(state, userId, newData) {
  const profile = state.getIn([userId, 'profile']);
  const newProfile = profile ? profile.mergeWith(merger, newData) : Immutable.fromJS(newData);
  return state.setIn([userId, 'profile'], newProfile);
}

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case LOGOUT_SUCCESS: {
      return initialState;
    }

    case GET_ACTIVITY_SUCCESS: {
      const users = action.response.activity;
      let newState = state;
      users.forEach((user) => {
        const userId = user.userId;
        // Update profile specific data
        const profileData = _.pick(user, ['userId', 'profilePhoto', 'name', 'tagLine', 'nudges', 'matchStatusId']);
        newState = addOrUpdateProfile(newState, userId, profileData);
      });
      return newState;
    }

    case GET_RECOMMENDATIONS_SUCCESS: {
      const recommendations = action.response.recommendations;
      let newState = state;
      recommendations.forEach((recommendation) => {
        const userId = recommendation.userId;
        newState = addOrUpdateProfile(newState, userId, recommendation);
      });
      return newState;
    }

    case SEARCH_USERS_SUCCESS: {
      const users = action.response.users;
      let newState = state;
      users.forEach((user) => {
        const userId = user.userId;
        newState = addOrUpdateProfile(newState, userId, user);
      });
      return newState;
    }

    case GET_THREADS_SUCCESS: {
      const roster = action.response.roster;
      let newState = state;
      roster.forEach((item) => {
        const userId = item.userId;
        newState = addOrUpdateProfile(newState, userId, item);
      });
      return newState;
    }

    case SUBMIT_TEST_SUCCESS: {
      const id = action.args[0];
      let output = state.setIn([id, 'testDate'], new Date());
      output = output.setIn([id, 'profile', 'matchStatusId'], action.response.matchStatusId);
      return output.setIn([id, 'profile', 'score'], action.response.score);
    }

    case GET_USER_REQUEST: {
      const id = action.args[0];
      return state.mergeIn([id], {
        getProfileBusy: true,
        getProfileError: false,
      });
    }

    case GET_USER_FAILED: {
      const id = action.args[0];
      return state.mergeIn([id], {
        getProfileBusy: false,
        getProfileError: action.error,
      });
    }

    case GET_USER_SUCCESS: {
      const id = action.args[0];
      const newState = addOrUpdateProfile(state, id, action.response.profile);
      const test = action.response.test;
      return newState.mergeIn([id], {
        testId: test ? test.testId : null,
        getProfileBusy: false,
        fullProfileFetched: true,
      });
    }

    case GET_USER_ABORT: {
      const id = action.args[0];
      return state.mergeIn([id], {
        getProfileBusy: false,
      });
    }

    case NUDGE_USER_REQUEST: {
      const id = action.args[0];
      return state.mergeIn([id], {
        nudgeBusy: true,
        nudgeError: false,
      });
    }

    case NUDGE_USER_FAILED: {
      const id = action.args[0];
      return state.mergeIn([id], {
        nudgeBusy: false,
        nudgeError: action.error,
      });
    }

    case NUDGE_USER_SUCCESS: {
      const id = action.args[0];
      const nudges = state.getIn([id, 'profile', 'nudges'], 0);
      let output = state.setIn([id, 'nudgeBusy'], false);
      output = output.setIn([id, 'profile', 'nudges'], nudges + 1);
      return output;
    }

    case NUDGE_USER_ABORT: {
      const id = action.args[0];
      return state.setIn([id], 'nudgeBusy', false);
    }

    case BLOCK_USER_REQUEST: {
      const id = action.args[0];
      return state.mergeIn([id], {
        blockBusy: true,
        blockError: false,
      });
    }

    case BLOCK_USER_FAILED: {
      const id = action.args[0];
      return state.mergeIn([id], {
        blockBusy: false,
        blockError: action.error,
      });
    }

    case BLOCK_USER_SUCCESS: {
      const id = action.args[0];
      return state.mergeIn([id], {
        blockBusy: false,
      });
    }

    case BLOCK_USER_ABORT: {
      const id = action.args[0];
      return state.setIn([id], 'blockBusy', false);
    }

    case REPORT_USER_REQUEST: {
      const id = action.args[0];
      return state.mergeIn([id], {
        reportBusy: true,
        reportError: false,
      });
    }

    case REPORT_USER_FAILED: {
      const id = action.args[0];
      return state.mergeIn([id], {
        reportBusy: false,
        reportError: action.error,
      });
    }

    case REPORT_USER_SUCCESS: {
      const id = action.args[0];
      return state.mergeIn([id], {
        reportBusy: false,
      });
    }

    case REPORT_USER_ABORT: {
      const id = action.args[0];
      return state.setIn([id], 'reportBusy', false);
    }

    default:
      return state;

  }
}
