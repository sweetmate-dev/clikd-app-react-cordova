import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';

import './ListRowWrapper.scss';

@bem({ block: 'list-row-wrapper' })
class ListRowWrapper extends Component {

  static propTypes = {
    children: PropTypes.node,
    theme: PropTypes.string,
  }

  render() {
    return (
      <div className={this.block()}>
        <For each="child" index="idx" of={this.props.children}>
          {React.cloneElement(child, { key: idx, theme: child.props.theme || this.props.theme })}
        </For>
      </div>
    );
  }
}

export default ListRowWrapper;
