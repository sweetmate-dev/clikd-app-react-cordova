import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import bem from 'react-bem-classes';
import {navigateTo} from '^/actions/NavigationActions';

import Logo from '^/assets/images/logo.svg';
import Pagination from '^/components/pagination/Pagination';
import {showAlert} from '^/actions/AppActions';

import './AuthLogin.scss';
import LoginCarousel from './LoginCarousel';
import LoginFooter from './LoginFooter';

@connect(null, {showAlert, navigateTo})
@bem({block: 'auth-login'})
class AuthLogin extends Component {
  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  };

  static propTypes = {
    onTriggerLogin: PropTypes.func,
  }

  state = {
    carouselIdx: 0,
  };

  onChange = (index, elem) => {
    this.setState({carouselIdx: index});
  };

  onLoginTap = () => {
    const state = this.context.store.getState();
    if (!state.app.get('online')) {
      this.props.showAlert({
        title: 'Oops!',
        message: 'You are currently offline. Please try again when you have a connection.',
        buttons: [{
          label: 'OK',
          color: 'transparent',
        }],
      });
      return;
    }
    this.props.onTriggerLogin();
  }

  render() {
    const returning = (window.localStorage.getItem('login-returning') ? true : false);
    return (
      <div className={this.block()}>
        <LoginCarousel className={this.element('carousel')}
           onChange={this.onChange}
           onLoginTap={this.onLoginTap}
           loginBusy={this.props.loginBusy}
           returning={returning}
           />
        <If condition={returning}>
          <img alt="Clickd" src={Logo} className="auth-logo"/>
        </If>
        <If condition={returning}>
          <LoginFooter onLoginTap={this.onLoginTap} loginBusy={this.props.loginBusy} />
        </If>
        <Pagination length={returning ? 4 : 6} index={this.state.carouselIdx}
          className={this.element('pagination')}/>
      </div>
    );
  }
}

export default AuthLogin;
