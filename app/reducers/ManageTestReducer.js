import Immutable from 'immutable';
import _ from 'lodash';

import { apiType } from '^/actions/ApiActions';
import { LOGOUT_SUCCESS, GET_SELF_SUCCESS } from '^/actions/UserActions';
import {
  SET_CURRENT_CATEGORY,
  INIT_TEST,
  RESET_MANAGE_TEST,
  ADD_UPDATE_TEST,
  REMOVE_FROM_TEST,
  UPDATE_TEST,
} from '^/actions/ManageTestActions';

const GET_QUESTIONS_REQUEST = apiType('getQuestions', 'REQUEST');
const GET_QUESTIONS_SUCCESS = apiType('getQuestions', 'SUCCESS');
const GET_QUESTIONS_FAILED = apiType('getQuestions', 'FAILED');
const GET_QUESTIONS_ABORT = apiType('getQuestions', 'ABORT');

const initialState = Immutable.fromJS({
  test: [],
  currentCategory: null,
  categoriesFetched: false,
  questions: {},
  categories: {},
  categoryIds: [],
});

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case LOGOUT_SUCCESS: {
      return initialState;
    }

    case INIT_TEST: {
      const test = Immutable.fromJS(action.values);
      return state.set('test', test);
    }

    case RESET_MANAGE_TEST: {
      return state.merge({
        test: new Immutable.List(),
        currentCategory: null,
      });
    }

    case GET_SELF_SUCCESS: {
      let output = state;
      if (action.test && _.isArray(action.test.questions)) {
        action.test.questions.forEach((question) => {
          question.categories = [question.categoryId];
          const map = Immutable.fromJS(question);
          output = output.mergeIn(['questions', question.questionId], map);
        });
      }
      return output;
    }

    case ADD_UPDATE_TEST: {
      let test = state.get('test');
      const index = test.findIndex(q => q.get('questionId') === action.questionId);
      if (index !== -1) {
        const question = test.get(index).merge({
          answerId: action.answerId,
          questionId: action.questionId,
        });
        test = test.set(index, question);
      } else {
        test = test.push(new Immutable.Map({
          answerId: action.answerId,
          questionId: action.questionId,
          categoryId: action.categoryId,
        }));
      }
      return state.set('test', test);
    }

    case REMOVE_FROM_TEST: {
      let test = state.get('test');
      const index = test.findIndex(q => q.get('questionId') === action.questionId);
      if (index !== -1) test = test.delete(index);
      return state.set('test', test);
    }

    case UPDATE_TEST: {
      return state.set('test', action.test);
    }

    case SET_CURRENT_CATEGORY: {
      return state.set('currentCategory', action.categoryId);
    }

    case GET_QUESTIONS_REQUEST: {
      return state.merge({
        getQuestionsBusy: true,
        getQuestionsError: false,
      });
    }

    case GET_QUESTIONS_FAILED: {
      return state.merge({
        getQuestionsBusy: false,
        getQuestionsError: action.error,
      });
    }

    case GET_QUESTIONS_SUCCESS: {
      let output = state;
      let categoryIds = new Immutable.List();

      action.response.categories.forEach((category) => {
        const categoryId = category.categoryId;
        categoryIds = categoryIds.push(categoryId);
        const image = new Image();
        image.src = category.url;
        output = output.mergeIn(['categories', categoryId], category);
      });

      output = output.set('categoryIds', categoryIds);
      output = output.set('categoriesFetched', true);

      action.response.questions.forEach((question) => {
        const questionId = question.questionId;
        const map = Immutable.fromJS(question);

        map.get('answers').forEach((answer) => {
          const image = new Image();
          image.src = answer.get('300x225');
        });

        output = output.mergeIn(['questions', questionId], map);
      });

      return output;
    }

    case GET_QUESTIONS_ABORT: {
      return state.merge({
        getQuestionsBusy: false,
        getQuestionsError: null,
      });
    }

    default:
      return state;
  }
}
