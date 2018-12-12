import './ContentTransitionGroup.scss';

import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Content from '^/components/layout/Content';
import { CROSSFADE } from '^/constants/Transitions';

@bem({ block: 'content-transition-group' })
class ContentTransitionGroup extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <Content className={this.block()}>
        <ReactCSSTransitionGroup
          className={this.element('transition-group')}
          transitionName={CROSSFADE.transitionName}
          transitionEnterTimeout={CROSSFADE.transitionEnterTimeout}
          transitionLeaveTimeout={CROSSFADE.transitionLeaveTimeout}
        >
          {this.props.children}
        </ReactCSSTransitionGroup>
      </Content>
    );
  }
}


export default ContentTransitionGroup;