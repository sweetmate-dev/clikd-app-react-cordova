import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

import { List } from '^/components/lists';

import CheckboxItem from './CheckboxItem';

class CheckboxList extends Component {

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    theme: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.any,
    multiple: PropTypes.bool,
    maxAllowed: PropTypes.number,
    maxAllowedWarning: PropTypes.string,
    alertHandler: PropTypes.func,
  };

  onSelect = (value) => {
    const selected = this.isSelected(value);
    if (!selected) {
      if (this.props.multiple && this.props.maxAllowed && (this.props.maxAllowed == this.props.value.length)) {
        let message = this.props.maxAllowedWarning || `You can only select ${maxAllowed} of this item`;
        this.props.alertHandler({
          message: message
        });
        return;
      }
    }
    if (this.props.onChange) this.props.onChange(value);
  }

  isSelected(value) {
    if (this.props.multiple) {
      return this.props.value.indexOf(value) !== -1;
    }
    return _.isEqual(this.props.value, value);
  }

  render() {
    return (
      <List theme={this.props.theme}>
        <For each="item" of={this.props.items}>
          <CheckboxItem
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

export default CheckboxList;
