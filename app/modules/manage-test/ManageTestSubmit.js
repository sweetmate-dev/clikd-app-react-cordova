import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import { connect } from 'react-redux';
import Content from '^/components/layout/Content';
import { NAVIGATION_BACKWARDS, navigateTo } from '^/actions/NavigationActions';
import { initTest, resetManageTest, updateTest, removeFromTest } from '^/actions/ManageTestActions';
import { showAlert } from '^/actions/AppActions';
import Tappable from 'react-tappable';
import QuestionThumb from '^/components/questions/QuestionThumb';

import './ManageTestSubmit.scss';

function mapStateToProps(state) {
  return {
    path: state.navigation.get('route'),
    test: state.manageTest.get('test').map((question) => {
      const id = question.get('questionId');
      return state.manageTest.getIn(['questions', id]).merge(question);
    }),
  };
}

@connect(mapStateToProps, {
  navigateTo,
  initTest,
  resetManageTest,
  showAlert,
})

@bem({ block: 'manage-test-submit' })

class ManageTestSubmit extends Component {

  getCols() {
    let index = 0;
    const output = [[], []];
    this.props.test.forEach((question) => {
      output[index % 2].push(question);
      index++;
    });
    return output;
  }

  onSubmit = () => {
    alert('hi');
  }

  onQuestionTap = (id) => {
    console.log(id);
  }

  render() {
    const cols = this.getCols();
    return (
      <Content className={this.block()}>
        <p className="title">Feeling creative?</p>
        <p className="subTitle">Submit a question through our website.</p>
        <Tappable onTap={this.onSubmit} className="submit-button">
          <p className="button-text">Submit a question</p>
        </Tappable>
        <p className="small-text">Here are just some examples submitted by our users.</p>
        <div className={this.element('grid')}>
          <For each="group" of={cols} index="idx">
            <div className={this.element('col')} key={idx}>
              <For each="question" of={group}>
                <QuestionThumb
                  className={this.element('question')}
                  key={question.get('questionId')}
                  onTap={this.onQuestionTap}
                  questionId={question.get('questionId')}
                  answers={question.get('answers')}
                  question={question.get('question')}
                />
              </For>
            </div>
          </For>
        </div>
      </Content>
    );
  }

}

export default ManageTestSubmit;
