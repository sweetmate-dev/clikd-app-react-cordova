import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';

import './TitleBar.scss';

@bem({ block: 'title-bar', modifiers: ['fixed', 'fade', 'border'] })
class TitleBar extends Component {

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    return (
      <header className={this.block()}>
        {this.props.children}
      </header>
    );
  }
}

export default TitleBar;
