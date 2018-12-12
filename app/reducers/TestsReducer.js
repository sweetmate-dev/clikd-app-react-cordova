import Immutable from 'immutable';

import { apiType } from '^/actions/ApiActions';
import { LOGOUT_SUCCESS } from '^/actions/UserActions';
import { SET_TEST_ANSWER } from '^/actions/TestActions';

const GET_USER_SUCCESS = apiType('getUser', 'SUCCESS');

const SUBMIT_TEST_REQUEST = apiType('submitTest', 'REQUEST');
const SUBMIT_TEST_FAILED = apiType('submitTest', 'FAILED');
const SUBMIT_TEST_SUCCESS = apiType('submitTest', 'SUCCESS');
const SUBMIT_TEST_ABORT = apiType('submitTest', 'ABORT');

const GET_TEST_RESULT_MESSAGES_REQUEST = apiType('getTestResultMessages', 'REQUEST');
const GET_TEST_RESULT_MESSAGES_SUCCESS = apiType('getTestResultMessages', 'SUCCESS');
const GET_TEST_RESULT_MESSAGES_FAILED = apiType('getTestResultMessages', 'FAILED');
const GET_TEST_RESULT_MESSAGES_ABORT = apiType('getTestResultMessages', 'ABORT');

const initialState = new Immutable.Map();

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case LOGOUT_SUCCESS: {
      return initialState;
    }

    case GET_USER_SUCCESS: {
      const test = action.response.test;
      test.userId = action.args[0];
      return state.set(test.testId, Immutable.fromJS(test));
    }

    case SET_TEST_ANSWER: {
      return state.setIn([action.testId, 'questions', action.questionIndex, 'answerId'], action.answerId);
    }

    case SUBMIT_TEST_REQUEST: {
      const context = action.args[2];
      return state.mergeIn([context.testId], {
        submitTestBusy: true,
        submitTestError: false,
      });
    }

    case SUBMIT_TEST_FAILED: {
      const context = action.args[2];
      return state.mergeIn([context.testId], {
        submitTestBusy: false,
        submitTestError: action.error,
      });
    }

    case SUBMIT_TEST_SUCCESS: {
      const context = action.args[2];
      return state.mergeIn([context.testId], {
        submitTestBusy: false,
      });
    }

    case SUBMIT_TEST_ABORT: {
      const testId = action.args[1];
      return state.mergeIn([testId], {
        submitTestBusy: false,
        submitTestError: false,
      });
    }

    case GET_TEST_RESULT_MESSAGES_REQUEST: {
      return state.merge({
        getTestResultMessagesBusy: true,
        getTestResultMessagesError: false,
      });
    }

    case GET_TEST_RESULT_MESSAGES_FAILED: {
      return state.merge({
        getTestResultMessagesBusy: false,
        getTestResultMessagesError: action.error,
      });
    }

    case GET_TEST_RESULT_MESSAGES_SUCCESS: {
      let output = state;

      action.response.testResultMessages.forEach((testResultMessage) => {
        testResultMessage.messages.forEach((message) => {
          const image = new Image();
          image.src = message.image;
        });

        const score = testResultMessage.score;
        const map = Immutable.fromJS(testResultMessage);

        output = output.mergeIn(['testResultMessages', score], map);
      });

      return output;
    }

    case GET_TEST_RESULT_MESSAGES_ABORT: {
      return state.merge({
        getTestResultMessagesBusy: false,
        getTestResultMessagesError: null,
      });
    }

    default:
      return state;
  }
}
