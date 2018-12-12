import Promise from 'bluebird';

import { subscribe } from '^/services/Subscriptions';
import { setUserLocation, setUserLocationFailed } from '^/actions/UserActions';
import Api from '^/services/Api';

const LOCATION_POLL_INTERVAL = 10 * 60 * 1000; // 10 Minutes

let store;
let aborted;
let timeout;

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Promisified version of navigator.geolocation.getCurrentPosition
 * @return {Promise}
 */
export function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      resolve(position);
    }, (error) => {
      let message = error && error.message ? error.message : 'location_error';
      reject(new Error(message));
    });
  });
}

/**
 * Returns the distance between two points on the earths surface in km.
 * @see  http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
 * @param  {Number} lat1
 * @param  {Number} lon1
 * @param  {Number} lat2
 * @param  {Number} lon2
 * @return {Number}
 */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function updateUtcOffset() {
  navigator.globalization.getDatePattern(
    function (result) {
      const hours = (result.utc_offset / 60) / 60;
      return Api.updateSelf({
        utcOffset: hours,
      });
    }
  );
}

function stopPolling() {
  aborted = true;
  clearTimeout(timeout);
}

function pollLocation() {
  aborted = false;
  getPosition().then((position) => {
    if (aborted) return null;
    const state = store.getState();
    const profile = state.user.get('profile');
    const distance = getDistance(
      profile.get('locationLat'),
      profile.get('locationLong'),
      position.coords.latitude,
      position.coords.longitude
    );
    updateUtcOffset();
    if (distance > profile.get('distanceRange')) {
      /* User has moved out of range, so update their position on the server */
      return Api.updateSelf({
        locationLat: position.coords.latitude,
        locationLong: position.coords.longitude,
      });
    }
    return null;
  })
  .then((response) => {
    if (aborted) return;
    if (response) {
      const action = setUserLocation(response.profile.locationLat, response.profile.locationLong)
      store.dispatch(action);
    }
  })
  .catch((error) => {
    if (aborted) return;
    const action = setUserLocationFailed(error);
    store.dispatch(action);
  })
  .finally(() => {
    timeout = setTimeout(pollLocation, LOCATION_POLL_INTERVAL);
  });
}

  
export default {

  init(storeObj) {
    store = storeObj;
    /* Subscribe to changes in the application state and begin polling the users location
    on login */
    subscribe('user', ['isLoggedIn'], (oldValue, newValue, state) => {
      if (!oldValue && newValue) {
        pollLocation();
      } else if (!newValue) {
        stopPolling();
      }
    });
  },
  
}