import React, { Component } from 'react';

import { InfoMessage, InfoMessageIcon } from '^/components/info-message';

class ActivityEmptyMessage extends Component {

  render() {
    return (
      <InfoMessage>
        <p>When you've passed someone's test they appear here. Say Hi and let them know you're keen.</p>
      </InfoMessage>
    );
  }

}

export default ActivityEmptyMessage;
