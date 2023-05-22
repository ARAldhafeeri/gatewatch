const AccessControlUtils = require("./utils");
const AccessControlError = require("./core/AccessControlError");

/**
 * @name AccessControl
 * @description class allow developers to enforce rbac policies client-side and server-side
 */

const acUtils = new AccessControlUtils();

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
    }

    /**
     * @description enforce json format, checks for resources, actions, roles, policies 
     */
    enforce(){
        acUtils.isJson(this.policy);

        acUtils.validatePolicy(this.policy);

        return this.policy;
    }

}

class GrantQuery{
    /**
     * 
     * @param {*} policy 
     * @description perform query on a policy
     */
    constructor(policy){
     this.policy = policy
     this.query = {};
    }

        /**
     * 
     * @description     pass role name to query
     * if .grant() called after role() return this.granted
     * @param {String}  roleName    - role name
     */
        role(roleName){

            this.query.role = roleName;
    
            return this;
        }
    
        /**
         * 
         * @description     pass action names to query
         * @param {Array}  actionsNames    - array of actions 
         * @example actionNames = ['read','update']
         */
        can(actionsNames){
    
            this.query.can = actionsNames;
            
            return this;
        }
    
        /**
         * 
         * @description     pass resources names to query
         * @param {Array}  resourcesNames    - array of actions 
         * @example resourcesNames = ['post','comment']
         */
        on(resourcesNames){
            this.query.on = resourcesNames;
            return this;
        }
    
        grant(){
    
            const grant = acUtils.search(this.query, this.policy.policies);
            
            return grant;    
        }
    
        grantAutoIf(grantAutoIf){
            this.query.grantAutoIf = grantAutoIf
            return this;
    
        }

}


module.exports = {
    AccessControl, 
    GrantQuery
}