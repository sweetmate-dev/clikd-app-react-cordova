import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Immutable from 'immutable';

import { getGender, getPurposes, getOrientation } from '^/services/Utils';

import './ProfileInfo.scss';

@bem({ block: 'profile-info' })
class ProfileInfo extends Component {

  static propTypes = {
    profile: PropTypes.instanceOf(Immutable.Map),
  };

  formatHeight(value) {
    const totalInches = value / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.floor(totalInches % 12);
    return `${feet}'${inches}" (${value}cm)`;
  }

  render() {
    const profile = this.props.profile;
    const genderId = profile.get('genderId');
    const height = profile.get('height');
    const purposes = profile.get('purposes');
    const geoLocation = profile.get('geoLocation');
    const orientationId = profile.get('orientationId');
    const universityStudy = profile.get('universityStudy');
    const jobPassion = profile.get('jobPassion');
    const uniqueAboutYou = profile.get('uniqueAboutYou');
    const story = profile.get('story');
    return (
      <div className={this.block()}>
        <div className={this.element('row')}>
          <div className={this.element('label')}>Gender</div>
          <div className={this.element('value')}>{getGender(genderId)}</div>
        </div>
        <If condition={height}>
          <div className={this.element('row')}>
            <div className={this.element('label')}>Height</div>
            <div className={this.element('value')}>{this.formatHeight(height)}</div>
          </div>
        </If>
        <If condition={orientationId}>
          <div className={this.element('row')}>
            <div className={this.element('label')}>Sexuality</div>
            <div className={this.element('value')}>{getOrientation(orientationId)}</div>
          </div>
        </If>
        <If condition={purposes && purposes.size > 0}>
          <div className={this.element('row')}>
            <div className={this.element('label')}>Here for</div>
            <div className={this.element('value')}>{getPurposes(purposes)}</div>
          </div>
        </If>
        <If condition={geoLocation}>
          <div className={this.element('row')}>
            <div className={this.element('label')}>Location</div>
            <div className={this.element('value')}>{geoLocation}</div>
          </div>
        </If>
        <If condition={universityStudy}>
          <div className={this.element('row')}>
            <div className={this.element('label')}>Education</div>
            <div className={this.element('value')}>{universityStudy}</div>
          </div>
        </If>
        <If condition={jobPassion}>
          <div className={this.element('row')}>
            <div className={this.element('label')}>Job / Passion</div>
            <div className={this.element('value')}>{jobPassion}</div>
          </div>
        </If>
        <If condition={story}>
          <div className={this.element('row')}>
            <div className={this.element('label')}>My Story</div>
            <div className={this.element('value')}>{story}</div>
          </div>
        </If>
        <If condition={uniqueAboutYou}>
          <div className={this.element('row')}>
            <div className={this.element('label')}>Be Unique</div>
            <div className={this.element('value')}>{uniqueAboutYou}</div>
          </div>
        </If>
      </div>
    );
  }

}

export default ProfileInfo;
