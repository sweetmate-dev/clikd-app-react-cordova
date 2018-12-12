import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Hammer from 'react-hammerjs';

import Icon from '^/components/icons/Icon';

@bem({ block: 'title-bar__action-button', modifiers: ['left', 'right', 'disabled'] })
class ActionButton extends Component {

  static propTypes = {
    left: PropTypes.bool,
    right: PropTypes.bool,
    disabled: PropTypes.bool,
    onTap: PropTypes.func,
    icon: PropTypes.string,
    iconClass: PropTypes.string,
    children: PropTypes.node,
  };

  render() {
    return (
      <Hammer onTap={this.props.onTap}>
        <div className={this.block()} >
          <If condition={this.props.icon}>
            <Icon src={this.props.icon} className={this.props.iconClass} />
          </If>
          {this.props.children}
        </div>
      </Hammer>
    );
  }
}


export default ActionButton;
