import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import { connect } from 'react-redux';

import { setRegistrationStep } from '^/actions/AppActions';
import { NAVIGATION_FORWARDS } from '^/actions/NavigationActions';
import { initForm } from '^/actions/FormActions';
import UserProfileImage from '^/components/user/UserProfileImage';
import { Screen, Content } from '^/components/layout';
import Logo from '^/components/icons/Logo';
import Facebook from '^/services/Facebook';

import './RegistrationDetails.scss';
import RegistrationDetailsList from './components/RegistrationDetailsList';
import RegistrationDetailsButton from './components/RegistrationDetailsButton';

function mapStateToProps(state) {
  return {
    profile: state.user.get('profile').toJS(),
    navigationDirection: state.navigation.get('direction')
  }
}

@connect(mapStateToProps, { setRegistrationStep })
@bem({block: 'registration-details'})
class RegistrationDetails extends Component {


  componentWillMount(){
    this.props.setRegistrationStep(1);
  }

  render() {
    const profile = this.props.profile;
    return (
      <Screen className={this.block()}>
        <Content className={this.element('content')}>
          <div className={this.element('header')}>
            <Logo className={this.element('logo')} />
            <h2>Welcome, {profile.name}</h2>
            <p>We've got your details.  You can edit your profile in full once you're set up.</p>
          </div>
          <UserProfileImage 
            className={this.element('profile-image')}
            name={profile.name}
            age={profile.age}
            image={profile.profilePhoto.images['600x600']} />
          <RegistrationDetailsList
            genderId={profile.genderId}
            location={profile.location}
            education={profile.education}
            work={profile.work}
          /> 
        </Content>
        <RegistrationDetailsButton 
          className={this.element('button')}
        />
      </Screen>
    );
  };
};

export default RegistrationDetails;
