import React, { PropTypes } from 'react';
import Tappable from 'react-tappable';
import bem from 'react-bem-classes';

import Icon from '^/components/icons/Icon';

import './IconButton.scss';

@bem({ block: 'icon-button' })
class IconButton extends React.Component {

  static propTypes = {
    solid: PropTypes.bool,
    icon: PropTypes.string.isRequired,
    children: PropTypes.node,
    animation: PropTypes.string,
  }

  onTap = (e) => {
    e.preventDefault();
    if (this.props.onTap) this.props.onTap(this.props.context);
  }

  render() {
    const { icon, solid, children, animation } = this.props;
    let className = this.element('icon', { solid });
    if (animation) {
      className = className + ' ' + animation;
    }
    return (
      <Tappable onTap={this.onTap} className={this.block()}>
        <Icon src={icon} className={className} />
        <div className={this.element('label')}>{children}</div>
      </Tappable>
    );
  }
}

export default IconButton;
