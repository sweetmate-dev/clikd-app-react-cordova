import Facebook from '^/services/Facebook';
import InstagramService from '^/services/InstagramService';
import Api from '^/services/Api'

export const GET_FACEBOOK_ALBUMS_REQUEST = 'PHOTOS.GET_FACEBOOK_ALBUMS_REQUEST';
export const GET_FACEBOOK_ALBUMS_SUCCESS = 'PHOTOS.GET_FACEBOOK_ALBUMS_SUCCESS';
export const GET_FACEBOOK_ALBUMS_FAILED = 'PHOTOS.GET_FACEBOOK_ALBUMS_FAILED';

export const GET_FACEBOOK_PHOTOS_REQUEST = 'PHOTOS.GET_FACEBOOK_PHOTOS.GET_FACEBOOK_REQUEST';
export const GET_FACEBOOK_PHOTOS_SUCCESS = 'PHOTOS.GET_FACEBOOK_PHOTOS.GET_FACEBOOK_SUCCESS';
export const GET_FACEBOOK_PHOTOS_FAILED = 'PHOTOS.GET_FACEBOOK_PHOTOS.GET_FACEBOOK_FAILED';

export const GET_INSTAGRAM_PHOTOS_REQUEST = 'PHOTOS.GET_INSTAGRAM_PHOTOS_REQUEST';
export const GET_INSTAGRAM_PHOTOS_SUCCESS = 'PHOTOS.GET_INSTAGRAM_PHOTOS_SUCCESS';
export const GET_INSTAGRAM_PHOTOS_FAILED = 'PHOTOS.GET_INSTAGRAM_PHOTOS_FAILED';

export const INSTAGRAM_CONNECT_REQUEST = 'PHOTOS.INSTAGRAM_CONNECT_REQUEST';
export const INSTAGRAM_CONNECT_SUCCESS = 'PHOTOS.INSTAGRAM_CONNECT_SUCCESS';
export const INSTAGRAM_CONNECT_FAILED = 'PHOTOS.INSTAGRAM_CONNECT_FAILED';

export const INSTAGRAM_DISCONNECT_REQUEST = 'PHOTOS.INSTAGRAM_DISCONNECT_REQUEST';
export const INSTAGRAM_DISCONNECT_SUCCESS = 'PHOTOS.INSTAGRAM_DISCONNECT_SUCCESS';
export const INSTAGRAM_DISCONNECT_FAILED = 'PHOTOS.INSTAGRAM_DISCONNECT_FAILED';

export function getFacebookAlbums(pageUrl = 'me/albums?fields=count,name') {
  return (dispatch) => {
    dispatch({ type: GET_FACEBOOK_ALBUMS_REQUEST });
    return Facebook.api(pageUrl).then((response) => {
      const nextPage = response.paging ? response.paging.next : null;
      dispatch({ type: GET_FACEBOOK_ALBUMS_SUCCESS, albums: response.data, nextPage: nextPage });
    }).catch((error) => {
      dispatch({ type: GET_FACEBOOK_ALBUMS_FAILED, error: error.message || true });
    });
  };
}

export function getFacebookPhotos(albumId, pageUrl) {
  const path = pageUrl || `${albumId}/photos?limit=60`;
  return (dispatch) => {
    dispatch({ type: GET_FACEBOOK_PHOTOS_REQUEST, id: albumId });
    return Facebook.api(path).then((response) => {
      const nextPage = response.paging ? response.paging.next : null;
      dispatch({
        type: GET_FACEBOOK_PHOTOS_SUCCESS,
        id: albumId,
        photos: response.data,
        nextPage: nextPage,
      });
    }).catch((error) => {
      dispatch({ type: GET_FACEBOOK_PHOTOS_FAILED, id: albumId, error: error.message || true });
    });
  };
}

export function connectInstagramAccount() {
  return (dispatch) => {
    dispatch({ type: INSTAGRAM_CONNECT_REQUEST });
    InstagramService.authorize()
      .then(() => {
        dispatch({ type: INSTAGRAM_CONNECT_SUCCESS });
      })
      .catch((error) => {
        dispatch({ type: INSTAGRAM_CONNECT_FAILED, error: error.message || true });
      });
  };
}

export function disconnectInstagramAccount() {
  return (dispatch) => {
    dispatch({ type: INSTAGRAM_DISCONNECT_REQUEST });
    Api.updateSelf({ instagramToken: null })
      .then(() => {
        dispatch({ type: INSTAGRAM_DISCONNECT_SUCCESS });
      })
      .catch((error) => {
        dispatch({ type: INSTAGRAM_DISCONNECT_FAILED, error: error.message || true });
      });
  }
}


export function getInstagramPhotos(url) {
  return (dispatch) => {
    dispatch({ type: GET_INSTAGRAM_PHOTOS_REQUEST });
    InstagramService.getMedia(url).then((response) => {
      const photos = response.data.map(item => ({
        id: item.id,
        images: item.images,
      }));
      dispatch({
        photos,
        type: GET_INSTAGRAM_PHOTOS_SUCCESS,
        nextPage: response.pagination.next_url,
      });
    }).catch((error) => {
      dispatch({ type: GET_INSTAGRAM_PHOTOS_FAILED, error: error.message || true });
    });
  };
}
