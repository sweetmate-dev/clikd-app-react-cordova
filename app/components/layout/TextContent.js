import React, { PropTypes, Component } from 'react';
import bem from 'react-bem-classes';

import './TextContent.scss';
import Content from './Content';

@bem({ block: 'text-content' })
class TextContent extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    let className = this.block();
    if(this.props.className) className += ` ${this.props.className}`;
    return <Content className={className} {...this.props} >{this.props.children}</Content>;
  }

}

export default TextContent;
