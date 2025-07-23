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
  
        // Try bitmap first if available
        if (this.policy.bitmapPolicy) {
          const bitmapGrant = this.bitmapSearch();
          if (bitmapGrant !== null) return bitmapGrant;
        }

        // Fallback to original search
        return this.originalSearch();
      }
  
      or(or){
          this.query.or = or
          return this;
  
      }

      and(and){
          this.query.and = and
          return this;
      }

      bitmapSearch() {
        if (!this.isValidQuery(this.query)) return false;
        
        // Check 'or' condition first
        if (this.query.or !== undefined) {
            if (!this.validateBoolean(this.query.or)) return false;
            if (this.query.or) return true;
        }

        const hasAccess = this.policy.bitmapPolicy.checkAccess(
            this.query.role,
            this.query.can,
            this.query.on
        );

        // Handle 'and' condition
        if (this.query.and !== undefined) {
            if (!this.validateBoolean(this.query.and)) return false;
            return hasAccess && this.query.and;
        }

        return hasAccess;
    }

    originalSearch() {
        const grant = this.search(this.query, this.policy.policies);
        return grant;    
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
  GrantQuery
}