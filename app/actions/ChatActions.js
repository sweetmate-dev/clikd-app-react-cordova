import ChatService from '^/services/ChatService';
import Api from '^/services/Api'

export const GET_MESSAGES_REQUEST = 'CHAT.GET_MESSAGES_REQUEST';
export const GET_MESSAGES_FAILED = 'CHAT.GET_MESSAGES_FAILED';
export const GET_MESSAGES_SUCCESS = 'CHAT.GET_MESSAGES_SUCCESS';
export const ADD_UPDATE_MESSAGE = 'CHAT.UPDATE_MESSAGE';
export const SET_CONNECTING_STATUS = 'CHAT.SET_CONNECTING_STATUS';
export const SET_CONNECTION_STATUS = 'CHAT.SET_CONNECTION_STATUS';
export const MARK_THREAD_READ = 'CHAT.MARK_THREAD_READ';
export const SAVE_UNSENT_MESSAGE = 'CHAT.SAVE_UNSENT_MESSAGE'

export function getMessages(threadId) {
  return (dispatch) => {
    dispatch({ type: GET_MESSAGES_REQUEST, threadId });
    ChatService.getSearchHistory(threadId).then((response) => {
      const messages = response.mamResult.items.map((item) => {
        const fwd = item.forwarded;
        const message = fwd.message;
        return {
          id: message.id,
          recipient: message.to.bare,
          body: message.body,
          time: new Date(fwd.delay.stamp),
        };
      });
      
      dispatch({ type: GET_MESSAGES_SUCCESS, threadId, messages });
    }).catch((err) => {
      dispatch({ type: GET_MESSAGES_FAILED, threadId, error: err.message || true });
    });
  };
}

export function addOrUpdateMessage(threadId, messageId, message) {
  return {
    type: ADD_UPDATE_MESSAGE,
    threadId,
    messageId,
    message,
  };
}

export function markThreadRead(threadId) {
  return (dispatch) => {
    dispatch({ type: MARK_THREAD_READ_REQUEST });
    Api.markThreadRead({ threadId: threadId })
      .then(() => {
        dispatch({ type: MARK_THREAD_READ_SUCCESS });
      })
      .catch((error) => {
        dispatch({ type: THREAD_MARK_READ_FAILED, error: error.message || true });
      });
  }
}

export function setConnectingStatus(connectingStatus) {
  return {
    type: SET_CONNECTING_STATUS,
    connectingStatus,
  };
}

export function setConnectionStatus(connectionStatus) {
  return {
    type: SET_CONNECTION_STATUS,
    connectionStatus,
  };
}

export function markRead(threadId) {
  return {
    type: MARK_THREAD_READ,
    threadId,
  };
}

export function saveUnsentMessage(threadId, message) {
  return {
    type: SAVE_UNSENT_MESSAGE,
    threadId,
    message,
  };
}