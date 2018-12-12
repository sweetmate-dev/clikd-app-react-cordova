import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import { login } from '^/actions/UserActions';
import { navigateTo } from '^/actions/NavigationActions';
import ChatService from '^/services/ChatService';
import RecommendationsService from '^/services/RecommendationsService';
import { showAlert } from '^/actions/AppActions';
import { getQuestions, getTestResultMessages } from '^/actions/ApiActions';
import Tappable from 'react-tappable';
import { Screen, ContentTransitionGroup } from '^/components/layout';
import { GENERIC_ERROR_MESSAGE, GENERIC_ERROR_TITLE } from '^/constants/Messages';
import { CROSSFADE } from '^/constants/Transitions';

import './Login.scss';
import AutoLogin from './components/AutoLogin';
import AuthLogin from './components/AuthLogin';

function mapStateToProps(state) {
  return {
    loginRoute: state.navigation.get('loginRoute'),
    loginBusy: state.user.get('loginBusy'),
    loginError: state.user.get('loginError'),
    isLoggedIn: state.user.get('isLoggedIn'),
    signupComplete: state.user.get('signupComplete'),
    shouldReset: state.user.get('shouldReset'),
    genderId: state.user.getIn(['profile', 'genderId']),
    auth: state.user.get('auth'),
  };
}

@connect(mapStateToProps, { login, navigateTo, showAlert, getQuestions, getTestResultMessages })
@bem({ block: 'login-screen' })
class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hasAuth: Boolean(props.auth),
    };
  }

  static propTypes = {
    auth: PropTypes.instanceOf(Immutable.Map),
    loginBusy: PropTypes.bool,
    loginError: PropTypes.any,
    isLoggedIn: PropTypes.bool,
    signupComplete: PropTypes.bool,
    shouldReset: PropTypes.bool,
    login: PropTypes.func,
    navigateTo: PropTypes.func,
    showAlert: PropTypes.func,
    getQuestions: PropTypes.func,
    genderId: PropTypes.number,
  };

  componentWillReceiveProps(newProps) {
    if (!this.props.isLoggedIn && newProps.isLoggedIn) {
      this.onLoginSuccess(newProps);
    }
    if (!this.props.loginError && newProps.loginError) {
      if (!this.state.hasAuth) {
        let title = GENERIC_ERROR_TITLE,
            message = GENERIC_ERROR_MESSAGE;

        if (newProps.loginError === 'missing_permissions') {
          title = 'Facebook Permissions';
          message = 'Please ensure you enable all permissions from Facebook to continue.';
        }

        if (newProps.loginError == 'facebook_criteria_invalid') {
          message = this.invalidFacebookMessage();
        }

        this.props.showAlert({
          title: title,
          message: message
        });
      }
      this.setState({ hasAuth: false });
    }
  }

  invalidFacebookMessage = () => {
    return(
      <div>
        <span>Your facebook log-in seems to have failed. </span>
        <Tappable onTap={this.checkoutFaqsTap} className="alertLink">
          Check out our FAQs
        </Tappable>
        <span> or contact us at feedback@clikdapp.com to find out more.</span>
      </div>
    )
  };

  checkoutFaqsTap() {
    cordova.InAppBrowser.open('https://www.clikdapp.com/faq/', '_system');
  };

  triggerAutoLogin = () => {
    this.props.login({ getAuth: false, getRecommendations: false });
  };

  triggerAuthLogin = () => {
    this.props.login({ reset: this.props.shouldReset });
  };

  onLoginSuccess(props) {
    navigator.splashscreen.hide();
    setTimeout(() => { ChatService.connect(); });
    setTimeout(() => { props.getQuestions(); });
    setTimeout(() => { props.getTestResultMessages(); });
    let route = props.loginRoute || '/home/recommendations';
    if (!props.signupComplete) {
      route = props.genderId ? '/registration/interests' : '/registration/details';
    }
    this.props.navigateTo(route, { clear: true });
  }

  render() {
    return (
      <Screen className={this.block()}>
        <ContentTransitionGroup>
          <Choose>
            <When condition={this.state.hasAuth}>
              <AutoLogin onTriggerLogin={this.triggerAutoLogin} />
            </When>
            <Otherwise>
              <AuthLogin loginBusy={this.props.loginBusy} onTriggerLogin={this.triggerAuthLogin} />
            </Otherwise>
          </Choose>
        </ContentTransitionGroup>
      </Screen>
    );
  }
}

export default Login;
