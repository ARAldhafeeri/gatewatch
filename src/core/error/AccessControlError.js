
class AccessControlError extends Error {
    /**
     * Error specific to AccessControl.
     * @readonly
     * @name AccessControlError
     * @param {*} message  
     * @param {*} name
     */
    constructor(message, name) {
      super(message); 
      this.name = name
      Error.captureStackTrace(this, this.constructor)
    }
}

module.exports =  AccessControlError;