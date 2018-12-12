import { showAlert } from '^/actions/AppActions';
import { navigateTo } from '^/actions/NavigationActions';

let store = null;

function noTestsAction() {
  return showAlert({
    title: 'Maximum tests reached',
    message: 'You\'ve taken the maximum number of tests you can take for one day. Try checking back tomorrow.', 
  });
}

export default {
  init(storeObj) {
    store = storeObj;
  },
  /**
   * Convenience method for performing checks before navigating to another
   * users test.
   * @param  {String|Number} userId
   */
  takeTest(userId) {
    let action;
    const state = store.getState();
    const remainingTests = state.user.getIn(['profile', 'remainingTests']);
    if (!remainingTests) {
      action = noTestsAction();
    } else {
      action = navigateTo(`user/${userId}/test/0`);
    }
    store.dispatch(action);
  },

};
