declare module "gatewatch" {
  interface Policy {
    resources: string[];
    actions: string[];
    roles: string[];
    policies: RolePolicy[];
  }

  interface RolePolicy {
    role: string;
    can: string[];
    on: string[];
  }

  class GrantQuery {
    constructor(enforcedPolicy: EnforcedPolicy);

    role(role: string): this;
    can(actions: string[]): this;
    on(resources: string[]): this;
    and(condition: boolean): this;
    or(condition: boolean): this;
    grant(): boolean;
  }

  class AccessControl {
    constructor(policy: Policy);
    enforce(): EnforcedPolicy;
  }

  interface EnforcedPolicy {}
}

export {};
