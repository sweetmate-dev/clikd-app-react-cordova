import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';

import IconTick from '^/assets/icons/tick.svg';
import PreloadImage from '^/components/PreloadImage';
import Icon from '^/components/icons/Icon';

import './QuestionThumbAnswer.scss';

@bem({ block: 'question-thumb-answer' })
class QuestionThumbAnswer extends Component {

  static propTypes = {
    image: PropTypes.string.isRequired,
    answerId: PropTypes.number.isRequired,
    selectedAnswer: PropTypes.number,
  }

  render() {
    const { image, answerId, selectedAnswer } = this.props;
    return (
      <PreloadImage className={this.block()} src={image}>
        <If condition={answerId === selectedAnswer}>
          <Icon src={IconTick} className={this.element('icon')} />
        </If>
      </PreloadImage>
    );
  }

}

export default QuestionThumbAnswer;