import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import AnalyticsService from '^/services/AnalyticsService';
import { navigateBackTo } from '^/actions/NavigationActions';
import { getUser, abortGetUser } from '^/actions/ApiActions';
import { Screen, ContentTransitionGroup } from '^/components/layout';
import ErrorMessage from '^/components/info-message/ErrorMessage';
import Loader from '^/components/icons/Loader';

import TestResultContent from './components/TestResultContent';

function mapStateToProps(state, ownProps) {
  const userId = Number(ownProps.params.userId);
  const match = state.users.get(userId) || new Immutable.Map();
  return {
    userId,
    profileFetched: match.get('fullProfileFetched'),
    getProfileBusy: match.get('getProfileBusy'),
    getProfileError: match.get('getProfileError'),
    profilePhoto: state.user.getIn(['profile', 'profilePhoto', 'images', '300x300']),
    matchProfilePhoto: match.getIn(['profile', 'profilePhoto', 'images', '300x300']),
    matchStatusId: match.getIn(['profile', 'matchStatusId']),
  };
}

@connect(mapStateToProps, { navigateBackTo, getUser, abortGetUser })
class TestResult extends Component {

  static propTypes = {
    navigateBackTo: PropTypes.func,
    profileFetched: PropTypes.bool,
    getProfileBusy: PropTypes.bool,
    getProfileError: PropTypes.any,
    profilePhoto: PropTypes.string,
    matchProfilePhoto: PropTypes.string,
    matchStatusId: PropTypes.number,
    userId: PropTypes.number,
  }

  onSkipTap = () => {
    this.props.navigateBackTo('home/recommendations');
  }

  onChatTap = () => {
    this.props.navigateBackTo(`chat/${this.props.userId}`, { clearFrom: 'home/recommendations' });
  }

  componentWillMount() {
    if (!this.props.profileFetched) this.fetch();
  }

  componentWillUnmount() {
    this.props.abortGetUser(this.reqId);
  }

  componentDidMount() {
    AnalyticsService.logPageView('Test result');
  }

  fetch = () => {
    this.reqId = this.props.getUser(this.props.userId);
  }

  render() {
    const {
      getProfileBusy,
      getProfileError,
      profileFetched,
      profilePhoto,
      matchProfilePhoto,
      matchStatusId } = this.props;
    return (
      <Screen>
        <ContentTransitionGroup>
          <Choose>
            <When condition={profileFetched}>
              <TestResultContent
                key="content"
                profilePhoto={profilePhoto}
                matchProfilePhoto={matchProfilePhoto}
                matchStatusId={matchStatusId}
                chatHandler={this.onChatTap}
                skipHandler={this.onSkipTap}
              />
            </When>
            <When condition={getProfileBusy}>
              <Loader centered size="large" color="grey" key="loader" />
            </When>
            <When condition={getProfileError}>
              <ErrorMessage key="error-message" retry={this.fetch} >
                There was a problem fetching this profile.
              </ErrorMessage>
            </When>
          </Choose>
        </ContentTransitionGroup>
      </Screen>
    );
  }

}

export default TestResult;
