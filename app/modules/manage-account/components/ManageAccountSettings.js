import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { toggleLoader, showAlert } from '^/actions/AppActions';
import { navigateTo } from '^/actions/NavigationActions';
import { logout, resetAndLogout } from '^/actions/UserActions';
import { List, ListLabel, ListRow, ListButton } from '^/components/lists';
import { GENERIC_ERROR_MESSAGE, GENERIC_ERROR_TITLE } from '^/constants/Messages';

function mapStateToProps(state) {
  return {
    isLoggedIn: state.user.get('isLoggedIn'),
    logoutBusy: state.user.get('logoutBusy'),
    logoutError: state.user.get('logoutError'),
    resetBusy: state.user.get('resetBusy'),
    resetError: state.user.get('resetError'),
  };
}

@connect(mapStateToProps, { toggleLoader, logout, resetAndLogout, navigateTo, showAlert })
class PreferencesAccountSettings extends Component {

  static propTypes = {
    logoutBusy: PropTypes.bool,
    logoutError: PropTypes.any,
    resetBusy: PropTypes.bool,
    resetError: PropTypes.any,
    isLoggedIn: PropTypes.bool,
    toggleLoader: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    resetAndLogout: PropTypes.func.isRequired,
    navigateTo: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired,
  }

  componentWillReceiveProps(newProps) {
    if (this.props.logoutBusy !== newProps.logoutBusy) {
      this.props.toggleLoader(newProps.logoutBusy);
    }
    if (this.props.resetBusy !== newProps.resetBusy) {
      this.props.toggleLoader(newProps.resetBusy);
    }
    if(
      !this.props.logoutError && this.props.logoutError
      || !this.props.resetError && newProps.logoutError
    ) {
      this.props.showAlert({ title: GENERIC_ERROR_TITLE, message: GENERIC_ERROR_MESSAGE });
    }
    if (!newProps.isLoggedIn) {
      this.props.navigateTo('/', { clear: true });
    }
  }

  logout = () => {
    this.props.showAlert({
      title: 'Log out',
      message: 'Are you sure you want to log out?',
      buttons: [{
        label: 'Yes',
        callback: () => {
          this.props.logout();
        },
      }, {
        label: 'No',
        color: 'transparent',
      }],
    });
  };

  resetUser = () => {
    this.props.showAlert({
      title: 'Delete your account',
      message: 'Are you sure you want to delete your account?',
      buttons: [{
        label: 'Yes',
        callback: () => {
          this.props.resetAndLogout();
        },
      }, {
        label: 'No',
        color: 'transparent',
      }],
    });
  };

  render() {
    return (
      <ListRow stacked>
        <ListLabel>Account settings</ListLabel>
        <List>
          <ListButton theme="white" onTap={this.logout}>Log out</ListButton>
          <ListButton theme="white" onTap={this.resetUser}>Delete account</ListButton>
        </List>
      </ListRow>
    );
  }
}

export default PreferencesAccountSettings;
