
const {AccessControl, GrantQuery} = require("../src/AccessControl");

const policyData = require("./data/data.json")

const ac = new AccessControl(policyData);

const vm = require('vm');

const enforcedPolicy = ac.enforce()


const {
    DATA_MUST_BE_IN_JSON_FORMAT,
    RESOURCES_MUST_BE_DEFINED,
    ACTIONS_MUST_BE_A_LIST,
    POLICIES_MUST_BE_A_LIST,
    ROLES_MUST_BE_A_LIST,
} = require("../src/core/erros");


const policy_missing_roles = {
    "resources": [],
    "actions": [],
    "policies": []
}

const policy_missing_resources = {
    "actions": [],
    "roles": [],
    "policies": []
}

const policy_missing_actions = {
    "resources": [],
    "roles": [],
    "policies": []
}

const policy_missing_policies = {
    "resources": [],
    "actions": [],
    "roles": [],
}


const Q = new GrantQuery(enforcedPolicy);

describe('test AccessControlUtils.role()', () => {
    
    test('AccessControl.role("user").grant() return true since user role in roles ', async () => {

        const roleExists = new GrantQuery(enforcedPolicy).role("user").grant()

        expect(roleExists).toBeFalsy()
       
    })


    test('AccessControl.role("whatEver").grant() return true since user role in roles ', async () => {

        const roleExists = new GrantQuery(enforcedPolicy).role("whatEver").grant()

        expect(roleExists).toBeFalsy()
       
    })

    test('truthy and falsy build before grants at the same time should return correct grants ', async () => {

        const truthy = new GrantQuery(enforcedPolicy).role("user").can(["create", "update"]).on(["post"])
        const falsy = new GrantQuery(enforcedPolicy).role("user").can(["create", "update"]).on(["wrong"])

        expect(truthy.grant()).toBeTruthy()
        expect(falsy.grant()).toBeFalsy()
       
    })



})


describe('AccessControlUtils: test entire queries ', () => {
    
    test('returns true user can create, update on post ', async () => {

        const roleExists = new GrantQuery(enforcedPolicy).role("user").can(["create", "update"]).on(["post"]).grant()

        expect(roleExists).toBeTruthy()
       
    })


    test('AccessControl.role("user").grant() return false since it is risky ', async () => {

        const roleExists = new GrantQuery(enforcedPolicy).role("user").grant()

        expect(roleExists).toBeFalsy()
       
    })


    test('AccessControl.role("whatEver").can("whatever").grant() return false since it is risky ', async () => {

        const roleExists = new GrantQuery(enforcedPolicy).role("user").can("").grant()

        expect(roleExists).toBeFalsy()
       
    })


    test('returns true since the condition based to or is true ', async () => {

        const roleExists = new GrantQuery(enforcedPolicy).role("user").can(["create", "update", 'badAction']).on(["post"]).or(true).grant()

        expect(roleExists).toBeTruthy()
       
    })


    
    test('returns true since the condition based to or is false but query is granted ', async () => {

        const roleExists = new GrantQuery(enforcedPolicy).role("user").can(["create", "update"]).on(["post"]).or(false).grant()

        expect(roleExists).toBeTruthy()
       
    })


    test('returns true since  admin role and resources has "*"  ', async () => {

        const roleExists = new GrantQuery(enforcedPolicy).role("admin").can(["create", "update"]).on(["post"]).or(false).grant()

        expect(roleExists).toBeTruthy()
       
    })
    test('returns true if obj passed', async () => {

        const obj = ac.isJson({test: "test"})

        expect(obj).toBeTruthy()
       
    })


    test('AccessControlUtils.isJson return true if passed data is JSON', async () => {

        const obj = ac.isJson({test: "test"})

        expect(obj).toBeTruthy()
       
    })


    test('AccessControlUtils.search returns true , based on authorized query ', async () => {


        const obj = Q.search(
            {role: "user", can: ["read"], on:["post"]},
            policyData.policies)

        expect(obj).toBeTruthy()
       
    })


    test('AccessControlUtils.search returns true , based on authorized query "*" operation', async () => {

       
        const obj = Q.search(
            {role: "admin", can: ["*"], on:["post"]},
            policyData.policies)

        expect(obj).toBeTruthy()
       
    })

    
    test('AccessControlUtils.search positive returns true , based on authorized query "*" operation', async () => {

       
        const obj = Q.search(
            {role: "admin", can: ["*"], on:["comment"]},
            policyData.policies)

        expect(obj).toBeTruthy()
       
    })


    test('AccessControlUtils.search negitive returns true , based on authorized query "*" resources', async () => {

       
        const obj = Q.search(
            {role: "super-admin", can: ["*"], on:["*"]},
            policyData.policies)

        expect(obj).toBeTruthy()
       
    })

    test('AccessControlUtils.search returns true because or is true', async () => {

       
        const obj = Q.search(
            {role: "user", can: ["*"], on:[], or: true},
            policyData.policies)

        expect(obj).toBeTruthy()
       
    })


    test('AccessControlUtils.search returns true because or is false but the grant is based on the query', async () => {

       
        const obj = Q.search(
            {role: "super-admin", can: ["*"], on:["*"], or: false},
            policyData.policies)

        expect(obj).toBeTruthy()
       
    })


    test('AccessControlUtils.search returns true because can, on, resource, and are true', async () => {

       
        const obj = Q.search(
            {role: "super-admin", can: ["*"], on:["*"], and: true},
            policyData.policies)

        expect(obj).toBeTruthy()

    })


    test('AccessControlUtils.search returns true because can, on, resource, and are true, or is true', async () => {

       
        const obj = Q.search(
            {role: "super-admin", can: ["*"], on:["*"], and: true, or: true},
            policyData.policies)

        expect(obj).toBeTruthy()

    })

          

})

