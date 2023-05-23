# gatewatch
Verbose, readable and flexiable Role based access control for JavaScript based applications. It gives the freedom for the application developer to specify the operations , resources and roles. Also it allows for dynamic checks using and , or query aggregation. As will provide functionality to manage privilaged users within the application logic using grant-policy-query-or-condition. 

### Installation 

```Bash
npm install gatewatch

```
### Motivation
There are many great libraries in npm that provide the same value. However, the motivation behind this library. Is most libraries assume a specific set of roles " user or admin", actions like "CURD". But what if your application needs to manage access and secure authorization for multiple operations ? this library may help. 

As my collbrative bug bounty jounery me and colleage discovered that developers are based the point of " broken access control " with roles based on " human " interaction with the application. Which is a great point to start with. However, it is not enough. Some systems have many sub-systems that interact with each other. Therefore, the roles should be based on the system that is interacting with the application.

Things this library do not assume:
- roles
- operations
- resources

Therefore, the developer can specify the roles, operations and resources. Which can lead to great flexibility in defining the policy. Once the policy is defined the flexiblity of the library comes in the query. The developer can query the policy using and, or.


### Features
- Verbose and readable
- Flexiable
- Dynamic checks
- least-privilge
- zero trust
- risk mitigation



### definations
- Role: pre-defined entity in an application; Which is linked to a user or system, device to determine what operations can be done on what resources.
- Resources: A specific entity that resemble data in an application that authorized users or systems can perform operations on.
- Operations: actions the system perform on resources via authorized user, system, devices.

### Grant Query types: 
- grant: returns true or false based on the query.
    + A ROLE can perform OPERATIONs on Resources -> simple query
- grant: returns true or false based on the query and a condition.
    + ( A ROLE can perform OPERATIONs on Resources ) AND ( Boolean output of a condition ) -> complex query returns true if both  the grant query and the condition are true.
- grant: returns true or false based on the query or a condition.
    + ( A ROLE can perform OPERATIONs on Resources ) OR ( Boolean output of a condition ) -> complex query returns true if either the grant query or the condition are true.

### least-privilge and zero trust:

access control will return false grant if:
- one of the chaind methods returned false, such :
    + role()
    + can()
    + on()
- if the condition output that is pased to and, or is not boolean.


### risk mitigation:
- some developers will grant access to specific resource based on role-name which can lead to a lot of risk, therefore this library require complete query:
    + role()
    + can()
    + on()
- role() argument must be a non-empty string, that has policiy defined in the policy object.
- can() argument must be a non-empty list of strings, that has policiy defined in the policy object.
- can() argument must be a non-empty list of strings, that has policiy defined in the policy object.
- or() argument must be a boolean. Which is output of a specific logical comparison.
- and() argument must be a boolean. Which is output of a specific logical comparison.

important note: not all the arguments are required, however, the library will return false grant if one of the arguments is not valid.



## Usage

 Take this JSON policy example of rbac policy for all the upcoming examples: 
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

new GrantQuery(enforcedPolicy).role("user").can(["delete"]).on(["post"]).grant(); // returns true
```
- check if user can perform multiple operations on a resource:

```JavaScript
const ac = new AccessControl(policy)

const enforcedPolicy = ac.enforce();

new GrantQuery(enforcedPolicy).role("user").can(["delete", "create", "update"]).on(["post"]).grant(); // returns true
```

- example of exit  false grant given operation do not exists in the policy:
```JavaScript

const ac = new AccessControl(policy)

const enforcedPolicy = ac.enforce();

new GrantQuery(enforcedPolicy).role("user").can(["delete", "create", "random"]).on(["post"]).grant(); // returns false
```

- example of checking onwership of a resource and using it to authorize with and
```JavaScript
const ac = new AccessControl(policy);

const enforcedPolicy = ac.enforce();


// mongodb service
const user = await userService.find("_id_": req.session.userID );
const post = await postService.find("_id": req.params.postID );
new GrantQuery(enforcedPolicy).role(user.role).can(["delete", "create", "random"]).on("post").and(user._id === post.creator._id).grant(); // returns true if user._id === post.creator._id returns true.
```

In previous example the behavior is as follow:
- scenario 1 returns true: 
    + if condition and grant query are true.
- scenario 2 returns false: 
    + if condition is true and grant query is false.
    + if condition is false and grant query is true.
    + if condition is false and grant query is false.



- grant with or example
```JavaScript
const ac = new AccessControl(policy);

const enforcedPolicy = ac.enforce();

// mongodb service
const user = await userService.find("_id_": req.session.userID );

