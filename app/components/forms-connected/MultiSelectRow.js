import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import bem from 'react-bem-classes';
import Immutable from 'immutable';

import { updateValue } from '^/actions/FormActions';
import { List, ListRow, ListLabel, ListContent } from '^/components/lists';

import './MultiSelectRow.scss';

/*
Connected form row with a textarea as input
*/

function mapStateToProps(state, ownProps) {
  return {
    value: state.forms.getIn([ownProps.formName, 'fields', ownProps.field]) || new Immutable.List(),
  };
}

@connect(mapStateToProps, { updateValue })
@bem({ block: 'multi-select-row' })
class MultiSelectRow extends Component {

  static propTypes = {
    label: PropTypes.string.isRequired,
    formName: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    updateValue: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.array.isRequired,
    theme: PropTypes.string,
    itemTheme: PropTypes.string,
    items: PropTypes.array.isRequired,
  };

  onChange = (e) => {
    const options = Array.prototype.slice.call(e.target.selectedOptions);
    const values = options.map(option => option.value);
    this.props.updateValue(this.props.formName, this.props.field, values);
  }


  render() {
    const { theme, itemTheme, label, items, placeholder, value } = this.props;
    const selected = `${this.props.value.length} selected`;
    return (
      <ListRow stacked theme={theme} className={this.block()}>
        <ListLabel>{label}</ListLabel>
        <List>
          <ListRow theme={itemTheme} className={this.element('wrapper')}>
            <ListLabel subtext={selected}>{placeholder}</ListLabel>
            <select value={value} multiple onChange={this.onChange}>
              <For each="item" of={items}>
                <option 
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              </For>
            </select>
          </ListRow>
        </List>
      </ListRow>
    );
  }

}

export default MultiSelectRow;
