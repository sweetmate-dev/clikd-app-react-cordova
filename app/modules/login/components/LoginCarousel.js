import React, {Component, PropTypes} from 'react';
import bem from 'react-bem-classes';

import ReactSwipe from 'react-swipe';
import Logo from '^/assets/images/logo.svg';

import './LoginCarousel.scss';
import LoginFooter from './LoginFooter';

@bem({block: 'login-carousel'})
class LoginCarousel extends Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onLoginTap: PropTypes.func.isRequired,
  };

  render() {
    let images = [
      'The creative app for meeting new people, where you call the shots.',
      'So you can express yourself and show your creativity.',
      'And find who you want, how you want, when you want.',
      'So you’re in control ... you call the shots.'
    ];

    let cssClass = 'slide-inner';
    let continuous = false;
    if (!this.props.returning) {
      images[0] = 'Hi, welcome to CLiKD. Now let us tell you what we\'re all about';
      images.push(5);
      images.push(6);
    } else {
      cssClass += ' returning';
      continuous = true;
    }

    return (
      <ReactSwipe className={this.block()} swipeOptions={{
        callback: this.props.onChange,
        continuous: continuous
      }}>
        <For each="item" index="idx" of={images}>
          <div key={idx} className={this.element(cssClass, {pos: (idx + 1)})}>
            <If condition={(!this.props.returning && (idx == 0))}>
              <img alt="Clickd" src={Logo} className="auth-logo"/>
            </If>
            <If condition={this.props.returning || idx == 0}>
              <h2
                  className={(!this.props.returning && idx == 0) ? 'bottom' : ''}>{item}
                </h2>
            </If>
            <If condition={!this.props.returning && idx == 5}>
              <LoginFooter onLoginTap={this.props.onLoginTap} loginBusy={this.props.loginBusy} />
            </If>
          </div>
        </For>
      </ReactSwipe>
    );
  }
}

export default LoginCarousel;