const isSUperAdmin = user.role === "super-admin";
new GrantQuery(enforcedPolicy).role(user.role).can(["delete", "create", "random"]).on("post").or(isSuperAdmin); 
```

In previous example the behavior is as follow:
- scenario 1: If user role is not super-admin, grant will return true if user can perform the operation on the resource.
- scenario 2: If user role is super-admin, grant will return true thus authorizing the request.


### instalation 

### server side 

- The purpose of using this library in the server-side is to authorize the requests and access control to APIs. Therefore, the policy should be defined in the server-side.
- The policy can be defined in a JSON file and imported in the server-side.
- The policy can be defined in a database and imported in the server-side.

#### Take the folliwng example in ExpressJS application:

```JavaScript
const express = require("express");
const app = express();
const AccessControl = require("rbac");
const policy = require("./policy.json"); // same policy as above

const ac = new AccessControl(policy);

const enforcedPolicy = ac.enforce();

app.get("/post/:postID", async (req, res) => {
    const user = await userService.find("_id_": req.session.userID );
    const post = await postService.find("_id": req.params.postID );
    const isSUperAdmin = user.role === "super-admin";
    const isAuthorized = new GrantQuery(enforcedPolicy).role(user.role).can(["delete", "create", "random"]).on("post").or(isSuperAdmin).grant(); 
    if(isAuthorized) {
        // do something
    } else {
        // do something else
    }
});
```

#### also the rbac library functionality can be implemented as middlewares in expressjs application:

```JavaScript

// middleware

app.use((req, res, next) => {
    const user = await userService.find("_id_": req.session.userID );
    const post = await postService.find("_id": req.params.postID );
    const isSUperAdmin = user.role === "super-admin";
    const isAuthorized = new GrantQuery(enforcedPolicy).role(user.role).can(["delete", "create", "random"]).on("post").or(isSuperAdmin).grant(); 
    if(isAuthorized) {
        next();
    } else {
        res.status(403).send("unauthorized");
    }
});

```


### Client-side:

- The purpose of using this library in the client-side is unlike the server-side. The goal of using this library in the client-side is to manage the UI and the user experience. Therefore, the policy should be defined in the client-side. With resources and operations that are related to the UI and the user experience.


#### Take the folliwng example in ReactJS application:

```JavaScript
import React from "react";
import { AccessControl, GrantQuery } from "rbac";
import policy from "./policy.json"; // same policy as above

const ac = new AccessControl(policy);

const enforcedPolicy = ac.enforce();

const Post = () => {
    const user = await userService.find("_id_": req.session.userID );
    const post = await postService.find("_id": req.params.postID );
    const isSUperAdmin = user.role === "super-admin";
    const isAuthorized = new GrantQuery(enforcedPolicy).role(user.role).can(["delete", "create", "random"]).on("post").or(isSuperAdmin).grant(); 
    if(isAuthorized) {
        return (
            <div>
                <h1>Post</h1>
                <p>Post content</p>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Post</h1>
                <p>Post content</p>
                <p>you are not authorized to perform this action</p>
            </div>
        )
    }
}
```

#### also the rbac library functionality can be implemented as custom hooks in reactjs application:

```JavaScript

// custom hook

const useGrant = (role, operations, resources, condition) => {
    const isAuthorized = new GrantQuery(enforcedPolicy).role(role).can(operations).on(resources).or(condition).grant(); 
    return isAuthorized;
}

// component

const Post = () => {
    const isAuthorized = useGrant(user.role, ["delete", "create", "update"], ["post"], user._id === post.creator._id);
    if(isAuthorized) {
        return (
            <div>
                <h1>Post</h1>
                <p>Post content</p>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Post</h1>
                <p>Post content</p>
                <p>you are not authorized to perform this action</p>
            </div>
        )
    }

}
```

### custom hook and omit higher order component:
    
```JavaScript
    const useGrant = (role, operations, resources, condition) => {
        const isAuthorized = new GrantQuery(enforcedPolicy).role(role).can(operations).on(resources).or(condition).grant(); 
        return isAuthorized;
    }

    const withGrant = (WrappedComponent, role, operations, resources, condition) => {
        const isAuthorized = useGrant(role, operations, resources, condition);
        return (props) => {
            if(isAuthorized) {
                return <WrappedComponent {...props} />
            } else {
                return <p>you are not authorized to perform this action</p>
            }
        }
    }


    const Post = () => {
        return (
            <div>
                <h1>Post</h1>
                <p>Post content</p>
            </div>
        )
    }

    const PostWithGrant = withGrant(Post, user.role, ["delete", "create", "update"], ["post"], user._id === post.creator._id);

    export default PostWithGrant;
```







