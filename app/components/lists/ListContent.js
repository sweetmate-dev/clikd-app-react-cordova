import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';

import './ListContent.scss';

@bem({ block: 'list-content' })
class ListContent extends Component {

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    return (
      <div className={this.block()}>
        {this.props.children}
      </div>
    );
  }
}

export default ListContent;
