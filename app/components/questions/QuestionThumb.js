import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Tappable from 'react-tappable';
import Immutable from 'immutable';

import './QuestionThumb.scss';
import QuestionThumbAnswer from './QuestionThumbAnswer';

@bem({ block: 'question-thumb' })
class QuestionThumb extends Component {

  static propTypes = {
    question: PropTypes.string.isRequired,
    questionId: PropTypes.number.isRequired,
    selectedAnswer: PropTypes.number,
    answers: PropTypes.instanceOf(Immutable.List),
    onTap: PropTypes.func.isRequired,
    children: PropTypes.node,
  }

  onTap = () => {
    this.props.onTap(this.props.questionId);
  }

  render() {
    const { question, answers, selectedAnswer } = this.props;
    const answerOne = answers.get(0);
    const answerTwo = answers.get(1);
    return (
      <Tappable moveThreshold={5} onTap={this.onTap} className={this.block()} >
        <QuestionThumbAnswer
          className={this.element('answer')}
          answerId={answerOne.get('answerId')}
          selectedAnswer={selectedAnswer}
          image={answerOne.get('300x225')}
        />
        <p className={this.element('question')}>{question}</p>
        <QuestionThumbAnswer
          className={this.element('answer')}
          answerId={answerTwo.get('answerId')}
          selectedAnswer={selectedAnswer}
          image={answerTwo.get('300x225')}
        />
        {this.props.children}
      </Tappable>
    );
  }

}

export default QuestionThumb;
