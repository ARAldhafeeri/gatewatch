const AccessControlError = require("./core/AccessControlError");

const {
    DATA_MUST_BE_IN_JSON_FORMAT,
    RESOURCES_MUST_BE_DEFINED,
    ACTIONS_MUST_BE_A_LIST,
    POLICIES_MUST_BE_A_LIST,
    ROLES_MUST_BE_A_LIST
} = require("./core/erros");

/**
 * @description check if strData is JSON
 * @name AccessControlUtils
 */
class AccessControlUtils {
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
    search(query, policies){
        // incorrect query : role, can, on must be defined
        const allTruthy = [

                this.validateRole(query?.role), 

                this.validateOperations(query?.can), 

                this.validateResources(query?.on)

            ].every(this.allGrantsTrue);

        if(!allTruthy){
            return false;
        }
        
        let grant= [];
        
        // get policy for the given role
        const [queryRole] = policies.filter(policy => query.role === policy.role);

        // no role found return false
        if(!queryRole) return false;

        /**
         * check if found query role:
         * 1. has all the query operations in the policy operations 
         *  1.1: if operation is a string other than "*" search normally
         *  1.2: if operation is "*" then check if found policy have "*" in can
         * 2. has all the query resources in the policy resources
         */

        query.on.forEach(resource => 

            grant.push(queryRole.on.includes(resource))

        );
        

        if(query.can.includes("*")){

            grant.push(queryRole.can.includes("*"))

        } else {
            query.can.forEach(operation => 

                grant.push( queryRole.can.includes(operation) )

            );

        }
        

        return grant.every(this.allGrantsTrue)
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
        return ( (roleName !== "") && (typeof roleName === "string"))
    }

    /**
     * @description validate on
     * @param {Array} resources  - array of resourc linked to a role
     * @returns {Boolean}   - returns true if resources is array and length of the resources is greater than 0
    */
    validateResources(resources){
        return ( (resources?.length > 0) && (resources instanceof Array))
    }


    /**
     * @description validate on
     * @param {Array} operations  - array of operations linked to a role
     * @returns {Boolean}   - returns true if operations is array and length of the operations is greater than 0
    */
    validateOperations(operations){
        return ( (operations?.length > 0) && (operations instanceof Array))
    }
    




}


module.exports = AccessControlUtils;