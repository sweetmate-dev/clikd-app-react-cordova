import Immutable from 'immutable';

import {
  GET_FACEBOOK_ALBUMS_REQUEST,
  GET_FACEBOOK_ALBUMS_SUCCESS,
  GET_FACEBOOK_ALBUMS_FAILED,
  GET_FACEBOOK_PHOTOS_REQUEST,
  GET_FACEBOOK_PHOTOS_SUCCESS,
  GET_FACEBOOK_PHOTOS_FAILED,
  GET_INSTAGRAM_PHOTOS_SUCCESS,
  GET_INSTAGRAM_PHOTOS_REQUEST,
  GET_INSTAGRAM_PHOTOS_FAILED,
  INSTAGRAM_CONNECT_REQUEST,
  INSTAGRAM_CONNECT_SUCCESS,
  INSTAGRAM_CONNECT_FAILED,
  INSTAGRAM_DISCONNECT_REQUEST,
  INSTAGRAM_DISCONNECT_SUCCESS,
  INSTAGRAM_DISCONNECT_FAILED,
} from '^/actions/PhotosActions';
import { LOGOUT_SUCCESS } from '^/actions/UserActions';

const initialState = Immutable.fromJS({
  getInstagramPhotosBusy: false,
  getInstagramPhotosError: null,
  instagramPhotoIds: [],
  instagramPhotos: {},
  instagramNextPage: null,
  getFacebookAlbumsBusy: false,
  getFacebookAlbumsError: null,
  facebookAlbumIds: [],
  facebookAlbums: {},
  facebookPhotos: {},
  facebookAlbumsNextPage: null,
  connectInstagramBusy: false,
  connectInstagramError: null,
  disconnectInstagramBusy: false,
  disconnectInstagramError: null,
});

export default function photosReducers(state = initialState, action) {
  switch (action.type) {

    case LOGOUT_SUCCESS: {
      return initialState;
    }

    case INSTAGRAM_CONNECT_REQUEST: {
      return state.merge({
        connectInstagramBusy: true,
        connectInstagramError: null,
      });
    }

    case INSTAGRAM_CONNECT_SUCCESS: {
      return state.set('connectInstagramBusy', false);
    }

    case INSTAGRAM_CONNECT_FAILED: {
      return state.merge({
        connectInstagramBusy: false,
        connectInstagramError: action.error,
      });
    }

    case INSTAGRAM_DISCONNECT_REQUEST: {
      return state.merge({
        disconnectInstagramBusy: true,
        disconnectInstagramError: null,
      });
    }

    case INSTAGRAM_DISCONNECT_SUCCESS: {
      return state.set('disconnectInstagramBusy', false);
    }

    case INSTAGRAM_DISCONNECT_FAILED: {
      return state.merge({
        disconnectInstagramBusy: false,
        disconnectInstagramError: action.error,
      });
    }

    case GET_INSTAGRAM_PHOTOS_REQUEST: {
      return state.merge({
        getInstagramPhotosBusy: true,
        getInstagramPhotosError: null,
      });
    }

    case GET_INSTAGRAM_PHOTOS_FAILED: {
      return state.merge({
        getInstagramPhotosBusy: false,
        getInstagramPhotosError: action.error,
      });
    }

    case GET_INSTAGRAM_PHOTOS_SUCCESS: {
      let output = state;
      let instagramPhotoIds = state.get('instagramPhotoIds');
      action.photos.forEach((photo) => {
        const id = photo.id;
        if (!instagramPhotoIds.includes(id)) {
          instagramPhotoIds = instagramPhotoIds.push(id);
        }
        output = output.mergeIn(['instagramPhotos', id], photo);
      });
      return output.merge({
        instagramPhotoIds,
        instagramNextPage: action.nextPage,
        getInstagramPhotosBusy: false,
      });
    }

    case GET_FACEBOOK_ALBUMS_REQUEST: {
      return state.merge({
        getFacebookAlbumsBusy: true,
        getFacebookAlbumsError: false,
      });
    }

    case GET_FACEBOOK_ALBUMS_FAILED: {
      return state.merge({
        getFacebookAlbumsBusy: false,
        getFacebookAlbumsError: action.error,
      });
    }

    case GET_FACEBOOK_ALBUMS_SUCCESS: {
      let output = state;
      let facebookAlbumIds = state.get('facebookAlbumIds');
      action.albums.forEach((album) => {
        const id = album.id;
        if (!facebookAlbumIds.includes(id)) {
          facebookAlbumIds = facebookAlbumIds.push(id);
        }
        output = output.mergeIn(['facebookAlbums', id], album);
      });
      return output.merge({
        facebookAlbumIds,
        facebookAlbumsNextPage: action.nextPage,
        getFacebookAlbumsBusy: false,
      });
    }

    case GET_FACEBOOK_PHOTOS_REQUEST: {
      return state.mergeIn(['facebookAlbums', action.id], {
        getPhotosBusy: true,
        getPhotosError: false,
      });
    }

    case GET_FACEBOOK_PHOTOS_FAILED: {
      return state.mergeIn(['facebookAlbums', action.id], {
        getPhotosBusy: false,
        getPhotosError: action.error,
      });
    }

    case GET_FACEBOOK_PHOTOS_SUCCESS: {
      const albumId = action.id;
      let output = state;
      let photoIds = state.getIn(['facebookAlbums', albumId, 'facebookPhotos'], new Immutable.List());
      action.photos.forEach((photo) => {
        const photoId = photo.id;
        if (!photoIds.includes(photoId)) {
          photoIds = photoIds.push(photoId);
        }
        output = output.mergeIn(['facebookPhotos', photoId], photo);
      });
      return output.mergeIn(['facebookAlbums', albumId], {
        facebookPhotos: photoIds,
        getPhotosBusy: false,
        nextPage: action.nextPage,
      });
    }

    default:
      return state;
  }
}
