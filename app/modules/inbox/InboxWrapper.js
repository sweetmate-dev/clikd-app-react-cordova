import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import AnalyticsService from '^/services/AnalyticsService';
import { getThreads, abortGetThreads } from '^/actions/ApiActions';
import ChatService from '^/services/ChatService';

import Inbox from './Inbox';

/** 
 * Use a higher order component to handle fetching, so we can dispatch actions
 * in componentWillMount
 *
 * see https://github.com/reactjs/react-redux/issues/210
 */

function mapStateToProps(state) {
  return {
    refresh: state.chat.get('refresh')
  };
}

@connect(mapStateToProps, { getThreads, abortGetThreads })
class InboxWrapper extends Component {
  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func.isRequired,
    }).isRequired,
  }

  static propTypes = {
    refresh: PropTypes.bool
  }

  componentDidMount() {
    AnalyticsService.logPageView('Chat Inbox');
  }
  
  fetch = () => {
    const state = this.context.store.getState();
    if (!state.chat.get('connected')) {
      ChatService.connect();
    }
    this.reqId = this.props.getThreads();
    state.chat.set('refresh', false);
  }
  componentWillMount() {
    this.fetch();
  }
  componentWillUnmount() {
    this.props.abortGetThreads(this.reqId);
  }
  componentWillReceiveProps(newProps) {
    if (newProps.refresh) {
      this.fetch();
    }
  }
  render() {
    return (
      <Inbox {...this.props} retryFetch={this.fetch} />
    )
  }
}

export default InboxWrapper;
