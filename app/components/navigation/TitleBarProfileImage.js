import React, { Component } from 'react';
import bem from 'react-bem-classes';

import PreloadImage from '^/components/PreloadImage';

import './TitleBarProfileImage.scss';

@bem({ block: 'title-bar-profile-image' })
class TitleBarProfileImage extends Component {

  static propTypes = {
    user: PropTypes.instanceOf(Immutable.Map)
  };
//<PreloadImage src={this.props.image} className={this.block()} />
  render() {
    return (
      <div />
    );
  } 

}

export default TitleBarProfileImage;
