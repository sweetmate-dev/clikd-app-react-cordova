import './TransitionGroup.scss';

import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { parseTemplate } from '^/services/Utils';

/**
 * Wrapper that animates between components mounted by react router, using
 * the current transition set in the application state.
 */

class TransitionGroup extends Component {

  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  };

  static propTypes = {
    children: PropTypes.shape({
      props: PropTypes.shape({
        route: PropTypes.shape({
          transitionKey: PropTypes.string,
        }),
      }),
      params: PropTypes.object,
    }),
  };

  getTransitionKey() {
    const childProps = this.props.children.props;
    return parseTemplate(childProps.route.transitionKey, childProps.params);
  }

  render() {
    const state = this.context.store.getState();
    const transition = state.navigation.get('transition').toJS();
    return (
      <ReactCSSTransitionGroup
        className="transition-group"
        transitionName={transition.transitionName}
        transitionEnterTimeout={transition.transitionEnterTimeout}
        transitionLeaveTimeout={transition.transitionLeaveTimeout}
        transitionEnter={Boolean(transition.transitionEnterTimeout)}
        transitionLeave={Boolean(transition.transitionLeaveTimeout)}
      >
        <div className="transition-group__item" key={this.getTransitionKey()}>
          {this.props.children}
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}


export default TransitionGroup;