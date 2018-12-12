import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { toggleLoader, showAlert } from '^/actions/AppActions';
import { connectInstagramAccount, disconnectInstagramAccount } from '^/actions/PhotosActions';
import { List, ListLabel, ListRow, ListButton } from '^/components/lists';
import { GENERIC_ERROR_MESSAGE, GENERIC_ERROR_TITLE } from '^/constants/Messages';

function mapStateToProps(state) {
  return {
    instagramToken: state.user.getIn(['profile', 'instagramToken']),
    connectInstagramBusy: state.photos.get('connectInstagramBusy'),
    connectInstagramError: state.photos.get('connectInstagramError'),
    disconnectInstagramBusy: state.photos.get('disconnectInstagramBusy'),
    discconnectInstagramError: state.photos.get('disconnectInstagramError'),
  };
}

@connect(mapStateToProps, { connectInstagramAccount, disconnectInstagramAccount, toggleLoader, showAlert })
class PreferencesInstagramConnect extends Component {

  static propTypes = {
    instagramToken: PropTypes.string,
    connectInstagramAccount: PropTypes.func,
    disconnectInstagramAccount: PropTypes.func,
    toggleLoader: PropTypes.func,
    showAlert: PropTypes.func.isRequired,
    connectInstagramBusy: PropTypes.bool,
    disconnectInstagramBusy: PropTypes.bool,
  };

  componentWillReceiveProps(newProps) {
    const isBusy = this.isBusy(newProps);
    if (isBusy !== this.isBusy(this.props)) {
      this.props.toggleLoader(isBusy);
    }
    if (!this.getError(this.props) && this.getError(newProps)) {
      this.props.showAlert({ title: GENERIC_ERROR_TITLE, message: GENERIC_ERROR_MESSAGE });
    }
    if (this.props.connectInstagramBusy && !newProps.connectInstagramBusy && !newProps.connectInstagramError){
      this.props.showAlert({
        title: 'Success',
        message: 'Your Instagram account is connected.  You can now add images to your profile from your Instagram feed',
      });
    }
  }

  isBusy(props) {
    return props.disconnectInstagramBusy || props.connectInstagramBusy;
  }

  getError(props) {
    return props.discconnectInstagramError || props.connectInstagramError;
  }

  onConnectTap = () => {
    this.props.connectInstagramAccount();
  };

  onDisconnectTap = () => {
    this.props.showAlert({
      title: 'Disconnect',
      message: 'Are you sure you want to disconnect your Instagram Account?',
      buttons: [{
        label: 'Yes',
        callback: () => {
          this.props.disconnectInstagramAccount();
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
        <ListLabel>Instagram</ListLabel>
        <List>
          <Choose>
            <When condition={this.props.instagramToken}>
              <ListButton
                theme="white"
                onTap={this.onDisconnectTap}
              >
                Disconnect your Instagram account
              </ListButton>
            </When>
            <Otherwise>
              <ListButton
                theme="white"
                onTap={this.onConnectTap}
              >
                Connect your Instagram account
              </ListButton>
            </Otherwise>
          </Choose>
        </List>
      </ListRow>
    );
  }
}

export default PreferencesInstagramConnect;
