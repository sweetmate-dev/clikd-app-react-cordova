import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Hammer from 'react-hammerjs';

import './DraggableGridItem.scss';

@bem({ block: 'draggable-grid-item' })
class DraggableGridItem extends Component {

  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    index: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    onPan: PropTypes.func.isRequired,
    onPanEnd: PropTypes.func.isRequired,
    children: PropTypes.node,
    fixed: PropTypes.bool,
  }

  state = {
    isPanning: false,
  }

  onPanStart = () => {
    this.panStartX = this.props.x;
    this.panStartY = this.props.y;
    this.setState({
      isPanning: true,
      panX: this.props.x,
      panY: this.props.y,
    });
  }

  onPan = (ev) => {
    if (!this.props.fixed && this.panStartX > 0 && this.panStartY > 0) {
      const panX = this.panStartX + ev.deltaX;
      const panY = this.panStartY + ev.deltaY;
      this.setState({ panX, panY, center_x: ev.center.x, center_y: ev.center.y });
      // this.props.onPan(this.props.index, ev.center.x, ev.center.y);
    }
  }

  onPanEnd = () => {
    if (!this.props.fixed) {
      this.props.onPanEnd(this.props.index, this.state.center_x, this.state.center_y);
    }
    this.setState({ isPanning: false });
  }

  render() {
    const isPanning = this.state.isPanning;
    const x = isPanning ? this.state.panX : this.props.x;
    const y = isPanning ? this.state.panY : this.props.y;
    const style = {
      left: `${x}px`,
      top: `${y}px`,
      width: `${this.props.width}px`,
      height: `${this.props.height}px`,
    };
    return (
      <Hammer direction="DIRECTION_ALL" onPanStart={this.onPanStart} onPan={this.onPan} onPanEnd={this.onPanEnd}>
        <div className={this.block({ isPanning })} style={style}>
          {this.props.children}
        </div>
      </Hammer>
    );
  }
}

export default DraggableGridItem;
