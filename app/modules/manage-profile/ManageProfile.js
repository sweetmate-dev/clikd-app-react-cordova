import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import bem from 'react-bem-classes';
import Immutable from 'immutable';

import AnalyticsService from '^/services/AnalyticsService';
import { toggleLoader, showAlert } from '^/actions/AppActions';
import { updateSelf } from '^/actions/ApiActions';
import { initForm, destroyForm } from '^/actions/FormActions';
import { navigateBack, navigateTo } from '^/actions/NavigationActions';
import { Screen, Content } from '^/components/layout';
import { Title, TitleBar, BackButton, ActionButton } from '^/components/navigation';
import { GENERIC_ERROR_MESSAGE, GENERIC_ERROR_TITLE } from '^/constants/Messages';

import ManageProfileForm from './components/ManageProfileForm';

function mapStateToProps(state){
  return {
    updateSelfBusy: state.user.get('updateSelfBusy'),
    updateSelfError: state.user.get('updateSelfError'),
    photos: state.user.getIn(['profile', 'photos']).map(photo => photo.getIn(['images', '600x600'])),
  };
}

@connect(mapStateToProps, { initForm, destroyForm, toggleLoader, showAlert, navigateBack, navigateTo, updateSelf })
@bem({ block: 'manage-profile-page' })
class ManageProfile extends Component {

  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  };

  static propTypes = {
    initForm: PropTypes.func.isRequired,
    destroyForm: PropTypes.func.isRequired,
    toggleLoader: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired,
    updateSelf: PropTypes.func.isRequired,
    navigateBack: PropTypes.func.isRequired,
    navigateTo: PropTypes.func.isRequired,
    updateSelfBusy: PropTypes.bool,
    updateSelfError: PropTypes.any,
    photos: PropTypes.instanceOf(Immutable.List),
  };

  componentWillMount() {
    /* Initialise form */
    const state = this.context.store.getState();
    const initialValues = state.user.get('profile').toJS();
    this.props.initForm('manage-profile', initialValues);
  }

  componentWillUnmount() {
    this.props.destroyForm('manage-profile');
  }

  componentDidMount() {
    AnalyticsService.logPageView('About Me');
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
        this.props.showAlert({
          message: 'The changes you made to your preferences will be reflected' +
            ' in the recommendations we send you tomorrow.'
        });
      }
    }
  }

  save = () => {
    const state = this.context.store.getState();
    const fields = state.forms.getIn(['manage-profile', 'fields']).toJS();
    this.props.updateSelf(fields);
  }

  onImagesTap = () => {
    this.props.navigateTo('manage-photos');
  }

  render() {
    return (
      <Screen className={this.block()}>
        <TitleBar>
          <BackButton defaultRoute="home/me" />
          <Title>My Profile</Title>
          <ActionButton onTap={this.save} right>Save</ActionButton>
        </TitleBar>
        <Content className={this.element('content')}>
          <ManageProfileForm />
        </Content>
      </Screen>
    );
  }

}

export default ManageProfile;