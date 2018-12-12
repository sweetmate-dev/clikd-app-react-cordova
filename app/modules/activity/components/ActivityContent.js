import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import bem from 'react-bem-classes';

import Content from '^/components/layout/Content';
import ProfileList from '^/components/profile-list/ProfileList';

import './ActivityContent.scss';
import ActivityItemTestTaken from './ActivityItemTestTaken';
import ActivityItemMatched from './ActivityItemMatched';
import ActivityItemNudgeReceived from './ActivityItemNudgeReceived';

@bem({ block: 'activity-content' })
class ActivityContent extends Component {

  static propTypes = {
    activity: PropTypes.instanceOf(Immutable.List).isRequired,
    onItemTap: PropTypes.func,
    nudgeHandler: PropTypes.func,
    alertHandler: PropTypes.func,
    loaderHandler: PropTypes.func,
    navigationHandler: PropTypes.func,
  }

  renderTestTakenItem(item) {
    return (
      <ActivityItemTestTaken
        key={item.get('userId')}
        user={item.get('user')}
        date={item.get('date')}
        nudgeHandler={this.props.nudgeHandler}
        alertHandler={this.props.alertHandler}
        loaderHandler={this.props.loaderHandler}
        onTap={this.props.onItemTap}
      />
    );
  }

  renderMatchedItem(item) {
    return (
      <ActivityItemMatched
        key={item.get('userId')}
        user={item.get('user')}
        date={item.get('date')}
        navigationHandler={this.props.navigationHandler}
        onTap={this.props.onItemTap}
      />
    );
  }

  renderNudgeReceivedItem(item) {
    return (
      <ActivityItemNudgeReceived
        key={item.get('userId')}
        user={item.get('user')}
        date={item.get('date')}
        activityRead={(item.get('activityRead') ? true : false)}
        onTap={this.props.onItemTap}
      />
    );
  }

  renderItems() {
    return this.props.activity.map((item) => {
      switch (item.get('activity')) {
        //case 'matched':
         // return this.renderMatchedItem(item);
        case 'testTaken':
          return this.renderTestTakenItem(item);
        case 'nudgeReceived':
          return this.renderNudgeReceivedItem(item);
      }
    });
  }

  render() {
    return (
      <Content className={this.block()}>
        <ProfileList>
          { this.renderItems() }
        </ProfileList>
      </Content>
    );
  }

}

export default ActivityContent;
