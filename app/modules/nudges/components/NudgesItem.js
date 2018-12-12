import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Hammer from 'react-hammerjs';
import dateFormat from 'dateformat';

import { ProfileListItem, ProfileListImage, ProfileListContent } from '^/components/profile-list';
import { getDateDifference } from '^/services/Utils';

import './NudgesItem.scss';

@bem({ block: 'nudges-item' })
class NudgesItem extends Component {

  static propTypes = {
    userId: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
    nudgeReceivedAt: PropTypes.instanceOf(Date),
    onTap: PropTypes.func.isRequired,
  }

  onTap = () => {
    this.props.onTap(this.props.userId);
  }

  parseDate(date) {
    const diff = getDateDifference(date);
    if (diff > -1) return 'Today';
    if (diff === -1) return 'Yesterday';
    return dateFormat(date, 'dd/mm/yyyy');
  }

  render() {
    const { name, image, nudgeReceivedAt } = this.props;
    return (
      <Hammer onTap={this.onTap}>
        <ProfileListItem className={this.block()}>
          <ProfileListImage image={image} />
          <ProfileListContent className={this.element('content')}>
            <p className={this.element('name')}>{name}</p>
            <p className={this.element('nudge-date')}>
              Nudged you { this.parseDate(nudgeReceivedAt) }
            </p>
          </ProfileListContent>
        </ProfileListItem>
      </Hammer>
    );
  }

}

export default NudgesItem;
