import React, { Component } from 'react';
import bem from 'react-bem-classes';

import './ProfileListContent.scss';

@bem({ block: 'profile-list-content' })
class ProfileListContent extends Component {

  render() {
    return (
      <div className={this.block()}>
        {this.props.children}
      </div>
    );
  }

}

export default ProfileListContent;
