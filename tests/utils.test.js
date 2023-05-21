
const AccessControlUtils = require("../src/utils");

const {
    DATA_MUST_BE_IN_JSON_FORMAT
} = require("../src/core/erros");

const policyData = require("./data/data.json");

const acUtils = new AccessControlUtils()

describe('test positive AccessControlUtils methods', () => {

    test('returns true if obj passed', async () => {

        const obj = acUtils.isJson({test: "test"})

        expect(obj).toBeTruthy()
       
    })


    test('AccessControlUtils.isJson return true if passed data is JSON', async () => {

        const obj = acUtils.isJson({test: "test"})

        expect(obj).toBeTruthy()
       
    })


    test('AccessControlUtils.search returns true , based on authorized query ', async () => {

       
        const obj = acUtils.search(
            {role: "user", can: ["read"], on:["post"]},
            policyData.policies)

        expect(obj).toBeTruthy()
       
    })


    test('AccessControlUtils.search returns true , based on authorized query "*" operation', async () => {

       
        const obj = acUtils.search(
            {role: "admin", can: ["*"], on:["post"]},
            policyData.policies)

        expect(obj).toBeTruthy()
       
    })

    
    test('AccessControlUtils.search positive returns true , based on authorized query "*" operation', async () => {

       
        const obj = acUtils.search(
            {role: "admin", can: ["*"], on:["comment"]},
            policyData.policies)

        expect(obj).toBeTruthy()
       
    })


    test('AccessControlUtils.search negitive returns true , based on authorized query "*" resources', async () => {

       
        const obj = acUtils.search(
            {role: "super-admin", can: ["*"], on:["*"]},
            policyData.policies)

        expect(obj).toBeTruthy()
       
    })

})

describe('test negitive scenarios AccessControlUtils methods', () => {

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

    // missing query components 

    test('AccessControlUtils.search returns false missing role ', async () => {

       
        const obj = acUtils.search(
            { can: ["read"], on:["post"]},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })

    
    test('AccessControlUtils.search returns false missing can ', async () => {

       
        const obj = acUtils.search(
            { role:"user", on:["post"]},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })


    test('AccessControlUtils.search returns false missing on ', async () => {

       
        const obj = acUtils.search(
            { role:"user", can: ["read"]},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })

    // appending extra operations or resources

    test('AccessControlUtils.search returns false since there is extra resource with no policy ', async () => {

       
        const obj = acUtils.search(
            { role:"user", can: ["read"], on: ['post', 'whatever']},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })


    test('AccessControlUtils.search returns false since there is extra operation with no policy ', async () => {

       
        const obj = acUtils.search(
            { role:"user", can: ["read", 'whatever'], on: ['post']},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })


    // invalid types passed role, operation, resources
    test('AccessControlUtils.search returns false invalid type role : empty string ', async () => {

       
        const obj = acUtils.search(
            { role:"", can: ["read"], on: ['post']},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })

    // invalid types passed role, operation, resources
    test('AccessControlUtils.search returns false invalid type:  object ', async () => {

       
        const obj = acUtils.search(
            { role:{}, can: ["read"], on: ['post']},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })

    test('AccessControlUtils.search returns false invalid type can ', async () => {

       
        const obj = acUtils.search(
            { role:"user", can: [], on: ['post']},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })


    test('AccessControlUtils.search returns false invalid type on ', async () => {

       
        const obj = acUtils.search(
            { role:"user", can: ['read'], on: ['']},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })


    test('AccessControlUtils.search returns false invalid type on ', async () => {

       
        const obj = acUtils.search(
            { role:"user", can: ['read'], on: ['']},
            policyData.policies)

        expect(obj).toBeFalsy()
       
    })



});