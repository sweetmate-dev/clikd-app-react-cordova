import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Hammer from 'react-hammerjs';

import { ListRow } from '^/components/lists';

import './ListButton.scss';

@bem({ block: 'list-button' })
class ListButton extends Component {

  static propTypes = {
    children: PropTypes.node,
    theme: PropTypes.string,
    onTap: PropTypes.func,
    context: PropTypes.any,
  }

  onTap = () => {
    this.props.onTap(this.props.context);
  }

  render() {
    return (
      <Hammer onTap={this.onTap}>
        <ListRow theme={this.props.theme} className={this.block()}>
          <div className={this.element('button')} >
            {this.props.children}
          </div>
        </ListRow>
      </Hammer>
    );
  }
}

export default ListButton;
