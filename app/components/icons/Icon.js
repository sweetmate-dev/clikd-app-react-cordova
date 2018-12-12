import './Icon.scss';

import React, { PropTypes } from 'react';
import bem from 'react-bem-classes';

@bem({block: 'icon', modifiers: ['button']})
class Icon extends React.Component {
  
  static propTypes = {
    src: PropTypes.string.isRequired,
    className: PropTypes.string,
  }

  render() {
    return (
      <span className={this.block(this.props.className)} dangerouslySetInnerHTML={{__html: this.props.src}} />
    );
  }

}

export default Icon;