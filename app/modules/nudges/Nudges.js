import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import { navigateTo } from '^/actions/NavigationActions';
import { Screen, ContentTransitionGroup } from '^/components/layout';
import ErrorMessage from '^/components/info-message/ErrorMessage';
import Loader from '^/components/icons/Loader';

import EmptyNudgesMessage from './components/EmptyNudgesMessage';
import NudgesContent from './components/NudgesContent';

function mapStateToProps(state) {
  return {
    getNudgesBusy: state.chat.get('getNudgesBusy'),
    getNudgesError: state.chat.get('getNudgesError'),
    nudgesFetched: state.chat.get('nudgesFetched'),
    nudges: state.chat.get('nudgeIds').map(userId =>
      state.users.get(userId)
    ),
  };
}

@connect(mapStateToProps, { navigateTo })
class Nudges extends Component {

  static propTypes = {
    getNudgesBusy: PropTypes.bool,
    nudgesFetched: PropTypes.bool,
    getNudgesError: PropTypes.any,
    nudges: PropTypes.instanceOf(Immutable.List).isRequired,
    retryFetch: PropTypes.func.isRequired,
    navigateTo: PropTypes.func.isRequired,
  }

  onItemTap = (userId) => {
    this.props.navigateTo(`user/${userId}/`);
  }

  render() {
    const {
      getNudgesBusy,
      getNudgesError,
      nudgesFetched,
      retryFetch,
      nudges,
    } = this.props;
    const showState = !nudgesFetched || nudges.size === 0;
    return (
      <Screen>
        <ContentTransitionGroup>
          <Choose>
            <When condition={showState && getNudgesBusy}>
              <Loader centered size="large" color="grey" key="loader" />
            </When>
            <When condition={showState && getNudgesError}>
              <ErrorMessage key="error-message" retry={retryFetch}>
                There was a problem fetching your activities.
              </ErrorMessage>
            </When>
            <When condition={nudges.size === 0}>
              <EmptyNudgesMessage key="empty" />
            </When>
            <Otherwise>
              <NudgesContent
                key="content"
                nudges={nudges}
                onItemTap={this.onItemTap}
              />
            </Otherwise>
          </Choose>
        </ContentTransitionGroup>
      </Screen>
    )
  }
}

export default Nudges;
