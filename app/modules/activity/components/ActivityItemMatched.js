import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Tappable from 'react-tappable';
import dateFormat from 'dateformat';
import Immutable from 'immutable';

import IconChatOutline from '^/assets/icons/chat-outline.svg';
import { ProfileListItem, ProfileListImage, ProfileListContent } from '^/components/profile-list';
import Icon from '^/components/icons/Icon';
import { getDateDifference } from '^/services/Utils';

import './ActivityItem.scss';

@bem({ block: 'activity-item' })
class ActivityItem extends Component {

  static propTypes = {
    user: PropTypes.instanceOf(Immutable.Map),
    date: PropTypes.instanceOf(Date),
    onTap: PropTypes.func.isRequired,
    navigationHandler: PropTypes.func.isRequired,
  }

  onTap = () => {
    const userId = this.props.user.getIn(['profile', 'userId']);
    this.props.onTap(userId);
  }

  parseDate(date) {
    if (!date) return '';
    const diff = getDateDifference(date);
    if (diff > -1) return 'Today';
    if (diff === -1) return 'Yesterday';
    return `on ${dateFormat(date, 'dS mmm')}`;
  }

  onChatTap = (ev) => {
    ev.stopPropagation();
    const userId = this.props.user.getIn(['profile', 'userId']);
    this.props.navigationHandler(`chat/${userId}`);
  }

  render() {
    const name = this.props.user.getIn(['profile', 'name']);
    const image = this.props.user.getIn(['profile', 'profilePhoto', 'images', '100x100']);
    const date = this.props.date;
    return (
      <Tappable onTap={this.onTap} className={this.block()}>
        <ProfileListItem className={this.element('item')}>
          <ProfileListImage image={image} />
          <ProfileListContent>
            <p className={this.element('name')}>{name}</p>
            <p className={this.element('status')}>
              Matched { this.parseDate(date) }
            </p>
          </ProfileListContent>
          <Tappable onTap={this.onChatTap} className={this.element('icon-wrapper')}>
            <Icon src={IconChatOutline} className={this.element('icon')} />
          </Tappable>
        </ProfileListItem>
      </Tappable>
    );
  }

}

export default ActivityItem;
