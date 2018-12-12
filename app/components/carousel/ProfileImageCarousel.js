import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Immutable from 'immutable';

import PreloadImage from '^/components/PreloadImage';
import Pagination from '^/components/pagination/Pagination';

import ReactSwipe from 'react-swipe';

import './ProfileImageCarousel.scss';

@bem({ block: 'profile-image-carousel' })
class ProfileImageCarousel extends Component {

  static propTypes = {
    images: PropTypes.instanceOf(Immutable.List),
  };

  state = {
    index: 0,
  };

  onChange = (index, elem) => {
    const images = this.props.images;
    index = index > images.size - 1 ? index - images.size : index;
    this.setState({ index });
  };

  render() {
    let images = this.props.images;
    const imageCount = images.size;
    if (imageCount == 2) {
      images = images.push(images.get(0), images.get(1));
    }
    return (
      <div className={this.block()}>
        <ReactSwipe key={imageCount} className={this.element('item')} swipeOptions={{ callback: this.onChange }}>
          <For each="image" index="idx" of={images}>
            <div key={idx}>
              <PreloadImage src={image} className={this.element('image')} />
            </div>
          </For>
        </ReactSwipe>
        <Pagination
            light
            length={imageCount}
            index={this.state.index}
            className={this.element('pagination')} />
      </div>
    );
  }
}

export default ProfileImageCarousel;
