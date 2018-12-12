import Immutable from 'immutable';
import _ from 'lodash';

import {
   UPDATE_VALUE,
   INIT_FORM,
   DESTROY_FORM,
   ADD_REMOVE_VALUE,
   PUSH_VALUE,
   TOGGLE_VALUE,
 } from '^/actions/FormActions';
import { LOGOUT_SUCCESS } from '^/actions/UserActions';

const initialState = new Immutable.Map({});

export default function (state = initialState, action) {
  switch (action.type) {

    case LOGOUT_SUCCESS: {
      return initialState;
    }

    case INIT_FORM: {
      return state.set(action.formName, new Immutable.Map({
        fields: new Immutable.Map(action.values),
      }));
    }

    case UPDATE_VALUE: {
      return state.setIn([action.formName, 'fields', action.field], action.value);
    }

    case ADD_REMOVE_VALUE: {
      let value = state.getIn([action.formName, 'fields', action.field]);
      value = [].concat(value);
      const index = value.indexOf(action.value);
      if (index === -1) value.push(action.value);
      else value.splice(index, 1);
      return state.setIn([action.formName, 'fields', action.field], value);
    }

    case TOGGLE_VALUE: {
      let value = state.getIn([action.formName, 'fields', action.field]);
      value = value === action.value ? null : action.value;
      return state.setIn([action.formName, 'fields', action.field], value);
    }

    case PUSH_VALUE: {
      // Add a value to a list
      let value = state.getIn([action.formName, 'fields', action.field]);
      value = [].concat(value);
      value.push(action.value);
      return state.setIn([action.formName, 'fields', action.field], value);
    }

    case DESTROY_FORM:
      return state.delete(action.formName);

  }

  return state;
}
