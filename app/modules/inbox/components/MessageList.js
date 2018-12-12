import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Immutable from 'immutable';
import { isEqual } from 'lodash';
import dateFormat from 'dateformat';

import { getDateDifference } from '^/services/Utils';

import './MessageList.scss';
import MessageGroup from './MessageGroup';


@bem({ block: 'message-list' })
class MessageList extends Component {

  static propTypes = {
    groupIds: PropTypes.instanceOf(Immutable.List),
    groups: PropTypes.instanceOf(Immutable.Map),
    threadId: PropTypes.string,
  };

  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func.isRequired,
    }).isRequired,
  }

  shouldComponentUpdate(newProps) {
    return !isEqual(newProps, this.props);
  }

  formatDate(dateStr) {
    const date = new Date(dateStr);
    const diff = getDateDifference(date);
    if (diff === 0) return 'Today';
    if (diff === -1) return 'Yesterday';
    return dateFormat(date, 'dS mmmm yyyy');
  }

  renderGroups() {
    const state = this.context.store.getState();
    const messages = state.chat.get('messages');
    const { groups, threadId } = this.props;
    return this.props.groupIds.map((groupId) => {
      const group = groups.get(groupId) || new Immutable.List();
      const groupMessages = group.map(messageId => messages.get(messageId));
      const date = this.formatDate(groupId);
      const className = this.element('group');
      return (
        <MessageGroup
          key={groupId}
          date={date}
          messages={groupMessages}
          threadId={threadId}
          className={className}
        />
      );
    });
  }

  render() {
    return (
      <div className={this.block()}>
        { this.renderGroups() }
      </div>
    );
  }

}

export default MessageList;
