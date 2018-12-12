import { navigateBack } from '^/actions/NavigationActions';

let store;

function onBackButtonPress(e) {
  e.preventDefault();
  const state = store.getState();
  if (!state.navigation.get('history').size || state.navigation.get('history').size == 1) {
    navigator.app.exitApp();
  } else {
    const action = navigateBack('/');
    store.dispatch(action);
  }
}

export default {
  init(storeObj) {
    store = storeObj;
    document.addEventListener('backbutton', onBackButtonPress, false);
  },

};
