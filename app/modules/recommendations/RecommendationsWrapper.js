import React, { Component } from 'react';
import AnalyticsService from '^/services/AnalyticsService';
import RecommendationsService from '^/services/RecommendationsService';
import Recommendations from './Recommendations';

/**
 * Use a higher order component to handle fetching, so we can dispatch actions
 * in componentWillMount
 *
 * see https://github.com/reactjs/react-redux/issues/210
 */
class RecommendationsWrapper extends Component {
  fetch() {
    RecommendationsService.getRecommendations();
  }

  componentDidMount() {
    AnalyticsService.logPageView('Recommendations');
  }

  render() {
    return (
      <Recommendations {...this.props} retryFetch={this.fetch} />
    );
  }
}

export default RecommendationsWrapper;
