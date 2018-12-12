import Immutable from 'immutable';
import _ from 'lodash';

import { apiType, getThreads } from '^/actions/ApiActions';
import { LOGOUT_SUCCESS } from '^/actions/UserActions';
import {
  SET_CONNECTION_STATUS,
  SET_CONNECTING_STATUS,
  GET_MESSAGES_REQUEST,
  GET_MESSAGES_FAILED,
  GET_MESSAGES_SUCCESS,
  ADD_UPDATE_MESSAGE,
  MARK_THREAD_READ,
  SAVE_UNSENT_MESSAGE,
} from '^/actions/ChatActions';

const GET_THREADS_REQUEST = apiType('getThreads', 'REQUEST');
const GET_THREADS_SUCCESS = apiType('getThreads', 'SUCCESS');
const GET_THREADS_FAILED = apiType('getThreads', 'FAILED');
const GET_THREADS_ABORT = apiType('getThreads', 'ABORT');

const SUBMIT_TEST_SUCCESS = apiType('submitTest', 'SUCCESS');
const BLOCK_USER_SUCCESS = apiType('blockUser', 'SUCCESS');

const initialState = Immutable.fromJS({
  connecting: false,
  connected: false,
  getThreadsBusy: false,
  getThreadsError: null,
  threadsFetched: false,
  threadIds: [],
  threads: {},
  messages: {},
  refresh: false,
});

/**
 * Sort threadIds by the date of the last message recieved
 * @param  {Immutable.Map} state
 * @return {Immutable.Map}
 */
function sortThreads(state) {
  const threadIds = state.get('threadIds').sort((a, b) => {
    const dateA = state.getIn(['threads', a, 'lastMessageDate']);
    const dateB = state.getIn(['threads', b, 'lastMessageDate']);
    return dateA < dateB ? 1 : dateA > dateB ? -1 : 0;
  });
  return state.set('threadIds', threadIds);
}

/**
 * Generate a groupId for a timestamp based on the date, excluding time.
 * @param  {String} date
 * @return {String}
 */
function getGroupId(date) {
  return date.toISOString().substr(0, 10);
}

/**
 * Add a message to a thread.  Messages within threads are organised into groups
 * by the date the message was sent.
 * @param {Immutable.Map} state
 * @param {String} threadId
 * @param {Immutable.Map} message
 */
function addOrUpdate(state, threadId, message) {
  let output = state;
  const groupId = getGroupId(message.get('time'));
  const messageId = message.get('id');
  /* Create group if it doesn't exist */
  let groupIds = output.getIn(['threads', threadId, 'groupIds'], new Immutable.List());
  if (!groupIds.includes(groupId)) groupIds = groupIds.push(groupId);
  output = output.setIn(['threads', threadId, 'groupIds'], groupIds);
  /* Add the message id to the group */
  let group = output.getIn(['threads', threadId, 'groups', groupId], new Immutable.List());
  if (!group.includes(messageId)) group = group.push(messageId);
  output = output.setIn(['threads', threadId, 'groups', groupId], group);
  /* Merge message into the state */
  return output.mergeIn(['messages', messageId], message);
}

/**
 * Sorts messages in all groups for a given thread by the date sent.  Also sorts
 * the groupIds in ascending order.
 * @param  {Immutable.Map} state
 * @param  {String} threadId
 * @return {Immutable.Map}
 */
function sortGroups(state, threadId) {
  const groupIds = state.getIn(['threads', threadId, 'groupIds']);
  let output = state;
  if (groupIds) {
    groupIds.forEach((groupId) => {
      const sorted = state.getIn(['threads', threadId, 'groups', groupId]).sort((a, b) => {
        const aTime = state.getIn(['messages', a, 'time']);
        const bTime = state.getIn(['messages', b, 'time']);
        return aTime > bTime ? 1 : aTime > bTime ? -1 : 0;
      });
      output = state.setIn(['threads', threadId, 'groups', groupId], sorted);
    });
    const sortedGroupIds = groupIds.sort();
    output = output.setIn(['threads', threadId, 'groupIds'], sortedGroupIds);
  }
  return output;
}

