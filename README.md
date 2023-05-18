# rbac
Verbose, readable JSON policy based Role based access control for JavaScript based applications. It gives the freedom for the application developer to specify the operations , resources and roles. Also it allows for dynamic checks using IF-IS approach. 

### definations
- Role: pre-defined entity in an application; Which is linked to a user or system, device to determine what operations can be done on what resources.
- Resources: A specific entity that resemble data in an application that authorized users or systems can perform operations on.
- Operations: actions the system perform on resources via authorized user, system, devices.

To create a complete role:
 A ROLE can perform OPERATIONs on Resources IF something IS something

IF "something1" IS "Something believed to be something1 "
will return something1 === "Something believed to be something1 "

an extention that allows to perform attribuation and check the ownership of a resources.

### least-privilge and zero trust:

access control will return false grant if:
- one of the chaind methods returned false.



## Usage

JSON example of rbac policy: 
```JSON
{
    "policy": [
        {
            "role": "user",
            "can": ["delete", "create", "update", "read"],
            "on": ["post", "profile","comment"]
        }
    ]
}

```
Then within the  server-side or client-side JavaScript based applications:
We can check the permissions 
- check if user can perform delete on post
```JavaScript
const ac = new AccessControl(policy)
ac.role("user").can("delete").on("post").grant() // returns true
```
- check if user can perform multiple operations on a resource:

```JavaScript
const ac = new AccessControl(policy)
ac.role("user").can(["delete", "create", "update"]).on("post").grant() // returns true
```

- example of exit  false grant given operation do not exists in the policy:
```JavaScript
const ac = new AccessControl(policy)
ac.role("user").can(["delete", "create", "random"]).on("post").grant() // returns false
```

- example of checking onwership of a resource and using it to authorize 
```JavaScript
const ac = new AccessControl(policy)
// mongodb service
const user = await userService.find("_id_": req.session.userID )
const post = await postService.find("_id": req.params.postID )
ac.role("user").can(["delete", "create", "random"]).on("post").if(user._id).is(post.creator._id).grant() // returns true if user._id === post.creator._id in the database.
```

### instalation 

### server side 

### Client-side



