import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Tabs from '^/components/navigation/Tabs';
import TabButton from '^/components/navigation/TabButton';
import Badge from '^/components/badges/Badge';

function mapStateToProps(state) {
  let newNudges = state.user.get('newNudges');
  if (newNudges > 99) {
    newNudges = '99+';
  } else if (newNudges == 0) {
    newNudges = '';
  }
  let unreadMessagesCount = state.user.get('unreadMessagesCount');
  if (unreadMessagesCount > 99) {
    unreadMessagesCount = '99+';
  } else if (unreadMessagesCount == 0) {
    unreadMessagesCount = '';
  }
  return {
    newNudges: newNudges.toString(),
    unreadMessagesCount: unreadMessagesCount.toString(),
  };
}

@connect(mapStateToProps)
class InteractionsTabs extends Component {

  static propTypes = {
    path: PropTypes.string,
    onSelect: PropTypes.func,
    newNudges: PropTypes.string,
    unreadMessagesCount: PropTypes.string,
  }

  getSelectedIndex() {
    return [
      '/home/interactions',
      '/home/interactions/activity',
    ].indexOf(this.props.path);
  }

  render() {
    const onSelect = this.props.onSelect;
    return (
      <Tabs selectedIndex={this.getSelectedIndex()}>
        <TabButton onTap={onSelect} context="/home/interactions">
          Chat <Badge>{this.props.unreadMessagesCount}</Badge>
        </TabButton>
        <TabButton onTap={onSelect} context="/home/interactions/activity">
          Activity <Badge>{this.props.newNudges}</Badge>
        </TabButton>
      </Tabs>
    );
  }

}

export default InteractionsTabs;
