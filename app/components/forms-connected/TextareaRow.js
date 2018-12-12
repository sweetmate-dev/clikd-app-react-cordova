import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import bem from 'react-bem-classes';

import { updateValue } from '^/actions/FormActions';
import { ListRow, ListLabel } from '^/components/lists';

import './TextareaRow.scss';

/*
Connected form row with a textarea as input
*/

function mapStateToProps(state, ownProps) {
  return {
    value: state.forms.getIn([ownProps.formName, 'fields', ownProps.field]),
  };
}

@connect(mapStateToProps, { updateValue })
@bem({ block: 'textarea-row', modifiers: [ 'large' ] })
class TextareaRow extends Component {

  static propTypes = {
    label: PropTypes.string.isRequired,
    formName: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    maxLength: PropTypes.number,
    updateValue: PropTypes.func,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    theme: PropTypes.string,
    large: PropTypes.bool,
  };

  onChange = (e) => {
    this.props.updateValue(this.props.formName, this.props.field, e.target.value);
  }

  render() {
    let remaining;
    if (this.props.maxLength) {
      const inputLength = this.props.value ? this.props.value.length : 0;
      remaining = String(this.props.maxLength - inputLength);
    }
    return (
      <ListRow stacked theme={this.props.theme} className={this.block()}>
        <ListLabel subtext={remaining}>{this.props.label}</ListLabel>
        <textarea maxLength={this.props.maxLength} onChange={this.onChange} value={this.props.value || ''} placeholder={this.props.placeholder || ''} />
      </ListRow>
    );
  }

}

export default TextareaRow;
