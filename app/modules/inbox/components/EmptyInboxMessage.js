import React, { Component } from 'react';

import IconChat from '^/assets/icons/chat-outline.svg';
import { InfoMessage, InfoMessageIcon } from '^/components/info-message';

class EmptyInboxMessage extends Component {

  render() {
    return (
      <InfoMessage>
        <h2>You haven't matched with anyone yet.</h2>
        <p>Keep taking tests to find someone you clik with.</p>
      </InfoMessage>
    );
  }

}

export default EmptyInboxMessage;
