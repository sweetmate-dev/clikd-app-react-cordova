import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { toggleValue, addOrRemoveValue } from '^/actions/FormActions';
import CheckboxList from '^/components/forms/CheckboxList';
import { ListRow, ListLabel } from '^/components/lists';

/*
Connected form row with a checkbox list as input
*/

function mapStateToProps(state, ownProps) {
  return {
    value: state.forms.getIn([ownProps.formName, 'fields', ownProps.field]),
  };
}

@connect(mapStateToProps, { toggleValue, addOrRemoveValue })
class CheckboxListRow extends Component {

  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  };

  static propTypes = {
    label: PropTypes.string.isRequired,
    formName: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    multiple: PropTypes.bool,
    theme: PropTypes.string,
    addOrRemoveValue: PropTypes.func,
    onChangeCallback: PropTypes.func,
    toggleValue: PropTypes.func,
    items: PropTypes.arrayOf(PropTypes.object),
    allowEmpty: PropTypes.bool,
    maxAllowed: PropTypes.number,
    maxAllowedWarning: PropTypes.string,
    alertHandler: PropTypes.func,
  };

  static defaultProps = {
    allowEmpty: true,
  }

  onChange = (value) => {
    if (this.props.multiple) {
      this.props.addOrRemoveValue(this.props.formName, this.props.field, value);
    } else {
      if (this.props.allowEmpty || value !== this.props.value) {
        this.props.toggleValue(this.props.formName, this.props.field, value);
      }
    }
    if (this.props.onChangeCallback) {
        const state = this.context.store.getState();
        const newValue = state.forms.getIn([this.props.formName, 'fields', this.props.field]);
        this.props.onChangeCallback(this.props.field, newValue);
    }
  }

  render() {
    return (
      <ListRow stacked theme={this.props.theme}>
        <ListLabel>{this.props.label}</ListLabel>
        <CheckboxList
          multiple={this.props.multiple}
          theme={this.props.itemTheme}
          value={this.props.value}
          items={this.props.items}
          maxAllowed={this.props.maxAllowed}
          maxAllowedWarning={this.props.maxAllowedWarning}
          onChange={this.onChange}
          onClick={this.onClick}
          alertHandler={this.props.alertHandler}
        />
      </ListRow>
    );
  }

}

export default CheckboxListRow;
