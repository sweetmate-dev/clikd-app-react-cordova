import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import { connect } from 'react-redux';

import { toggleValue, updateValue } from '^/actions/FormActions';
import { ListLabel, ListRow, ListRowWrapper } from '^/components/lists';
import CheckboxItem from '^/components/forms/CheckboxItem';
import { GENDER, GENDER_IDENTITY } from '^/constants/Settings';

import './RegistrationGenderSelect.scss';

function mapStateToProps(state, ownProps){
  return {
    genderId: state.forms.getIn(['registration', 'fields', 'genderId']),
    genderDescription: state.forms.getIn(['registration', 'fields', 'genderDescription'])
  }
}

@connect(mapStateToProps, { toggleValue, updateValue })
@bem({block: 'registration-gender-select'})
class RegistrationGenderSelect extends Component {

  onGenderSelect = (value) => {
    this.props.updateValue('registration', 'genderId', value);
  };

  onGenderIdentitySelect = (value) => {
    this.props.toggleValue('registration', 'genderDescription', value);
  };

  render() {
    const { gender, location, work, education } = this.props;
    return (
      <div className={this.block()}>
        <ListRow stacked theme="dark" size="small" className={this.element('row')}>
          <ListLabel>Gender</ListLabel>
          <ListRowWrapper>
            <For each="gender" of={GENDER}>
              <CheckboxItem
                key={gender.value}
                theme="med-block"
                size="small"
                label={gender.label}
                value={gender.value}
                isSelected={this.props.genderId == gender.value}
                onTap={this.onGenderSelect} />
            </For>
          </ListRowWrapper>
        </ListRow>
        <ListRow stacked theme="dark" size="small" className={this.element('row')}>
          <ListLabel>I'd also describe myself as</ListLabel>
          <CheckboxItem
            label={GENDER_IDENTITY[0].label}
            value={GENDER_IDENTITY[0].value}
            onTap={this.onGenderIdentitySelect}
            isSelected={Boolean(this.props.genderDescription)}
            theme="med-block"
            size="small"
          />
        </ListRow>
        </div>
    );
  };
};

export default RegistrationGenderSelect;
