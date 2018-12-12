import Immutable from 'immutable';
import _ from 'lodash';

import { apiType } from '^/actions/ApiActions';
import { LOGOUT_SUCCESS } from '^/actions/UserActions';

const GET_RECOMMENDATIONS_REQUEST = apiType('getRecommendations', 'REQUEST');
const GET_RECOMMENDATIONS_SUCCESS = apiType('getRecommendations', 'SUCCESS');
const GET_RECOMMENDATIONS_FAILED = apiType('getRecommendations', 'FAILED');
const GET_RECOMMENDATIONS_ABORT = apiType('getRecommendations', 'ABORT');

const BLOCK_USER_SUCCESS = apiType('blockUser', 'SUCCESS');

const initialState = Immutable.fromJS({
  getRecommendationsBusy: false,
  getRecommendationsError: null,
  recommendations: [],
});

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case LOGOUT_SUCCESS: {
      return initialState;
    }

    case GET_RECOMMENDATIONS_REQUEST: {
      return state.merge({
        getRecommendationsBusy: true,
        getRecommendationsError: false,
      });
    }

    case GET_RECOMMENDATIONS_FAILED: {
      return state.merge({
        getRecommendationsBusy: false,
        getRecommendationsError: action.error,
      });
    }

    case GET_RECOMMENDATIONS_SUCCESS: {
      const recommendations = Immutable.fromJS(action.response.recommendations);
      const recommendationsIds = _.map(recommendations.toJS(), 'userId');
      const recommendationsDate = action.response.recommendationsDate;
      recommendations.forEach((recommendation) => {
        const image = new Image();
        image.src = recommendation.getIn(['profilePhoto', 'images', '600x0']);
      });

      if (state.get('recommendationsDate') != recommendationsDate) {
        window.localStorage.removeItem('recommendation-scroll');
      }

      return state.merge({
        recommendationsDate: recommendationsDate,
        getRecommendationsFetched: true,
        getRecommendationsBusy: false,
        recommendations: recommendationsIds,
      });
    }

    case GET_RECOMMENDATIONS_ABORT: {
      return state.merge({
        getRecommendationsBusy: false,
      });
    }

    case BLOCK_USER_SUCCESS: {
      const recommendations = state.get('recommendations');
      const newRecommendations = recommendations.filter(function(recommendation) {
          return recommendation !== action.args[0];
      });
      return state.set('recommendations', newRecommendations);
    }

    default:
      return state;

  }
}
