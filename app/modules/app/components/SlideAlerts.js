import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import bem from 'react-bem-classes';
import Immutable from 'immutable';

import { dismissSlideAlert } from '^/actions/AppActions';

import './SlideAlerts.scss';
import SlideAlert from './SlideAlert';

function mapStateToProps(state) {
  return {
    slideAlerts: state.app.get('slideAlertIds').map(id =>
      state.app.getIn(['slideAlerts', id]),
    ),
  };
}

@connect(mapStateToProps, { dismissSlideAlert })
@bem({ block: 'slideAlerts' })
class SlideAlerts extends Component {

  static propTypes = {
    slideAlerts: PropTypes.instanceOf(Immutable.List).isRequired,
    dismissSlideAlert: PropTypes.func.isRequired,
  };

  dismissSlideAlert = (id) => {
    this.props.dismissSlideAlert(id);
  }

  render() {
    const slideAlerts = this.props.slideAlerts;
    return (
      <CSSTransitionGroup
        className={this.block()}
        transitionName="animate"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
      >
        <If condition={slideAlerts.size > 0}>
          <div className={this.element('overlay')} />
        </If>
        <For each="slideAlert" of={slideAlerts}>
          <SlideAlert
            key={slideAlert.get('id')}
            id={slideAlert.get('id')}
            body={slideAlert.get('message')}
            title={slideAlert.get('title')}
            buttons={slideAlert.get('buttons')}
            dismissHandler={this.dismissSlideAlert}
          />
        </For>
      </CSSTransitionGroup>
    );
  }
}


export default SlideAlerts;
