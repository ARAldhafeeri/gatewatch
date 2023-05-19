
const AccessControl = require("../src/AccessControl");

const policyData = require("./data/data.json")

const ac = new AccessControl(policyData);


ac.enforce()


describe('test AccessControlUtils.role()', () => {
    
    test('AccessControl.role("user").grant() return true since user role in roles ', async () => {

        const roleExists = ac.role("user").grant()

        expect(roleExists).toBeFalsy()
       
    })


    test('AccessControl.role("whatEver").grant() return true since user role in roles ', async () => {

        const roleExists = ac.role("whatEver").grant()

        expect(roleExists).toBeFalsy()
       
    })





})


describe('AccessControlUtils: test entire queries ', () => {
    
    test('returns true user can create, update on post ', async () => {

        const roleExists = ac.role("user").can(["create", "update"]).on(["post"]).grant()

        expect(roleExists).toBeTruthy()
       
    })

    // bug must fix , race condition maybe can be fixed using map

    test('truthy and falsy build before grants at the same time ', async () => {

        const truthy = ac.role("user").can(["create", "update"]).on(["post"])
        console.log(ac.query)
        const falsy = ac.role("user").can(["create", "update"]).on(["wrong"])
        console.log(ac.query)
        expect(truthy.grant()).toBeTruthy()
        expect(falsy.grant()).toBeFalsy()
       
    })



    test('AccessControl.role("user").grant() return false since it is risky ', async () => {

        const roleExists = ac.role("user").grant()

        expect(roleExists).toBeFalsy()
       
    })


    test('AccessControl.role("whatEver").can("whatever").grant() return false since it is risky ', async () => {

        const roleExists = ac.role("user").can("").grant()

        expect(roleExists).toBeFalsy()
       
    })


})