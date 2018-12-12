import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Icon from '^/components/icons/Icon';

@bem({ block: 'info-message__icon' })
class MessageIcon extends Component {

  static propTypes = {
    src: PropTypes.string.isRequired,
  };

  render() {
    return (
      <Icon src={this.props.src} className={this.block()} />
    );
  }

}

export default MessageIcon;
