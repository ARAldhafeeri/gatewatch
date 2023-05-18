
const AccessControlUtils = require("../src/utils");
const {
    DATA_MUST_BE_IN_JSON_FORMAT
} = require("../src/core/erros")
const acUtils = new AccessControlUtils()

describe('Test negitive scenrios client library', () => {

    test('bad policy format DATA_MUST_BE_IN_JSON_FORMAT', async () => {
        try {
           acUtils.isJson("hello")
        } catch (err){
            const expectedErrorName = Object.keys({DATA_MUST_BE_IN_JSON_FORMAT})[0]
            console.log(expectedErrorName, err)

            expect(err.name).toBe(expectedErrorName)
        }
       
    })

})