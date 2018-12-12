import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import _ from 'lodash';

import DraggableGrid from '^/components/draggable-grid/DraggableGrid';
import DraggableGridAddButton from '^/components/draggable-grid/DraggableGridAddButton';
import { MAX_IMAGES } from '^/constants/Settings';
import Facebook from '^/services/Facebook';

import './ManagePhotosGrid.scss';
import ManagePhotosThumb from './ManagePhotosThumb';

@bem({ block: 'manage-photos-grid' })
class ManagePhotosGridWrapper extends Component {

  static propTypes = {
    photos: PropTypes.array.isRequired,
    onDelete: PropTypes.func,
    onAddTap: PropTypes.func,
    onChange: PropTypes.func,
  }

  getImage(photo) {
    if (photo.facebookPhotoId) {
      return Facebook.getImageUrl(photo.facebookPhotoId);
    } else if (photo.instagramUrl) {
      return photo.instagramUrl;
    } else if (photo.deviceUrl) {
      return photo.deviceUrl;
    }
    return _.get(photo, 'images.300x300');
  }

  getKey(photo) {
    return photo.photoId || photo.facebookPhotoId || photo.instagramUrl || photo.deviceUrl;
  }

  renderChildren() {
    const { photos, onDelete, onAddTap } = this.props;
    const output = [];
    for (let i = 0, len = photos.length; i < len; i++) {
      const photo = photos[i];
      output.push((
        <ManagePhotosThumb
          index={i}
          image={this.getImage(photo)}
          key={i}
          showDelete={len > 1}
          onDelete={onDelete}
        />
      ));
    }
    if (photos.length < MAX_IMAGES) {
      output.push(<DraggableGridAddButton key="add" onTap={onAddTap} />);
    }
    return output;
  }

  render() {
    return (
      <DraggableGrid
        numBlocks={MAX_IMAGES}
        blockClass={this.element('block')}
        onChange={this.props.onChange}
      >
        {this.renderChildren()}
      </DraggableGrid>
    );
  }

}

export default ManagePhotosGridWrapper;
