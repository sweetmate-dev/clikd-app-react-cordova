import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';

import IconWarning from '^/assets/icons/warning.svg';
import { ButtonList, Button } from '^/components/buttons';

import './ErrorMessage.scss';
import InfoMessage from './InfoMessage';
import InfoMessageIcon from './InfoMessageIcon';

@bem({ block: 'error-message' })
class ErrorMessage extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    retry: PropTypes.func,
    className: PropTypes.string,
    theme: PropTypes.string,
  }

  render() {
    return (
      <InfoMessage className={this.props.className} theme={this.props.theme}>
        <h2>Oops!</h2>
        <p>{this.props.children}</p>
        <If condition={this.props.retry}>
          <ButtonList>
            <Button onTap={this.props.retry}>Retry</Button>
          </ButtonList>
        </If>
      </InfoMessage>
    );
  }

}

export default ErrorMessage;
