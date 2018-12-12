import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { navigateTo } from '^/actions/NavigationActions';
import { List, ListLabel, ListRow, ListButton } from '^/components/lists';

@connect(null, { navigateTo })
class ManageAccountApp extends Component {

  static propTypes = {
    navigateTo: PropTypes.func,
  };

  onShareTap = () => {
    const options = {
      message: 'Hey, I just got on clikd - a new app that helps you meet dates or mates - and it’s awesome, why not check it out.', // not supported on some apps (Facebook, Instagram)
      subject: 'Check out clikd!', // for email
      url: 'https://www.clikdapp.com/'
    };

    window.plugins.socialsharing.shareWithOptions(options, this.onShareSuccess, this.onShareError);
  }

  onShareSuccess =  (result) => {
    //console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
    //console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
  }

  onShareError = (msg) => {
    //console.log("Sharing failed with message: " + msg);
  }

  onRateTap = () => {
    // Check which platform
    if (device.platform == "iOS") {
      cordova.InAppBrowser.open('itms-apps://itunes.apple.com/app/id1185598415?mt=8&uo=4', '_system');
    } else {
      window.open('market://details?id=com.clikdapp');
    }
  }

  onFeedbackTap = () => {
    cordova.InAppBrowser.open('https://www.clikdapp.com/contact-us/', '_system');
  }

  render() {
    const navigate = this.props.navigateTo;
    return (
      <ListRow stacked>
        <ListLabel>App</ListLabel>
        <List>
          <ListButton theme="white" onTap={this.onShareTap}>Share</ListButton>
          <ListButton theme="white" onTap={this.onRateTap}>Rate Us</ListButton>
          <ListButton theme="white" onTap={this.onFeedbackTap}>Feedback</ListButton>
        </List>
      </ListRow>
    );
  }
}

export default ManageAccountApp;
