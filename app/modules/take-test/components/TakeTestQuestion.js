import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import bem from 'react-bem-classes';

import { submitTest, abortSubmitTest } from '^/actions/ApiActions';
import { toggleLoader, showAlert } from '^/actions/AppActions';
import { setTestAnswer } from '^/actions/TestActions';
import { navigateTo, navigateBack, navigateBackTo } from '^/actions/NavigationActions';
import TestQuestion from '^/components/questions/TestQuestion';
import { MAX_TEST_QUESTIONS } from '^/constants/Settings';
import { GENERIC_ERROR_MESSAGE, GENERIC_ERROR_TITLE } from '^/constants/Messages';
import Icon from '^/components/icons/Icon';
import IconNudge from '^/assets/icons/nudge.svg';

import './TakeTestQuestion.scss';

function mapStateToProps(state, ownProps) {
  const params = ownProps.params;
  const index = Number(params.questionIndex);
  const userId = Number(params.userId);
  const testId = state.users.getIn([userId, 'testId']);
  const user = state.users.get(userId);
  const profile = user.get('profile');
  return {
    userId,
    testId,
    profile,
    question: state.tests.getIn([testId, 'questions', index]).toJS(),
    submitTestBusy: state.tests.getIn([testId, 'submitTestBusy']),
    submitTestError: state.tests.getIn([testId, 'submitTestError']),
    matchStatusId: state.users.getIn([userId, 'profile', 'matchStatusId']),
    score: state.users.getIn([userId, 'profile', 'score']),
    userName: state.users.getIn([userId, 'profile', 'name']),
    testResultMessages: state.tests.get('testResultMessages'),
  };
}

@connect(mapStateToProps, { toggleLoader, setTestAnswer, navigateTo, navigateBackTo, submitTest, abortSubmitTest, showAlert })
@bem({ block: 'take-test-question' })
class TakeTestQuestion extends Component {

  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  };

  static propTypes = {
    question: PropTypes.shape({
      answerId: PropTypes.number,
      questions: PropTypes.array,
      question: PropTypes.string,
    }),
    userId: PropTypes.number,
    userName: PropTypes.string,
    profile: PropTypes.instanceOf(Immutable.Map).isRequired,
    navigateBackTo: PropTypes.func,
    navigateTo: PropTypes.func,
    setTestAnswer: PropTypes.func,
    submitTest: PropTypes.func,
    abortSubmitTest: PropTypes.func,
    toggleLoader: PropTypes.func,
    params: PropTypes.shape({
      userId: PropTypes.string,
      questionIndex: PropTypes.string,
    }),
    showAlert: PropTypes.func.isRequired,
    testResultMessages: PropTypes.instanceOf(Immutable.Map).isRequired,
  }

  state = {
    referrer: null,
  };

  componentWillReceiveProps(newProps){
    if (newProps.submitTestBusy !== this.props.submitTestBusy) {
      this.props.toggleLoader(newProps.submitTestBusy);
    }
    if (!this.props.submitTestError && newProps.submitTestError) {
      this.onSubmitError();
    }
    if (this.props.matchStatusId !== newProps.matchStatusId) {
      this.onSubmitSuccess(newProps.matchStatusId, newProps.score);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    if (this.reqId) this.props.abortSubmitTest(this.reqId, this.props.testId);
  }

  componentWillMount() {
    const state = this.context.store.getState();
    const history = state.navigation.get('history');
    const numBack = (history.get(history.size - 2).get('route') === `/user/${this.props.userId}`) ? 3 : 2;
    const previousRoute = history.get(history.size - numBack).get('route');
    this.state.referrer = previousRoute;
  }

  onSelect = (answerId) => {
    const params = this.props.params;
    const index = Number(params.questionIndex);
    const testId = this.props.testId;
    this.props.setTestAnswer(testId, index, answerId);
    this.timeout = setTimeout(() => {
      const nextQuestion = index + 1;
      if (nextQuestion < MAX_TEST_QUESTIONS) {
        this.props.navigateTo(`user/${this.props.userId}/test/${nextQuestion}`);
      } else {
        this.submit();
      }
    }, 400);
  };

  onSubmitSuccess(matchStatusId, score) {
    const state = this.context.store.getState();
    if (!window.localStorage.getItem('intro-no-test')
        && state.user.getIn(['profile', 'totalTestsTaken']) > 1
        && !state.user.get('test').size
    ) {
      this.props.showAlert({
        title: 'Test complete',
        message: 'You only click with someone when you’ve both ' +
          'passed each other’s test, so why not set yours up now?',
        buttons: [{
          label: 'Set-up test',
          callback: () => {
            this.props.navigateTo(`/home/manage-test/categories`, {clearFrom: this.state.referrer});
          }
        }/*, {
          label: 'Keep looking',
          callback: () => {
            this.props.navigateTo(`user/${this.props.userId}`, {clearFrom: this.state.referrer});
          }
        }*/]
      });

      window.localStorage.setItem('intro-no-test', true);

      return;
    }

    let testResultMessages = this.props.testResultMessages.getIn([score, 'messages']).toJS();
    let testResultMessageItem = testResultMessages[Math.floor(Math.random() * testResultMessages.length)];
    testResultMessageItem.cssClass = 'test-result';

    // first person to take test
    if (matchStatusId == 1) {
      this.props.showAlert(testResultMessageItem);
      this.props.navigateTo(`user/${this.props.userId}`, {clearFrom: this.state.referrer});

    // second person to take test
    } else {
      switch (matchStatusId) {
        case 2:
          this.props.showAlert(testResultMessageItem);
          this.props.navigateTo(`user/${this.props.userId}`, {clearFrom: this.state.referrer});
          break;
        case 3:
        case 4:
          this.props.navigateTo(`user/${this.props.userId}/test/result`, {clearFrom: this.state.referrer});
          break;
      }
    }
  }

  onSubmitError() {
    this.props.showAlert({ title: GENERIC_ERROR_TITLE, message: GENERIC_ERROR_MESSAGE });
  }

  submit() {
    const state = this.context.store.getState();
    const testId = this.props.testId;
    const userId = state.tests.getIn([testId, 'userId']);
    const threadId = state.users.getIn([userId, 'profile', 'jid']);
    const questions = state.tests.getIn([testId, 'questions']).toJS();
    const data = {
      testId,
      answers: questions.map(({ questionId, answerId }) => ({ questionId, answerId })),
    };
    this.reqId = this.props.submitTest(userId, data, { testId, threadId });
  }

  render() {
    const question = this.props.question;
    return (
      <TestQuestion
        className={this.block()}
        value={question.answerId}
        onSelect={this.onSelect}
        answers={question.answers}
        question={question.question}
        key={question.questionId}
      />
    );
  }

}

export default TakeTestQuestion;
