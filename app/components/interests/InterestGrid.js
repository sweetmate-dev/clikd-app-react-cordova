import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';

import { Interests } from '^/constants/Interests';

import './InterestGrid.scss';
import InterestGridItem from './InterestGridItem';

@bem({ block: 'interest-grid' })
class InterestGrid extends Component {

  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    value: PropTypes.array.isRequired,
  }

  isSelected(id) {
    return this.props.value.indexOf(id) !== -1;
  }

  render() {
    return (
      <div className={this.block()}>
        <For each="interest" of={Interests}>
          <InterestGridItem
            {...interest}
            key={interest.id}
            onTap={this.props.onSelect}
            selected={this.isSelected(interest.id)}
          />
        </For>
      </div>
    );
  }

}

export default InterestGrid;
