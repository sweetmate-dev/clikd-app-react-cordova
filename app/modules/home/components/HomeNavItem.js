import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Hammer from 'react-hammerjs';

import Icon from '^/components/icons/Icon';
import Badge from '^/components/badges/Badge';

import './HomeNavItem.scss';

@bem({ block: 'home-nav-item', modifiers: ['isActive'] })
class HomeNavItem extends Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    onTap: PropTypes.func.isRequired,
    context: PropTypes.string.isRequired,
    badge: PropTypes.string,
  }
  onTap = () => {
    this.props.onTap(this.props.context);
  }
  render() {
    return (
      <Hammer onTap={this.onTap}>
        <div className={this.block()}>
          <Icon src={this.props.icon} className={this.element('icon')} />
          <Badge>{this.props.badge}</Badge>
        </div>
      </Hammer>
    );
  };
};

export default HomeNavItem;