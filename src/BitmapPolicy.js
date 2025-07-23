class BitSet {
  constructor(size) {
      this.data = new Uint32Array(Math.ceil(size / 32));
      this.size = size;
  }

  set(index, value) {
      const arrayIndex = Math.floor(index / 32);
      const bitPosition = index % 32;
      if (value) {
          this.data[arrayIndex] |= (1 << bitPosition);
      } else {
          this.data[arrayIndex] &= ~(1 << bitPosition);
      }
  }

  get(index) {
      const arrayIndex = Math.floor(index / 32);
      const bitPosition = index % 32;
      return (this.data[arrayIndex] & (1 << bitPosition)) !== 0;
  }
}

class BitmapPolicy {
    /**
     * intialize the bitmap policy 
     * @param {} resources - resources identifier array  
     * @param {*} actions  - actions identifier array  
     * @param {*} roles  - roles identifier array  
     */
    constructor(resources, actions, roles) {
        this.resourceIndex = new Map(resources.map((r, i) => [r, i]));
        this.actionIndex = new Map(actions.map((a, i) => [a, i]));
        this.roleIndex = new Map(roles.map((r, i) => [r, i]));
        this.size = resources.length * actions.length;
        this.policies = new Map();
    }

    /**
     * creates bitmap set with the configured size which is 32 bit by default for the policy
     * for later faster checks 
     * @param {*} role 
     * @param {*} actions 
     * @param {*} resources 
     * @returns boolean , true of the added policy
     */
    addPolicy(role, actions, resources) {
        const roleId = this.roleIndex.get(role);
        if (roleId === undefined) return false;

        const bitmap = new BitSet(this.size);
        
        const isAllActions = actions.includes('*');
        const isAllResources = resources.includes('*');

        for (const [resource, resIdx] of this.resourceIndex) {
            if (!isAllResources && !resources.includes(resource)) continue;
            
            for (const [action, actIdx] of this.actionIndex) {
                if (!isAllActions && !actions.includes(action)) continue;
                
                const index = resIdx * this.actionIndex.size + actIdx;
                bitmap.set(index, true);
            }
        }

        // Store multiple policies per role
        if (!this.policies.has(role)) {
            this.policies.set(role, []);
        }
        this.policies.get(role).push(bitmap);
        return true;
    }

    /**
     * Check access using the bitmap 
     * @param {*} role 
     * @param {*} actions 
     * @param {*} resources 
     * @returns 
     */
    checkAccess(role, actions, resources) {
        const rolePolicies = this.policies.get(role);
        if (!rolePolicies) return false;

        return rolePolicies.some(policy => 
            this.checkPolicy(policy, actions, resources)
        );
    }

    /**
     * check ploicy using bitmap
     */
    checkPolicy(policy, actions, resources) {
        for (const resource of resources) {
            const resIdx = this.resourceIndex.get(resource);
            if (resIdx === undefined) continue;

            for (const action of actions) {
                const actIdx = this.actionIndex.get(action);
                if (actIdx === undefined) continue;

                const index = resIdx * this.actionIndex.size + actIdx;
                if (policy.get(index)) return true;
            }
        }
        return false;
    }
}

module.exports = {
  BitmapPolicy
}