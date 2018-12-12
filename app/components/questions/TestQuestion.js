import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';

import './TestQuestion.scss';
import TestQuestionAnswer from './TestQuestionAnswer';

@bem({ block: 'test-question' })
class TestQuestion extends Component {

  static propTypes = {
    answers: PropTypes.arrayOf(PropTypes.shape({
      answerId: PropTypes.number.isRequired,
    })).isRequired,
    question: PropTypes.string.isRequired,
    onSelect: PropTypes.func,
    value: PropTypes.number,
  }

  onSelect = (answerId) => {
    if (this.props.onSelect) this.props.onSelect(answerId);
  }

  render() {
    return (
      <div className={this.block()} >
        <TestQuestionAnswer
          isSelected={this.props.value === this.props.answers[0].answerId}
          className={this.element('answer')}
          onTap={this.onSelect}
          key={this.props.answers[0].answerId}
          {...this.props.answers[0]}
        />
        <div className={this.element('question')}>
          {this.props.question}
        </div>
        <TestQuestionAnswer
          isSelected={this.props.value === this.props.answers[1].answerId}
          onTap={this.onSelect}
          className={this.element('answer')}
          key={this.props.answers[1].answerId}
          {...this.props.answers[1]}
        />
      </div>
    );
  }

}

export default TestQuestion;
