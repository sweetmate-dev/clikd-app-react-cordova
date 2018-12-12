import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import bem from 'react-bem-classes';
import Hammer from 'react-hammerjs';

import IconTick from '^/assets/icons/tick.svg';
import PreloadImage from '^/components/PreloadImage';
import Icon from '^/components/icons/Icon';
import { POP } from '^/constants/Transitions';

import './TestQuestionAnswer.scss';

@bem({ block: 'test-question-answer' })
class TestQuestionAnswer extends Component {

  static propTypes = {
    answerId: PropTypes.number.isRequired,
    onTap: PropTypes.func,
    isSelected: PropTypes.bool,
  }

  state = {
    reAnimate: false
  }
  
  onTap = () => {
    if (this.props.isSelected) {
      this.setState({
        reAnimate: true
      })
    }
    
    if(this.props.onTap) this.props.onTap(this.props.answerId);
  }
  
  render() {
    let selectedClass = this.element('icon');
    if (this.state.reAnimate) {
      selectedClass += ' re-animate';
    }
    
    return (
      <Hammer onTap={this.onTap}>
        <ReactCSSTransitionGroup
          className={this.block()}
          transitionName={POP.transitionName}
          transitionEnterTimeout={POP.transitionEnterTimeout}
          transitionLeaveTimeout={POP.transitionLeaveTimeout}
        >
          <PreloadImage placeholder={this.props['300x225']} src={this.props['600x450']} className={this.element('image')} />
          <If condition={this.props.isSelected}>
            <Icon src={IconTick} className={selectedClass} />
          </If>
        </ReactCSSTransitionGroup>
      </Hammer>
    )
  }

}

export default TestQuestionAnswer;