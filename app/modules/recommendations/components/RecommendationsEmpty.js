import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { navigateTo } from '^/actions/NavigationActions';
import IconRecommendations from '^/assets/icons/recommendations.svg';
import { InfoMessage, InfoMessageIcon } from '^/components/info-message';
import { ButtonList, Button } from '^/components/buttons';

@connect(null, { navigateTo })
class RecommendationsEmpty extends Component {

  static propTypes = {
    maxRecommendations: PropTypes.number,
    navigateTo: PropTypes.func,
  }

  onTap = () => {
    this.props.navigateTo('home/me');
  }

  render() {
    return (
      <InfoMessage>
        <p>You should get {this.props.maxRecommendations} new recommendations everyday.
           If you don't, try increasing your distance settings or give us a little while
           and check back in - we are a new app so still growing.</p>
      </InfoMessage>
    );
  }

}

export default RecommendationsEmpty;
