import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';

import IconLoader from '^/assets/icons/loader.svg';
import Icon from '^/components/icons/Icon';

import './Loader.scss';

@bem({ block: 'loader', modifiers: ['centered', 'size', 'color'] })
class Loader extends Component {

  static propTypes = {
    size: PropTypes.oneOf(['large']),
    color: PropTypes.oneOf(['grey']),
    centered: PropTypes.bool,
  };

  render() {
    return <Icon src={IconLoader} className={this.block()} />;
  }

}

export default Loader;
