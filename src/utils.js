const fs = require('fs');

const AccessControlError = require("./core/AccessControlError");

const {DATA_MUST_BE_IN_JSON_FORMAT} = require("./core/erros");

/**
 * @description check if strData is JSON
 * @name AccessControlError
 */

class AccessControlUtils {
    isJson(data){
        /**
         * @param {String} strData
         * @throws DATA_MUST_BE_IN_JSON_FORMAT
         */
       if (!data instanceof Object){

        throw new AccessControlError(DATA_MUST_BE_IN_JSON_FORMAT, "DATA_MUST_BE_IN_JSON_FORMAT")
        } 
    }

    jsonToObj(filePath){
        /**
         * fetch policy from rbac_policy.json
         * @param {*} filePath - ralitve path of rbac_policy.json
         */
    }
}


module.exports = AccessControlUtils;