import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Hammer from 'react-hammerjs';

import PreloadImage from '^/components/PreloadImage';

import './InboxFilmStripItem.scss';

@bem({ block: 'inbox-film-strip-item' })
class InboxFilmStripItem extends Component {

  static propTypes = {
    profilePhoto: PropTypes.string,
    userId: PropTypes.number,
  }

  onTap = () => {
    this.props.onTap(this.props.userId);
  }

  render() {
    return (
      <Hammer onTap={this.onTap}>
        <PreloadImage className={this.block()} src={this.props.profilePhoto} />
      </Hammer>
    );
  }

}

export default InboxFilmStripItem;