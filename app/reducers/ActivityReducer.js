import Immutable from 'immutable';
import _ from 'lodash';

import { apiType } from '^/actions/ApiActions';
import { LOGOUT_SUCCESS, MARK_NUDGE_READ } from '^/actions/UserActions';

const GET_ACTIVITY_REQUEST = apiType('getActivity', 'REQUEST');
const GET_ACTIVITY_SUCCESS = apiType('getActivity', 'SUCCESS');
const GET_ACTIVITY_FAILED = apiType('getActivity', 'FAILED');
const GET_ACTIVITY_ABORT = apiType('getActivity', 'ABORT');

const SUBMIT_TEST_SUCCESS = apiType('submitTest', 'SUCCESS');
const BLOCK_USER_SUCCESS = apiType('blockUser', 'SUCCESS');

const GET_USER_REQUEST = apiType('getUser', 'REQUEST');

const initialState = Immutable.fromJS({
  getActivityBusy: false,
  getActivityError: null,
  activityFetched: false,
  activity: [],
});


export default function reducer(state = initialState, action) {
  switch (action.type) {

    case LOGOUT_SUCCESS: {
      return initialState;
    }
  
    case GET_ACTIVITY_REQUEST: {
      return state.merge({
        getActivityBusy: true,
        getActivityError: null,
      });
    }

    case GET_ACTIVITY_FAILED: {
      return state.merge({
        getActivityBusy: false,
        getActivityError: action.error,
      });
    }

    case GET_ACTIVITY_SUCCESS: {
      const activity = action.response.activity.map((item) => {
        const data = _.pick(item, ['userId', 'date', 'activity', 'activityRead'])
        data.date = new Date(data.date);
        return data;
      });
      return state.merge({
        getActivityBusy: false,
        activityFetched: true,
        activity: Immutable.fromJS(activity),
      });
    }

    case GET_ACTIVITY_ABORT: {
      return state.merge({
        getActivityBusy: false,
        getActivityError: null,
      });
    }

    /* Perform an optimistic update when a test has been submitted to add the
    user to the activity feed if the matchStatus is pending */
    case SUBMIT_TEST_SUCCESS: {
      let output = state;
      const userId = action.args[0];
      const activity = state.get('activity');
      const index = activity.findIndex(item => item.get('userId') === userId);
      if (action.response.matchStatusId === 1) {
        const item = new Immutable.Map({
          activity: 'testTaken',
          date: new Date(),
          userId: userId,
        });
        if (index === -1) output = output.set('activity', activity.push(item));
        else output = output.set('activity', activity.set(1, activity));
      } else if(index !== -1){
        /* If it's a match remove completely */
        output = output.set('activity', activity.delete(index));
      }
      return output;
    }

    case BLOCK_USER_SUCCESS: {
      let output = state;
      const userId = action.args[0];
      const activity = state.get('activity');
      const index = activity.findIndex(item => item.get('userId') === userId);
      if (index !== -1) output = output.set('activity', activity.delete(index));
      return output;
    }

    case MARK_NUDGE_READ: {
      return state.merge({
        navigateToUserId: action.userId,
      });
    }

    case GET_USER_REQUEST: {
      return state.merge({
        navigateToUserId: null,
      });
    }

    default:
      return state;

  }
}
