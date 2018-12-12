import Promise from 'bluebird';
import request from 'superagent';
import _ from 'lodash';
import jsonp from '^/utils/jsonp';

let store;

Promise.config({cancellation: true});

const defaultOptions = {
  method: 'get',
};

const requests = [];
const promises = {};

export function createRequest() {
  const id = _.uniqueId();
  requests.push(id);
  return id;
}

export function isRequestActive(id) {
  return requests.indexOf(id) !== -1;
}

export function clearRequest(id) {
  const index = requests.indexOf(id);
  if (index !== -1) requests.splice(index, 1);
  const promise = promises[id];
  if (promise && promise.cancel) promise.cancel();
  delete promises[id];
}

export function setRequestPromise(id, promise) {
  promises[id] = promise;
}

export function getRequestPromise(id) {
  return promises[id];
}


export default {

  init(storeObj) {
    store = storeObj;
  },

  /**
   * A wrapper for XMLHttpRequest that returns a cancellable promise.
   * When the promise is cancelled, the request will also be aborted.
   * @param  {String} url
   * @param  {Object} options
   * @return {Promise}
   */
  request(url, options = defaultOptions) {
    return new Promise((resolve, reject, onCancel) => {
      _.defaults(options, defaultOptions);

      let files = [];
      if (options.body && options.body.fields && options.body.fields.photos) {
       let {body: {fields: {photos: photos}}} = options;
        photos.map((photo, index) => {
          if (photo.blob) {
            files.push({
              key: 'fields[photos][' + index + '][file]',
              value: photo.blob,
            });
          }
        });

        // remove blob from main array in body
        options.body
               .fields
               .photos = photos.map(photo => _.omit(photo, 'blob'));
      }

      const method = files.length ? 'post' : options.method;
      const req = request[method](url);

      if (options.auth) {
        const user = store.getState().user;
        req.set('Accesstoken', user.getIn(['auth', 'accessToken']));
        req.set('Userid', user.getIn(['auth', 'userID']));
      }

      if (options.jsonp) req.use(jsonp);
      req.query(options.query);

      if (files.length) {
        files.forEach(function(file) {
          req.attach(file.key, file.value)
        });

        if (options.body) {
          req.field('body', JSON.stringify(options.body));
        }
      } else {
        req.send(options.body);
        req.set('Content-Type', 'application/json');
      }

      req.end((errorObj, response) => {
        let errorMessage = null;
        const errors = _.get(response, 'body.errors');
        if (errors && _.isArray(errors) && errors.length) {
          const error = errors[0];
          if (_.isString(error)) errorMessage = error;
          else if (_.isObject(error)) errorMessage = error.errorCode;
          else errorMessage = true;
        }
        if (errorMessage) {
          reject(new Error(errorMessage));
        } else if (errorObj) {
          reject(errorObj);
        } else if (response.statusCode && response.statusCode !== 200) {
          reject(new Error(`Server responded with ${response.status} code`));
        } else {
          resolve(response.body);
        }
      });
      onCancel(() => {
        req.abort();
      });
    });
  },

}
