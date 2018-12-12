import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Hammer from 'react-hammerjs';
import TweenLite from 'gsap/src/uncompressed/TweenLite';
import { clamp } from 'lodash';

import { getClosestIndex } from '^/services/Utils';

import './Carousel.scss';
import CarouselTrack from './CarouselTrack';

@bem({ block: 'carousel' })
class Carousel extends Component {

  static propTypes = {
    offset: PropTypes.number,
    infinite: PropTypes.bool,
    onBeforeChange: PropTypes.func,
    onPositionChange: PropTypes.func,
    onChange: PropTypes.func,
    slideClass: PropTypes.string,
    children: PropTypes.node,
  };

  static defaultProps = {
    offset: 0,
    infinite: false,
  };

  state = {
    position: 0,
    childWidths: [],
    offsets: [],
    outerWidth: null,
    innerWidth: null,
  };

  componentWillUnmount() {
    if (this.tween) this.tween.kill();
  }

  onLayoutChange = (innerWidth, outerWidth, childWidths) => {
    const maxPan = innerWidth - outerWidth;
    /* Calculate the left offset of each child based on the width of the
    preceeding children */
    let offset = 0;
    const offsets = [0];
    childWidths.forEach((width) => {
      offset += width;
      offsets.push(offset);
    });

    let position = this.state.position;
    if (this.props.currentIndex) {
      position = offsets[this.props.currentIndex]
    }

    this.setState({ innerWidth, outerWidth, childWidths, maxPan, offsets, position });
  }

  onPanStart = () => {
    this.startPos = this.state.position;
  }

  onPan = (ev) => {
    const position = this.startPos - ev.deltaX;
    this.setPosition(position);
  }

  onPanEnd = () => {
    let nextIndex = getClosestIndex(this.state.offsets, this.state.position);
    if(this.props.inifinite){
      nextIndex %= this.state.childWidths.length;
    }
    this.toIndex(nextIndex);
  }

  setPosition(pos) {
    let position = pos;
    if (this.props.infinite) {
      if (position < 0) {
        position += this.state.innerWidth;
      } else if (position > this.state.maxPan) {
        position -= this.state.innerWidth;
      }
    }
    if (this.props.onPositionChange) {
      const index = getClosestIndex(this.state.offsets, position);
      this.props.onPositionChange(position, index);
    }
    this.setState({ position });

  }

  toIndex(index) {
    const position = this.state.offsets[index];
    const startPos = this.state.position;
    let endPos = position;
    if (this.props.infinite) {
      /* Determine the shortest route */
      const dist1 = this.state.innerWidth - startPos + position;
      const dist2 = startPos - position;
      endPos = (dist1 < dist2) ? startPos + dist1 : startPos - dist2;
    } else {
      /* Limit the pan to the visible area */
      endPos = clamp(endPos, 0, this.state.maxPan);
    }
    /* Event handlers */
    const toIndex = getClosestIndex(this.state.offsets, endPos);
    if (this.props.onBeforeChange) this.props.onBeforeChange(toIndex);
    /* Animate */
    const tween = { pos: startPos };
    this.tween = TweenLite.to(tween, 0.2, {
      pos: endPos,
      onUpdate: () => {
        this.setPosition(tween.pos);
      },
      onComplete: () => {
        if (this.props.onChange) this.props.onChange(toIndex);
      },
    });
  }

  render() {
    const position = this.props.offset - this.state.position;
    const style = { transform: `translateX(${position}px)` };
    return (
      <Hammer onPanStart={this.onPanStart} onPan={this.onPan} onPanEnd={this.onPanEnd}>
        <div className={this.block()}>
          <div className={this.element('inner')} style={style}>
            <CarouselTrack
              onLayoutChange={this.onLayoutChange}
              outerWidth={this.state.outerWidth}
              childWidths={this.state.childWidths}
              innerWidth={this.state.innerWidth}
              infinite={this.props.infinite}
              slideClass={this.props.slideClass}
              offset={this.props.offset}
            >
              {this.props.children}
            </CarouselTrack>
          </div>
        </div>
      </Hammer>
    );
  }
}

export default Carousel;
