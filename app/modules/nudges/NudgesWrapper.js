import React, { Component } from 'react';
import { connect } from 'react-redux';
import AnalyticsService from '^/services/AnalyticsService';

import { getNudges, abortGetNudges } from '^/actions/ApiActions';

import Nudges from './Nudges';

/** 
 * Use a higher order component to handle fetching, so we can dispatch actions
 * in componentWillMount
 *
 * see https://github.com/reactjs/react-redux/issues/210
 */

@connect(null, { getNudges, abortGetNudges })
class NudgesWrapper extends Component {
  fetch = () => {
    this.reqId = this.props.getNudges();
  }
  componentWillMount() {
    this.fetch();
  }
  componentWillUnmount() {
    this.props.abortGetNudges(this.reqId);
  }

  componentDidMount() {
    AnalyticsService.logPageView('Nudges');
  }

  render() {
    return (
      <Nudges retryFetch={this.fetch} />
    );
  }
}

export default NudgesWrapper;
