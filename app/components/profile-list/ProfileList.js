import React, { Component } from 'react';
import bem from 'react-bem-classes';

import './ProfileList.scss';

@bem({ block: 'profile-list' })
class ProfileList extends Component {

  render() {
    return (
      <div className={this.block()}>
        {this.props.children}
      </div>
    );
  }

}

export default ProfileList;
