import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import { connect } from 'react-redux';

import { navigateTo } from '^/actions/NavigationActions';
import IconChatOutline from '^/assets/icons/chat-outline.svg';
import IconTest from '^/assets/icons/test.svg';
import IconLogo from '^/assets/icons/logo.svg';
import IconUser from '^/assets/icons/profile.svg';

import './HomeNav.scss';
import HomeNavItem from './HomeNavItem';

function mapStateToProps(state) {
  let totalNewMessages = state.user.get('totalNewMessages');
  if (totalNewMessages > 99) {
    totalNewMessages = '99+';
  }
  return {
    route: state.navigation.get('route'),
    totalNewMessages: totalNewMessages.toString(),
  };
}

@connect(mapStateToProps, { navigateTo })
@bem({ block: 'home-nav' })
class HomeNav extends Component {
  static propTypes = {
    route: PropTypes.string.isRequired,
    navigateTo: PropTypes.func.isRequired,
    totalNewMessages: PropTypes.string,
  }
  onTap = (route) => {
    this.props.navigateTo(route);
  }
  render() {
    const { route, totalNewMessages } = this.props;
    const dark = route.indexOf('/home/recommendations') === -1;
    return (
      <div className={this.block({ dark })}>
        <HomeNavItem
          icon={IconLogo}
          onTap={this.onTap}
          context="home/recommendations"
          isActive={route.indexOf('/home/recommendations') !== -1}
        />
        <HomeNavItem
          icon={IconChatOutline}
          onTap={this.onTap}
          context="home/interactions"
          badge={totalNewMessages}
          isActive={route.indexOf('/home/interactions') !== -1}
        />
        <HomeNavItem
          icon={IconTest}
          onTap={this.onTap}
          context="home/manage-test/categories"
          isActive={route.indexOf('/home/manage-test/categories') !== -1}
        />
        <HomeNavItem
          icon={IconUser}
          onTap={this.onTap}
          context="home/me"
          isActive={route.indexOf('/home/me') !== -1}
        />
      </div>
    );
  };
};

export default HomeNav;