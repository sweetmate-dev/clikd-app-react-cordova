import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Hammer from 'react-hammerjs';
import Immutable from 'immutable';

import IconRight from '^/assets/icons/right.svg';
import Icon from '^/components/icons/Icon';
import PreloadImage from '^/components/PreloadImage';
import Facebook from '^/services/Facebook';

import './FacebookAlbumsListRow.scss';

@bem({ block: 'facebook-albums-list-row' })
class FacebookAlbumsListRow extends Component {

  static propTypes = {
    onTap: PropTypes.func,
    album: PropTypes.instanceOf(Immutable.Map),
  }

  onTap = () => {
    this.props.onTap(this.props.album.get('id'));
  }

  render() {
    const album = this.props.album;
    const thumb = Facebook.getImageUrl(album.get('id'), 'small');
    return (
      <Hammer onTap={this.onTap}>
        <div className={this.block()} >
          <PreloadImage src={thumb} className={this.element('image')}/>
          <div className={this.element('label')}>
            <p className={this.element('name')}>{album.get('name')}</p>
            <p className={this.element('count')}>{album.get('count')} photos</p>
          </div>
          <Icon src={IconRight} className={this.element('icon')} />
        </div>
      </Hammer>
    );
  }
}

export default FacebookAlbumsListRow;
