import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import { connect } from 'react-redux';

import IconBack from '^/assets/icons/back.svg';
import { navigateBack } from '^/actions/NavigationActions';

import ActionButton from './ActionButton';

@connect(null, { navigateBack })
class BackButton extends Component {

  static propTypes = {
    navigateBack: PropTypes.func,
    beforeNavigate: PropTypes.func,
    defaultRoute: PropTypes.string.isRequired,
  }

  onTap = () => {
    if (this.props.beforeNavigate) {
      this.props.beforeNavigate(() => {
        this.props.navigateBack(this.props.defaultRoute);
      });
    } else {
      this.props.navigateBack(this.props.defaultRoute);
    }
  }

  render() {
    return (
      <ActionButton onTap={this.onTap} icon={IconBack} left />
    );
  }
}


export default BackButton;
