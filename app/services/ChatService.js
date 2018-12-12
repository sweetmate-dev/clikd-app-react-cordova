import Promise from 'bluebird';

import { addOrUpdateMessage, setConnectionStatus, setConnectingStatus } from '^/actions/ChatActions';
import Api from './Api';
import ChatWorker from '^/workers/ChatWorker';
import { subscribe } from '^/services/Subscriptions';

const MAX_RECONNECT_ATTEMPTS = 200;
const MAX_SEARCH_HISTORY_ATTEMPTS = 5;

let store,
    reconnectAttempts = 0,
    historyAttempts = 0,
    worker,
    workerAlive = false;

function createWorker(reConnect) {
  if (typeof worker == 'object') {
    console.log('*** TERMINATING BAD WORKER ***');
    worker.terminate();
  }
  
  console.log('*** SPAWNING WORKER ***');
  worker = new ChatWorker();
  worker.addEventListener('message', onWorkerMessage);
  workerAlive = true;

  if (reConnect) {
    console.log('*** RECONNECTING ***');
    connect();
  }
}

createWorker();

/**
 * Initiate a connection request.  Returns a promise that resolves when
 * the client indicates a connection has been made.
 * @return {Promise}
 */
function connect(callback) {
  return new Promise((resolve, reject) => {
    const state = store.getState();

    if (state.chat.get('connecting') || !state.app.get('online')) {
      return;
    }

    const jid = state.user.getIn(['profile', 'jid']);
    const password = state.user.getIn(['auth', 'accessToken']);
    store.dispatch(setConnectingStatus(true));

    console.log('connecting start');
    console.time('connecting finished');
    function onConnectionMessage(e){
      console.timeEnd('connecting finished');
      switch (e.data[0]) {
        case 'connected':
          resolve();
          worker.removeEventListener('message', onConnectionMessage);
          if (callback) callback();
          reconnectAttempts = 0;
          break;
        case 'connectionError':
          const state = store.getState();
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS && state.app.get('online')) {
            if (!state.chat.get('connecting')) {
              setTimeout(() => {
                console.time('connecting finished');
                store.dispatch(setConnectingStatus(true));
                worker.postMessage(['connect', jid, password]);
              }, 3000);
              
              reconnectAttempts ++;
            }
            
          } else {
            reject(new Error('Chat connection error'));
            worker.removeEventListener('message', onConnectionMessage);
            reconnectAttempts = 0;
          }
          break;
        default:
          break;
      }
    }
    
    reconnectAttempts ++;
    worker.addEventListener('message', onConnectionMessage);
    worker.postMessage(['connect', jid, password]);
  }).catch((err) => {});
}

/**
 * Send a request to the chat client to disconnect
 */
function disconnect() {
  worker.postMessage(['disconnect']);
}

/**
 * Request the search history for a particular user from the chat client.  Returns
 * a promise that resolves when the history has been received.
 * @param  {String} jid
 * @return {Promise}
 */
function getSearchHistory(jid) {
  return new Promise((resolve, reject) => {
    function onSearchHistoryMessage(e) {
      const type = e.data[0];
      const response = e.data[1];
      switch(type) {
        case 'getSearchHistorySuccess':
          resolve(response);
          worker.removeEventListener('message', onSearchHistoryMessage);
          historyAttempts = 0;
          break;
        case 'getSearchHistoryFailed':
          const state = store.getState();
          if (historyAttempts < MAX_SEARCH_HISTORY_ATTEMPTS && state.app.get('online')) {
            worker.postMessage(['getSearchHistory', jid]);
            historyAttempts ++;
          } else {
            reject(new Error('Search history error'));
            worker.removeEventListener('message', onSearchHistoryMessage);
            historyAttempts = 0;
            store.dispatch(setConnectionStatus(false));
          }
          break;
        default:
          break;
      }
    }
  
    historyAttempts ++;
    worker.addEventListener('message', onSearchHistoryMessage);
    worker.postMessage(['getSearchHistory', jid]);
  });
}

function sendMessage(jid, body) {
  const state = store.getState();
  
  // if not connected, try and connect first and then send message
  if (!state.chat.get('connected')) {
    connect(() => {
      worker.postMessage(['sendMessage', jid, body]);
    });
    return;
  }
  
  worker.postMessage(['sendMessage', jid, body]);
}


/**
 * Delegate events coming from the chat client
 * @param  {Object} e 
 */
function onWorkerMessage(e) {
  const type = e.data[0];
  const args = e.data.slice(1);
  // console.log('message received from worker: ' + type, args);
  switch(type) {
    case 'messageReceived':
      onMessageReceived(...args);
      break;
    case 'messageSent':
      onMessageSent(...args);
      break;
    case 'connected':
      onConnected();
      break;
    case 'connectionError':
      onConnectionError();
      break;
    case 'disconnected':
      onDisconnected();
      break;
    case 'pong':
      workerAlive = true;
      break;
    default: 
      break;
  }
}


function onMessageReceived(message) {
  const state = store.getState();
  const threadId = message.from.bare;
  const action = addOrUpdateMessage(threadId, message.id, {
    id: message.id,
    body: message.body,
    recipient: message.to.bare,
    time: new Date(),
  }, true);
  store.dispatch(action);

  // send notification to self if app is in background
  if (state.app.get('inBackground')) {
      Api.sendChatNotificationToSelf(message);
  }
}

function onMessageSent(message) {
  const threadId = message.to.bare;
  const action = addOrUpdateMessage(threadId, message.id, {
    id: message.id,
    body: message.body,
    recipient: threadId,
    time: new Date(),
  });
  store.dispatch(action);
}

function onDisconnected() {
  const state = store.getState();
  store.dispatch(setConnectionStatus(false));

  // Attempt to reconnect
  connect();
}

function onConnected() {
  const state = store.getState();
  store.dispatch(setConnectionStatus(true));
  reconnectAttempts = 0;
}

function onConnectionError() {
  const state = store.getState();
  store.dispatch(setConnectionStatus(false));
}

function ping() {
  // console.log('sending ping to chat worker');
  worker.postMessage(['ping']);  
  workerAlive = false;
  setTimeout(() => {
    if (!workerAlive) {
      console.log('*** CHAT WORKER NOT RESPONDING ***');
      store.dispatch(setConnectionStatus(false));
      createWorker(true);
    }
  }, 500);
}

export default {

  connect,
  disconnect,
  getSearchHistory,
  sendMessage,
  ping,

  init(storeObj) {
    store = storeObj;
    // Disconnect on logout
    subscribe('user', ['isLoggedIn'], (oldValue, newValue) => {
      if (oldValue && !newValue) {
        disconnect();
      }
    });
  },

};
