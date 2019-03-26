# API Template

This is a RESTful API template for Nodejs projects. Using this project, following stack will be applied automatically;

  - RESTful API endpoints with basic CRUD operations
  - Routing
  - Test
  - Logging
  - Validation
  - Error Handling
  - Async/Await
  - **Docker** and related configuration **is not** embedded to this repository.

# Overview

First, the purpose of this template is not automating everything in the project. We know each project should have 
its business logic, validation, authorization etc. So, you have handle all these, yet this template provides a base level standard to achieve your final project.

Following items are our design decisions as coding standards:
  -  **filenames:** lowercase and separated with "_"
  - **object names:** use PascalCase
  - **method names:** use camelCase, for private methods use "_camelCase"
  - **error handling:** use try/catch block only in controllers, and use ErrorHandler
  - **settings:** use environment variables, check **config_manager.js**


### Tech

This template uses a number of open source projects to work properly:

* [Node.js](https://nodejs.org/en/) - Node.js® is a JavaScript runtime for server side!
* [ExpressJs](https://expressjs.com/) - fast node.js network app framework
* [MySQL](https://www.mysql.com/) - is an open source relational database management system.
* [Jest](https://jestjs.io/) - is a delightful JavaScript Testing Framework with a focus on simplicity
* [log4js](https://github.com/log4js-node/log4js-node) - is a solid logging tool for Node.js

Lastest version is tested on [Node.js](https://nodejs.org/) v11+.
### Usage

1 - Install the dependencies and devDependencies.

```sh
$ cd api-template
$ npm install -d
```
2 - Create your database with your schema, there is sample under **/etc/1.0.0_db_changes**
3 - Set your environment variables, check **/src/utils/config_manager.js**
4 - Create your first entity

```sh
$ npm run api User
```
Result:
```sh
Following files are created for User
        - src/apis/user/user_route.js
        - src/apis/user/user_controller.js
        - src/apis/user/user_repository.js
        - src/apis/user/user_test.js
        - src/apis/user/user_schema.js
        - src/apis/user/user_validator.js
```
- Be sure that you created related database table, because this script **will not** create database table for you.
 

5 - Define your schema for validation in **src/apis/user/user_schema.js**
6 - Assign your router to app, in **src/apis/index.js**
7 - Run your tests
```sh
$ npm test
```

**All done!**

License
----

MIT
