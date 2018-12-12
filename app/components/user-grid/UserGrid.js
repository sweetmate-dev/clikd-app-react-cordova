import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Immutable from 'immutable';

import './UserGrid.scss';
import UserGridItem from './UserGridItem';

@bem({ block: 'user-grid' })
class UserGrid extends Component {

  static propTypes = {
    users: PropTypes.instanceOf(Immutable.List).isRequired,
    onTap: PropTypes.func,
    onIconTap: PropTypes.func,
    onDelete: PropTypes.func,
  };

  render() {
    const users = this.props.users;
    return (
      <div className={this.block()}>
        <For each="user" of={users}>
          <UserGridItem
            key={user.get('userId')}
            userId={user.get('userId')}
            profilePhoto={user.getIn(['profilePhoto', 'images', '600x0'])}
            name={user.get('name')}
            age={user.get('age')}
            tagLine={user.get('tagLine')}
            matchStatusId={user.get('matchStatusId')}
            className={this.element('item')}
            onTap={this.props.onTap}
            onIconTap={this.props.onIconTap}
            onDelete={this.props.onDelete}
          />
        </For>
      </div>
    );
  }

}

export default UserGrid;
