import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import bem from 'react-bem-classes';
import Immutable from 'immutable';
import Hammer from 'react-hammerjs';

import AnalyticsService from '^/services/AnalyticsService';
import { toggleLoader, showAlert } from '^/actions/AppActions';
import { updateSelf } from '^/actions/ApiActions';
import { initForm, destroyForm, addOrRemoveValue } from '^/actions/FormActions';
import { navigateBack, navigateTo } from '^/actions/NavigationActions';
import { Screen, Content } from '^/components/layout';
import { TitleBar, BackButton, ActionButton, Title } from '^/components/navigation';
import { GENERIC_ERROR_MESSAGE, GENERIC_ERROR_TITLE } from '^/constants/Messages';
import InterestGrid from '^/components/interests/InterestGrid';
import { MAX_INTERESTS, MIN_INTERESTS } from '^/constants/Interests';

import './ManageInterests.scss';

function mapStateToProps(state){
  return {
    updateSelfBusy: state.user.get('updateSelfBusy'),
    updateSelfError: state.user.get('updateSelfError'),
    interests: state.forms.getIn(['manage-interests', 'fields', 'interests']) || [],
  };
}

@connect(mapStateToProps, { initForm, destroyForm, toggleLoader, showAlert, navigateBack, updateSelf, addOrRemoveValue })
@bem({ block: 'manage-interests-screen' })
class ManageInterests extends Component {

  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  };

  static propTypes = {
    initForm: PropTypes.func.isRequired,
    destroyForm: PropTypes.func.isRequired,
    addOrRemoveValue: PropTypes.func.isRequired,
    toggleLoader: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired,
    updateSelf: PropTypes.func.isRequired,
    navigateBack: PropTypes.func.isRequired,
    updateSelfBusy: PropTypes.bool,
    updateSelfError: PropTypes.any,
  };

  componentWillMount() {
    /* Initialise form */
    const state = this.context.store.getState();
    const initialValues = {
      interests: state.user.getIn(['profile', 'interests']).toArray()
    }
    this.props.initForm('manage-interests', initialValues);
  }

  componentWillUnmount() {
    this.props.destroyForm('manage-interests');
  }

  componentDidMount() {
    AnalyticsService.logPageView('Interests');
  }

  componentWillReceiveProps(newProps) {
    if (newProps.updateSelfBusy !== this.props.updateSelfBusy) {
      this.props.toggleLoader(newProps.updateSelfBusy);
    }
    if (this.props.updateSelfBusy && !newProps.updateSelfBusy) {
      if (newProps.updateSelfError) {
        this.props.showAlert({ title: GENERIC_ERROR_TITLE, message: GENERIC_ERROR_MESSAGE });
      } else {
        this.props.navigateBack('home/me');
      }
    }
  }


  onSelect = (interestId) => {
    const interests = this.props.interests;
    if(interests.length === MAX_INTERESTS && interests.indexOf(interestId) === -1) {
      this.props.showAlert({ title: 'Sorry', message: `You can only select a maximum of ${MAX_INTERESTS} interests`})
    } else {
      this.props.addOrRemoveValue('manage-interests', 'interests', interestId);
    }
  }

  onSaveTap = () => {
    if(this.props.interests.length < MIN_INTERESTS){
      let message = `Please select at least ${MIN_INTERESTS} interests`;
      if (MIN_INTERESTS == MAX_INTERESTS) {
        message = `Please select ${MAX_INTERESTS} interests`;
      }
      this.props.showAlert({ title: 'Oops', message: message})
    } else {
      this.save();
    }
  }

  actionButtonDisabled() {
    const interests = this.props.interests;
    return interests.length >= MAX_INTERESTS || interests.length < MIN_INTERESTS
  }

  save = () => {
    const state = this.context.store.getState();
    const fields = state.forms.getIn(['manage-interests', 'fields']).toJS();
    this.props.updateSelf(fields);
  }

  render() {
    return (
      <Screen className={this.block()}>
        <TitleBar>
          <BackButton defaultRoute="home/me" />
          <Title>Interests</Title>
          <ActionButton onTap={this.onSaveTap} right disabled={this.actionButtonDisabled()}>
            Save
          </ActionButton>
        </TitleBar>
        <Content className={this.element('content')}>
          <div className={this.element('inner')}>
            <p className={this.element('intro')}>Choose 5 things you're into and we'll send people your way who think the same.</p>
            <InterestGrid 
              value={this.props.interests} 
              onSelect={this.onSelect} 
            />
          </div>
        </Content>
      </Screen>
    );
  }

}

export default ManageInterests;