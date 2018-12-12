import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import bem from 'react-bem-classes';

import Content from '^/components/layout/Content';
import ProfileList from '^/components/profile-list/ProfileList';

import './NudgesContent.scss';
import NudgesItem from './NudgesItem';

@bem({ block: 'nudges-content' })
class NudgesContent extends Component {

  static propTypes = {
    nudges: PropTypes.instanceOf(Immutable.List),
  }

  renderMatches() {
    const { nudges } = this.props;
    return nudges.map((user) => {
      const profile = user.get('profile');
      const userId = profile.get('userId');
      return (
        <NudgesItem
          key={userId}
          userId={userId}
          nudgeReceivedAt={user.get('nudgeReceivedAt')}
          name={profile.get('name')}
          image={profile.getIn(['profilePhoto', 'images', '100x100'])}
          onTap={this.props.onItemTap}
        />
      );
    });
  }

  render() {
    return (
      <Content className={this.block()}>
        <ProfileList>
          { this.renderMatches() }
        </ProfileList>
      </Content>
    );
  }

}

export default NudgesContent;
