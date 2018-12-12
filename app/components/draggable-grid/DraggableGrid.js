import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import _ from 'lodash';
import { findDOMNode } from 'react-dom';

import './DraggableGrid.scss';
import DraggableGridItem from './DraggableGridItem';

@bem({ block: 'draggable-grid' })
class DraggableGrid extends Component {

  state = {
    layout: null,
  }

  onPan = (index, pointerX, pointerY) => {
    const gridX = pointerX - this.gridLeft;
    const gridY = pointerY - this.gridTop;
    const block = this.getBlockForPoint(gridX, gridY);
    if (block !== null && block !== index) {
      this.props.onChange(index, block);
    }
  }

  onPanEnd = (index, pointerX, pointerY) => {
    const gridX = pointerX - this.gridLeft;
    const gridY = pointerY - this.gridTop;
    const block = this.getBlockForPoint(gridX, gridY);
    if (block !== null && block !== index) {
      this.props.onChange(index, block);
    }
  }

  getBlockForPoint(x, y) {
    const layout = this.state.layout;
    for (let i = 0; i < this.props.numBlocks; i++) {
      const bounds = layout[i];
      if (x > bounds.x && x < bounds.x + bounds.width && y > bounds.y && y < bounds.y + bounds.height) {
        return i;
      }
    }
    return null;
  }

  renderBlocks() {
    this.blocks = {};
    const output = [];
    const className = `${this.element('block')} ${this.props.blockClass}`;
    for (let i = 0; i < this.props.numBlocks; i++) {
      const el = this.renderBlock(i, className);
      output.push(el);
    }
    return output;
  }

  renderBlock(index, className) {
    return <div className={className} key={index} ref={(c) => { this.blocks[index] = c; }} />;
  }

  componentDidMount() {
    /* Get the dimensions for all rendered blocks */
    const layout = [];
    const gridBounds = this.el.getBoundingClientRect();
    const gridLeft = gridBounds.left;
    const gridTop = gridBounds.top;
    for (let i = 0; i < this.props.numBlocks; i++) {
      const item = findDOMNode(this.blocks[i]);
      const itemBounds = item.getBoundingClientRect();
      layout.push({
        x: itemBounds.left - gridLeft,
        y: itemBounds.top - gridTop,
        width: itemBounds.width,
        height: itemBounds.height,
      });
    }
    this.gridLeft = gridLeft;
    this.gridTop = gridTop;
    this.setState({ layout });
  }

  renderChildren() {
    const layout = this.state.layout;
    /* The order the children are rendered in the DOM needs to remain the same for CSS transitions
    to work. Children are sorted by key to maintain a consistant order */
    const children = _.isArray(this.props.children) ? this.props.children : [this.props.children];
    const keys = children.map(child => child.key);
    children.sort((a, b) => a.key > b.key);
    return children.map((child) => {
      const index = keys.indexOf(child.key);
      return (
        <DraggableGridItem
          {...layout[index]}
          index={index}
          key={child.key}
          onPan={this.onPan}
          onPanEnd={this.onPanEnd}
          fixed={child.props.fixed}
        >
          {child}
        </DraggableGridItem>
      );
    });
  }

  render() {
    return (
      <div className={this.block()} ref={(c) => { this.el = c; }}>
        { this.renderBlocks() }
        { this.state.layout ? this.renderChildren() : null }
      </div>
    );
  }
}

export default DraggableGrid;
