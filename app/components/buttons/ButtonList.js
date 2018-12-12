import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';

import './ButtonList.scss';

@bem({ block: 'button-list' })
class ButtonList extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <div className={this.block()}>
        { this.props.children }
      </div>
    );
  }
}

export default ButtonList;
