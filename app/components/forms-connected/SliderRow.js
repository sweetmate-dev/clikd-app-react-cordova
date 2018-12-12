import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { isFunction } from 'lodash';

import { updateValue } from '^/actions/FormActions';
import Slider from '^/components/forms/Slider';
import { ListRow, ListLabel, ListContent } from '^/components/lists';


/*
Connected form row with a slider as input
*/

function mapStateToProps(state, ownProps) {
  return {
    value: state.forms.getIn([ownProps.formName, 'fields', ownProps.field]),
    value2: ownProps.field2 ? state.forms.getIn([ownProps.formName, 'fields', ownProps.field2]) : null,
  };
}

@connect(mapStateToProps, { updateValue })
class SliderRow extends Component {

  static propTypes = {
    label: PropTypes.string.isRequired,
    formName: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    field2: PropTypes.string,
    max: PropTypes.number.isRequired,
    min: PropTypes.number,
    step: PropTypes.number,
    template: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    theme: PropTypes.string,
    value: PropTypes.any,
    value2: PropTypes.any,
    updateValue: PropTypes.func,
  };

  static defaultProps = {
    template: '{0}',
    min: 0,
  }

  componentWillMount() {
    this.isMultiple = Boolean(this.props.field2);
  }

  componentWillReceiveProps(newProps) {
    this.isMultiple = Boolean(newProps.field2);
  }

  onChange = (value) => {
    if (this.isMultiple) {
      this.props.updateValue(this.props.formName, this.props.field, value[0]);
      this.props.updateValue(this.props.formName, this.props.field2, value[1]);
    } else {
      this.props.updateValue(this.props.formName, this.props.field, value);
    }
  }

  getValue() {
    if (this.isMultiple) {
      return [this.props.value || this.props.min, this.props.value2 || this.props.max];
    }
    return this.props.value || this.props.min;
  }

  formatValue(value) {
    if (isFunction(this.props.template)) {
      return this.props.template(value);
    } else if (this.isMultiple) {
      return this.props.template.replace('{0}', value[0]).replace('{1}', value[1]);
    }
    return this.props.template.replace('{0}', value);
  }

  render() {
    const value = this.getValue();
    const { theme, label, step, min, max, field2 } = this.props;
    return (
      <ListRow stacked theme={theme}>
        <ListLabel subtext={this.formatValue(value)}>{label}</ListLabel>
        <ListContent>
          <Slider
            isMultiple={this.isMultiple}
            onChange={this.onChange}
            value={value}
            range={Boolean(field2)}
            step={step}
            min={min}
            max={max}
          />
        </ListContent>
      </ListRow>
    );
  }

}

export default SliderRow;