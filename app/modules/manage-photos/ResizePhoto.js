import React, { Component, PropTypes } from 'react';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import bem from 'react-bem-classes';
import { connect } from 'react-redux';

import { toggleLoader, showAlert } from '^/actions/AppActions';
import { initForm, destroyForm, pushValue, updateValue } from '^/actions/FormActions';
import { NAVIGATION_BACKWARDS, navigateTo, navigateBack } from '^/actions/NavigationActions';
import { Screen, ContentTransitionGroup } from '^/components/layout';
import Facebook from '^/services/Facebook';
import { GENERIC_ERROR_MESSAGE, GENERIC_ERROR_TITLE } from '^/constants/Messages';

import './ResizePhoto.scss';
import ActionButton from '../../components/navigation/ActionButton';
import Title from '../../components/navigation/Title';
import TitleBar from '../../components/navigation/TitleBar';
import { updateSelf } from '../../actions/ApiActions';

function mapStateToProps(state) {
  const resizeProps = state.forms.getIn(['manage-photos', 'fields', 'resize']);
  const facebookPhotoId = resizeProps.facebookPhotoId;
  const instagramUrl = resizeProps.instagramUrl;
  const deviceUrl = resizeProps.deviceUrl;
  let photoUrl = '';
  if (facebookPhotoId) {
    photoUrl = Facebook.getImageUrl(facebookPhotoId, 'medium');
  } else if (instagramUrl) {
    photoUrl = instagramUrl;
  } else if (deviceUrl) {
    photoUrl = deviceUrl;
  }
  const screenWidth = window.screen.width * window.devicePixelRatio;
  const screenHeight = window.screen.height * window.devicePixelRatio;
  const minWidth = Math.round(10000 / screenWidth);
  const minHeight = Math.round(10000 / screenHeight);
  return {
    photoUrl,
    screenWidth,
    screenHeight,
    blob: resizeProps.blob,
    minWidth,
    minHeight,
    facebookPhotoId: resizeProps.facebookPhotoId || '',
    instagramUrl: resizeProps.instagramUrl || '',
    deviceUrl: resizeProps.deviceUrl || '',
    updateSelfBusy: state.user.get('updateSelfBusy'),
    updateSelfError: state.user.get('updateSelfError'),
  };
}

@connect(mapStateToProps, { toggleLoader, updateValue, showAlert, navigateTo, navigateBack, pushValue, updateSelf })
@bem({ block: 'resize-photo-screen' })
class ResizePhoto extends Component {
  state = {
    scale: 1,
    crop: {
      width: 50,
      x: 20,
      y: 10,
    },
    originImage: {},
  }

  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  };

  static propTypes = {
    minWidth: PropTypes.number,
    minHeight: PropTypes.number,
    photoUrl: PropTypes.string.isRequired,
    facebookPhotoId: PropTypes.string,
    instagramUrl: PropTypes.string,
    deviceUrl: PropTypes.string,
    blob: PropTypes.object,
    updateValue: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired,
    navigateTo: PropTypes.func.isRequired,
    navigateBack: PropTypes.func.isRequired,
    pushValue: PropTypes.func.isRequired,
    updateSelf: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const that = this;
    const img = new Image();
    img.onload = function () {
      that.setState({
        originImage: this,
      });
    };
    img.src = this.props.photoUrl;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.updateSelfBusy != this.props.updateSelfBusy) {
      this.props.toggleLoader(nextProps.updateSelfBusy);
    }
    if (this.props.updateSelfBusy && !nextProps.updateSelfBusy) {
      if (nextProps.updateSelfError) {
        this.props.showAlert({ title: GENERIC_ERROR_TITLE, message: GENERIC_ERROR_MESSAGE });
      } else {
        this.props.navigateTo('manage-photos');
      }
    }
  }

  onCropTap = () => {
    const { crop, originImage } = this.state;
    const cropValue = {
      x: crop.x * originImage.width / 100,
      y: crop.y * originImage.height / 100,
      width: crop.width * originImage.width / 100,
      height: crop.height * originImage.height / 100,
    };
    // alert(JSON.stringify(cropValue));
    const params = {
      crop: cropValue,
    };
    if (this.props.facebookPhotoId) {
      params.facebookPhotoId = this.props.facebookPhotoId;
    } else if (this.props.instagramUrl) {
      params.instagramUrl = this.props.instagramUrl;
    } else if (this.props.deviceUrl) {
      params.deviceUrl = this.props.deviceUrl;
      params.blob = this.props.blob;
    }
    this.props.pushValue('manage-photos', 'photos', params);
    const state = this.context.store.getState();
    const photos = state.forms.getIn(['manage-photos', 'fields', 'photos']);
    const data = { photos: photos.map(photo => _.omit(photo, 'images')) };
    this.props.updateSelf(data);
  }

  onCancelTap = () => {
    this.props.navigateTo('manage-photos');
  }

  onComplete = (crop, pixelCrop) => {
    this.setState({ crop });
  }

  render() {
    return (
      <Screen className={this.block()}>
        <TitleBar className={this.element('title')}>
          <ActionButton left onTap={this.onCancelTap}>Cancel</ActionButton>
          <ActionButton right onTap={this.onCropTap}>Save</ActionButton>
          <Title>Resize photo</Title>
        </TitleBar>
        <ContentTransitionGroup>
          <Choose>
            <When condition={this.props.updateSelfBusy}>
              <span />
            </When>
            <Otherwise>
              <div className={this.element('wrapper')}>
                <center className="center">Press save to upload the photo as it is or if you would like to crop please tap on your photo</center>
                <ReactCrop
                  className={this.element('canvas')}
                  src={this.props.photoUrl}
                  minWidth={80}
                  minHeight={70}
                  maxWidth={100}
                  maxHeight={100}
                  onImageLoaded={this.onImageLoaded}
                  onComplete={this.onComplete}
                  keepSelection
                />
              </div>
            </Otherwise>
          </Choose>
        </ContentTransitionGroup>
      </Screen>
    );
  }
}


export default ResizePhoto;
