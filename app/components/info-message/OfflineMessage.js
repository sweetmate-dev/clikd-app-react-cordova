import React, { Component, PropTypes } from 'react';

import ErrorMessage from './ErrorMessage';

class OfflineMessage extends Component {

  static propTypes = {
    retry: PropTypes.func,
    className: PropTypes.string,
    theme: PropTypes.string,
  }

  render() {
    const { retry, theme, className } = this.props;
    return (
      <ErrorMessage retry={retry} theme={theme} className={className}>
        You are currently offline.
      </ErrorMessage>
    );
  }

}

export default OfflineMessage;
