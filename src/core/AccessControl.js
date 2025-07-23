const AccessControlError = require("./AccessControlError");
const { BitmapPolicy}  = require("./BitmapPolicy");

const {
    DATA_MUST_BE_IN_JSON_FORMAT,
    RESOURCES_MUST_BE_DEFINED,
    ACTIONS_MUST_BE_A_LIST,
    POLICIES_MUST_BE_A_LIST,
    ROLES_MUST_BE_A_LIST,
} = require("./erros");

/**
 * @name AccessControl
 * @description class allow developers to enforce rbac policies client-side and server-side
 */

class AccessControl {
    /**
     * @description  must pass JSON policy 
     * 
     * @example 
     * const grants = {
                "resources": ["post","profile", "comment"],
                "actions": ["delete", "create", "update", "read"],
                "roles": ["user", "admin", "super-admin"],
                "policies": [
                    {
                        "role": "user",
                        "can": ["delete", "create", "update", "read"],
                        "on": ["post", "profile","comment"]
                    },
            
                    {
                        "role": "admin",
                        "can": ["*"], 
                        "on": ["post", "profile","comment"]
                    },
            
                    {
                        "role": "super-admin",
                        "can": ["*"], 
                        "on": ["*"]
                    }
                    
                ]
            }
        * ac = new AccessControl(policy)
    */  
    constructor(policy){
        this.policy = policy;
        this.bitmapPolicy = null;
            // Initialize bitmap policy if not too large
            if (this.policy.resources.length * this.policy.actions.length <= 10000) {
            this.bitmapPolicy = new BitmapPolicy(
                this.policy.resources,
                this.policy.actions,
                this.policy.roles
            );

            this.policy.policies.forEach(p => {
                this.bitmapPolicy.addPolicy(p.role, p.can, p.on);
            });
        }
    }

    /**
     * @description enforce json format, checks for resources, actions, roles, policies 
     */
    enforce(){
        this.isJson(this.policy);

        this.validatePolicy(this.policy);

        return this;

    }
       /**
     * @param {String} data
     * @throws DATA_MUST_BE_IN_JSON_FORMAT
     */
       isJson(data){
        if (!(data instanceof Object)){
 
         throw new AccessControlError(DATA_MUST_BE_IN_JSON_FORMAT, "DATA_MUST_BE_IN_JSON_FORMAT")
         } 
         return true;
     }
 
 
     /**
      * @description validate JSON policy
      * @example
      * const p = {
             "resources": [],
             "actions": [],
             "policies": [],
             "roles": [],
         }
         acUtils.validatePolicy(p) // returns true
      * @example
      const p = {
             "resources": [],
             "actions": [],
             "policies": [],
         }
         acUtils.validatePolicy(p) // throws an error roles missing
      * @param {Obj} data
      * @returns {Obj} data
      */
     validatePolicy(data){
         if(! ( data?.resources instanceof Array ) ){
             
             throw new AccessControlError(RESOURCES_MUST_BE_DEFINED, "RESOURCES_MUST_BE_DEFINED");
         
         } else if (! ( data?.actions instanceof Array ) ) {
             
             throw new AccessControlError(ACTIONS_MUST_BE_A_LIST, "ACTIONS_MUST_BE_A_LIST");
         
         } else if (! ( data?.roles instanceof Array ) ) {
             
             throw new AccessControlError(ROLES_MUST_BE_A_LIST, "ROLES_MUST_BE_A_LIST");
         
         } else if (! ( data?.policies instanceof Array ) ) {
             throw new AccessControlError(POLICIES_MUST_BE_A_LIST, "POLICIES_MUST_BE_A_LIST");
 
         }
         return data;
 
     }
 
     /**
      * @description query predifned policy for authorization
      * @param {Object} query  - builded query based on chaining role, can, on
      * @param {Array} policies     - array of predefined policies to search
      * @returns {Boolean}   - returns true or false based on policies and query
      */
 

}


module.exports = {
    AccessControl
}