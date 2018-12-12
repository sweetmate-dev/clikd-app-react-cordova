import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import { navigateTo } from '^/actions/NavigationActions';
import { Screen, ContentTransitionGroup } from '^/components/layout';
import Loader from '^/components/icons/Loader';
import ErrorMessage from '^/components/info-message/ErrorMessage';
import TestService from '^/services/TestService';

import SearchContent from './components/SearchContent';
import SearchEmpty from './components/SearchEmpty';

function mapStateToProps(state) {
  return {
    users: state.search.get('userIds').map(id => state.users.getIn([id, 'profile'])),
    busy: state.search.get('searchUsersBusy'),
    error: state.search.get('searchUsersError'),
    nextPage: state.search.get('nextPage'),
  };
}

@connect(mapStateToProps, { navigateTo })
class Search extends Component {

  static propTypes = {
    busy: PropTypes.bool,
    error: PropTypes.any,
    searchHandler: PropTypes.func,
    users: PropTypes.instanceOf(Immutable.List),
    navigateTo: PropTypes.func.isRequired,
  }

  onUserTap = (userId) => {
    this.props.navigateTo(`user/${userId}`);
  }

  onIconTap = (userId, matchStatusId) => {
    if (!matchStatusId) {
      TestService.takeTest(userId);
    } else {
      this.props.navigateTo(`user/${userId}`);
    }
  }

  onButtonTap = () => {
    this.props.navigateTo(`refine-search`);
  }

  loadMore = () => {
    this.props.searchHandler(this.props.nextPage);
  }

  render() {
    const { busy, error, users, nextPage } = this.props;
    const empty = users.size === 0;
    return (
      <Screen>
        <ContentTransitionGroup>
          <Choose>
            <When condition={empty && busy}>
              <Loader centered size="large" color="grey" key="loader" />
            </When>
            <When condition={error}>
              <ErrorMessage key="error-message" retry={this.props.searchHandler}>
                There was a problem fetching these results
              </ErrorMessage>
            </When>
            <When condition={empty}>
              <SearchEmpty onButtonTap={this.onButtonTap}/>
            </When>
            <Otherwise>
              <SearchContent
                busy={busy}
                users={users}
                loadMoreHandler={nextPage ? this.loadMore : null}
                onButtonTap={this.onButtonTap}
                onUserTap={this.onUserTap}
                onIconTap={this.onIconTap}
              />
            </Otherwise>
          </Choose>
        </ContentTransitionGroup>
      </Screen>
    );
  }

}

export default Search;
