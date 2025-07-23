/**
 * @description Error specific to AccessControl.
 * @name AccessControlError
 */
class AccessControlError extends Error {
    /**
      * @param {String} message - error message
      * @param {String} name    - error name
      */
    constructor(message, name) {
      super(message); 
      this.name = name
      Error.captureStackTrace(this, this.constructor)
    }
}

module.exports =  AccessControlError;