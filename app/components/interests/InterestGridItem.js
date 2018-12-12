import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Hammer from 'react-hammerjs';

import IconTick from '^/assets/icons/tick.svg';
import Icon from '^/components/icons/Icon';

import './InterestGridItem.scss';

@bem({ block: 'interest-grid-item', modifiers: ['selected'] })
class InterestGridItem extends Component {

  static propTypes = {
    id: PropTypes.number,
    onTap: PropTypes.func.isRequired,
    name: PropTypes.string,
    image: PropTypes.string,
  };

  onTap = () => {
    this.props.onTap(this.props.id);
  }

  render() {
    const { name, image } = this.props;
    const style = { backgroundImage: `url(${image})` };
    return (
      <Hammer onTap={this.onTap}>
        <div className={this.block()} style={style}>
          <span className={this.element('label')}>
            {name}
          </span>
          <Icon src={IconTick} className={this.element('icon')} />
        </div>
      </Hammer>
    );
  };
};

export default InterestGridItem;
