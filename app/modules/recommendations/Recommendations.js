import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import bem from 'react-bem-classes';
import Immutable from 'immutable';
import _ from 'lodash';

import { navigateTo } from '^/actions/NavigationActions';
import { Screen, ContentTransitionGroup } from '^/components/layout';
import Loader from '^/components/icons/Loader';
import { TitleBar, Title } from '^/components/navigation';
import ErrorMessage from '^/components/info-message/ErrorMessage';
import TestService from '^/services/TestService';

import RecommendationsContent from './components/RecommendationsContent';
import RecommendationsEmpty from './components/RecommendationsEmpty';

import { showAlert } from '^/actions/AppActions';
import Icon from '^/components/icons/Icon';
import IconTest from '^/assets/icons/test.svg';

import './Recommendations.scss';

function mapStateToProps(state) {
  const { maxRecommendations } = state.user.get('profile').toJS();
  const recommendations = state.recommendations.get('recommendations').map(id =>
    state.users.getIn([id, 'profile'])
  );

  // calculate recommendations remaining
  let recommendationsRemaining = recommendations.size;
  recommendations.map((user) => {
    if (user.get('matchStatusId')) {
      recommendationsRemaining--;
    }
  });
  return {
    recommendations,
    maxRecommendations,
    recommendationsRemaining,
    busy: state.recommendations.get('getRecommendationsBusy'),
    error: state.recommendations.get('getRecommendationsError'),
    fetched: state.recommendations.get('getRecommendationsFetched'),
  };
}

@connect(mapStateToProps, { navigateTo, showAlert })
@bem({ block: 'recommendations' })
class Recommendations extends Component {

  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  };

  state = {
    hideUserIds: [],
  };

  static propTypes = {
    busy: PropTypes.bool,
    error: PropTypes.any,
    fetched: PropTypes.bool,
    retryFetch: PropTypes.func,
    showAlert: PropTypes.func,
    recommendations: PropTypes.instanceOf(Immutable.List),
    maxRecommendations: PropTypes.number,
    recommendationsRemaining: PropTypes.number,
    navigateTo: PropTypes.func.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    if (!window.localStorage.getItem('intro-recommendations')
      && nextProps.recommendations.size
    ) {
      this.props.showAlert({
        message: [
          'See someone you like? Press ',
          <Icon src={IconTest} key="icon" />,
          ' to take their test and see if you Click',
        ],
      });

      window.localStorage.setItem('intro-recommendations', true);
    }
  }

  componentWillMount() {
    const state = this.context.store.getState();
    if (window.localStorage.getItem('intro-recommendations') && !state.user.get('test').size) {
      const lastMessage = window.localStorage.getItem('setup-test-reminder');
      const now = new Date().getTime();

      if (!lastMessage || ((now - lastMessage) / 1000) > 86400) {
        this.props.showAlert({
          title: '',
          message: 'Remember to set up your test.  If you don\'t, you wont get any more recommendations.',
          buttons: [{
            label: 'Set-up test',
            callback: () => {
              this.props.navigateTo('/home/manage-test/categories');
            },
          }],
        });

        window.localStorage.setItem('setup-test-reminder', now);
      }
    }
  }

  onUserTap = (userId) => {
    this.props.navigateTo(`user/${userId}`);
  }

  onIconTap = (userId, matchStatusId) => {
    if (!matchStatusId) {
      TestService.takeTest(userId);
    } else {
      this.props.navigateTo(`user/${userId}`);
    }
  }

  onDelete = (userId) => {
    const hideUserIds = this.state.hideUserIds;
    if (hideUserIds.indexOf(userId) < 0) {
      hideUserIds.push(userId);
      this.setState({ hideUserIds });
    }
  }

  filterUsers = (recommendations) => {
    const { hideUserIds } = this.state;
    const users = [];
    recommendations.map((user) => {
      if (hideUserIds.indexOf(user.get('userId')) < 0) users.push(user);
      return true;
    });
    return users;
  }

  render() {
    const { busy, error, fetched, recommendations, maxRecommendations, recommendationsRemaining } = this.props;
    const empty = (recommendations.size === 0 || recommendationsRemaining === 0);
    const recommendedUsers = this.filterUsers(recommendations);
    return (
      <Screen className={this.block()}>
        <TitleBar border>
          <Title>Recommendations</Title>
        </TitleBar>
        <ContentTransitionGroup className={this.element('content')}>
          <Choose>
            <When condition={!fetched && busy}>
              <Loader centered size="large" color="grey" key="loader" />
            </When>
            <When condition={!fetched && error}>
              <ErrorMessage key="error-message" retry={this.props.retryFetch}>
                There was a problem fetching your recommendations.
              </ErrorMessage>
            </When>
            <When condition={empty}>
              <RecommendationsEmpty maxRecommendations={maxRecommendations} />
            </When>
            <Otherwise>
              <RecommendationsContent
                recommendations={recommendedUsers}
                maxRecommendations={maxRecommendations}
                onUserTap={this.onUserTap}
                onIconTap={this.onIconTap}
                onDelete={this.onDelete}
              />
            </Otherwise>
          </Choose>
        </ContentTransitionGroup>
      </Screen>
    );
  }

}

export default Recommendations;
