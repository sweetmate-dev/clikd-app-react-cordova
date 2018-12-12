import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';

import Logo from '^/assets/images/logo.svg';

import './AutoLogin.scss';

@bem({ block: 'auto-login' })
class AutoLogin extends Component {

  static propTypes = {
    onTriggerLogin: PropTypes.func,
  }

  state = {
    carouselIdx: 0,
  };

  onChange = (index) => {
    this.setState({ carouselIdx: index });
  };

  componentDidMount = () => {
   this.props.onTriggerLogin();
  }

  render() {
    return (
      <div className={this.block()}>
      </div>
    );
  }
}

export default AutoLogin;
