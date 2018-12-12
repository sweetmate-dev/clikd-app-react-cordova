import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';

import FacebookAlbumsListRow from './FacebookAlbumsListRow';

class FacebookAlbumsList extends Component {

  static propTypes = {
    albums: PropTypes.instanceOf(Immutable.List),
  };

  render() {
    return (
      <div>
        <For each="album" of={this.props.albums}>
          <FacebookAlbumsListRow onTap={this.props.onTap} album={album} key={album.get('id')} />
        </For>
      </div>
    );
  }
}

export default FacebookAlbumsList;
