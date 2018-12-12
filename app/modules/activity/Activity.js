import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import { navigateTo } from '^/actions/NavigationActions';
import { nudgeUser } from '^/actions/ApiActions';
import { showAlert, toggleLoader } from '^/actions/AppActions';
import { Screen, ContentTransitionGroup } from '^/components/layout';
import ErrorMessage from '^/components/info-message/ErrorMessage';
import Loader from '^/components/icons/Loader';

import ActivityContent from './components/ActivityContent';
import ActivityEmptyMessage from './components/ActivityEmptyMessage';

function mapStateToProps(state) {
  return {
    getActivityBusy: state.activity.get('getActivityBusy'),
    getActivityError: state.activity.get('getActivityError'),
    activityFetched: state.activity.get('activityFetched'),
    activity: state.activity.get('activity').map(item =>
      item.set('user', state.users.get(item.get('userId')))
    ),
  };
}

@connect(mapStateToProps, { navigateTo, nudgeUser, showAlert, toggleLoader })
class Activity extends Component {

  static propTypes = {
    retryFetch: PropTypes.func,
    navigateTo: PropTypes.func.isRequired,
    nudgeUser: PropTypes.func,
    showAlert: PropTypes.func,
    toggleLoader: PropTypes.func,
    getActivityBusy: PropTypes.bool,
    getActivityError: PropTypes.any,
    activityFetched: PropTypes.bool,
    activity: PropTypes.instanceOf(Immutable.List),
  }

  onItemTap = (userId) => {
    this.props.navigateTo(`user/${userId}`);
  }

  render() {
    const {
      getActivityBusy,
      getActivityError,
      activityFetched,
      activity,
      retryFetch,
    } = this.props;
    const showState = !activityFetched || activity.size === 0;
    return (
      <Screen>
        <ContentTransitionGroup>
          <Choose>
            <When condition={showState && getActivityBusy}>
              <Loader centered size="large" color="grey" key="loader" />
            </When>
            <When condition={showState && getActivityError}>
              <ErrorMessage key="error-message" retry={retryFetch}>
                There was a problem fetching your activity
              </ErrorMessage>
            </When>
            <When condition={activity.size === 0}>
              <ActivityEmptyMessage key="empty" />
            </When>
            <Otherwise>
              <ActivityContent
                key="content"
                activity={activity}
                onItemTap={this.onItemTap}
                nudgeHandler={this.props.nudgeUser}
                alertHandler={this.props.showAlert}
                loaderHandler={this.props.toggleLoader}
                navigationHandler={this.props.navigateTo}
              />
            </Otherwise>
          </Choose>
        </ContentTransitionGroup>
      </Screen>
    );
  }

}

export default Activity;
