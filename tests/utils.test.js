
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

    test('AccessControlUtils.search returns true because or is true', async () => {

       
        const obj = acUtils.search(
            {role: "user", can: ["*"], on:[], or: true},
            policyData.policies)

        expect(obj).toBeTruthy()
       
    })


    test('AccessControlUtils.search returns true because or is false but the grant is based on the query', async () => {

       
        const obj = acUtils.search(
            {role: "super-admin", can: ["*"], on:["*"], or: false},
            policyData.policies)

        expect(obj).toBeTruthy()
       
    })


    test('AccessControlUtils.search returns true because can, on, resource, and are true', async () => {

       
        const obj = acUtils.search(
            {role: "super-admin", can: ["*"], on:["*"], and: true},
            policyData.policies)

        expect(obj).toBeTruthy()

    })


    test('AccessControlUtils.search returns true because can, on, resource, and are true, or is true', async () => {

       
        const obj = acUtils.search(
            {role: "super-admin", can: ["*"], on:["*"], and: true, or: true},
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

    test('AccessControlUtils.search returns false invalid type or ', async () => {

        const obj = acUtils.search(
            { role:"user", can: ['read'], on: [''], or: ''},
            policyData.policies)

        expect(obj).toBeFalsy()



    });


    test('AccessControlUtils.search returns false invalid type or ', async () => {

        const obj = acUtils.search(
            { role:"user", can: ['read'], on: [''], or: []},
            policyData.policies)

        expect(obj).toBeFalsy()



    });


    // and , or, query combination
    test('test and -> false , or -> false, query -> false', async () => {

        const obj = acUtils.search(
            { role:"user", can: ['read'], on: [''], or: false, and: false},
            policyData.policies)

        expect(obj).toBeFalsy()

    });


    test('test and -> false , or -> false, query -> true', async () => {

        const obj = acUtils.search(
            { role:"user", can: ['read'], on: ['post'], or: false, and: false},
            policyData.policies)

        expect(obj).toBeFalsy()

    });

    test('test and -> true , or -> true, query -> true', async () => {

        const obj = acUtils.search(
            { role:"user", can: ['read'], on: ['post'], or: true, and: true},
            policyData.policies)

        expect(obj).toBeTruthy()

    });


    test('test and -> true , or -> false, query -> false', async () => {

        const obj = acUtils.search(
            { role:"user", can: ['read'], on: [], or: false, and: true},
            policyData.policies)

        expect(obj).toBeFalsy()

    });

    test('test and -> true , or -> false, query -> true', async () => {

        const obj = acUtils.search(
            { role:"user", can: ['read'], on: ['post'], or: true, and: true},
            policyData.policies)

        expect(obj).toBeTruthy()

    });


    test('test and -> true , or -> true, query -> false', async () => {

        const obj = acUtils.search(
            { role:"user", can: [], on: [], or: true, and: true},
            policyData.policies)

        expect(obj).toBeTruthy()

    });


    test('test and -> true , or -> true, query -> true', async () => {

        const obj = acUtils.search(
            { role:"user", can: ['read'], on: ['post'], or: true, and: true},
            policyData.policies)

        expect(obj).toBeTruthy()

    });







})

