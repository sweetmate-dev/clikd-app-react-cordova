import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import bem from 'react-bem-classes';

import { Screen, Content } from '^/components/layout';
import { TitleBar, BackButton, Title } from '^/components/navigation';
import Button from '^/components/buttons/Button';
import PhotoGrid from '^/components/photos/PhotoGrid';
import { getFacebookPhotos } from '^/actions/PhotosActions';
import { toggleLoader, showAlert } from '^/actions/AppActions';
import { navigateBack, navigateBackTo } from '^/actions/NavigationActions';
import { updateValue } from '^/actions/FormActions';
import { GENERIC_ERROR_MESSAGE, GENERIC_ERROR_TITLE } from '^/constants/Messages';
import Facebook from '^/services/Facebook';

import './FacebookPhotos.scss';

function mapStateToProps(state, ownProps) {
  const album = state.photos.getIn(['facebookAlbums', ownProps.params.id], new Immutable.Map());
  return {
    albumName: album.get('name'),
    nextPage: album.get('nextPage'),
    getPhotosBusy: album.get('getPhotosBusy'),
    getPhotosError: album.get('getPhotosError'),
    photos: album.get('facebookPhotos', new Immutable.List()).map(id => new Immutable.Map({
      id,
      thumbnail: Facebook.getImageUrl(id, 'small'),
    })),
  };
}

@connect(mapStateToProps, { getFacebookPhotos, toggleLoader, navigateBack, navigateBackTo, updateValue, showAlert })
@bem({ block: 'facebook-photos-screen' })
class FacebookPhotos extends Component {

  static propTypes = {
    photos: PropTypes.instanceOf(Immutable.List),
    albumName: PropTypes.string,
    nextPage: PropTypes.string,
    getPhotosBusy: PropTypes.bool,
    getPhotosError: PropTypes.bool,
    getFacebookPhotos: PropTypes.func,
    toggleLoader: PropTypes.func,
    navigateBack: PropTypes.func,
    navigateBackTo: PropTypes.func,
    showAlert: PropTypes.func.isRequired,
    updateValue: PropTypes.func,
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }

  componentWillMount() {
    const { photos, params } = this.props;
    if (!photos.size) this.props.getFacebookPhotos(params.id);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.getPhotosBusy !== newProps.getPhotosBusy) {
      this.props.toggleLoader(newProps.getPhotosBusy);
    }
    if (!this.props.getPhotosError && newProps.getPhotosError) {
      this.props.showAlert({
        title: GENERIC_ERROR_TITLE,
        message: GENERIC_ERROR_MESSAGE,
        buttons: [{
          callback: () => {
            this.props.navigateBack('manage-photos/facebook');
          },
        }],
      });
    }
  }

  onLoadMoreTap = () => {
    this.props.getFacebookPhotos(this.props.params.id, this.props.nextPage);
  }

  onPhotoTap = (photo) => {
    this.props.updateValue('manage-photos', 'resize', {
      facebookPhotoId: photo.get('id'),
    });
    this.props.navigateBackTo('manage-photos/resize');
  }

  render() {
    const { albumName, photos } = this.props;
    return (
      <Screen className={this.block()}>
        <TitleBar className={this.element('title')}>
          <BackButton defaultRoute="manage-photos" />
          <Title>{albumName}</Title>
        </TitleBar>
        <Content>
          <PhotoGrid
            photos={photos}
            thumbKey={['thumbnail']}
            onTap={this.onPhotoTap}
          />
          <If condition={this.props.nextPage}>
            <Button
              className={this.element('button')}
              color="facebook"
              onTap={this.onLoadMoreTap}
            >
              Load More
            </Button>
          </If>
        </Content>
      </Screen>
    );
  }

}

export default FacebookPhotos;
