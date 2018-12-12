import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import { blockUser, reportUser } from '^/actions/ApiActions';
import { navigateTo } from '^/actions/NavigationActions';
import { toggleLoader, showAlert } from '^/actions/AppActions';
import { Screen, ContentTransitionGroup } from '^/components/layout';
import ErrorMessage from '^/components/info-message/ErrorMessage';
import Loader from '^/components/icons/Loader';

import InboxContent from './components/InboxContent';
import EmptyInboxMessage from './components/EmptyInboxMessage';

function mapStateToProps(state) {
  return {
    getThreadsBusy: state.chat.get('getThreadsBusy'),
    getThreadsError: state.chat.get('getThreadsError'),
    threadsFetched: state.chat.get('threadsFetched'),
    threads: state.chat.get('threadIds').map((threadId) => {
      const thread = state.chat.getIn(['threads', threadId]);
      const user = state.users.get(thread.get('userId'));
      return {
        threadId,
        userId: thread.get('userId'),
        lastMessage: thread.get('lastMessage'),
        lastMessageDate: thread.get('lastMessageDate'),
        unreadMessagesCount: thread.get('unreadMessagesCount'),
        profilePhoto: user.getIn(['profile', 'profilePhoto', 'images', '120x120']),
        blockBusy: user.get('blockBusy'),
        blockError: user.get('blockError'),
        reportBusy: user.get('reportBusy'),
        reportError: user.get('reportError'),
        name: user.getIn(['profile', 'name']),
      };
    }),
  };
}

@connect(mapStateToProps, { navigateTo, blockUser, reportUser, toggleLoader, showAlert })
@bem({ block: 'inbox-screen' })
class Inbox extends Component {

  static propTypes = {
    blockUser: PropTypes.func,
    reportUser: PropTypes.func,
    toggleLoader: PropTypes.func,
    showAlert: PropTypes.func,
    retryFetch: PropTypes.func,
    navigateTo: PropTypes.func,
    getThreadsBusy: PropTypes.bool,
    threadsFetched: PropTypes.bool,
    getThreadsError: PropTypes.any,
    threads: PropTypes.instanceOf(Immutable.List),
  }

  onPhotoTap = (userId) => {
    this.props.navigateTo(`/user/${userId}`);
  }

  onItemTap = (userId) => {
    this.props.navigateTo(`/chat/${userId}`);
  }

  render() {
    const { getThreadsBusy, getThreadsError, threadsFetched, threads, retryFetch } = this.props;
    const showState = !threadsFetched || threads.size === 0;
    return (
      <Screen className={this.block()}>
        <ContentTransitionGroup className={this.element('content')}>
          <Choose>
            <When condition={showState && getThreadsBusy}>
              <Loader centered size="large" color="grey" key="loader" />
            </When>
            <When condition={showState && getThreadsError}>
              <ErrorMessage key="error-message" retry={retryFetch}>
                There was a problem fetching your conversations.
              </ErrorMessage>
            </When>
            <When condition={threads.size === 0}>
              <EmptyInboxMessage key="empty" />
            </When>
            <Otherwise>
              <InboxContent
                threads={threads}
                key="content"
                onTap={this.onItemTap}
                onPhotoTap={this.onPhotoTap}
                blockHandler={this.props.blockUser}
                reportHandler={this.props.reportUser}
                loaderHandler={this.props.toggleLoader}
                alertHandler={this.props.showAlert}
              />
            </Otherwise>
          </Choose>
        </ContentTransitionGroup>
      </Screen>
    );
  }

}

export default Inbox;
