import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Hammer from 'react-hammerjs';

import IconCross from '^/assets/icons/cross.svg';
import Icon from '^/components/icons/Icon';

import './Notification.scss';

@bem({ block: 'notification' })
class Notification extends Component {

  static propTypes = {
    dismissHandler: PropTypes.func,
    tapHandler: PropTypes.func,
    title: PropTypes.string,
    body: PropTypes.string,
    id: PropTypes.string,
  };

  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.props.dismissHandler(this.props.id);
    }, 8000); // Clear after 8 seconds
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  onDismissTap = () => {
    this.props.dismissHandler(this.props.id);
  }

  onMessageTap = () => {
    this.props.tapHandler(this.props.id);
  }

  render() {
    const { title, body } = this.props;
    return (
      <div className={this.block()}>
        <Hammer onTap={this.onMessageTap}>
          <div className={this.element('message')}>
            <If condition={title}>
              <h3>{title}</h3>
            </If>
            <p>{body}</p>
          </div>
        </Hammer>
        <Hammer onTap={this.onDismissTap} >
          <Icon src={IconCross} className={this.element('button')} />
        </Hammer>
      </div>
    );
  }
}


export default Notification;
