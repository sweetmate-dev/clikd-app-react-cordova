import React, { PropTypes, Component } from 'react';
import bem from 'react-bem-classes';

import './Content.scss';

@bem({ block: 'content', modifiers: ['flex', 'white'] })
class Content extends Component {

  static propTypes = {
    children: PropTypes.node,
    flex: PropTypes.bool,
    white: PropTypes.bool,
    onScroll: PropTypes.func,
    useRef: PropTypes.func,
  };

  render() {
    return <div className={this.block()} onScroll={this.props.onScroll} ref={this.props.useRef}>{this.props.children}</div>;
  }

}

export default Content;
