import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Immutable from 'immutable';

import './Message.scss';

@bem({ block: 'message', modifiers: ['sent'] })
class Message extends Component {

  static propTypes = {
    message: PropTypes.instanceOf(Immutable.Map),
    threadId: PropTypes.string,
  };

  render() {
    const { message, threadId } = this.props;
    const dir = message.get('recipient') === threadId ? 'sent' : 'received';
    const timeString = message.get('time').toTimeString().substr(0, 5);
    const status = message.get('status');
    const body = message.get('body');
    return (
      <div className={this.block({ status, dir })}>
        <p className={this.element('bubble')}>
          <span className={this.element('body')}>{body}</span>
          <span className={this.element('time')}>{timeString}</span>
        </p>
      </div>
    );
  }

}

export default Message;
