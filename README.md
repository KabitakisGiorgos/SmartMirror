# Fullstack Seed
A front-end service seed for AmiHome exposing RESTfull API using Typescript, Mongoose, Express and Angular.

> Part of AmI-Solertis project.

### Tech

This seed uses a number of open source projects to work properly:
* [node.js] - evented I/O for the backend
* [Express] - Fast, unopinionated, minimalist web framework for Node.js
* [Gulp] - a toolkit for automating painful or time-consuming tasks in development workflow
* [MongoDB] -  a free and open-source cross-platform document-oriented database program
* [Typescript] - super set of javascript that compliles to plain javascript
* [Angular] - a JavaScript-based open-source front-end web application framework

## 1. Installation and Run 
### 1.1 Prerequisites
- Latest version of Node to be installed.
- Install MongoDB (if it is required for your project) 
- Install C++ compilers and python **2.7** (if not already installed)
```
[windows only command]
$ npm install -g --production windows-build-tools
``` 
- Setup npm registry in order to find `@amisolertis` modules
```
$ npm config set @amisolertis:registry http://solertis.ics.forth.gr:4870
``` 
- Install required global packages:
```
$ npm install -g gulp @angular/cli
```

### 1.2 Steps to Run
```
$ npm install          <= install npm packages
$ mongod               <= [optional] start MongoDB 
$ gulp serve           <= start server in development mode
```

### 1.3 Work with environments

| Environment   | Command               |
| ------------- | --------------------- |
| Development   | `$ gulp serve`        |
| Production    | `$ gulp serve:dist`   |
| Build Dist    | `$ gulp build:dist`   |
| Test          | Not supported yet...  |




### 1.4. Configuration
All the configuration is specified in the `./config/config.json` file, through the module `@amisolertis/utils-config`.
* **Express.** Configure `express.hostName`, `express.port` and `express.ip`.
* **MongoDB.** In order to enable connection with MongoDB, change `mongodb.connect` to `true` and configure `mongodb.host`, `mongodb.name` and `mongodb.port`.
* **Redis.** Edit `redis.ip`, `redis.port` and `redis.password` in order to connect with Redis.



License
----
Part of AmI-Solertis project. See [AMI ICS-FORTH] .


[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [AMI ICS-FORTH]: <http://ami.ics.forth.gr/>
   [node.js]: <http://nodejs.org>
   [express]: <http://expressjs.com>
   [Gulp]: <http://gulpjs.com>
   [MongoDB]: <https://www.mongodb.com/>
   [Typescript]: <https://www.typescriptlang.org/>
   [Angular]: <https://angular.io/>

