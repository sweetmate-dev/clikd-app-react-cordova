import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Hammer from 'react-hammerjs';
import dateFormat from 'dateformat';

import IconVerticalDots from '^/assets/icons/vertical-dots.svg';
import Icon from '^/components/icons/Icon';
import Badge from '^/components/badges/Badge';
import { ProfileListItem, ProfileListImage, ProfileListContent } from '^/components/profile-list';
import { getDateDifference } from '^/services/Utils';
import { GENERIC_ERROR_MESSAGE, GENERIC_ERROR_TITLE } from '^/constants/Messages';
import { REPORT_REASONS } from '^/constants/Settings';
import ActionsheetService from '^/services/ActionsheetService';

import './InboxListItem.scss';

@bem({ block: 'inbox-list-item' })
class InboxListItem extends Component {

  static propTypes = {
    thread: PropTypes.shape({
      threadId: PropTypes.string,
      userId: PropTypes.number,
      name: PropTypes.string,
      lastMessageDate: PropTypes.instanceOf(Date),
      lastMessage: PropTypes.string,
      unreadMessagesCount: PropTypes.number,
      profilePhoto: PropTypes.string,
      blockBusy: PropTypes.bool,
      blockError: PropTypes.any,
      reportBusy: PropTypes.bool,
      reportError: PropTypes.any,
    }),
    onTap: PropTypes.func.isRequired,
    onPhotoTap: PropTypes.func.isRequired,
    blockHandler: PropTypes.func.isRequired,
    reportHandler: PropTypes.func.isRequired,
    loaderHandler: PropTypes.func.isRequired,
    alertHandler: PropTypes.func.isRequired,
  };

  componentWillReceiveProps(newProps) {
    if (newProps.thread.blockBusy !== this.props.thread.blockBusy) {
      this.props.loaderHandler(newProps.thread.blockBusy);
    }
    if (newProps.thread.reportBusy !== this.props.thread.reportBusy) {
      this.props.loaderHandler(newProps.thread.reportBusy);
    }
    if (this.props.thread.reportBusy && !newProps.thread.reportBusy && !newProps.thread.reportError) {
      this.props.alertHandler({
        title: 'Report sent',
        message: 'Thank you for your report.  We\'ll review it shortly and take any appropriate action.',
      });
    }
    if (
      !this.props.thread.blockError && newProps.thread.blockError
      || !this.props.thread.reportError && newProps.thread.reportError
    ) {
      this.props.alertHandler({ title: GENERIC_ERROR_TITLE, message: GENERIC_ERROR_MESSAGE });
    }
  }

  getDate(date) {
    const diff = getDateDifference(date);
    if (diff > -1) return dateFormat(date, 'HH:MM');
    if (diff === -1) return 'Yesterday';
    return dateFormat(date, 'dd/mm/yyyy');
  }

  onTap = () => {
    this.props.onTap(this.props.thread.userId);
  }

  onPhotoTap = () => {
    this.props.onPhotoTap(this.props.thread.userId);
  }

  onMenuTap = () => {
    this.component.setOffset(0);
    this.props.alertHandler({
      buttons: [{
        label: 'Block user',
        callback: this.blockUser,
      }, {
        label: 'Report user',
        callback: this.reportUser,
      }, {
        label: 'Cancel',
        color: 'transparent',
      }],
    });
  }

  blockUser = () => {
    this.props.alertHandler({
      title: 'Block user',
      message: 'Are you sure you want to block this user?  You will no longer be able to contact each other.',
      buttons: [{
        label: 'Yes',
        callback: () => {
          this.props.blockHandler(this.props.thread.userId, {
            threadId: this.props.thread.threadId,
          });
        },
      }, {
        label: 'No',
        color: 'transparent',
      }],
    });
  }

  reportUser = () => {
    const reportHandler = this.props.reportHandler;
    const userId = this.props.thread.userId;

    const buttons = [];
    for (let i = 0; i < REPORT_REASONS.length; i++) {
      let reportReason = REPORT_REASONS[i];
      buttons.push({
        label: reportReason.label,
        callback: () => { reportHandler(userId, reportReason.value); }
      });
    }

    buttons.push({
      label: 'Cancel',
      color: 'transparent',
    });

    this.props.alertHandler({
      message: 'Please select a reason from the list below.',
      buttons: buttons,
    });
  }

  render() {
    const { name, lastMessageDate, lastMessage, profilePhoto, unreadMessagesCount } = this.props.thread;
    const message = lastMessage || 'You have Clikd';
    return (
      <ProfileListItem
        draggableDistance={40}
        className={this.block({
          unread: !!unreadMessagesCount
        })}
        ref={(c) => { this.component = c }}
      >
        <Hammer onTap={this.onMenuTap}>
          <Icon src={IconVerticalDots} className={this.element('menu-icon')} />
        </Hammer>
        <Hammer onTap={this.onPhotoTap}>
          <ProfileListImage image={profilePhoto} />
        </Hammer>
        <Hammer onTap={this.onTap}>
          <ProfileListContent>
            <div className={this.element('meta')}>
              <p className={this.element('name')}>{name}</p>
            </div>
            <p className={this.element('latest-message')}>{message}</p>
          </ProfileListContent>
        </Hammer>
        <If condition={lastMessageDate}>
          <Hammer onTap={this.onTap}>
            <p className={this.element('date')}>{this.getDate(lastMessageDate)}</p>
          </Hammer>
        </If>
      </ProfileListItem>
    );
  }

}

export default InboxListItem;