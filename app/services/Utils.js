import _ from 'lodash';
import { GENDER, LOOKING_FOR, ORIENTATION } from '^/constants/Settings';

export function getGender(genderId) {
  const gender = _.find(GENDER, ['value', genderId]);
  return gender ? gender.label : null;
}

export function getOrientation(orientationId) {
  const orientation = _.find(ORIENTATION, ['value', orientationId]);
  return orientation ? orientation.label : null;
}

export function getPurposes(purposes) {
  const matched = purposes.map((purposeId) => {
    const purpose = _.find(LOOKING_FOR, ['value', purposeId]);
    return purpose ? purpose.label : null;
  });
  return matched.join(', ');
}


/**
 * Converts a dateString in format DD/MM/YYYT HH:MM:SS to a javascript date
 * object.
 * @param  {String} dateString
 * @return {Date}
 */
export function stringToDate(dateString) {
  if (!dateString) return null;
  const args = dateString.split(/[- :]/);
  args[1] -= 1; // Offset month by one.
  return new Date(...args);
}

/**
 * Parses a simple template, replacing keys surrounded by curly braces with
 * their respective values in the passed data object.
 *
 * ie. ("Hello {name}", {name: "John"}) => "Hello John";
 *
 * @param  {String} template
 * @param  {Object} data
 * @return {String}
 */
export function parseTemplate(template = '', data = {}) {
  return template.replace(/{([^{}]+)}/g, (match, key) => {
    const val = data[key];
    if (val === 0) return val;
    else return val || '';
  });
}

/**
 * Given an array, returns the value that is closest to n
 * @param  {Array} array
 * @param  {*} value
 * @return {*}
 */
export function getClosest(array, n) {
  const clone = [].concat(array);
  clone.sort((a, b) => Math.abs(n - a) - Math.abs(n - b));
  return clone[0];
}

/**
 * Given an array, returns the index of the value that is closest to n
 * @param  {Array} array
 * @param  {*} value
 * @return {Number}
 */
export function getClosestIndex(array, n) {
  const closest = getClosest(array, n);
  return array.indexOf(closest);
}


/**
 * Get the number of whole days between two date objects
 * @param  {Date} fromDate 
 * @param  {Date}   toDate   
 * @return {Number}          
 */
export function getDateDifference(fromDate, toDate = new Date()) {
  const diff = fromDate.getTime() - toDate.getTime();
  return Math.ceil(diff / 86400000);
}


/**
 * Merge an array of objects into a single object
 * @param  {Array} object
 * @return {Object}
 */
export function merge(objects) {
  const out = {};
  for (let i = 0; i < objects.length; i++) {
    for (const p in objects[i]) {
      out[p] = objects[i][p];
    }
  }
  return out;
}

/**
 * Recuresively flatten a json object into string paths
 * @param  {Object} obj
 * @return {Object}
 */
export function flattenJSON(obj, name, stem) {
  let out = {};
  const newStem = (typeof stem !== 'undefined' && stem !== '') ? `${stem}[${name}]` : name;
  if (typeof obj !== 'object') {
    out[newStem] = obj;
    return out;
  }
  for (const p in obj) {
    const prop = flattenJSON(obj[p], p, newStem);
    out = merge([out, prop]);
  }
  return out;
};
