import Immutable from 'immutable';
import _ from 'lodash';

import { apiType } from '^/actions/ApiActions';
import { LOGOUT_SUCCESS } from '^/actions/UserActions';
import { INVALIDATE_SEARCH } from '^/actions/SearchActions';

const SEARCH_USERS_REQUEST = apiType('getUsers', 'REQUEST');
const SEARCH_USERS_SUCCESS = apiType('getUsers', 'SUCCESS');
const SEARCH_USERS_FAILED = apiType('getUsers', 'FAILED');
const SEARCH_USERS_ABORT = apiType('getUsers', 'ABORT');

const BLOCK_USER_SUCCESS = apiType('blockUser', 'SUCCESS');

const initialState = Immutable.fromJS({
  searchUsersBusy: false,
  searchUsersError: null,
  searchResultsFetched: false,
  userIds: [],
  nextPage: null,
});

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case LOGOUT_SUCCESS: {
      return initialState;
    }

    case INVALIDATE_SEARCH: {
      return initialState;
    }

    case SEARCH_USERS_REQUEST: {
      return state.merge({
        searchUsersBusy: true,
        searchUsersError: false,
      });
    }

    case SEARCH_USERS_FAILED: {
      return state.merge({
        searchUsersBusy: false,
        searchUsersError: action.error,
      });
    }

    case SEARCH_USERS_SUCCESS: {
      let userIds = state.get('userIds');
      action.response.users.forEach((user) => {
        if (!userIds.includes(user.userId)) userIds = userIds.push(user.userId);
      });
      return state.merge({
        userIds,
        searchResultsFetched: true,
        searchUsersBusy: false,
        nextPage: action.response.info.next,
      });
    }

    case SEARCH_USERS_ABORT: {
      return state.merge({
        searchUsersBusy: false,
      });
    }

    case BLOCK_USER_SUCCESS: {
      const id = action.args[0];
      const userIds = state.get('userIds');
      const index = userIds.indexOf(id);
      if (index !== -1) userIds.delete(index);
      return state.set('userIds', userIds);
    }

    default:
      return state;

  }
}
