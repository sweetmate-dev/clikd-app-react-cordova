import { subscribe } from '^/services/Subscriptions';
import { getRecommendations, abortGetRecommendations } from '^/actions/ApiActions';
import { getRequestPromise } from '^/services/Requests';

const RECOMMENDATIONS_POLL_INTERVAL = 5 * 60 * 1000;

let store;
let timeout;
let requestId;
let polling = false;
let dataReceived = false;

function makeRequest() {
  const method = getRecommendations();
  requestId = method(store.dispatch);
  const promise = getRequestPromise(requestId);
  promise.then(() => { dataReceived = true; });
  return promise;
}

function poll(defer) {
  clearTimeout(timeout);
  if (defer) {
    timeout = setTimeout(poll, RECOMMENDATIONS_POLL_INTERVAL);
  } else {
    makeRequest().finally(() => {
      if (polling) timeout = setTimeout(poll, RECOMMENDATIONS_POLL_INTERVAL);
    });
  }
}

export default {

  init(storeObj) {
    store = storeObj;
    subscribe('user', ['signupComplete'], (oldValue, newValue) => {
      if (!oldValue && newValue) {
        this.startPolling();
      } else if (!newValue) {
        this.stopPolling();
      }
    });
  },

  startPolling() {
    if (polling) return false;
    polling = true;
    poll(dataReceived);
    return true;
  },

  stopPolling() {
    dataReceived = false;
    polling = false;
    abortGetRecommendations(requestId);
    clearTimeout(timeout);
  },

  getRecommendations() {
    return makeRequest();
  }

};