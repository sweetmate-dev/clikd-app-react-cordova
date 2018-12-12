import React, { PropTypes } from 'react';
import Hammer from 'react-hammerjs';
import bem from 'react-bem-classes';

import Loader from '^/components/icons/Loader';

import './Button.scss';

@bem({ block: 'button', modifiers: ['color', 'loading', 'disabled', 'full-width'] })
class Button extends React.Component {

  static propTypes = {
    color: PropTypes.oneOf(['facebook', 'red', 'transparent', 'white']),
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    children: PropTypes.node,
    onTap: PropTypes.func,
    context: PropTypes.any,
  }

  onTap = (e) => {
    e.preventDefault();
    if (this.props.onTap) this.props.onTap(this.props.context);
  }

  render() {
    return (
      <Hammer onTap={this.onTap}>
        <div className={this.block()}>
          <Choose>
            <When condition={this.props.loading}>
              <Loader centered />
            </When>
            <Otherwise>
              {this.props.children}
            </Otherwise>
          </Choose>
        </div>
      </Hammer>
    );
  }
}

export default Button;
