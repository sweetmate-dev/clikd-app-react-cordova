import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import AnalyticsService from '^/services/AnalyticsService';
import { navigateTo } from '^/actions/NavigationActions';
import { TitleBar, BackButton, ActionButton } from '^/components/navigation';
import IconPencil from '^/assets/icons/pencil.svg';
import IconCamera from '^/assets/icons/camera.svg';
import IconAccount from '^/assets/icons/account.svg';
import IconInterests from '^/assets/icons/interests.svg';
import { Screen, Content } from '^/components/layout';
import { IconButtonGroup, IconButton } from '^/components/buttons';
import ProfileImageCarousel from '^/components/carousel/ProfileImageCarousel';

import './Me.scss';

function mapStateToProps(state) {
  const profile = state.user.get('profile');
  return {
    photos: profile.get('photos').map(photo => photo.getIn(['images', '600x600'])),
  };
}

@connect(mapStateToProps, { navigateTo })
@bem({ block: 'me-screen' })
class Me extends Component {
  static propTypes = {
    navigateTo: PropTypes.func.isRequired,
    photos: PropTypes.instanceOf(Immutable.List),
  }

  componentDidMount() {
    AnalyticsService.logPageView('My profile');
  }

  onProfileTap = () => {
    this.props.navigateTo('manage-profile');
  }
  onButtonTap = (route) => {
    this.props.navigateTo(route);
  }
  onImagesTap = () => {
    this.props.navigateTo('manage-photos');
  }
  onPreferencesTap = () => {
    this.props.navigateTo('manage-profile');
  }

  render() {
    return (
      <Screen className={this.block()}>
        <Content className={this.element('content')}>
          <Content className={this.element('image-wrapper')}>
            <ProfileImageCarousel images={this.props.photos} />
            <IconButton
              solid
              className={this.element('camera-button')}
              onTap={this.onImagesTap}
              icon={IconCamera}
            >
              My Photos
            </IconButton>
          </Content>
          <IconButtonGroup>
            <IconButton
              icon={IconPencil}
              onTap={this.onPreferencesTap}
              context="preferences"
            >
              My Profile
            </IconButton>
            <IconButton
              icon={IconInterests}
              onTap={this.onButtonTap}
              context="manage-interests"
            >
              Interests
            </IconButton>
            <IconButton
              icon={IconAccount}
              onTap={this.onButtonTap}
              context="manage-account"
            >
              Account
            </IconButton>
          </IconButtonGroup>
        </Content>
      </Screen>
    )
  }

}

export default Me;
