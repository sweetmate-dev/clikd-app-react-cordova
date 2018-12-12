import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';

import './InfoMessage.scss';

@bem({ block: 'info-message', modifiers: ['theme'] })
class InfoMessage extends Component {

  static propTypes = {
    children: PropTypes.node,
    theme: PropTypes.oneOf(['light', 'med']),
  };

  render() {
    return (
      <div className={this.block()}>
        {this.props.children}
      </div>
    );
  }

}

export default InfoMessage;
