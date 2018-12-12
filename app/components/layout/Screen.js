import React, { PropTypes } from 'react';
import bem from 'react-bem-classes';

import './Screen.scss';

@bem({ block: 'screen' })
class Screen extends React.Component {

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    return <div className={this.block()}>{this.props.children}</div>;
  }

}

export default Screen;
