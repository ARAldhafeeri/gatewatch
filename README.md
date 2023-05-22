# rbac
Verbose, readable JSON policy based Role based access control for JavaScript based applications. It gives the freedom for the application developer to specify the operations , resources and roles. Also it allows for dynamic checks using IF-IS. As will provide functionality to manage privilaged users within the application logic using grant-autho-if-condition-true. 

Current libraries that do the same thing are great, however, the motivation behind this library. Is most libraries assume a specific set of actions like "CURD". But what if your application needs to manage access and secure authorization for multiple operations ? this library may help. 

### definations
- Role: pre-defined entity in an application; Which is linked to a user or system, device to determine what operations can be done on what resources.
- Resources: A specific entity that resemble data in an application that authorized users or systems can perform operations on.
- Operations: actions the system perform on resources via authorized user, system, devices.

To create a complete role:
 A ROLE can perform OPERATIONs on Resources IF something IS something

onlyIf "something1" IS "Something believed to be something1 "
will return something1 === "Something believed to be something1 "

an extention that allows flexibilty to check of other things e.g. onwership of resources, attribation and so on. 

### least-privilge and zero trust:

access control will return false grant if:
- one of the chaind methods returned false, such :
    + user role have queried resurce but lack queried operations
    + user role have queried operations but lack queried resource
- risk 
we can manage privileged users in application as well using grantAutoIf(condition):
- grant().grantAutoIf(user.role === "super-admin")


### risk mitigation:
- some developers will grant access to specific resource based on role-name which can lead to a lot of risk, therefore this library require complete query:
    + role()
    + can()
    + on()
note: if the three mentioned above not chained within the query or badly formated, the grant will return false:

- If there is a use-case where a privilaged user such superadmin, use grantAutoIf(condition) at your own risk; grantAutoIf will authorize the grant if the condition passed to it is true.

- if you need to link the grant to a specific condition and return true or false based on that use onlyIfgit s


## Usage

JSON example of rbac policy: 
```JSON
{
    "resources": ["post","profile", "comment"],
    "actions": ["delete", "create", "update", "read"],
    "roles": ["user", "admin", "super-admin"],
    "policies": [
        {
            "role": "user",
            "can": ["delete", "create", "update", "read"],
            "on": ["post", "profile","comment"]
        },

        {
            "role": "admin",
            "can": ["*"], 
            "on": ["post", "profile","comment"]
        },

        {
            "role": "super-admin",
            "can": ["*"], 
            "on": ["*"]
        }
        
    ]
}

```

Then within the  server-side or client-side JavaScript based applications:
We can check the permissions 
- check if user can perform delete on post
```JavaScript
const ac = new AccessControl(policy);

const enforcedPolicy = ac.enforce();

new GrantQuery(enforcedPolicy).role("user").can("delete").on("post").grant(); // returns true
```
- check if user can perform multiple operations on a resource:

```JavaScript
const ac = new AccessControl(policy)

const enforcedPolicy = ac.enforce();

new GrantQuery(enforcedPolicy).role("user").can(["delete", "create", "update"]).on("post").grant(); // returns true
```

- example of exit  false grant given operation do not exists in the policy:
```JavaScript

const ac = new AccessControl(policy)

const enforcedPolicy = ac.enforce();

new GrantQuery(enforcedPolicy).role("user").can(["delete", "create", "random"]).on("post").grant(); // returns false
```

- example of checking onwership of a resource and using it to authorize with onlyIf
```JavaScript
const ac = new AccessControl(policy);

const enforcedPolicy = ac.enforce();


// mongodb service
const user = await userService.find("_id_": req.session.userID );
const post = await postService.find("_id": req.params.postID );
new GrantQuery(enforcedPolicy).role(user.role).can(["delete", "create", "random"]).on("post").onlyIf(user._id === post.creator._id).grant(); // returns true if user._id === post.creator._id in the database.
```


- grant auto example
```JavaScript
const ac = new AccessControl(policy);

const enforcedPolicy = ac.enforce();

// mongodb service
const user = await userService.find("_id_": req.session.userID );

const isSUperAdmin = user.role === "super-admin";
new GrantQuery(enforcedPolicy).role(user.role).can(["delete", "create", "random"]).on("post").grantAutoIf(isSuperAdmin); 
```

In previous example the behavior is as follow:
- First the entire chain will be checked if return false, and user role is not super-admin -> grant will return false.

- If user role is admin, grant will return true thus authorizing the request. 

### instalation 

### server side 

### Client-side



