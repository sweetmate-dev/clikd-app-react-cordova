import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import { showAlert, toggleLoader } from '^/actions/AppActions';
import { nudgeUser } from '^/actions/ApiActions';
import { navigateTo } from '^/actions/NavigationActions';
import ProfileImageCarousel from '^/components/carousel/ProfileImageCarousel';
import { Content } from '^/components/layout';
import TestService from '^/services/TestService';
import { GENERIC_ERROR_MESSAGE, GENERIC_ERROR_TITLE } from '^/constants/Messages';

import './ProfileContent.scss';
import ProfileInfo from './ProfileInfo';
import ProfileButton from './ProfileButton';


function mapStateToProps(state, ownProps) {
  const user = state.users.get(ownProps.userId);
  const profile = user.get('profile');
  return {
    profile,
    photos: profile.get('photos').map(photo => photo.getIn(['images', '600x600'])),
    nudgeBusy: user.get('nudgeBusy'),
    nudgeError: user.get('nudgeError'),
  };
}

@connect(mapStateToProps, { navigateTo, showAlert, nudgeUser, toggleLoader })
@bem({ block: 'profile-content' })
class ProfileContent extends Component {

  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  };

  static propTypes = {
    profile: PropTypes.instanceOf(Immutable.Map).isRequired,
    photos: PropTypes.instanceOf(Immutable.List).isRequired,
    navigateTo: PropTypes.func.isRequired,
    userId: PropTypes.number.isRequired,
    showAlert: PropTypes.func.isRequired,
    nudgeUser: PropTypes.func.isRequired,
    toggleLoader: PropTypes.func.isRequired,
    nudgeBusy: PropTypes.bool,
    nudgeError: PropTypes.any,
  };

  componentWillReceiveProps(newProps) {
    if (!this.props.nudgeError && newProps.nudgeError) {
      if (newProps.nudgeError === 'Maximum nudges for this user reached!') {
        this.showNudgeError();
      } else {
        this.props.showAlert({ title: GENERIC_ERROR_TITLE, message: GENERIC_ERROR_MESSAGE });
      }
    }
    if (this.props.nudgeBusy !== newProps.nudgeBusy) {
      this.props.toggleLoader(newProps.nudgeBusy);
    }
  }

  onTestButtonTap = () => {
    TestService.takeTest(this.props.userId);
  }

  onChatButtonTap = () => {
    this.props.navigateTo(`chat/${this.props.userId}`);
  }

  onNudgeButtonTap = () => {
    const state = this.context.store.getState();
    if (!state.user.get('test').size) {
      this.props.showAlert({
        title: 'Set up your test',
        message: 'You can\'t nudge anyone until you\'ve set up your own test.',
        buttons: [{
          label: 'Set-up test',
          callback: () => {
            this.props.navigateTo(`/home/manage-test/categories`);
          }
        }/*, {
          label: 'Keep looking',
        }*/]
      });
    } else {
      this.props.showAlert({
        message: 'Say hi to this user?',
        buttons: [{
          label: 'Yes',
          callback: () => {
            this.props.nudgeUser(this.props.userId);
          },
        }, {
          label: 'No',
          color: 'transparent',
        }],
      });
    }
  }

  showNudgeError = () => {
    this.props.showAlert({
      title: 'Oops',
      message: 'You can\'t say hi to this user more than once',
    });
  }

  render() {
    const { profile, photos } = this.props;
    const tagLine = profile.get('tagLine');
    const noTagLineClass = (!tagLine) ? 'noTagLine' : '';
    return (
      <Content flex>
        <div className={this.element('inner')}>
          <ProfileImageCarousel images={photos} className={this.element('carousel')} />
          <div className={`${this.element('header')} ${noTagLineClass}`}>
            <div className={this.element('meta')}>
              <h3>{profile.get('name')}, {profile.get('age')}</h3>
              <If condition={tagLine}>
                <p className={this.element('tagline')}>{tagLine}</p>
              </If>
            </div>
            <ProfileButton
              nudges={profile.get('nudges')}
              matchStatusId={profile.get('matchStatusId')}
              score={profile.get('score')}
              nudgeHandler={this.onNudgeButtonTap}
              chatHandler={this.onChatButtonTap}
              takeTestHandler={this.onTestButtonTap}
              nudgeErrorHandler={this.showNudgeError}
            />
          </div>
          <ProfileInfo profile={profile} />
        </div>
      </Content>
    );
  }

}

export default ProfileContent;