describe('test negitive scenarios AccessControlUtils methods', () => {

    test('AccessControlUtils.search returns false because user do not have "*" permission', async () => {

       
        const obj = Q.search(
            {role: "user", can: ["*"], on:[]},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })


    test('AccessControlUtils.search returns false because user do not have hello action', async () => {

       
        const obj = Q.search(
            {role: "user", can: ["hello"], on:['post']},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })

    test('AccessControlUtils.search returns false because some role does not exists', async () => {

       
        const obj = Q.search(
            {role: "some", can: ["read"], on:['post']},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })


    test('AccessControlUtils.search returns false because user role can not read on random ', async () => {

       
        const obj = Q.search(
            {role: "user", can: ["read"], on:['random']},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })

    test('AccessControlUtils.search returns false because user role can not read on empty resources ', async () => {

       
        const obj = Q.search(
            {role: "user", can: ["read"], on:[]},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })

    test('AccessControlUtils.search returns false empty role ', async () => {

       
        const obj = Q.search(
            {role: "", can: ["read"], on:["post"]},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })


    test('AccessControlUtils.search returns false empty role ', async () => {

       
        const obj = Q.search(
            {role: "", can: ["read"], on:["post"]},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })


    test('AccessControlUtils.search returns false empty role ', async () => {

       
        const obj = Q.search(
            {role: "", can: ["read"], on:["post"]},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })


    test('AccessControlUtils.search returns false there is no such resources as "*" for user ', async () => {

       
        const obj = Q.search(
            {role: "user", can: ["read"], on:["*"]},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })

    // missing query components 

    test('AccessControlUtils.search returns false missing role ', async () => {

       
        const obj = Q.search(
            { can: ["read"], on:["post"]},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })

    
    test('AccessControlUtils.search returns false missing can ', async () => {

       
        const obj = Q.search(
            { role:"user", on:["post"]},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })


    test('AccessControlUtils.search returns false missing on ', async () => {

       
        const obj = Q.search(
            { role:"user", can: ["read"]},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })

    // appending extra operations or resources

    test('AccessControlUtils.search returns false since there is extra resource with no policy ', async () => {

       
        const obj = Q.search(
            { role:"user", can: ["read"], on: ['post', 'whatever']},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })


    test('AccessControlUtils.search returns false since there is extra operation with no policy ', async () => {

       
        const obj = Q.search(
            { role:"user", can: ["read", 'whatever'], on: ['post']},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })


    // invalid types passed role, operation, resources
    test('AccessControlUtils.search returns false invalid type role : empty string ', async () => {

       
        const obj = Q.search(
            { role:"", can: ["read"], on: ['post']},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })

    // invalid types passed role, operation, resources
    test('AccessControlUtils.search returns false invalid type:  object ', async () => {

       
        const obj = Q.search(
            { role:{}, can: ["read"], on: ['post']},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })

    test('AccessControlUtils.search returns false invalid type can ', async () => {

       
        const obj = Q.search(
            { role:"user", can: [], on: ['post']},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })


    test('AccessControlUtils.search returns false invalid type on ', async () => {

       
        const obj = Q.search(
            { role:"user", can: ['read'], on: ['']},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })


    test('AccessControlUtils.search returns false invalid type on ', async () => {

       
        const obj = Q.search(
            { role:"user", can: ['read'], on: ['']},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })

    test('AccessControlUtils.search returns false invalid type or ', async () => {

        const obj = Q.search(
            { role:"user", can: ['read'], on: [''], or: ''},
            policyData.policies)

        expect(obj).toBeFalsy()



    });


    test('AccessControlUtils.search returns false invalid type or ', async () => {

        const obj = Q.search(
            { role:"user", can: ['read'], on: [''], or: []},
            policyData.policies)

        expect(obj).toBeFalsy()



    });


    // and , or, query combination
    test('test and -> false , or -> false, query -> false', async () => {

        const obj = Q.search(
            { role:"user", can: ['read'], on: [''], or: false, and: false},
            policyData.policies)

        expect(obj).toBeFalsy()

    });


    test('test and -> false , or -> false, query -> true', async () => {

        const obj = Q.search(
            { role:"user", can: ['read'], on: ['post'], or: false, and: false},
            policyData.policies)

        expect(obj).toBeFalsy()

    });

    test('test and -> true , or -> true, query -> true', async () => {

        const obj = Q.search(
            { role:"user", can: ['read'], on: ['post'], or: true, and: true},
            policyData.policies)

        expect(obj).toBeTruthy()

    });


    test('test and -> true , or -> false, query -> false', async () => {

        const obj = Q.search(
            { role:"user", can: ['read'], on: [], or: false, and: true},
            policyData.policies)

        expect(obj).toBeFalsy()

    });

    test('test and -> true , or -> false, query -> true', async () => {

        const obj = Q.search(
            { role:"user", can: ['read'], on: ['post'], or: true, and: true},
            policyData.policies)

        expect(obj).toBeTruthy()

    });


    test('test and -> true , or -> true, query -> false', async () => {

        const obj = Q.search(
            { role:"user", can: [], on: [], or: true, and: true},
            policyData.policies)

        expect(obj).toBeTruthy()

    });


    test('test and -> true , or -> true, query -> true', async () => {

        const obj = Q.search(
            { role:"user", can: ['read'], on: ['post'], or: true, and: true},
            policyData.policies)

        expect(obj).toBeTruthy()

    });

    test('AccessControl.isJson bad policy format DATA_MUST_BE_IN_JSON_FORMAT', async () => {
        try {
           ac.isJson("hello")
        } catch (err){
            const expectedErrorName = Object.keys({DATA_MUST_BE_IN_JSON_FORMAT})[0]
            console.log(expectedErrorName, err)

            expect(err.name).toBe(expectedErrorName)
        }
       
    })

    test('AccessControl.validatePolicy RESOURCES_MUST_BE_DEFINED', async () => {
        try {
           ac.validatePolicy(policy_missing_resources)
        } catch (err){
            const expectedErrorName = Object.keys({RESOURCES_MUST_BE_DEFINED})[0]
            console.log(expectedErrorName, err)

            expect(err.name).toBe(expectedErrorName)
        }
       
    })


    test('AccessControl.validatePolicy ACTIONS_MUST_BE_A_LIST', async () => {
        try {
           ac.validatePolicy(policy_missing_actions)
        } catch (err){
            const expectedErrorName = Object.keys({ACTIONS_MUST_BE_A_LIST})[0]
            console.log(expectedErrorName, err)

            expect(err.name).toBe(expectedErrorName)
        }
       
    })


    test('AccessControl.validatePolicy POLICIES_MUST_BE_A_LIST', async () => {
        try {
           ac.validatePolicy(policy_missing_policies)
        } catch (err){
            const expectedErrorName = Object.keys({POLICIES_MUST_BE_A_LIST})[0]
            console.log(expectedErrorName, err)

            expect(err.name).toBe(expectedErrorName)
        }
       
    })

    test('AccessControl.validatePolicy ROLES_MUST_BE_A_LIST', async () => {
        try {
           ac.validatePolicy(policy_missing_roles)
        } catch (err){
            const expectedErrorName = Object.keys({ROLES_MUST_BE_A_LIST})[0]
            console.log(expectedErrorName, err)

            expect(err.name).toBe(expectedErrorName)
        }
       
    })

    test('inside node vm grantQuery should be true', async () => {
     const context = {GrantQuery, enforcedPolicy, data: {}}
        const code = `
        const grant = new GrantQuery(enforcedPolicy).role("user").can(["create", "update"]).on(["post"]).grant()
        data = grant
        `
        vm.createContext(context)
        vm.runInContext(code, context)
        expect(context.data).toBeTruthy()
    })

})