import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import bem from 'react-bem-classes';
import Immutable from 'immutable';

import { dismissAlert } from '^/actions/AppActions';

import './Alerts.scss';
import Alert from './Alert';

function mapStateToProps(state) {
  return {
    alerts: state.app.get('alertIds').map(id =>
      state.app.getIn(['alerts', id]),
    ),
  };
}

@connect(mapStateToProps, { dismissAlert })
@bem({ block: 'alerts' })
class Alerts extends Component {

  static propTypes = {
    alerts: PropTypes.instanceOf(Immutable.List).isRequired,
    dismissAlert: PropTypes.func.isRequired,
  };

  dismissAlert = (id) => {
    this.props.dismissAlert(id);
  }

  render() {
    const alerts = this.props.alerts;
    return (
      <CSSTransitionGroup
        className={this.block()}
        transitionName="animate"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
      >
        <If condition={alerts.size > 0}>
          <div className={this.element('overlay')} />
        </If>
        <For each="alert" of={alerts}>
          <Alert
            key={alert.get('id')}
            id={alert.get('id')}
            body={alert.get('message')}
            title={alert.get('title')}
            buttons={alert.get('buttons')}
            dismissHandler={this.dismissAlert}
            image={alert.get('image')}
            cssClass={alert.get('cssClass')}
          />
        </For>
      </CSSTransitionGroup>
    );
  }
}


export default Alerts;
