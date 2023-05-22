
const {AccessControl, GrantQuery} = require("../src/AccessControl");

const policyData = require("./data/data.json")

const ac = new AccessControl(policyData);


const enforcedPolicy = ac.enforce()


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


    test('returns true since the condition based to grantAutoIf is true ', async () => {

        const roleExists = new GrantQuery(enforcedPolicy).role("user").can(["create", "update", 'badAction']).on(["post"]).grantAutoIf(true).grant()

        expect(roleExists).toBeTruthy()
       
    })


    
    test('returns true since the condition based to grantAutoIf is false but query is granted ', async () => {

        const roleExists = new GrantQuery(enforcedPolicy).role("user").can(["create", "update"]).on(["post"]).grantAutoIf(false).grant()

        expect(roleExists).toBeTruthy()
       
    })


    test('returns true since  admin role and resources has "*"  ', async () => {

        const roleExists = new GrantQuery(enforcedPolicy).role("admin").can(["create", "update"]).on(["post"]).grantAutoIf(false).grant()

        expect(roleExists).toBeTruthy()
       
    })


})