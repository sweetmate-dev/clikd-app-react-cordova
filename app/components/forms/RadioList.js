import React, { PropTypes } from 'react';

import { List } from '^/components/lists';

import RadioItem from './RadioItem';


class RadioList extends React.Component {

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    theme: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.any,
  };

  onSelect = (value) => {
    if (this.props.onChange) this.props.onChange(value);
  }

  isSelected(value) {
    return this.props.value === value;
  }

  render() {
    return (
      <List theme={this.props.theme}>
        <For each="item" of={this.props.items}>
          <RadioItem
            isSelected={this.isSelected(item.value)}
            onTap={this.onSelect}
            key={item.value}
            {...item}
          />
        </For>
      </List>
    );
  }

}

export default RadioList;
