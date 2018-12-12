import React, { PropTypes } from 'react';
import Hammer from 'react-hammerjs';
import bem from 'react-bem-classes';

import './ShareButton.scss';
import Button from './Button';

@bem({ block: 'share-button' })
class ShareButton extends React.Component {

  static propTypes = {
    method: PropTypes.string,
    color: PropTypes.string,
  }

  onTap = () => {
    if (this.props.onTap) this.props.onTap(this.props.method);
  }

  render() {
    const { method, color } = this.props;
    const className = method.toLowerCase();
    return (
      <Hammer onTap={this.onTap}>
        <Button className={this.block({ [className]: true })} color={color} >
          <p className={this.element('label')}>Share via</p>
          <p className={this.element('method')}>{ method }</p>
        </Button>
      </Hammer>
    );
  }
}

export default ShareButton;
