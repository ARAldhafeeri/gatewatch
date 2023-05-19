const DATA_MUST_BE_IN_JSON_FORMAT = "policy must be in JSON format";

const RESOURCES_MUST_BE_DEFINED = "resources must be defined as list in policy"

const ACTIONS_MUST_BE_A_LIST = "actions must be a list in policy ['action1', 'action2']"
 
const ROLES_MUST_BE_A_LIST = "roles must be a list in policy ['rol,e1', 'role2']"

const POLICIES_MUST_BE_A_LIST = "policies must be a list of objects [{role:'user', can:['read','write], on:['post','comment]}]"

module.exports = {
    DATA_MUST_BE_IN_JSON_FORMAT,
    RESOURCES_MUST_BE_DEFINED,
    ACTIONS_MUST_BE_A_LIST,
    POLICIES_MUST_BE_A_LIST,
    ROLES_MUST_BE_A_LIST
}