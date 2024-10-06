const AccessControlError = require("./core/AccessControlError");

const {
    DATA_MUST_BE_IN_JSON_FORMAT,
    RESOURCES_MUST_BE_DEFINED,
    ACTIONS_MUST_BE_A_LIST,
    POLICIES_MUST_BE_A_LIST,
    ROLES_MUST_BE_A_LIST,
} = require("./core/erros");

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
    }

    /**
     * @description enforce json format, checks for resources, actions, roles, policies 
     */
    enforce(){
        this.isJson(this.policy);

        this.validatePolicy(this.policy);

        return this.policy;
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
    
            const grant = this.search(this.query, this.policy.policies);
            
            return grant;    
        }
    
        or(or){
            this.query.or = or
            return this;
    
        }

        and(and){
            this.query.and = and
            return this;
        }

        search(query, policies) {
            // Check for 'or' condition and grant access if true
            if (query.or !== undefined) {
                if (!this.validateBoolean(query.or)) return false;
                if (query.or) return true;
            }
    
            // Validate the query structure
            if (!this.isValidQuery(query)) return false;
    
            // Get policies for the given role
            const queryRoles = policies.filter(policy => query.role === policy.role);
            console.log("Query roles:", queryRoles);
    
            // No policies found for the role, return false
            if (queryRoles.length === 0) return false;
    
            // Check access across all policies
            const hasAccess = queryRoles.some(policy => this.checkAccess(query, policy));
            
            // Handle 'and' condition
            if (query.and !== undefined) {
                if (!this.validateBoolean(query.and)) return false;
                return hasAccess && query.and;
            }
    
            return hasAccess;
        }

        checkAccess(query, policy) {
            const operationsGrant = this.checkOperations(query.can, policy.can);
            const resourcesGrant = this.checkResources(query.on, policy.on);
    
            return operationsGrant && resourcesGrant;
        }
    
        // Check if the operations requested are granted
        checkOperations(requestedOperations, policyOperations) {
            if (policyOperations.includes("*")) return true; // Auto grant if "*" is present
            return requestedOperations.every(op => policyOperations.includes(op));
        }
    
        // Check if the resources requested are granted
        checkResources(requestedResources, policyResources) {
            if (policyResources.includes("*")) return true; // Auto grant if "*" is present
            return requestedResources.every(res => policyResources.includes(res));
        }

        isValidQuery(query) {
            return [
                this.validateRole(query?.role),
                this.validateOperations(query?.can),
                this.validateResources(query?.on)
            ].every(this.allGrantsTrue);
        }

       /**
         * @description used in arr.every
         * @param {Object} grant  - check every resources, every operation on given role
         * @returns {Boolean}   - returns true if grant is true.
        */
        allGrantsTrue(grant){
            return grant === true;
        }
    
        /**
         * @description validate role
         * @param {String} roleName  - given role name in role-based access control
         * @returns {Boolean}   - returns true if role name is not empty string and instance of string
        */
        validateRole(roleName){
            return ( (roleName !== "") && (typeof roleName === "string"));
        }

    
        /**
         * @description validate on
         * @param {Array} resources  - array of resourc linked to a role
         * @returns {Boolean}   - returns true if resources is array and length of the resources is greater than 0
        */
        validateResources(resources){
            return (resources?.length > 0);
        }
    
    
        /**
         * @description validate on
         * @param {Array} operations  - array of operations linked to a role
         * @returns {Boolean}   - returns true if operations is array and length of the operations is greater than 0
        */
        validateOperations(operations){
            
            return (operations?.length > 0)
        }
    
        /**
         * @description validate and, or condition
         * @param {Array} condition  - output of a condition true or false
         * @returns {Boolean}   - returns true if condition is boolean, otherwise false.
        */
        validateBoolean(condition){
            return typeof condition === 'boolean';
        }

}


module.exports = {
    AccessControl, 
    GrantQuery
}