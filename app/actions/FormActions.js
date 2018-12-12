/*
 * action types
 */

export const INIT_FORM = 'FORM.INIT_FORM';
export const DESTROY_FORM = 'FORM.DESTROY_FORM';
export const UPDATE_VALUE = 'FORM.UPDATE_VALUE';
export const UPDATE_VALIDATION = 'FORM.UPDATE_VALIDATION';
export const ADD_REMOVE_VALUE = 'FORM.ADD_REMOVE_VALUE';
export const PUSH_VALUE = 'FORM.PUSH_VALUE';
export const TOGGLE_VALUE = 'FORM.TOGGLE_VALUE';


/*
 * action creators
 */

export function initForm(formName, values = {}, validation = {}) {
  return {
    type: INIT_FORM,
    formName,
    values,
    validation,
  };
}

export function destroyForm(formName) {
  return {
    type: DESTROY_FORM,
    formName,
  };
}

export function updateValue(formName, field, value) {
  return {
    type: UPDATE_VALUE,
    formName,
    field,
    value,
  };
}

export function addOrRemoveValue(formName, field, value) {
  return {
    type: ADD_REMOVE_VALUE,
    formName,
    field,
    value,
  };
}

export function toggleValue(formName, field, value) {
  return {
    type: TOGGLE_VALUE,
    formName,
    field,
    value,
  };
}

export function pushValue(formName, field, value){
  return {
    type: PUSH_VALUE,
    formName,
    field,
    value,
  };
}

export function updateValidation(formName, field, message) {
  return {
    type: UPDATE_VALIDATION,
    formName,
    field,
    message,
  };
}
