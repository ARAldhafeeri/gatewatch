
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


    test('AccessControl.role("user").grant() return false since it is risky ', async () => {

        const roleExists = ac.role("user").grant()

        expect(roleExists).toBeFalsy()
       
    })


    test('AccessControl.role("whatEver").can("whatever").grant() return false since it is risky ', async () => {

        const roleExists = ac.role("user").can("").grant()

        expect(roleExists).toBeFalsy()
       
    })


})