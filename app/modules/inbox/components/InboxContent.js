import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Immutable from 'immutable';

import Content from '^/components/layout/Content';
import ProfileList from '^/components/profile-list/ProfileList';

import './InboxContent.scss';
import InboxFilmStrip from './InboxFilmStrip';
import InboxListItem from './InboxListItem';


@bem({ block: 'inbox-content' })
class InboxContent extends Component {

  static propTypes = {
    threads: PropTypes.instanceOf(Immutable.List),
    onTap: PropTypes.func,
    onPhotoTap: PropTypes.func,
    reportHandler: PropTypes.func,
    blockHandler: PropTypes.func,
    loaderHandler: PropTypes.func,
    alertHandler: PropTypes.func,
  }

  render() {
    const { threads, onTap, onPhotoTap, blockHandler, loaderHandler, alertHandler, reportHandler } = this.props;
    return (
      <Content flex className={this.block()}>
        <InboxFilmStrip
          threads={threads}
          className={this.element('film-strip')}
          onThreadTap={onTap}
        />
        <ProfileList>
          <For each="thread" of={threads}>
            <InboxListItem
              key={thread.userId}
              thread={thread}
              onTap={onTap}
              onPhotoTap={onPhotoTap}
              reportHandler={reportHandler}
              blockHandler={blockHandler}
              alertHandler={alertHandler}
              loaderHandler={loaderHandler}
            />
          </For>
        </ProfileList>
      </Content>
    );
  }

}

export default InboxContent;
