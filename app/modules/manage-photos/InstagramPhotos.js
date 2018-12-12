import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import bem from 'react-bem-classes';

import { Screen, Content } from '^/components/layout';
import { TitleBar, ActionButton } from '^/components/navigation';
import PhotoGrid from '^/components/photos/PhotoGrid';
import Button from '^/components/buttons/Button';
import { getInstagramPhotos } from '^/actions/PhotosActions';
import { updateValue } from '^/actions/FormActions';
import { toggleLoader, showAlert } from '^/actions/AppActions';
import { navigateBack, navigateBackTo } from '^/actions/NavigationActions';
import { GENERIC_ERROR_MESSAGE, GENERIC_ERROR_TITLE } from '^/constants/Messages';

import './InstagramPhotos.scss';

function mapStateToProps(state){
  const photos = state.photos.get('instagramPhotoIds').map(id => 
    state.photos.getIn(['instagramPhotos', id])
  );
  return {
    photos,
    nextPage: state.photos.get('instagramNextPage'),
    getInstagramPhotosBusy: state.photos.get('getInstagramPhotosBusy'),
    getInstagramPhotosError: state.photos.get('getInstagramPhotosError'),
  };
}

@connect(mapStateToProps, { getInstagramPhotos, toggleLoader, navigateBack, navigateBackTo, updateValue, showAlert })
@bem({ block: 'instagram-photos-screen' })
class InstagramPhotos extends Component {

  static propTypes = {
    getInstagramPhotos: PropTypes.func,
    toggleLoader: PropTypes.func,
    navigateBack: PropTypes.func,
    navigateBackTo: PropTypes.func,
    updateValue: PropTypes.func,
    photos: PropTypes.instanceOf(Immutable.List),
    nextPage: PropTypes.string,
    getInstagramPhotosBusy: PropTypes.bool,
    getInstagramPhotosError: PropTypes.any,
    showAlert: PropTypes.func.isRequired,
  }

  componentWillMount() {
    if (!this.props.photos.size) {
      this.props.getInstagramPhotos();
    }
  }

  componentWillReceiveProps(newProps){
    if (this.props.getInstagramPhotosBusy !== newProps.getInstagramPhotosBusy) {
      this.props.toggleLoader(newProps.getInstagramPhotosBusy);
    }
    if (!this.props.getInstagramPhotosError && newProps.getInstagramPhotosError) {
      this.props.showAlert({
        title: GENERIC_ERROR_TITLE,
        message: GENERIC_ERROR_MESSAGE,
        buttons: [{
          callback: () => {
            this.props.navigateBack('manage-photos');
          },
        }],
      });
    }
  }

  onPhotoTap = (photo) => {
    this.props.updateValue('manage-photos', 'resize', {
      instagramUrl: photo.getIn(['images', 'standard_resolution', 'url']),
    });
    this.props.navigateBackTo('manage-photos/resize');
  }

  onLoadMoreTap = () => {
    this.props.getInstagramPhotos(this.props.nextPage);
  }

  onCancelTap = () => {
    this.props.navigateBack('manage-photos');
  }

  render() {
    const { photos, nextPage } = this.props;
    return (
      <Screen className={this.block()}>
        <TitleBar className={this.element('title')}>
          <ActionButton left onTap={this.onCancelTap}>Cancel</ActionButton>
        </TitleBar>
        <Content>
          <PhotoGrid 
            photos={photos} 
            thumbKey={['images', 'thumbnail', 'url']}
            onTap={this.onPhotoTap}
          />
          <If condition={nextPage}>
            <div className={this.element('button-wrapper')}>
              <Button onTap={this.onLoadMoreTap} >
                Load More
              </Button>
            </div>
          </If>
        </Content>
      </Screen>
    );
  };

};


export default InstagramPhotos;