import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';

import './CarouselSlide.scss';

@bem({ block: 'carousel-slide' })
class CarouselSlide extends Component {

  static propTypes ={
    style: PropTypes.object,
    children: PropTypes.node,
  };

  render() {
    return (
      <div className={this.block()} style={this.props.style}>
        {this.props.children}
      </div>
    );
  }

}

export default CarouselSlide;
