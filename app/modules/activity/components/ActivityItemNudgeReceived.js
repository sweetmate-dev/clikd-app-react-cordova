import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Tappable from 'react-tappable';
import dateFormat from 'dateformat';
import Immutable from 'immutable';

import IconTest from '^/assets/icons/test.svg';
import { ProfileListItem, ProfileListImage, ProfileListContent } from '^/components/profile-list';
import Icon from '^/components/icons/Icon';
import { getDateDifference } from '^/services/Utils';
import TestService from '^/services/TestService';
import { connect } from 'react-redux';
import { markNudgeRead } from '^/actions/UserActions';
import { getActivity } from '^/actions/ApiActions';

import './ActivityItem.scss';

function mapStateToProps(state) {
  return {
    navigateToUserId: state.activity.get('navigateToUserId')
  };
}

@connect(mapStateToProps, { markNudgeRead, getActivity })
@bem({ block: 'activity-item' })
class ActivityItem extends Component {

  static propTypes = {
    user: PropTypes.instanceOf(Immutable.Map),
    date: PropTypes.instanceOf(Date),
    activityRead: PropTypes.bool,
    onTap: PropTypes.func.isRequired,
    markNudgeRead: PropTypes.func,
    navigateToUserId: PropTypes.number
  };

  componentWillReceiveProps(newProps) {
    if (!this.props.navigateToUserId && newProps.navigateToUserId) {
      this.props.onTap(newProps.navigateToUserId);
    }
  }

  onTap = () => {
    const userId = this.props.user.getIn(['profile', 'userId']);
    if (!this.props.activityRead) {
      this.props.markNudgeRead(userId);
    } else {
      this.props.onTap(userId);
    }
  }

  parseDate(date) {
    if (!date) return '';
    const diff = getDateDifference(date);
    if (diff > -1) return 'Today';
    if (diff === -1) return 'Yesterday';
    return `on ${dateFormat(date, 'dS mmm')}`;
  }

  onIconTap = (ev) => {
    ev.stopPropagation();
    const userId = this.props.user.getIn(['profile', 'userId']);
    TestService.takeTest(userId);
  }

  render() {
    const name = this.props.user.getIn(['profile', 'name']);
    const image = this.props.user.getIn(['profile', 'profilePhoto', 'images', '100x100']);
    const date = this.props.date;
    const unread = (!this.props.activityRead);
    return (
      <Tappable onTap={this.onTap} className={this.block()} >
        <ProfileListItem className={this.element('item', {unread})}>
          <ProfileListImage image={image} />
          <ProfileListContent>
            <p className={this.element('name')}>{name}</p>
            <p className={this.element('status')}>
              Nudged you { this.parseDate(date) }
            </p>
          </ProfileListContent>
          <Tappable onTap={this.onIconTap} className={this.element('icon-wrapper')}>
            <Icon src={IconTest} className={this.element('icon')} />
          </Tappable>
        </ProfileListItem>
      </Tappable>
    );
  }

}

export default ActivityItem;
