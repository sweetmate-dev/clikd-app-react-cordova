import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getActivity, abortGetActivity } from '^/actions/ApiActions';

import Activity from './Activity';

/** 
 * Use a higher order component to handle fetching, so we can dispatch actions
 * in componentWillMount
 *
 * see https://github.com/reactjs/react-redux/issues/210
 */

@connect(null, { getActivity, abortGetActivity })
class ActivityWrapper extends Component {
  fetch = () => {
    this.reqId = this.props.getActivity();
  }
  componentWillMount() {
    this.fetch();
  }
  componentWillUnmount() {
    this.props.abortGetActivity(this.reqId);
  }
  render() {
    return (
      <Activity {...this.props} retryFetch={this.fetch} />
    );
  }
}

export default ActivityWrapper;
