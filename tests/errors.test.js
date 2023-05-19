
const AccessControlUtils = require("../src/utils");
const {
    DATA_MUST_BE_IN_JSON_FORMAT,
    RESOURCES_MUST_BE_DEFINED,
    ACTIONS_MUST_BE_A_LIST,
    POLICIES_MUST_BE_A_LIST,
    ROLES_MUST_BE_A_LIST
} = require("../src/core/erros")
const acUtils = new AccessControlUtils()


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
describe('test AccessControl errors', () => {

    test('AccessControlUtils.isJson bad policy format DATA_MUST_BE_IN_JSON_FORMAT', async () => {
        try {
           acUtils.isJson("hello")
        } catch (err){
            const expectedErrorName = Object.keys({DATA_MUST_BE_IN_JSON_FORMAT})[0]
            console.log(expectedErrorName, err)

            expect(err.name).toBe(expectedErrorName)
        }
       
    })

    test('AccessControlUtils.validatePolicy RESOURCES_MUST_BE_DEFINED', async () => {
        try {
           acUtils.validatePolicy(policy_missing_resources)
        } catch (err){
            const expectedErrorName = Object.keys({RESOURCES_MUST_BE_DEFINED})[0]
            console.log(expectedErrorName, err)

            expect(err.name).toBe(expectedErrorName)
        }
       
    })


    test('AccessControlUtils.validatePolicy ACTIONS_MUST_BE_A_LIST', async () => {
        try {
           acUtils.validatePolicy(policy_missing_actions)
        } catch (err){
            const expectedErrorName = Object.keys({ACTIONS_MUST_BE_A_LIST})[0]
            console.log(expectedErrorName, err)

            expect(err.name).toBe(expectedErrorName)
        }
       
    })


    test('AccessControlUtils.validatePolicy POLICIES_MUST_BE_A_LIST', async () => {
        try {
           acUtils.validatePolicy(policy_missing_policies)
        } catch (err){
            const expectedErrorName = Object.keys({POLICIES_MUST_BE_A_LIST})[0]
            console.log(expectedErrorName, err)

            expect(err.name).toBe(expectedErrorName)
        }
       
    })

    test('AccessControlUtils.validatePolicy ROLES_MUST_BE_A_LIST', async () => {
        try {
           acUtils.validatePolicy(policy_missing_roles)
        } catch (err){
            const expectedErrorName = Object.keys({ROLES_MUST_BE_A_LIST})[0]
            console.log(expectedErrorName, err)

            expect(err.name).toBe(expectedErrorName)
        }
       
    })

})