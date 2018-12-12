import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Immutable from 'immutable';

import Content from '^/components/layout/Content';

import './ThreadContent.scss';
import ThreadChatBox from './ThreadChatBox';
import MessageList from './MessageList';

@bem({ block: 'thread-content' })
class ThreadContent extends Component {

  static propTypes = {
    thread: PropTypes.instanceOf(Immutable.Map),
    threadId: PropTypes.string,
    sendMessageHandler: PropTypes.func,
    alertHandler: PropTypes.func,
  };

  render() {
    const { thread, threadId } = this.props;
    const groupIds = thread.get('groupIds') || new Immutable.List();
    const groups = thread.get('groups') || new Immutable.Map();
    return (
      <Content className={this.block()} flex>
        <div className={this.element('inbox-wrapper')}>
          <MessageList
            groupIds={groupIds}
            groups={groups}
            threadId={threadId}
            className={this.element('inbox')}
          />
        </div>
        <ThreadChatBox
          sendMessageHandler={this.props.sendMessageHandler}
          alertHandler={this.props.alertHandler}
          className={this.element('inbox-box')}
          threadId={threadId}
          thread={thread}
        />
      </Content>
    );
  }

}

export default ThreadContent;
