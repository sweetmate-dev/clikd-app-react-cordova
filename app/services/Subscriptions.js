import { uniqueId, forIn } from 'lodash';
import { Iterable } from 'immutable';

const subscriptions = {};
let store;

function getValue(state, key, path){
  if(!path){
    return state[key];
  } else {
    return state[key].getIn(path);
  }
}

export function subscribe(key, path, cb){

  if(!store) throw new Error('Cannot subscribe before store has been initialized');

  var id = uniqueId();
  var currentState = store.getState();
  if(!currentState.hasOwnProperty(key)){
    return console.error(`Key ${key} not found in store`);
  }
  subscriptions[id] = {
    key: key,
    path: path,
    value: getValue(currentState, key, path),
    cb: cb
  }

  return id;

}

export function unsubscribe(id){
  delete subscriptions[id];
}

/**
 * Simple Redux middleware that listens for changes in specific
 * paths in the store, and fires a callback when those values have
 * changed.
 */
export default (storeInst) => {
  store = storeInst;
  return next => action => {
    
    const result = next(action)
    const state = store.getState();

    forIn(subscriptions, (subscription, id) => {
      const currentValue = getValue(state, subscription.key, subscription.path);
      const oldValue = subscription.value;
      let changed = false;
      /* For immutable objects, use the built in equality checker */
      if(Iterable.isIterable(currentValue) && !oldValue.equals(currentValue)){
        changed = true;
      }
      /* Or for plain objects, just do a standard check */
      else if(oldValue != currentValue){
        changed = true;
      }
      subscription.value = currentValue;
      if(changed){
        subscription.cb(oldValue, currentValue, state);
      }
    });

    return result
  }
}