import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import bem from 'react-bem-classes';

import { updateValue } from '^/actions/FormActions';
import { ListRow, ListLabel } from '^/components/lists';

import './ReadonlyRow.scss';

/*
Connected form row with a textarea as input
*/

function mapStateToProps(state, ownProps) {
  const value = (ownProps.value) ? ownProps.value : state.forms.getIn([ownProps.formName, 'fields', ownProps.field])
  return {
    value: value,
  };
}

@connect(mapStateToProps, { updateValue })
@bem({ block: 'readonly-row' })
class ReadonlyRow extends Component {

  static propTypes = {
    label: PropTypes.string.isRequired,
    formName: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    value: PropTypes.string,
    theme: PropTypes.string,
  };

  render() {
    return (
      <ListRow stacked theme={this.props.theme} className={this.block()}>
        <div className={this.element('label')}>{this.props.label}</div>
        <div className={this.element('value')}>{this.props.value || ''}</div>
      </ListRow>
    );
  }

}

export default ReadonlyRow;
