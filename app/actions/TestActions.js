export const SET_TEST_ANSWER = 'TEST.SET_TEST_ANSWER';

export function setTestAnswer(testId, questionIndex, answerId) {
  return {
    type: SET_TEST_ANSWER,
    testId,
    questionIndex,
    answerId,
  };
}
