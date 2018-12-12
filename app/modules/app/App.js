import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';

import './App.scss';
import BlockingLoader from './components/BlockingLoader';
import Notifications from './components/Notifications';
import Alerts from './components/Alerts';
import SlideAlerts from './components/SlideAlerts';

function mapStateToProps(state) {
  return {
    route: state.navigation.get('route'),
    isLoggedIn: state.user.get('isLoggedIn'),
  };
}

@connect(mapStateToProps)
@bem({'block': 'app'})
class App extends Component {

  static contextTypes = {
    router: PropTypes.shape({
      push: PropTypes.func,
    }),
  }

  static propTypes = {
    isLoggedIn: PropTypes.bool,
    route: PropTypes.string,
    children: PropTypes.node,
  }

  componentDidMount() {
    const localAuth = window.localStorage.auth;
    if (localAuth === undefined) {
      navigator.splashscreen.hide();
      //console.log('hiding splash - app.js');
    } else {
      //console.log('Not hiding splash');
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.route !== this.props.route) {
      this.context.router.push(newProps.route);
    }
  }

  render() {
    const platform = window.device.platform.replace(' ', '-').toLowerCase();
    return (
      <div className={`${this.block()} platform-${platform}`}>
        { this.props.children }
        <Alerts />
        <SlideAlerts />
        <BlockingLoader />
        <If condition={this.props.isLoggedIn}>
          <Notifications />
        </If>
      </div>
    );
  }
}


export default App;