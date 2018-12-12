import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showAlert } from '^/actions/AppActions';

import CheckboxListRow from '^/components/forms-connected/CheckboxListRow';
import ManageDiscoverySettings from './ManageDiscoverySettings';
import SliderRow from '^/components/forms-connected/SliderRow';
import TextareaRow from '^/components/forms-connected/TextareaRow';
import ReadonlyRow from '^/components/forms-connected/ReadonlyRow';
import { List, ListRow, ListLabel } from '^/components/lists';
import { GENDER_CHOICE } from '^/constants/Settings';

import bem from 'react-bem-classes';
import {
  ORIENTATION,
  LOOKING_FOR,
  MAX_HEIGHT,
  MIN_HEIGHT,
  GENDER_IDENTITY,
} from '^/constants/Settings';

function mapStateToProps(state) {
  const { work, education, gender, birthday} = state.user.get('profile').toJS();
  return {
    work: work,
    education: education,
    gender: gender,
    birthday: new Date(birthday).toLocaleDateString('en-GB'),
  }
}

@connect(mapStateToProps, { showAlert })
@bem({ block: 'basic-info' })
class ManageProfileForm extends Component {

  formatHeight(value) {
    const totalInches = value / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.floor(totalInches % 12);
    return `${feet}'${inches}" (${value}cm)`;
  }

  render() {
    return (
      <List form>
        <ReadonlyRow
          label="Name"
          field="name"
          formName="manage-profile"
        />
        <SliderRow
          template={this.formatHeight}
          theme="white"
          label="Height"
          formName="manage-profile"
          field="height"
          alertHandler={this.props.showAlert}
          min={MIN_HEIGHT}
          max={MAX_HEIGHT}
        />
        <TextareaRow
          label="My Tagline"
          formName="manage-profile"
          field="tagLine"
          alertHandler={this.props.showAlert}
          maxLength={50}
          placeholder="• You - in 50 characters."
        />
        <TextareaRow
          label="Education"
          formName="manage-profile"
          field="universityStudy"
          alertHandler={this.props.showAlert}
          maxLength={50}
          placeholder="• School / Uni / Life"
        />
        <TextareaRow
          label="Job / Passion"
          formName="manage-profile"
          field="jobPassion"
          alertHandler={this.props.showAlert}
          maxLength={50}
          placeholder="• What's your gig? what you into?"
        />
        <TextareaRow
          label="My Story"
          formName="manage-profile"
          field="story"
          alertHandler={this.props.showAlert}
          maxLength={250}
          large={true}
          placeholder="• Tell us about you, how did you get here."
        />
        <TextareaRow
          label="Im Unique"
          formName="manage-profile"
          field="uniqueAboutYou"
          alertHandler={this.props.showAlert}
          maxLength={50}
          placeholder="• because...tell us why your special."
        />
        <CheckboxListRow
          multiple
          itemTheme="white"
          label="Here for"
          formName="manage-profile"
          field="purposes"
          maxAllowed={2}
          maxAllowedWarning='You can only select a maximum of 2 "Here for" options'
          alertHandler={this.props.showAlert}
          items={LOOKING_FOR}
        />
        <CheckboxListRow
          itemTheme="white"
          label="I am looking for a"
          formName="manage-profile"
          field="genderChoices"
          multiple
          items={GENDER_CHOICE}
        />
        <ManageDiscoverySettings />
        <CheckboxListRow
          itemTheme="white"
          label="I would describe myself as"
          formName="manage-profile"
          field="orientationId"
          alertHandler={this.props.showAlert}
          items={ORIENTATION}
        />
        <CheckboxListRow
         itemTheme="white"
          label="I'm"
          formName="manage-profile"
          field="genderDescription"
          alertHandler={this.props.showAlert}
          items={GENDER_IDENTITY}
        />
        <ListRow stacked theme={this.props.theme} className={this.block()}>
          <ListLabel>Info From Facebook</ListLabel>
          <If condition={this.props.gender}>
            <ReadonlyRow
              label="Gender"
              field="gender"
              formName="manage-profile"
            />
          </If>
          <If condition={this.props.birthday}>
            <ReadonlyRow
              label="Birthday"
              field="birthday"
              formName="manage-profile"
              value={this.props.birthday}
            />
          </If>
        </ListRow>
      </List>
    );
  }

}

export default ManageProfileForm;
