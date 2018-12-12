import React, {Component, PropTypes} from 'react';
import bem from 'react-bem-classes';
import {connect} from 'react-redux';

import AnalyticsService from '^/services/AnalyticsService';
import { showAlert, toggleLoader } from '^/actions/AppActions';
import { initForm, destroyForm, updateValue, pushValue } from '^/actions/FormActions';
import { NAVIGATION_BACKWARDS, navigateTo } from '^/actions/NavigationActions';
import { Screen, Content } from '^/components/layout';
import ActionsheetService from '^/services/ActionsheetService';

import './ManagePhotos.scss';
import ManagePhotosTitleBar from './components/ManagePhotosTitleBar';
import ManagePhotosGrid from './components/ManagePhotosGrid';

function mapStateToProps(state) {
  return {
    photos: state.forms.getIn(['manage-photos', 'fields', 'photos']) || [],
  };
}

@connect(mapStateToProps, {initForm, destroyForm, updateValue, showAlert, navigateTo, pushValue, toggleLoader})
@bem({block: 'manage-photos-screen'})
class ManagePhotos extends Component {

  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  };

  static propTypes = {
    photos: PropTypes.array.isRequired,
    destroyForm: PropTypes.func.isRequired,
    initForm: PropTypes.func.isRequired,
    updateValue: PropTypes.func.isRequired,
    pushValue: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired,
    navigateTo: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const state = this.context.store.getState();
    if (state.navigation.get('direction') !== NAVIGATION_BACKWARDS) {
      const photos = state.user.getIn(['profile', 'photos']).toJS();
      this.props.initForm('manage-photos', { photos });
    }
  }

  componentWillUnmount() {
    const state = this.context.store.getState();
    if (state.navigation.get('direction') === NAVIGATION_BACKWARDS) {
      this.props.destroyForm('manage-photos');
    }
  }

  componentDidMount() {
    AnalyticsService.logPageView('Manage photos');
  }

  onChange = (oldIndex, newIndex) => {
    const value = [].concat(this.props.photos);
    if (newIndex < value.length) {
      value.splice(newIndex, 0, value.splice(oldIndex, 1)[0]);
      this.props.updateValue('manage-photos', 'photos', value);
    }
  };

  onDelete = (index) => {
    this.props.showAlert({
      title: 'Confirm',
      message: 'Are you sure you want to delete this photo?',
      buttons: [{
        label: 'Yes',
        callback: () => {
          const photos = [].concat(this.props.photos);
          photos.splice(index, 1);
          this.props.updateValue('manage-photos', 'photos', photos);
        },
      }, {
        label: 'No',
        color: 'transparent',
      }],
    });
  };

  onAddTap = () => {
    const options = {
      buttonLabels: ['Add from Facebook', 'Add from Instagram', 'Add from Device'],
      addCancelButtonWithLabel: 'Cancel',
    };
    ActionsheetService.show(options, (buttonIndex) => {
      let path;
      if (buttonIndex === 1) {
        path = 'facebook';
        this.props.navigateTo(`manage-photos/${path}`);
      }
      else if (buttonIndex === 2) {
        path = 'instagram';
        this.props.navigateTo(`manage-photos/${path}`);
      }
      else if (buttonIndex === 3) {
        navigator.camera.getPicture((deviceUri) => {
          // https://stackoverflow.com/questions/20638932/unable-to-load-image-when-selected-from-the-gallery-on-android-4-4-kitkat-usin
          if (deviceUri.match(/^content:\/\/com\.android/g)) {
            let photoSplit = deviceUri.split("%3A");
            deviceUri = 'content://media/external/images/media/' + photoSplit[1];
          }

          const me = this;
          window.resolveLocalFileSystemURL(deviceUri, (fileEntry) => {
            me.props.toggleLoader(true);
            fileEntry.file(function (file) {
              let reader = new FileReader();

              // after read
              reader.onloadend = function() {
                let imgBlob = new Blob([ this.result ], { type: 'image/jpeg' });
                me.props.updateValue('manage-photos', 'resize', {
                  deviceUrl: fileEntry.nativeURL,
                  blob: imgBlob,
                });
                me.props.toggleLoader(false);
                me.props.navigateTo('manage-photos/resize');
              };

              // read new file
              reader.readAsArrayBuffer(file);

            }, (err) => {
              me.props.toggleLoader(false);
              console.log("read err", err);
            });

          }, (err) => {
            me.props.toggleLoader(false);
            console.log("resolveLocalFileSystemURL", err);
          });
        }, (err) => {
          console.log("navigator", err);
        }, {
          quality: 50,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          destinationType: Camera.DestinationType.FILE_URI,
          encodingType: Camera.EncodingType.JPEG,
          mediaType: Camera.MediaType.PICTURE
        });
      }
    });
  };

  render() {
    return (
      <Screen className={this.block()}>
        <ManagePhotosTitleBar formName="manage-photos"/>
        <Content className={this.element('content')}>
          <p>Drag and drop photos to rearrange the order.</p>
          <ManagePhotosGrid
            photos={this.props.photos}
            onChange={this.onChange}
            onDelete={this.onDelete}
            onAddTap={this.onAddTap}
          />
        </Content>
      </Screen>
    );
  };
}
;

export default ManagePhotos;
