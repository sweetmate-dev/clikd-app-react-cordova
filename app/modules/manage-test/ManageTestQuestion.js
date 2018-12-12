import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import { showAlert, toggleLoader } from '^/actions/AppActions';
import { addOrUpdateTest, removeFromTest } from '^/actions/ManageTestActions';
import { navigateBackTo } from '^/actions/NavigationActions';
import { Screen, Content } from '^/components/layout';
import { TitleBar, Title, BackButton } from '^/components/navigation';
import TestQuestion from '^/components/questions/TestQuestion';
import { GENERIC_ERROR_MESSAGE, GENERIC_ERROR_TITLE } from '^/constants/Messages';
import { saveTest } from '^/actions/ApiActions';
import { MAX_TEST_QUESTIONS } from '^/constants/Settings';

import './ManageTestQuestion.scss';

function mapStateToProps(state, ownProps) {
  const questionId = Number(ownProps.params.questionId);
  const question = state.manageTest.getIn(['questions', questionId]);
  return {
    saveTestBusy: state.user.get('saveTestBusy'),
    saveTestError: state.user.get('saveTestError'),
    questionId,
    answers: question.get('answers').toJS(),
    question: question.get('question'),
    categoryId: question.getIn(['categories', 0]),
    test: state.manageTest.get('test').map((question) => {
      const id = question.get('questionId');
      return state.manageTest.getIn(['questions', id]).merge(question);
    }),
  };
}

@connect(mapStateToProps, {
  addOrUpdateTest, removeFromTest, showAlert, saveTest, navigateBackTo, toggleLoader
})
@bem({ block: 'manage-test-question-screen' })
class ManageTestQuestion extends Component {

  constructor(props, context) {
    super(props);
    /* Initialize with the current value of this question if it's already been set */
    const state = context.store.getState();
    const question = state.manageTest.get('test').find(q => q.get('questionId') === props.questionId);
    this.state = {
      answerId: question ? question.get('answerId') : null,
    };
  }

  static propTypes = {
    params: PropTypes.shape({
      questionId: PropTypes.string.isRequired,
    }).isRequired,
    test: PropTypes.instanceOf(Immutable.List).isRequired,
    questionId: PropTypes.number,
    question: PropTypes.string.isRequired,
    answers: PropTypes.array.isRequired,
    addOrUpdateTest: PropTypes.func.isRequired,
    removeFromTest: PropTypes.func.isRequired,
    navigateBackTo: PropTypes.func,
    saveTestError: PropTypes.any,
    saveTestBusy: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func.isRequired,
    }).isRequired,
  };

  componentWillReceiveProps(newProps) {
    if (newProps.saveTestBusy !== this.props.saveTestBusy) {
      this.props.toggleLoader(newProps.saveTestBusy);
    }
    if (this.props.saveTestBusy && !newProps.saveTestBusy) {
      if (newProps.saveTestError) {
        this.props.showAlert({ title: GENERIC_ERROR_TITLE, message: GENERIC_ERROR_MESSAGE });
      } else {
        this.props.navigateBackTo('home/manage-test');
      }
    }
  }

  componentDidMount() {
    const state = this.context.store.getState();
    if (!window.localStorage.getItem('intro-question')) {
      if (!state.user.get('test').size) {
        this.props.showAlert({
          message: "Now, tap on the image you want a match to choose",
        });
      }

      window.localStorage.setItem('intro-question', true);
    }
  }

  tooMany = () => {
    this.props.showAlert({
      message: 'You can\'t add any more questions.  Try removing one of your existing ones and try again.',
      buttons: [{
          label: 'Change My Questions',
          callback: () => {
          this.props.navigateBackTo('home/manage-test');
        },
        }, {
            label: 'Cancel',
            color: 'transparent',
        }],
    });
  }

  onSelect = (answerId) => {
    if (this.props.test.size == MAX_TEST_QUESTIONS && !this.state.answerId) {
      return this.tooMany();
    }

    if (answerId !== this.state.answerId) {
      this.setState({
        answerId: answerId
      });
      this.props.addOrUpdateTest(this.props.questionId, this.state.answerId, this.props.categoryId);
    } else {
      setTimeout(() => {
        this.props.navigateBackTo('home/manage-test');
      }, 400)
      return;
    }

    const test = this.props.test;
    const props = test.map(question => ({
      questionId: question.get('questionId'),
      answerId: question.get('answerId'),
      categoryId: question.get('categoryId'),
    }));


    if (test.size == MAX_TEST_QUESTIONS) {
      const state = this.context.store.getState();
      this.props.saveTest(props.toJS());
      if (!window.localStorage.getItem('intro-complete')) {
        if (!state.user.get('test').size) {
          this.props.showAlert({
            message: "Great, you’re all sorted ... why not take some tests to find someone you Click with",
          });
        }

        window.localStorage.setItem('intro-complete', true);
      }

    } else {
      this.props.navigateBackTo('home/manage-test');
    }
  }

  render() {
    const { question, answers } = this.props;
    return (
      <Screen className={this.block()}>
        <TitleBar>
          <BackButton defaultRoute="home/manage-test/categories" />
          <Title>Pick the answer you want a match to give</Title>
        </TitleBar>
        <Content>
          <TestQuestion
            question={question}
            answers={answers}
            className={this.element('question')}
            onSelect={this.onSelect}
            value={this.state.answerId}
          />
        </Content>
      </Screen>
    );
  };
};

export default ManageTestQuestion;
