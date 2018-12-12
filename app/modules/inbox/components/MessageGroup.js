import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Immutable from 'immutable';

import './MessageGroup.scss';
import Message from './Message';

@bem({ block: 'message-group' })
class MessageGroup extends Component {

  static propTypes = {
    messages: PropTypes.instanceOf(Immutable.List),
    date: PropTypes.string,
    threadId: PropTypes.string,
  }

  render() {
    const { threadId, messages, date } = this.props;
    return (
      <div className={this.block()}>
        <p className={this.element('title')}>
          {date}
        </p>
        <For each="message" of={messages}>
          <Message
            className={this.element('message')}
            key={message.get('id')}
            message={message}
            threadId={threadId}
          />
        </For>
      </div>
    );
  }

}

export default MessageGroup;
