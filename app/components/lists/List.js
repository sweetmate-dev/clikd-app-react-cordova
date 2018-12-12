import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';

import './List.scss';

@bem({ block: 'list', 'modifiers': ['form'] })
class List extends Component {

  static propTypes = {
    theme: PropTypes.string,
    size: PropTypes.oneOf(['small', null]),
    children: PropTypes.node,
  }

  render() {
    let children = [].concat(this.props.children);
    return (
      <div className={this.block()}>
        <For each="child" index="idx" of={children}>
          <If condition={child}>
            {React.cloneElement(child, {
              key: idx,
              theme: child.props.theme || this.props.theme,
              size: child.props.size || this.props.size,
            })}
          </If>
        </For>
      </div>
    );
  }
}

export default List;
