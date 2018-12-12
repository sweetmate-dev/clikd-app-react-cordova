import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';

import IconLogo from '^/assets/icons/logo.svg';
import Icon from '^/components/icons/Icon';

@bem({ block: 'title-bar__title' })
class Title extends Component {

  static propTypes = {
    logo: PropTypes.bool,
    children: PropTypes.node,
  };

  render() {
    return (
      <div className={this.block()} >
        <If condition={this.props.logo}>
          <Icon src={IconLogo} className={this.element('logo')} />
        </If>
        <h2>{this.props.children}</h2>
      </div>
    );
  }
}

export default Title;
