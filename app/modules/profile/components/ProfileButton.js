import React, { Component, PropTypes } from 'react';

import IconButton from '^/components/buttons/IconButton';

import IconNudge from '^/assets/icons/nudge.svg';
import IconTest from '^/assets/icons/test.svg';
import IconChat from '^/assets/icons/chat-outline.svg';

class ProfileButton extends Component {

  static propTypes = {
    matchStatusId: PropTypes.number,
    score: PropTypes.number,
    nudges: PropTypes.number,
    nudgeErrorHandler: PropTypes.func.isRequired,
    chatHandler: PropTypes.func.isRequired,
    nudgeHandler: PropTypes.func.isRequired,
    takeTestHandler: PropTypes.func.isRequired,
  };

  render() {
    const {
      matchStatusId,
      score,
      nudges,
      nudgeErrorHandler,
      chatHandler,
      nudgeHandler,
      takeTestHandler,
    } = this.props;
    if (matchStatusId === 1 && !nudges && score > 1) {
      return (
        <IconButton icon={IconNudge}  onTap={nudgeHandler} />
      );
    } else if (!matchStatusId){
      return (
        <IconButton icon={IconTest} animation="pulse-grow" onTap={takeTestHandler} />
      );
    } else if (matchStatusId === 3 || matchStatusId === 4) {
      return (
        <IconButton icon={IconChat} onTap={chatHandler} />
      );
    } else {
      return (
        <div></div>
      );
    }
  }

}

export default ProfileButton;
