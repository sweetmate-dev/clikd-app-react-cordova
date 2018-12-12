import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';

import './ListLabel.scss';

@bem({ block: 'list-label' })
class ListLabel extends Component {

  static propTypes = {
    children: PropTypes.node,
    subtext: PropTypes.string,
  }

  render() {
    return (
      <div className={this.block()}>
        <div className={this.element('label')}>
          {this.props.children}
        </div>
        <If condition={this.props.subtext}>
          <div className={this.element('subtext')}>
            {this.props.subtext}
          </div>
        </If>
      </div>
    );
  }
}

export default ListLabel;
