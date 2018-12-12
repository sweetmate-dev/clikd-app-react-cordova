import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import bem from 'react-bem-classes';
import Immutable from 'immutable';

import AnalyticsService from '^/services/AnalyticsService';
import { navigateBack } from '^/actions/NavigationActions';
import { getUser, abortGetUser, blockUser, reportUser, getActivity } from '^/actions/ApiActions';
import { Screen, ContentTransitionGroup } from '^/components/layout';
import { TitleBar, BackButton, ActionButton } from '^/components/navigation';
import ErrorMessage from '^/components/info-message/ErrorMessage';
import Loader from '^/components/icons/Loader';

import ProfileContent from './components/ProfileContent';

import IconVerticalDots from '^/assets/icons/vertical-dots.svg';
import { REPORT_REASONS } from '^/constants/Settings';
import { GENERIC_ERROR_MESSAGE, GENERIC_ERROR_TITLE } from '^/constants/Messages';

import { showAlert, toggleLoader } from '^/actions/AppActions';

import './Profile.scss';

function mapStateToProps(state, ownProps) {
  const userId = Number(ownProps.params.userId);
  const user = state.users.get(userId) || new Immutable.Map();
  const history = state.navigation.get('history');
  const previousRoute = history.size > 1 ? history.get(history.size - 2) : new Immutable.Map();

  var props = {
    getProfileBusy: user.get('getProfileBusy'),
    getProfileError: user.get('getProfileError'),
    fullProfileFetched: user.get('fullProfileFetched'),
    blockBusy: user.get('blockBusy'),
    blockError: user.get('blockError'),
    reportBusy: user.get('reportBusy'),
    reportError: user.get('reportError'),
    previousRoute: previousRoute.get('route'),
    refreshActivities: state.user.get('refreshActivities'),
  };
  return props;
}

@connect(mapStateToProps, { getUser, abortGetUser, showAlert, blockUser, reportUser, toggleLoader, navigateBack, getActivity })
@bem({ block: 'profile-screen' })
class Profile extends Component {

  static propTypes = {
    params: PropTypes.shape({
      userId: PropTypes.string,
    }),
    getUser: PropTypes.func,
    abortGetUser: PropTypes.func,
    getProfileBusy: PropTypes.bool,
    getProfileError: PropTypes.any,
    fullProfileFetched: PropTypes.bool,
    showAlert: PropTypes.func.isRequired,
    blockUser: PropTypes.func.isRequired,
    reportUser: PropTypes.func.isRequired,
    toggleLoader: PropTypes.func.isRequired,
    navigateBack: PropTypes.func.isRequired,
  };

  state = {
    galleryVisible: false,
  };

  componentWillMount() {
    const userId = Number(this.props.params.userId);
    this.reqId = this.props.getUser(userId);
  }

  componentWillUnmount() {
    const userId = Number(this.props.params.userId);
    this.props.abortGetUser(this.reqId, userId);
  }

  componentDidMount() {
    AnalyticsService.logPageView('View profile');
  }

  componentWillReceiveProps(newProps) {
    if (newProps.blockBusy !== this.props.blockBusy) {
      this.props.toggleLoader(newProps.blockBusy);
    }

    if (this.props.blockBusy && !newProps.blockBusy && !newProps.reportError) {
      this.props.navigateBack('/');
    }

    if (newProps.reportBusy !== this.props.reportBusy) {
      this.props.toggleLoader(newProps.reportBusy);
    }

    if (this.props.reportBusy && !newProps.reportBusy && !newProps.reportError) {
      this.props.showAlert({
        title: 'Report sent',
        message: 'Thank you for your report.  We\'ll review it shortly and take any appropriate action.',
      });

      this.props.navigateBack('/');
    }

    if (!this.props.blockError && newProps.blockError
        || !this.props.reportError && newProps.reportError
    ) {
      this.props.showAlert({ title: GENERIC_ERROR_TITLE, message: GENERIC_ERROR_MESSAGE });
    }

    // re-fetch activities
    if (newProps.refreshActivities
        && (!this.props.fullProfileFetched && newProps.fullProfileFetched)
        && this.props.previousRoute === "/home/interactions/activity"
    ) {
      this.props.getActivity();
    }
  }

  retryGet = () => {
    const userId = Number(this.props.params.userId);
    this.reqId = this.props.getUser(userId);
  }

  toggleGallery = () => {
    this.setState({
      galleryVisible: !this.state.galleryVisible,
    });
  };

  onMenuTap = () => {
    /*this.component.setOffset(0);*/
    this.props.showAlert({
      buttons: [{
        label: 'Block user',
        callback: this.blockUser,
      }, {
        label: 'Report user',
        callback: this.reportUser,
      }, {
        label: 'Cancel',
        color: 'transparent',
      }],
    });
  }

  blockUser = () => {
    const userId = Number(this.props.params.userId);
    this.props.showAlert({
      title: 'Block user',
      message: 'Are you sure you want to block this user?  You will no longer be able to contact each other.',
      buttons: [{
        label: 'Yes',
        callback: () => {
          this.props.blockUser(userId);
        },
      }, {
        label: 'No',
        color: 'transparent',
      }],
    });
  }

  reportUser = () => {
    const reportHandler = this.props.reportUser;
    const userId = Number(this.props.params.userId);

    const buttons = [];
    for (let i = 0; i < REPORT_REASONS.length; i++) {
      let reportReason = REPORT_REASONS[i];
      buttons.push({
        label: reportReason.label,
        callback: () => { reportHandler(userId, reportReason.value); }
      });
    }

    buttons.push({
      label: 'Cancel',
      color: 'transparent',
    });

    this.props.showAlert({
      message: 'Please select a reason from the list below.',
      buttons: buttons,
    });
  }

  render() {
    const { getProfileBusy, getProfileError, fullProfileFetched, name } = this.props;
    const userId = Number(this.props.params.userId);
    return (
      <Screen>
        <TitleBar fixed fade>
          <BackButton defaultRoute="home/recommendations" />
          <ActionButton icon={IconVerticalDots} iconClass={this.element('menu-icon')} onTap={this.onMenuTap} right />
        </TitleBar>
        <ContentTransitionGroup>
          <Choose>
            <When condition={fullProfileFetched}>
              <ProfileContent
                userId={userId}
                toggleGallery={this.toggleGallery}
                galleryVisible={this.state.galleryVisible}
                key="content"
              />
            </When>
            <When condition={getProfileBusy}>
              <Loader centered size="large" color="grey" key="loader" />
            </When>
            <When condition={getProfileError}>
              <ErrorMessage key="error-message" retry={this.retryGet} >
                There was a problem fetching this profile.
              </ErrorMessage>
            </When>
          </Choose>
        </ContentTransitionGroup>
      </Screen>
    );
  }

}

export default Profile;
