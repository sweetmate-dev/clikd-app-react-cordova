import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import { connect } from 'react-redux';

import { toggleLoader } from '^/actions/AppActions';
import { Screen, ContentTransitionGroup } from '^/components/layout';
import { Title, TitleBar, BackButton } from '^/components/navigation';
import Loader from '^/components/icons/Loader';
import ShareButton from '^/components/buttons/ShareButton';
import ButtonList from '^/components/buttons/ButtonList';
import ShareCopy from '^/constants/ShareCopy';

import './Share.scss';

@connect(null, { toggleLoader })
@bem({ block: 'share-screen' })
class Share extends Component {

  state = {
    checking: true,
    whatsapp: false,
    twitter: false,
    facebook: false,
  }

  static propTypes = {
    toggleLoader: PropTypes.func,
  };

  checkMethod(method, callback) {
    window.plugins.socialsharing.canShareVia(method, 'lorem', null, null, null, () => {
      callback(method, true);
    }, () => {
      callback(method, false);
    });
  }

  componentDidMount() {
    const methods = ['whatsapp', 'twitter', 'facebook'];
    const newState = { checking: false };
    let checked = 0;
    methods.forEach((methodName) => {
      this.checkMethod(methodName, (method, canUse) => {
        newState[method] = canUse;
        checked++;
        if (checked === methods.length) {
          this.setState(newState);
        }
      });
    });
  }

  onShareTap = (method) => {
    const success = this.onShareSuccess;
    const error = this.onShareError;
    const opener = window.device.platform === 'browser' ? window : cordova.InAppBrowser;
    switch (method) {
      case 'Facebook': {
        const copy = ShareCopy.facebook;
        if (this.state.facebook) {
          this.props.toggleLoader(true);
          plugins.socialsharing.shareViaFacebook(null, copy.image, copy.url, success, error);
        } else {
          // Fallback to facebook's sharer.php
          const url = encodeURIComponent(copy.url);
          const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
          opener.open(fbUrl, '_blank');
        }
        break;
      }
      case 'Twitter': {
        const copy = ShareCopy.twitter;
        if (this.state.twitter) {
          this.props.toggleLoader(true);
          plugins.socialsharing.shareViaTwitter(copy.message, copy.image, copy.url, success, error);
        } else {
          // Fallback to twitter web intents
          const message = encodeURIComponent(copy.message);
          const url = encodeURIComponent(copy.url);
          const twitterUrl = `https://twitter.com/intent/tweet?text=${message}&url=${url}`;
          opener.open(twitterUrl, '_blank');
        }
        break;
      }
      case 'Whatsapp': {
        const copy = ShareCopy.whatsapp;
        this.props.toggleLoader(true);
        plugins.socialsharing.shareViaWhatsApp(copy.message, null, copy.url, success, error);
        break;
      }
      case 'SMS': {
        const copy = ShareCopy.sms;
        this.props.toggleLoader(true);
        plugins.socialsharing.shareViaSMS(copy.message, null, success, error);
        break;
      }
      case 'E-Mail': {
        const copy = ShareCopy.email;
        this.props.toggleLoader(true);
        plugins.socialsharing.shareViaEmail(copy.message, copy.subject, null, null, null, null, success, error);
        break;
      }
    }
  }

  onShareSuccess = () => {
    this.props.toggleLoader(false);
  }

  onShareError = () => {
    this.props.toggleLoader(false);
  }

  render() {
    return (
      <Screen className={this.block()}>
        <TitleBar>
          <BackButton defaultRoute="home/me" />
          <Title>Share</Title>
        </TitleBar>
        <ContentTransitionGroup>
          <Choose>
            <When condition={this.state.checking}>
              <Loader centered size="large" color="grey" />
            </When>
            <Otherwise>
              <div className={this.element('content')} >
                <p className={this.element('copy')}>If you're enjoying Clikd, help us spread the word by sharing the app.</p>
                <ButtonList className={this.element('button-list')}>
                  <ShareButton method="Facebook" onTap={this.onShareTap} />
                  <ShareButton method="Twitter" onTap={this.onShareTap} />
                  <If condition={this.state.whatsapp}>
                    <ShareButton method="Whatsapp" onTap={this.onShareTap} />
                  </If>
                  <ShareButton method="SMS" onTap={this.onShareTap} />
                  <ShareButton method="E-Mail" onTap={this.onShareTap} />
                </ButtonList>
              </div>
            </Otherwise>
          </Choose>
        </ContentTransitionGroup>
      </Screen>
    );
  }
}

export default Share;
