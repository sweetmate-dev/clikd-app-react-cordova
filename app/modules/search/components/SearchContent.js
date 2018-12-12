import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Immutable from 'immutable';

import Button from '^/components/buttons/Button';
import Content from '^/components/layout/Content';
import UserGrid from '^/components/user-grid/UserGrid';

import './SearchContent.scss';

@bem({ block: 'search-content' })
class SearchContent extends Component {

  static propTypes = {
    users: PropTypes.instanceOf(Immutable.List),
    onUserTap: PropTypes.func,
    onIconTap: PropTypes.func,
    onButtonTap: PropTypes.func,
    loadMoreHandler: PropTypes.func,
    busy: PropTypes.bool,
  };

  onLoadMoreTap = () => {
    if (!this.props.busy) {
      this.props.loadMoreHandler();
    }
  }

  render() {
    const { onButtonTap, users, onUserTap, onIconTap, loadMoreHandler, busy } = this.props;
    return (
      <Content className={this.block()} >
        <div className={this.element('inner')}>
          <Button
            onTap={onButtonTap}
            className={this.element('refine-button')}
          >
            Refine
          </Button>
          <UserGrid 
            users={users} 
            onTap={onUserTap} 
            onIconTap={onIconTap}
            className={this.element('grid')} 
          />
          <If condition={loadMoreHandler}>
            <Button
              onTap={this.onLoadMoreTap}
              className={this.element('load-more-button')}
              loading={busy}
            >
              Load more
            </Button>
          </If>
        </div>
      </Content>
    );
  }

}

export default SearchContent;
