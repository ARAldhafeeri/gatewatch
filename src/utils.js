const fs = require('fs');


class AccessControlUtils {
    /**
     * check if strData is JSON]
     * @param {*} strData
     * @throws DATA_MUST_BE_IN_JSON_FORMAT
     */
    isJsonObject(strData){
        try {
            JSON.parse(strData)
        } catch {
            thro
            return false
        }
        return true
    }
}