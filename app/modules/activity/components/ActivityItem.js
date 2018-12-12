import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Tappable from 'react-tappable';
import dateFormat from 'dateformat';
import Immutable from 'immutable';

import IconNudge from '^/assets/icons/nudge.svg';
import { ProfileListItem, ProfileListImage, ProfileListContent } from '^/components/profile-list';
import Icon from '^/components/icons/Icon';
import { GENERIC_ERROR_MESSAGE, GENERIC_ERROR_TITLE } from '^/constants/Messages';
import { getDateDifference } from '^/services/Utils';

import './ActivityItem.scss';

@bem({ block: 'activity-item' })
class ActivityItem extends Component {

  static propTypes = {
    user: PropTypes.instanceOf(Immutable.Map),
    date: PropTypes.instanceOf(Date),
    onTap: PropTypes.func.isRequired,
    nudgeHandler: PropTypes.func.isRequired,
    alertHandler: PropTypes.func.isRequired,
    loaderHandler: PropTypes.func.isRequired,
  }

  componentWillReceiveProps(newProps) {
    const error = newProps.user.get('nudgeError');
    const busy = newProps.user.get('nudgeBusy');
    if (!this.props.user.get('nudgeError') && error) {
      if (error === 'Maximum nudges for this user reached!') {
        this.showNudgeError();
      } else {
        this.props.alertHandler({ title: GENERIC_ERROR_TITLE, message: GENERIC_ERROR_MESSAGE });
      }
    }
    if (this.props.user.get('nudgeBusy') !== busy) {
      this.props.loaderHandler(busy);
    }
  }

  onTap = () => {
    const userId = this.props.user.getIn(['profile', 'userId']);
    this.props.onTap(userId);
  }

  onNudgeTap = (e) => {
    e.stopPropagation();
    const nudges = this.props.user.getIn(['profile', 'nudges']);
    const userId = this.props.user.getIn(['profile', 'userId']);
    if (nudges > 0) {
      this.showNudgeError();
    } else {
      this.props.alertHandler({
        message: 'Say hi to this user?',
        buttons: [{
          label: 'Yes',
          callback: () => {
            this.props.nudgeHandler(userId);
          },
        }, {
          label: 'No',
          color: 'transparent',
        }],
      });
    }
  }

  showNudgeError() {
    this.props.alertHandler({
      title: 'Oops',
      message: 'You can\'t say hi to this user more than once',
    });
  }

  parseDate(date) {
    if (!date) return '';
    const diff = getDateDifference(date);
    if (diff > -1) return 'Today';
    if (diff === -1) return 'Yesterday';
    return `on ${dateFormat(date, 'dS mmm')}`;
  }

  render() {
    const name = this.props.user.getIn(['profile', 'name']);
    const nudges = this.props.user.getIn(['profile', 'nudges']);
    const image = this.props.user.getIn(['profile', 'profilePhoto', 'images', '100x100']);
    const date = this.props.date;
    const state = nudges ? 'nudged' : null;
    return (
      <Tappable onTap={this.onTap} >
        <ProfileListItem className={this.block({ state })}>
          <ProfileListImage image={image} />
          <ProfileListContent>
            <p className={this.element('name')}>{name}</p>
            <p className={this.element('status')}>
              Test passed { this.parseDate(date) }
            </p>
          </ProfileListContent>
          <Tappable onTap={this.onNudgeTap} className={this.element('icon-wrapper')}>
            <Icon src={IconNudge} className={this.element('icon')} />
          </Tappable>
        </ProfileListItem>
      </Tappable>
    );
  }

}

export default ActivityItem;
