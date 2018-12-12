import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import AnalyticsService from '^/services/AnalyticsService';
import { getMessages, sendMessage } from '^/actions/ChatActions';
import { showAlert } from '^/actions/AppActions';
import { getUser, abortGetUser } from '^/actions/ApiActions';
import ChatService from '^/services/ChatService';

import Thread from './Thread';

/**
 * Use a higher order component to handle fetching, so we can dispatch actions
 * in componentWillMount
 *
 * see https://github.com/reactjs/react-redux/issues/210
 */

function mapStateToProps(state, ownProps) {
  const userId = Number(ownProps.params.userId);
  const user = state.users.get(userId, new Immutable.Map());
  const threadId = user.getIn(['profile', 'jid']);
  const thread = state.chat.getIn(['threads', threadId], new Immutable.Map());
  return {
    user,
    thread,
    userId,
    threadId,
    getMessagesBusy: thread.get('getMessagesBusy'),
    getProfileBusy: user.get('getProfileBusy'),
    online: state.app.get('online'),
    connected: state.chat.get('connected'),
    connecting: state.chat.get('connecting')
  };
}

@connect(mapStateToProps, { getMessages, getUser, abortGetUser, sendMessage, showAlert })
class ThreadWrapper extends Component {
  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func.isRequired,
    }).isRequired,
  }
  static propTypes = {
    userId: PropTypes.number,
    threadId: PropTypes.string,
    getMessages: PropTypes.func,
    getUser: PropTypes.func,
    abortGetUser: PropTypes.func,
    user: PropTypes.instanceOf(Immutable.Map),
    thread: PropTypes.instanceOf(Immutable.Map),
    getMessagesBusy: PropTypes.bool,
    getProfileBusy: PropTypes.bool,
    online: PropTypes.bool,
    connected: PropTypes.bool,
    connecting: PropTypes.bool
  }
  componentWillReceiveProps(newProps) {
    const profileFetched = this.props.getProfileBusy && !newProps.getProfileBusy && !newProps.error;
    const reconnectChat = !this.props.online && newProps.online;
    if (profileFetched || reconnectChat) this.fetch();
  }
  componentWillMount() {
    this.fetch();
  }
  componentWillUnmount() {
    this.props.abortGetUser(this.reqId);
  }
  componentDidMount() {
    AnalyticsService.logPageView('Chat');
  }
  fetch = () => {
    const state = this.context.store.getState();
    if (!state.chat.get('connected')) {
        ChatService.connect();
    }
    if (!this.props.threadId) {
      this.reqId = this.props.getUser(this.props.userId);
    } else {
      this.props.getMessages(this.props.threadId);
    }
  }
  sendMessage = (message) => {
    ChatService.sendMessage(this.props.threadId, message);
  }
  render() {
    const { user, thread, threadId, online, connected, connecting } = this.props;
    const error = thread.get('getMessagesError') || user.get('getProfileError') || (online && !connected && !connecting);
    const searchHistoryError = thread.get('getMessagesError') === 'Search history error';
 
    return (
      <Thread
        sendMessageHandler={this.sendMessage}
        alertHandler={this.props.showAlert}
        retryHandler={this.fetch}
        busy={!thread.get('messagesFetched') || !connected}
        error={error}
        user={user}
        thread={thread}
        threadId={threadId}
        searchHistoryError={searchHistoryError}
      />
    );
  }
}

export default ThreadWrapper;
