import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Tappable from 'react-tappable';
import { connect } from 'react-redux';

import dateFormat from 'dateformat';
import Immutable from 'immutable';
import { navigateTo } from '^/actions/NavigationActions';
import IconNudge from '^/assets/icons/nudge.svg';
import { ProfileListItem, ProfileListImage, ProfileListContent } from '^/components/profile-list';
import Icon from '^/components/icons/Icon';
import { GENERIC_ERROR_MESSAGE, GENERIC_ERROR_TITLE } from '^/constants/Messages';
import { getDateDifference } from '^/services/Utils';

import './ActivityItem.scss';

@connect(null, { navigateTo })
@bem({ block: 'activity-item' })
class ActivityItem extends Component {

  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  };

  static propTypes = {
    user: PropTypes.instanceOf(Immutable.Map),
    date: PropTypes.instanceOf(Date),
    onTap: PropTypes.func.isRequired,
    nudgeHandler: PropTypes.func.isRequired,
    alertHandler: PropTypes.func.isRequired,
    loaderHandler: PropTypes.func.isRequired,
    navigateTo: PropTypes.func,
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
      const state = this.context.store.getState();
      if (!state.user.get('test').size) {
        this.props.alertHandler({
          title: 'Set up your test',
          message: 'You can\'t nudge anyone until you\'ve set up your own test.',
          buttons: [{
            label: 'Set-up test',
            callback: () => {
              this.props.navigateTo(`/home/manage-test/categories`);
            }
          }/*, {
            label: 'Keep looking',
          }*/]
        });
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
    return (
      <Tappable onTap={this.onTap} className={this.block()}>
        <ProfileListItem className={this.element('item')}>
          <ProfileListImage image={image} />
          <ProfileListContent>
            <p className={this.element('name')}>{name}</p>
            <p className={this.element('status')}>
              Test taken { this.parseDate(date) }
            </p>
          </ProfileListContent>
          <Tappable onTap={this.onNudgeTap} className={this.element('icon-wrapper')}>
            <Icon src={IconNudge} className={this.element('icon', { disabled: nudges > 0 })} />
          </Tappable>
        </ProfileListItem>
      </Tappable>
    );
  }

}

export default ActivityItem;
