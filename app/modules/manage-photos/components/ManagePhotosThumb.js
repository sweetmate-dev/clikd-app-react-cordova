import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';

import DraggableGridDeleteIcon from '^/components/draggable-grid/DraggableGridDeleteIcon';
import PreloadImage from '^/components/PreloadImage';

import './ManagePhotosThumb.scss';

@bem({ block: 'manage-photos-thumb' })
class ManagePhotosThumb extends Component {

  static propTypes = {
    showDelete: PropTypes.bool,
    image: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    index: PropTypes.number,
  };

  render() {
    return (
      <PreloadImage src={this.props.image} className={this.block()}>
        <If condition={this.props.showDelete}>
          <DraggableGridDeleteIcon onTap={this.props.onDelete} context={this.props.index} />
        </If>
      </PreloadImage>
    );
  }

}

export default ManagePhotosThumb;

