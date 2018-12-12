import _ from 'lodash';

export const SET_CURRENT_CATEGORY = 'MANAGE_TEST.SET_CURRENT_CATEGORY';

export const INIT_TEST = 'MANAGE_TEST.INIT_TEST';
export const RESET_MANAGE_TEST = 'MANAGE_TEST.RESET_MANAGE_TEST';
export const ADD_UPDATE_TEST = 'MANAGE_TEST.ADD_TO_TEST';
export const REMOVE_FROM_TEST = 'MANAGE_TEST.REMOVE_FROM_TEST';
export const UPDATE_TEST = 'MANAGE_TEST.UPDATE_TEST';

export function initTest(values = []) {
  return {
    type: INIT_TEST,
    values,
  };
}

export function resetManageTest() {
  return {
    type: RESET_MANAGE_TEST,
  };
}

export function updateTest(test) {
  return {
    type: UPDATE_TEST,
    test,
  };
}

export function addOrUpdateTest(questionId, answerId, categoryId) {
  return {
    type: ADD_UPDATE_TEST,
    questionId,
    answerId,
    categoryId
  };
}

export function removeFromTest(questionId) {
  return {
    type: REMOVE_FROM_TEST,
    questionId,
  };
}

export function setCurrentCategory(categoryId) {
  return {
    type: SET_CURRENT_CATEGORY,
    categoryId,
  };
}