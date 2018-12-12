import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import bem from 'react-bem-classes';
import Immutable from 'immutable';

import { dismissNotification } from '^/actions/AppActions';
import { navigateTo } from '^/actions/NavigationActions';

import './Notifications.scss';
import Notification from './Notification';

function mapStateToProps(state) {
  return {
    notifications: state.app.get('notificationIds').map(id =>
      state.app.getIn(['notifications', id]),
    ),
  };
}

@connect(mapStateToProps, { dismissNotification, navigateTo })
@bem({ block: 'notifications' })
class Notifications extends Component {

  static propTypes = {
    notifications: PropTypes.instanceOf(Immutable.List).isRequired,
    dismissNotification: PropTypes.func.isRequired,
    navigateTo: PropTypes.func.isRequired,
  };

  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func.isRequired,
    }).isRequired,
  };

  dismissNotification = (id) => {
    this.props.dismissNotification(id);
  }

  onNotificationTap = (id) => {
    const state = this.context.store.getState();
    const route = state.app.getIn(['notifications', id, 'route']);
    if (route) {
      this.dismissNotification(id);
      this.props.navigateTo(route, { clear: true });
    }
  }

  render() {
    return (
      <CSSTransitionGroup
        className={this.block()}
        transitionName="animate"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
      >
        <For each="notification" of={this.props.notifications}>
          <Notification
            body={notification.get('body')}
            title={notification.get('title')}
            id={notification.get('id')}
            key={notification.get('id')}
            dismissHandler={this.dismissNotification}
            tapHandler={this.onNotificationTap}
          />
        </For>
      </CSSTransitionGroup>
    );
  }
}


export default Notifications;
