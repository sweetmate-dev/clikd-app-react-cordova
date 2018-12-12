import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import bem from 'react-bem-classes';
import {navigateTo} from '^/actions/NavigationActions';
import {slideAlert} from '^/actions/AppActions';

import Button from '^/components/buttons/Button';

import './LoginCarousel.scss';

@connect(null, {slideAlert, navigateTo})
@bem({block: 'auth-login'})
class LoginFooter extends Component {
  static propTypes = {
    loginBusy: PropTypes.bool,
    onLoginTap: PropTypes.func.isRequired,
  }

  linkToTerms = (e) => {
    e.preventDefault();
    this.props.navigateTo('registration/terms');
  }

  linkToPrivacy = (e) => {
    e.preventDefault();
    this.props.navigateTo('registration/privacy');
  }

  showFacebookInfo = (e) => {
    this.props.slideAlert({
      title: 'Why Facebook Log in?',
      message: 'We collect this information with the best intentions to help keep you safe from scammers.\n\n' +
        'Yes, scammers are on Facebook too. That\'s why we require your Facebook account to be at least ' +
        'one-year-old, it\'s a pain, but bear with us, we are working tirelessly to build alternative ways ' +
        'to login.\n\n' +
        'We also verify your age through Facebook. You must be 18 or older to join the CLiKD community.\n\n' +
        'We will never post anything to your Facebook profile or contact any of your friends.\n\n' +
        'We ask for access to your Facebook photos to help you put some photos onto your profile page, you can ' +
        'edit these photos once you are logged in.\n\n' +
        'For more information on what we collect and how we use them (we will never sell your information to anyone), ' +
        'please see our Privacy Policy.',
    });
  }

  render() {
    return (
      <div className={this.element('footer')}>
        <p className={this.element('terms')}>
          By continuing you agree to our <a href="#"
          onClick={this.linkToTerms}>terms & conditions</a> and <a href="#" onClick={this.linkToPrivacy}>privacy
          policy</a></p>
        <Button onTap={this.props.onLoginTap} color="facebook"
        loading={this.props.loginBusy}>
        Log in with Facebook
        </Button>
        <p onClick={this.showFacebookInfo} className={'facebook-info'}>
          <span className={'information-icon'}>i</span>We’ll never post anything to your Facebook account
        </p>
      </div>
    );
  }
}

export default LoginFooter;
