import React, { PropTypes, Component } from 'react';
import bem from 'react-bem-classes';
import Hammer from 'react-hammerjs';

import './Link.scss';

@bem({block: 'link'})
class MailLink extends Component {

  static propTypes = {
    to: PropTypes.string,
  };

  onTap = () => {
    window.location = `mailto:${this.props.to}`;
  }

  render() {
    return (
      <Hammer onTap={this.onTap}>
        <span className={this.block()}>{this.props.children}</span>
      </Hammer>
    );
  }

}

export default MailLink;
