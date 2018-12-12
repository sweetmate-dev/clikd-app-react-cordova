import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Hammer from 'react-hammerjs';
import Immutable from 'immutable';

import PreloadImage from '^/components/PreloadImage';

import './PhotoGridItem.scss';

@bem({ block: 'photo-grid-item' })
class PhotoGridItem extends Component {

  static propTypes = {
    thumbKey: PropTypes.arrayOf(PropTypes.string).isRequired,
    photo: PropTypes.instanceOf(Immutable.Map).isRequired,
    onTap: PropTypes.func.isRequired,
  }

  onTap = () => {
    this.props.onTap(this.props.photo);
  }

  render() {
    const { photo, thumbKey } = this.props;
    const thumb = photo.getIn(thumbKey);
    return (
      <Hammer onTap={this.onTap}>
        <PreloadImage src={thumb} className={this.block()} />
      </Hammer>
    );
  }
}

export default PhotoGridItem;
