import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import _ from 'lodash';
import { findDOMNode } from 'react-dom';
import Immutable from 'immutable';

import './CarouselTrack.scss';
import CarouselSlide from './CarouselSlide';

const MAX_CLONES = 10;

@bem({ block: 'carousel-track' })
class CarouselTrack extends Component {

  static propTypes = {
    childWidths: PropTypes.arrayOf(PropTypes.number),
    outerWidth: PropTypes.number,
    offset: PropTypes.number,
    onLayoutChange: PropTypes.func.isRequired,
    infinite: PropTypes.bool,
    slideClass: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  };

  state = {
    mounted: false,
    childWidths: [],
    outerWidth: null,
    innerWidth: null,
  };

  slides = {};

  componentDidMount() {
    this.hasMounted = true;
    this.calculateLayout();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(nextState, this.state) || !_.isEqual(nextProps, this.props);
  }

  componentDidUpdate() {
    this.calculateLayout();
  }


  getClones(children, startIndex, increment) {
    if (!this.hasMounted) return null;
    const output = [];
    const childWidths = this.props.childWidths;
    const max = children.length - 1;
    let width = this.props.outerWidth + this.props.offset;
    let index = startIndex;
    const method = increment > 0 ? 'push' : 'unshift';
    for (let i = 0; i < MAX_CLONES; i++) {
      const clone = this.renderChild(children[index], index, `clone-${increment}-${i}-${index}`);
      output[method](clone);
      width -= childWidths[index];
      if (width <= 0) break;
      index += increment;
      if (index < 0) index = max;
      else if (index > max) index = 0;
    }
    return output;
  }

  calculateLayout() {
    this.el.style.removeProperty('width');
    const outerWidth = this.el.offsetWidth;
    /* Explicitly set widths for the container and all children */
    const children = this.getChildren();
    const childWidths = [];
    let innerWidth = 0;
    children.forEach((child, i) => {
      const el = findDOMNode(this.slides[i]);
      const width = el.offsetWidth;
      innerWidth += width;
      childWidths.push(width);
    });
    this.el.style.width = `${innerWidth}px`;
    this.props.onLayoutChange(innerWidth, outerWidth, childWidths);
  }

  renderChild(child, idx, key) {
    const childWidth = this.props.childWidths[idx];
    const style = { width: childWidth ? `${childWidth}px` : null };
    return (
      <CarouselSlide
        ref={(c) => { this.slides[key || idx] = c; }}
        key={key || idx}
        className={this.props.slideClass}
        style={style}
      >
        {child}
      </CarouselSlide>
    );
  }

  getChildren() {
    let children = this.props.children;
    if (Immutable.List.isList(children)) children = children.toArray();
    return _.isArray(children) ? children : [children];
  }

  render() {
    // Cast single children to array
    const children = this.getChildren();
    return (
      <div className={this.block()} ref={(c) => { this.el = c; }}>
        <For each="child" index="idx" of={children}>
          {this.renderChild(child, idx)}
        </For>
        <If condition={this.props.infinite}>
          <div className={this.element('clones', { before: true })}>
            {this.getClones(children, children.length - 1, -1)}
          </div>
          <div className={this.element('clones', { after: true })}>
            {this.getClones(children, 0, 1)}
          </div>
        </If>
      </div>
    );
  };
};

export default CarouselTrack;
