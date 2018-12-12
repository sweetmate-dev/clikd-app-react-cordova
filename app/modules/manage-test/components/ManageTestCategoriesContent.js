import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import bem from 'react-bem-classes';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import { navigateTo } from '^/actions/NavigationActions';
import { showAlert } from '^/actions/AppActions';
import Tappable from 'react-tappable';
import Content from '^/components/layout/Content';
import QuestionThumb from '^/components/questions/QuestionThumb';
import { MAX_TEST_QUESTIONS } from '^/constants/Settings';

import './ManageTestCategoriesContent.scss';

function mapStateToProps(state, ownProps) {
  const category = state.manageTest.getIn(['categories', ownProps.categoryId], new Immutable.Map());
  const test = state.manageTest.get('test');
  const questions = category.get('questionIds', new Immutable.List()).map((questionId) => {
    const question = state.manageTest.getIn(['questions', questionId]);
    return {
      questionId,
      question: question.get('question'),
      answers: question.get('answers'),
    };
  });
  return {
    questions,
    selected: test.map(question => question.get('questionId')),
  };
}

@connect(mapStateToProps, { navigateTo, showAlert })
@bem({ block: 'manage-test-categories-content' })
class ManageTestCategoriesContent extends Component {

  static propTypes = {
    selected: PropTypes.instanceOf(Immutable.List),
    questions: PropTypes.instanceOf(Immutable.List),
    navigateTo: PropTypes.func,
    showAlert: PropTypes.func.isRequired,
  };

  shouldComponentUpdate(nextProps) {
    return !this.props.questions.equals(nextProps.questions);
  }

  componentDidUpdate() {
    ReactDOM.findDOMNode(this).scrollTop = 0;
  }

  onQuestionTap = (questionId) => {
    this.props.navigateTo(`manage-test/question/${questionId}`);
  };

  getCols() {
    let index = 0;
    const output = [[], []];
    const selected = this.props.selected;
    this.props.questions.forEach((question) => {
      if (!selected.includes(question.questionId)) {
        output[index % 2].push(question);
        index++;
      }
    });
    return output;
  }

  submitQuestion() {
    cordova.InAppBrowser.open('https://www.clikdapp.com/competition/', '_system');
  }

  render() {
    const cols = this.getCols();
    return (
      <Content className={this.block()}>
        <div className={this.element('grid')}>
          <For each="group" of={cols} index="idx">
            <div className={this.element('col')} key={idx}>
              <For each="question" of={group}>
                <QuestionThumb
                  {...question}
                  key={question.questionId}
                  onTap={this.onQuestionTap}
                  className={this.element('question', { isSelected: !!question.selectedAnswer })}
                />
              </For>
            </div>
          </For>
        </div>
        <Tappable onTap={this.submitQuestion} className="submitQuestion">
          Feeling creative?  Click here to submit a question through our website ...
        </Tappable>
      </Content>
    );
  }
}

export default ManageTestCategoriesContent;
