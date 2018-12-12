import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';

import './ListRow.scss';

@bem({ block: 'list-row', modifiers: ['stacked', 'theme', 'size'] })
class ListRow extends Component {

  static propTypes = {
    stacked: PropTypes.bool,
    theme: PropTypes.oneOf(['white', 'dark', 'dark-block', 'med-block']),
    size: PropTypes.oneOf(['small']),
    children: PropTypes.node,
  }

  render(){
    return (
      <div className={this.block()}>
        {this.props.children}
      </div>
    );
  }
}

export default ListRow;
