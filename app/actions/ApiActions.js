import { createRequest, isRequestActive, clearRequest, setRequestPromise } from '^/services/Requests';
import Api from '^/services/Api';

export function apiType(method, verb) {
  return `API.${method.toUpperCase()}_${verb}`;
}

/**
 * Action creator for API methods that return a promise. Excutes the API method
 * and triggers {method}_REQUEST, {method}_SUCCESS and {method}_FAILED actions.
 * The returned function evaluates to a unique ID that can be used to terminate the
 * method before it completes.
 * @param  {String} method
 * @return {Function}
 */
function requestActionGenerator(method) {
  if (!Api[method]) {
    throw new Error(`Api method '${method}' is not defined`);
  }
  return (...args) => (dispatch) => {
    const id = createRequest();
    const passed = [...args];
    dispatch({ type: apiType(method, 'REQUEST'), args: passed });
    const promise = Api[method](...args);
    promise.then((response) => {
      if (isRequestActive(id)) {
        dispatch({ type: apiType(method, 'SUCCESS'), response, args: passed });
      }
      return null;
    }).catch((error) => {
      console.error(error);
      if (isRequestActive(id)) {
        dispatch({ type: apiType(method, 'FAILED'), args: passed, error: error.message || true });
      }
      return null;
    }).finally(() => {
      clearRequest(id);
    });
    setRequestPromise(id, promise);
    return id;
  };
}


function abortActionGenerator(method) {
  return (id, ...args) => {
    clearRequest(id);
    return { type: apiType(method, 'ABORT'), args: [...args] };
  };
}


export const updateSelf = requestActionGenerator('updateSelf');
export const abortUpdateSelf = abortActionGenerator('updateSelf');

export const getQuestions = requestActionGenerator('getQuestions');
export const abortGetQuestions = abortActionGenerator('getQuestions');

export const getTestResultMessages = requestActionGenerator('getTestResultMessages');
export const abortGetTestResultMessages = abortActionGenerator('getTestResultMessages');

export const saveTest = requestActionGenerator('saveTest');
export const abortSaveTest = abortActionGenerator('saveTest');

export const getRecommendations = requestActionGenerator('getRecommendations');
export const abortGetRecommendations = abortActionGenerator('getRecommendations');

export const getUser = requestActionGenerator('getUser');
export const abortGetUser = abortActionGenerator('getUser');

export const submitTest = requestActionGenerator('submitTest');
export const abortSubmitTest = abortActionGenerator('submitTest');

export const getThreads = requestActionGenerator('getThreads');
export const abortGetThreads = abortActionGenerator('getThreads');

export const markThreadRead = requestActionGenerator('markThreadRead');
export const abortMarkThreadRead = abortActionGenerator('markThreadRead');

export const getActivity = requestActionGenerator('getActivity');
export const abortGetActivity = abortActionGenerator('getActivity');

export const nudgeUser = requestActionGenerator('nudgeUser');
export const abortNudgeUser = abortActionGenerator('nudgeUser');

export const getNudges = requestActionGenerator('getNudges');
export const abortGetNudges = abortActionGenerator('getNudges');

export const getUsers = requestActionGenerator('getUsers');
export const abortGetUsers = abortActionGenerator('getUsers');

export const blockUser = requestActionGenerator('blockUser');
export const abortBlockUser = abortActionGenerator('blockUser');

export const reportUser = requestActionGenerator('reportUser');
export const abortReportUser = abortActionGenerator('reportUser');

