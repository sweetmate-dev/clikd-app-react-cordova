import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Tappable from 'react-tappable';

import IconCross from '^/assets/icons/cross.svg';
import Icon from '^/components/icons/Icon';

import './DraggableGridDeleteIcon.scss';

@bem({ block: 'draggable-grid-delete-icon' })
class DraggableGridDeleteIcon extends Component {

  static propTypes = {
    onTap: PropTypes.func.isRequired,
    context: PropTypes.any,
  };

  onTap = (e) => {
    e.stopPropagation();
    this.props.onTap(this.props.context);
  }

  render() {
    return (
      <Tappable onTap={this.onTap} className={this.block()}>
        <Icon src={IconCross} className={this.element('icon')} />
      </Tappable>
    );
  }

}

export default DraggableGridDeleteIcon;
