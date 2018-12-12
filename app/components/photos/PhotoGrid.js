import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Immutable from 'immutable';

import './PhotoGrid.scss';
import PhotoGridItem from './PhotoGridItem';

@bem({ block: 'photo-grid' })
class PhotoGrid extends Component {

  static propTypes = {
    thumbKey: PropTypes.arrayOf(PropTypes.string),
    photos: PropTypes.instanceOf(Immutable.List),
    onTap: PropTypes.func.isRequired,
  }


  render() {
    const { thumbKey, photos, onTap } = this.props;
    return (
      <div className={this.block()}>
        <For each="photo" index="idx" of={photos}>
          <PhotoGridItem
            onTap={onTap}
            photo={photo}
            thumbKey={thumbKey}
            key={idx}
          />
        </For>
      </div>
    );
  }
}

export default PhotoGrid;
