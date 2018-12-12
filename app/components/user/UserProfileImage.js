import './UserProfileImage.scss';

import React, { PropTypes } from 'react';
import bem from 'react-bem-classes';

import PreloadImage from '^/components/PreloadImage';

@bem({ block: 'user-profile-image' })
class UserProfileImage extends React.Component {

  static propTypes = {
    src: PropTypes.string
  }

 
  render() {
    return (
      <div className={this.block()}>
        <div className={this.element('image-wrapper')}>
          <PreloadImage src={this.props.image} className={this.element('image')} />
          {this.props.children}
        </div>
        <h3>
          {this.props.name}
          <If condition={this.props.age}>, {this.props.age}</If>
        </h3>

      </div>
    )
   };
};


export default UserProfileImage;