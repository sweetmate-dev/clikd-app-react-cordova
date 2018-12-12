import React, { Component } from 'react';
import bem from 'react-bem-classes';
import Hammer from 'react-hammerjs';
import _ from 'lodash';

import './ProfileListItem.scss';

const PAN_BOUNCE = 30;

@bem({ block: 'profile-list-item' })
class ProfileListItem extends Component {

  state = {
    offsetX: 0,
    isPanning: false,
  }

  onPanStart = () => {
    this.offsetStart = this.state.offsetX;
  }

  onPan = (ev) => {
    const offset = this.offsetStart + ev.deltaX;
    const max = this.props.draggableDistance;
    this.setState({
      isPanning: true,
      offsetX: _.clamp(offset, 0, max + PAN_BOUNCE),
    });
  }

  onPanEnd = (ev) => {
    const offset = this.offsetStart + ev.deltaX;
    const max = this.props.draggableDistance;
    this.setState({
      isPanning: false,
      offsetX: offset > max / 2 ? max : 0,
    });
  }

  setOffset(val) {
    this.setState({ offsetX: val });
  }

  render() {
    const hammerProps = {};
    const style = {};
    const isPanning = this.state.isPanning;
    if (this.props.draggableDistance) {
      hammerProps.onPanStart = this.onPanStart;
      hammerProps.onPan = this.onPan;
      hammerProps.onPanEnd = this.onPanEnd;
      style.transform = `translateX(${this.state.offsetX}px)`;
    }
    return (
      <Hammer {...hammerProps} >
        <div className={this.block({ isPanning })} style={style} >
          {this.props.children}
        </div>
      </Hammer>
    );
  }

}

export default ProfileListItem;
