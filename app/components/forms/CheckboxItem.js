import Hammer from 'react-hammerjs';
import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';

import IconCheckbox from '^/assets/icons/checkbox.svg';
import IconCheckboxSelected from '^/assets/icons/checkbox-selected.svg';
import Icon from '^/components/icons/Icon';
import { ListRow, ListLabel } from '^/components/lists';

import './CheckboxItem.scss';

@bem({ block: 'checkbox-item' })
class CheckboxItem extends Component {

  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.any,
    theme: PropTypes.string,
    size: PropTypes.string,
    onTap: PropTypes.func,
    isSelected: PropTypes.bool,
  }

  onTap = () => {
    if (this.props.onTap) this.props.onTap(this.props.value);
  }

  render() {
    const icon = this.props.isSelected ? IconCheckboxSelected : IconCheckbox;
    return (
      <Hammer onTap={this.onTap}>
        <ListRow theme={this.props.theme} size={this.props.size} className={this.block()}>
          <ListLabel>
            {this.props.label}
          </ListLabel>
          <Icon src={icon} className={this.element('button', { selected: this.props.isSelected })} />
        </ListRow>
      </Hammer>
    );
  }

}

export default CheckboxItem;
