import React, { Component } from 'react';
import bem from 'react-bem-classes';

import PreloadImage from '^/components/PreloadImage';

import './ProfileListImage.scss';

@bem({ block: 'profile-list-image' })
class ProfileListImage extends Component {

  render() {
    return (
      <PreloadImage src={this.props.image} className={this.block()} />
    );
  } 

}

export default ProfileListImage;
