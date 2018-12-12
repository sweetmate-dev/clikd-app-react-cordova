import React, { Component, PropTypes } from 'react';
import Hammer from 'react-hammerjs';
import bem from 'react-bem-classes';
import { connect } from 'react-redux';

import { navigateTo } from '^/actions/NavigationActions';
import PolaroidStack from '^/components/user/PolaroidStack';

import './ManageProfileImages.scss';

function mapStateToProps(state) {
  const profile = state.user.get('profile');
  return {
    name: profile.get('name'),
    age: profile.get('age'),
    work: profile.get('work'),
    location: profile.get('location'),
    height: profile.get('height'),
    genderId: profile.get('genderId'),
    orientationId: profile.get('orientationId'),
    purposes: profile.get('purposes').toJS(),
    passions: profile.get('passions'),
    tagLine: profile.get('tagLine'),
    images: profile.get('photos').map(photo => photo.getIn(['images', '600x600'])),
  };
}

@connect(mapStateToProps, { navigateTo })
@bem({ block: 'manage-profile-images' })
class ManageProfileImages extends Component {

  static propTypes = {
    navigateTo: PropTypes.func,
  }

  onTap = () => {
    this.props.navigateTo('manage-photos');
  }

  render() {
    const props = this.props;
    return (
      <div className={this.block()}>
        <Hammer onTap={this.onTap}>
          <PolaroidStack
            name={props.name}
            age={props.age}
            work={props.work}
            location={props.location}
            height={props.height}
            genderId={props.genderId}
            orientationId={props.orientationId}
            passions={props.passions}
            images={props.images}
            tagLine={props.tagLine}
            purposes={props.purposes}
            className={this.element('carousel')}
          />
        </Hammer>
      </div>
    );
  }

}

export default ManageProfileImages;
