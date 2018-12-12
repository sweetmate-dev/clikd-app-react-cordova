import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Tappable from 'react-tappable';

import IconTick from '^/assets/icons/tick.svg';
import IconTest from '^/assets/icons/test.svg';
import IconLogo from '^/assets/icons/logo.svg';
import CloseIcon from '^/assets/icons/cross.svg';
import PreloadImage from '^/components/PreloadImage';
import Icon from '^/components/icons/Icon';

import './UserGridItem.scss';

@bem({ block: 'user-grid-item' })
class UserGridItem extends Component {

  static propTypes = {
    profilePhoto: PropTypes.string,
    name: PropTypes.string,
    age: PropTypes.number,
    tagLine: PropTypes.string,
    userId: PropTypes.number,
    navigateTo: PropTypes.func,
    matchStatusId: PropTypes.number,
    onTap: PropTypes.func.isRequired,
    onIconTap: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  };

  onTap = (e) => {
    this.props.onTap(this.props.userId);
  };

  onIconTap = (e) => {
    e.stopPropagation();
    this.props.onIconTap(this.props.userId, this.props.matchStatusId);
  }

  onDelete = (e) => {
    e.stopPropagation();
    this.props.onDelete(this.props.userId);
  }

  getUserStatus(matchStatusId) {
    if (matchStatusId) {
      return IconTick;
    }
    return IconTest;
  }

  render() {
    const { profilePhoto, name, age, tagLine, matchStatusId } = this.props;
    const matchIcon = this.getUserStatus(matchStatusId);
    if (matchStatusId) {
      return (
        <div />
      );
    }
    return (
      <Tappable onTap={this.onTap}>
        <PreloadImage src={profilePhoto} fluidHeight className={this.block()}>
          <div className={this.element('info')}>
            <div className={this.element('left')}>
              <p className={this.element('name')}>{name}, {age}</p>
              <If condition={tagLine}><p className={this.element('tagline')}>{tagLine}</p></If>
            </div>
            <Tappable className={this.element('icon-wrapper')} onTap={this.onIconTap}>
              <Icon src={matchIcon} className={this.element('match-status-icon')} />
            </Tappable>
          </div>
          <Tappable className={this.element('delete-icon-wrapper')} onTap={this.onDelete}>
            <Icon src={CloseIcon} className={this.element('delete-icon')} />
          </Tappable>
        </PreloadImage>
      </Tappable>
    );
  }

}

export default UserGridItem;
