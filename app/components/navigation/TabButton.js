import React, { Component, PropTypes } from 'react';
import Hammer from 'react-hammerjs';
import bem from 'react-bem-classes';

import './TabButton.scss';

@bem({ block: 'tab-button', modifiers: ['isActive'] })
class TabButton extends Component {

  static propTypes = {
    onTap: PropTypes.func,
    context: PropTypes.string,
    children: PropTypes.node,
  }

  onTap = () => {
    if (this.props.onTap) this.props.onTap(this.props.context);
  }

  render() {
    return (
      <Hammer onTap={this.onTap}>
        <div className={this.block()}>
          {this.props.children}
        </div>
      </Hammer>
    );
  }
}

export default TabButton;
