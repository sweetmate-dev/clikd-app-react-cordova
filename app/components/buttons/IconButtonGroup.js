import React, { PropTypes } from 'react';
import bem from 'react-bem-classes';

import './IconButtonGroup.scss';

@bem({ block: 'icon-button-group' })
class IconButtonGroup extends React.Component {

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    return (
      <div className={this.block()}>
        {this.props.children.map((child, key) => 
          React.cloneElement(child, { key, className: this.element('item') })
        )}
      </div>
    );
  }
}

export default IconButtonGroup;
