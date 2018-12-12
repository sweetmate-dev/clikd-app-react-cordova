import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';

import Carousel from '^/components/carousel/Carousel';

import './FilmStrip.scss';

@bem({ block: 'film-strip' })
class FilmStrip extends Component {

  static propTypes = {
    children: PropTypes.node,
    options: PropTypes.object,
  };

  toIndex(index) {
    this.carousel.toIndex(index);
  }

  render() {
    return (
      <div className={this.block()}>
        <Carousel {...this.props.options} slideClass={this.element('item')} ref={(c) => { this.carousel = c; }}>
          {this.props.children}
        </Carousel>
      </div>
    );
  }
}

export default FilmStrip;
