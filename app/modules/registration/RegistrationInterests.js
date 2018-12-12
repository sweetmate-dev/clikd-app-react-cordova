import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import { connect } from 'react-redux';

import { setRegistrationStep, toggleLoader, showAlert } from '^/actions/AppActions';
import { updateSelf } from '^/actions/ApiActions';
import { addOrRemoveValue } from '^/actions/FormActions';
import { navigateTo } from '^/actions/NavigationActions';
import { Screen, Content } from '^/components/layout';
import { TitleBar, Title } from '^/components/navigation';
import InterestGrid from '^/components/interests/InterestGrid';
import { MAX_INTERESTS } from '^/constants/Interests';
import { GENERIC_ERROR_MESSAGE, GENERIC_ERROR_TITLE } from '^/constants/Messages';

import './RegistrationInterests.scss';
import InterestButton from './components/InterestButton';

function mapStateToProps(state){
  return {
    updateSelfBusy: state.user.get('updateSelfBusy'),
    updateSelfError: state.user.get('updateSelfError'),
    interests: state.forms.getIn(['registration', 'fields', 'interests']) || [],
  };
}

@connect(mapStateToProps, { setRegistrationStep, updateSelf, addOrRemoveValue, toggleLoader, showAlert, navigateTo })
@bem({ block: 'registration-interests' })
class RegistrationInterests extends Component {

  static propTypes = {
    setRegistrationStep: PropTypes.func.isRequired,
    addOrRemoveValue: PropTypes.func.isRequired,
    toggleLoader: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired,
    updateSelf: PropTypes.func.isRequired,
    navigateTo: PropTypes.func.isRequired,
    updateSelfBusy: PropTypes.bool,
    updateSelfError: PropTypes.any,
    interests: PropTypes.array.isRequired,
  };

  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  }

  componentWillMount() {
    this.props.setRegistrationStep(2);
  }

  componentWillReceiveProps(newProps){
    if (this.props.updateSelfBusy != newProps.updateSelfBusy) {
      this.props.toggleLoader(newProps.updateSelfBusy);
    }
    if (this.props.updateSelfBusy && !newProps.updateSelfBusy) {
      if (newProps.updateSelfError) {
        this.props.showAlert({ title: GENERIC_ERROR_TITLE, message: GENERIC_ERROR_MESSAGE });
      } else {
        this.props.navigateTo('/home/recommendations', { clear: true });
      }
    }
  }

  onSelect = (interestId) => {
    const interests = this.props.interests;
    if (interests.length === MAX_INTERESTS && interests.indexOf(interestId) === -1) {
      this.props.showAlert({ title: 'Sorry', message: `You can only select a maximum of ${MAX_INTERESTS} interests`})
    } else {
      this.props.addOrRemoveValue('registration', 'interests', interestId);
    }
  }

  onButtonTap = () => {
    /* Save the users initial latitude and longitude along with the selected interests */
    const state = this.context.store.getState();

    let profile = {
      interests: state.forms.getIn(['registration', 'fields', 'interests']),
    };

    if (!state.user.getIn(['profile', 'genderId'])) {
      profile.genderId = state.forms.getIn(['registration', 'fields', 'genderId']);
      profile.genderDescription = state.forms.getIn(['registration', 'fields', 'genderDescription']);
    }

    this.props.updateSelf(profile);
  }

  render() {
    const interests = this.props.interests;
    return (
      <Screen className={this.block()}>
        <TitleBar>
          <Title>Interests</Title>
        </TitleBar>
        <Content className={this.element('content')}>
          <p className={this.element('intro-copy')}>Choose 5 things you're into and we'll send people your way who think the same.</p>
          <InterestGrid
            value={interests}
            onSelect={this.onSelect}
          />
        </Content>
        <div className={this.element('button-wrapper')}>
          <InterestButton numSelected={interests.length} onTap={this.onButtonTap} />
        </div>
      </Screen>
    );
  };
};

export default RegistrationInterests;
