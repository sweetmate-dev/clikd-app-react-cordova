import ChatService from '^/services/ChatService';
import BranchService from '^/services/BranchService';
import { goOffline, goOnline, goIntoBackground, goIntoForeground } from '^/actions/AppActions';

let store;

function onDisconnect() {
    store.dispatch(goOffline());
};

function onReconnect() {
    const state = store.getState();
    if (!state.app.get('online')) {
     // ChatService.connect();
      store.dispatch(goOnline());
    }
};

function onPause() {
    const state = store.getState();
    store.dispatch(goIntoBackground());
    if (state.user.get('isLoggedIn')) {
      //ChatService.disconnect();
    }
};

function onResume(checkChat) {
    const state = store.getState();
    store.dispatch(goIntoForeground());
    if (state.user.get('isLoggedIn') && checkChat) {
      ChatService.ping();
    }

    console.log("onResume");
    BranchService.init(store);
};

const AppService = {
  init(storeObj) {
    store = storeObj;

    // set initial networkState
    if (navigator.connection.type !== Connection.NONE) {
        store.dispatch(goOnline());
    };

    document.addEventListener('offline', onDisconnect, false);
    document.addEventListener('online', onReconnect, false);
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resign", onPause, false);
    document.addEventListener("resume", () => { onResume(true); }, false);
    document.addEventListener("active", () => { onResume(); }, false);
  },
};

export default AppService;