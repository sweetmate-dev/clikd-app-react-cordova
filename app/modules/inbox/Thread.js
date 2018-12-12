import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import Hammer from 'react-hammerjs';

import { Screen, ContentTransitionGroup } from '^/components/layout';
import { TitleBar, Title, BackButton } from '^/components/navigation';
import { navigateTo } from '^/actions/NavigationActions';
import { markThreadRead } from '^/actions/ApiActions';
import ErrorMessage from '^/components/info-message/ErrorMessage';
import OfflineMessage from '^/components/info-message/OfflineMessage';
import PreloadImage from '^/components/PreloadImage';
import Loader from '^/components/icons/Loader';
import { markRead } from '^/actions/ChatActions';

import './Thread.scss';
import ThreadContent from './components/ThreadContent';

function mapStateToProps(state) {
  return {
    online: state.app.get('online'),
  };
}

@connect(mapStateToProps, { navigateTo, markThreadRead, markRead })
@bem({ block: 'thread-screen' })
class Thread extends Component {
  static propTypes = {
    user: PropTypes.instanceOf(Immutable.Map),
    thread: PropTypes.instanceOf(Immutable.Map),
    threadId: PropTypes.string,
    busy: PropTypes.bool,
    error: PropTypes.any,
    searchHistoryError: PropTypes.bool,
    retryHandler: PropTypes.func,
    markRead: PropTypes.func.isRequired,
    markThreadRead: PropTypes.func.isRequired,
    sendMessageHandler: PropTypes.func,
    alertHandler: PropTypes.func,
    online: PropTypes.bool
  };
  onTitlePhotoTap = () => {
    this.markThreadRead();

    const userId = this.props.user.getIn(['profile', 'userId']);
    this.props.navigateTo(`/user/${userId}`);
  }

  componentWillMount() {
    const {thread} = this.props;

    // mark thread as read
    if (thread.get('unreadMessagesCount') > 0) {
      this.markThreadRead();
    }
  }

  markThreadRead() {
    const {user} = this.props;
    this.props.markThreadRead(user.getIn(['profile', 'userId']));
    this.props.markRead(this.props.threadId);
  }

  render() {
    const { user, busy, error, searchHistoryError, thread, threadId, sendMessageHandler, retryHandler, online } = this.props;
    const name = user.getIn(['profile', 'name']);
    const profilePhotos = user.getIn(['profile', 'profilePhoto']);
    const messagesFetched = thread.get('messagesFetched');
    return (
      <Screen className={this.block()}>
        <TitleBar>
          <BackButton defaultRoute="home/interactions"
                      beforeNavigate={
                        (navigateBack) => {
                          this.markThreadRead();
                          setTimeout(navigateBack, 100);
                        }
                      }
          />
          <Hammer onTap={this.onTitlePhotoTap}>
            <Title>
              <PreloadImage src={profilePhotos.getIn(['images', '100x100'])} className={this.element('title-image')} />
              {name}
            </Title>
          </Hammer>
        </TitleBar>
        <ContentTransitionGroup className={this.element('content' + (((error || !online) && !messagesFetched) ? ' error' : ''))} >
          <Choose>
             <When condition={!online}>
              <OfflineMessage />
            </When>
            <When condition={busy && !searchHistoryError}>
              <Loader centered size="large" color="grey" key="loader" />
            </When>
            <When condition={error}>
              <ErrorMessage retry={retryHandler}>
                There was a problem fetching this conversation.
              </ErrorMessage>
            </When>
            <When condition={messagesFetched}>
              <ThreadContent
                sendMessageHandler={sendMessageHandler}
                alertHandler={this.props.alertHandler}
                thread={thread}
                threadId={threadId}
                key="content"
              />
            </When>
            <Otherwise>
              <ErrorMessage retry={retryHandler}>
                There was a problem fetching this conversation.
              </ErrorMessage>
            </Otherwise>
          </Choose>
        </ContentTransitionGroup>
      </Screen>
    );
  }

}

export default Thread;
