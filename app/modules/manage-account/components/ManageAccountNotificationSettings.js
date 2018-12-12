import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { updateSelf } from '^/actions/ApiActions';
import CheckboxListRow from '^/components/forms-connected/CheckboxListRow';
import { NOTIFICATION_TYPES } from '^/constants/Settings';
import { initForm, destroyForm } from '^/actions/FormActions';

function mapStateToProps(state) {
  return {
    isLoggedIn: state.user.get('isLoggedIn'),
    logoutBusy: state.user.get('logoutBusy'),
    logoutError: state.user.get('logoutError'),
    resetBusy: state.user.get('resetBusy'),
    resetError: state.user.get('resetError'),
  };
}

@connect(mapStateToProps, { initForm, destroyForm, updateSelf })
class ManageAccountNotificationSettings extends Component {

  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  };

  static propTypes = {
    initForm: PropTypes.func.isRequired,
    destroyForm: PropTypes.func.isRequired,
    updateSelf: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const state = this.context.store.getState();
    const profile = state.user.get('profile').toJS();
    let notifcations = [];
    if (profile.receiveDailyRecommendationsNotification == 1) {
      notifcations.push('recommendations');
    }
    if (profile.receiveOtherNotifications == 1) {
      notifcations.push('other');
    }
    this.props.initForm(
      'manage-account', {
        notifications: notifcations
      }
    );
  }

  onChange(field, value) {
    const newNotificationSettings = {
      receiveDailyRecommendationsNotification: (value.includes('recommendations')) ? 1 : 0,
      receiveOtherNotifications: (value.includes('other')) ? 1 : 0,
    }

    this.props.updateSelf(newNotificationSettings);
  }

  render() {
    return (
      <CheckboxListRow
        multiple
        itemTheme="white"
        label="Notification settings"
        formName="manage-account"
        field="notifications"
        items={NOTIFICATION_TYPES}
        onChangeCallback={(field, value) => { this.onChange(field, value) }}
      />
    );
  }
}

export default ManageAccountNotificationSettings;
