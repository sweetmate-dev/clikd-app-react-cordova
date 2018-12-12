import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Tappable from 'react-tappable';

import IconPlus from '^/assets/icons/plus.svg';
import Icon from '^/components/icons/Icon';

import './DraggableGridAddButton.scss';

@bem({ block: 'draggable-grid-add-button' })
class DraggableGridAddButton extends Component {

  static propTypes = {
    onTap: PropTypes.func.isRequired,
  };

  static defaultProps = {
    fixed: true,
  };

  onTap = () => {
    this.props.onTap();
  }

  render() {
    return (
      <Tappable onTap={this.onTap}>
        <div className={this.block()}>
          <Icon button src={IconPlus} className={this.element('icon')} />
        </div>
      </Tappable>
    );
  }

}

export default DraggableGridAddButton;
