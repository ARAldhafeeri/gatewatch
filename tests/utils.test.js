
const AccessControlUtils = require("../src/utils");

const {
    DATA_MUST_BE_IN_JSON_FORMAT
} = require("../src/core/erros");

const policyData = require("./data/data.json");

const acUtils = new AccessControlUtils()

describe('test AccessControlUtils methods', () => {

    test('returns true if obj passed', async () => {

        const obj = acUtils.isJson({test: "test"})

        expect(obj).toBeTruthy()
       
    })


    test('AccessControlUtils.isJson return true if passed data is JSON', async () => {

        const obj = acUtils.isJson({test: "test"})

        expect(obj).toBeTruthy()
       
    })



    
    test('AccessControlUtils.search returns false because user do not have "*" permission', async () => {

       
        const obj = acUtils.search(
            {role: "user", can: ["*"], on:[]},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })


    test('AccessControlUtils.search returns false because user do not have hello action', async () => {

       
        const obj = acUtils.search(
            {role: "user", can: ["hello"], on:['post']},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })

    test('AccessControlUtils.search returns false because some role does not exists', async () => {

       
        const obj = acUtils.search(
            {role: "some", can: ["read"], on:['post']},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })


    test('AccessControlUtils.search returns false because user role can not read on random ', async () => {

       
        const obj = acUtils.search(
            {role: "user", can: ["read"], on:['random']},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })

    test('AccessControlUtils.search returns false because user role can not read on empty resources ', async () => {

       
        const obj = acUtils.search(
            {role: "user", can: ["read"], on:[]},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })

    test('AccessControlUtils.search returns false empty role ', async () => {

       
        const obj = acUtils.search(
            {role: "", can: ["read"], on:["post"]},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })


    test('AccessControlUtils.search returns false empty role ', async () => {

       
        const obj = acUtils.search(
            {role: "", can: ["read"], on:["post"]},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })


    test('AccessControlUtils.search returns false empty role ', async () => {

       
        const obj = acUtils.search(
            {role: "", can: ["read"], on:["post"]},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })


    test('AccessControlUtils.search returns false there is no such resources as "*" for user ', async () => {

       
        const obj = acUtils.search(
            {role: "user", can: ["read"], on:["*"]},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })


    test('AccessControlUtils.search returns true , based on authorized query ', async () => {

       
        const obj = acUtils.search(
            {role: "user", can: ["read"], on:["post"]},
            policyData.policies)

        expect(obj).toBeTruthy()
       
    })

})