import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';

import IconLogo from '^/assets/icons/logo.svg';

import './Logo.scss';
import Icon from './Icon';

@bem({ block: 'logo-icon' })
class Logo extends Component {

  render() {
    return <Icon src={IconLogo} className={this.block()} />;
  }

}

export default Logo;