function updateLatestMessage(state, threadId) {
  const lastGroupId = state.getIn(['threads', threadId, 'groupIds']).last();
  const lastMessageId = state.getIn(['threads', threadId, 'groups', lastGroupId]).last();
  const lastMessage = state.getIn(['messages', lastMessageId]);
  return state.mergeIn(['threads', threadId], {
    lastMessage: lastMessage.get('body'),
    lastMessageDate: lastMessage.get('time'),
    unreadMessagesCount: 1,
  });
}


export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_CONNECTING_STATUS: {
      return state.merge({
        connecting: action.connectingStatus
      });
    }
    
    case SET_CONNECTION_STATUS: {
      return state.merge({
        connected: action.connectionStatus,
        connecting: false,
      });
    }

    case LOGOUT_SUCCESS: {
      return initialState;
    }
 
    case GET_THREADS_REQUEST: {
      return state.merge({
        getThreadsBusy: true,
        getThreadsError: null,
      });
    }

    case GET_THREADS_FAILED: {
      return state.merge({
        getThreadsBusy: false,
        getThreadsError: action.error,
      });
    }

    case GET_THREADS_ABORT: {
      return state.merge({
        getThreadsBusy: false,
        getThreadsError: null,
      });
    }

    case GET_THREADS_SUCCESS: {
      let output = state.merge({ threadsFetched: true, getThreadsBusy: false });
      const ids = [];
      action.response.roster.forEach((item) => {
        const id = item.jid;
        const dateStr = item.lastMessageDate ? item.lastMessageDate.replace(' ', 'T') : null;
        ids.push(id);
        output = output.mergeIn(['threads', id], {
          userId: item.userId,
          lastMessageDate: dateStr ? new Date(dateStr) : null,
          lastMessage: item.lastMessage,
          unreadMessagesCount: item.unreadMessagesCount,
        });
      });
      output = output.set('threadIds', new Immutable.List(ids));
      return sortThreads(output);
    }

    case GET_MESSAGES_REQUEST: {
      return state.mergeIn(['threads', action.threadId], {
        getMessagesBusy: true,
        getMessagesError: false,
      });
    }

    case GET_MESSAGES_FAILED: {
      return state.mergeIn(['threads', action.threadId], {
        getMessagesBusy: false,
        getMessagesError: action.error,
      });
    }

    case GET_MESSAGES_SUCCESS: {
      let output = state.mergeIn(['threads', action.threadId], {
        messagesFetched: true,
        getMessagesBusy: false,
      });
      action.messages.forEach((item) => {
        const message = new Immutable.Map(item);
        output = addOrUpdate(output, action.threadId, message);
      });
      return sortGroups(output, action.threadId);
    }

    case ADD_UPDATE_MESSAGE: {
      const message = new Immutable.Map(action.message);
      let output = addOrUpdate(state, action.threadId, message);
      output = sortGroups(output, action.threadId);
      output = updateLatestMessage(output, action.threadId);
      output = sortThreads(output);
      return output;
    }

    case MARK_THREAD_READ: {
      const threadId = action.threadId;
      return state.mergeIn(['threads', threadId], {
        unreadMessagesCount: 0,
      });
    }

    case SUBMIT_TEST_SUCCESS: {
      let output = state;
      const userId = action.args[0];
      const context = action.args[2];
      // When a successful match is made, create a new thread for this match
      if ([1, 2].indexOf(action.response.matchStatusId) === -1) {
        const threadId = context.threadId;
        output = output.mergeIn(['threads', threadId], { userId });
        let threadIds = state.get('threadIds');
        if (!threadIds.includes(threadId)) threadIds = threadIds.push(threadId);
        output = output.set('threadIds', threadIds);
        output = sortThreads(output);
      }
      return output;
    }

    case BLOCK_USER_SUCCESS: {
      let output = state;
      return output.set('refresh', true).set('threadsFetched', false);
    }

    case SAVE_UNSENT_MESSAGE: {
      const threadId = action.threadId;
      return state.mergeIn(['threads', threadId], {
        unsentMessage: action.message,
      });
    }

    default:
      return state;

  }
}
