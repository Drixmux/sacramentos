import * as $ from 'jquery';

export class ValidateUtil {
  static nonEmpty (value) {
    return value && value !== '' && $.trim(value) !== '';
  }

  static numberFloat (value) {
    const regex = /^(\d+(\.\d+)?)$/;
    return regex.test(value);
  }

  static yesOrNo (value) {
    return value && (value === 'Y' || value === 'N');
  }

  static isInteger (value) {
    const regex = /^[0-9]*$/;
    return regex.test(value);
  }

  static email (value) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(value);
  }

  static hasProperty (object, key) {
    return !!object && object.hasOwnProperty(key);
  }
}
