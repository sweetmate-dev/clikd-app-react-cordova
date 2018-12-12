import React, { Component, PropTypes } from 'react';

import IconRecommendations from '^/assets/icons/recommendations.svg';
import { InfoMessage, InfoMessageIcon } from '^/components/info-message';
import { ButtonList, Button } from '^/components/buttons';

class SearchEmpty extends Component {

  static propTypes = {
    onButtonTap: PropTypes.func.isRequired,
  }

  render() {
    return (
      <InfoMessage>
        <InfoMessageIcon src={IconRecommendations} />
        <h2>No results found.</h2>
        <p>We couldn't find any users that matched your search.  Try refining your search criteria.</p>
        <ButtonList>
          <Button onTap={this.props.onButtonTap}>Refine</Button>
        </ButtonList>
      </InfoMessage>
    );
  }

}

export default SearchEmpty;
