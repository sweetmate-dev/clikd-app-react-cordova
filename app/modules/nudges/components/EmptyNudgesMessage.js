import React, { Component } from 'react';

import IconNudge from '^/assets/icons/nudge.svg';
import { InfoMessage, InfoMessageIcon } from '^/components/info-message';

class EmptyNudgesMessage extends Component {

  render() {
    return (
      <InfoMessage>
        <InfoMessageIcon src={IconNudge} />
        <h2>No nudges at the moment</h2>
        <p>Your nudges will appear here when somebody asks you to take their test</p>
      </InfoMessage>
    );
  }

}

export default EmptyNudgesMessage;
