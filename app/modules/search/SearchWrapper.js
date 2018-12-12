import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import { getUsers, abortGetUsers } from '^/actions/ApiActions';

import Search from './Search';

/**
 * Use a higher order component to handle fetching, so we can dispatch actions
 * in componentWillMount
 *
 * see https://github.com/reactjs/react-redux/issues/210
 */

@connect(null, { getUsers, abortGetUsers })
class SearchWrapper extends Component {
  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func.isRequired,
    }).isRequired,
  }
  fetch = (page) => {
    const state = this.context.store.getState();
    const sort = state.user.getIn(['profile', 'searchPreferences', 'sort']) || new Immutable.List();
    const filter = state.user.getIn(['profile', 'searchPreferences', 'filter']) || new Immutable.List();
    this.reqId = this.props.getUsers(sort.toJS(), filter.toJS(), page);
  }
  componentWillMount() {
    const state = this.context.store.getState();
    if (!state.search.get('searchResultsFetched')) {
      this.fetch();
    }
  }
  componentWillUnmount() {
    this.props.abortGetUsers(this.reqId);
  }
  render() {
    return (
      <Search {...this.props} searchHandler={this.fetch} />
    );
  }
}


export default SearchWrapper;
