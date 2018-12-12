import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';

import FilmStrip from '^/components/carousel/FilmStrip';

import InboxFilmStripItem from './InboxFilmStripItem';

class InboxFilmStrip extends Component {

  static propTypes = {
    threads: PropTypes.instanceOf(Immutable.List),
    onThreadTap: PropTypes.func,
  }

  renderItems() {
    const output = [];
    this.props.threads.forEach((user) => {
      output.push((
        <InboxFilmStripItem
          key={user.userId}
          userId={user.userId}
          onTap={this.props.onThreadTap}
          profilePhoto={user.profilePhoto}
        />));
    });
    return output;
  }

  render() {
    return (
      <FilmStrip>
        {this.renderItems()}
      </FilmStrip>
    );
  }

}

export default InboxFilmStrip;
