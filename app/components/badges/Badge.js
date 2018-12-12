import './Badge.scss';

import React, { PropTypes } from 'react';
import bem from 'react-bem-classes';

@bem({block: 'badge', modifiers: ['button']})
class Badge extends React.Component {
  
  static propTypes = {
    className: PropTypes.string,
  }

  render() {
    if (this.props.children == '' || this.props.children === undefined || this.props.children == 0) {
      return <span />
    }
    return (
      <span className={this.block(this.props.className)}>
        {this.props.children}
      </span>
    );
  }

}

export default Badge;