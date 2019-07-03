
    # Smart Mirror

    A fullstack service for AmiHome exposing RESTfull API using Typescript, Mongoose, Express and Angular.

    A postman  collection is provided *smartMirror.postman_collection.json*, this file is contained in the files and has the calls used for the api.
    ### Tech

    

    This seed uses a number of open source projects to work properly:

    *  [node.js] - evented I/O for the backend

    *  [Express] - Fast, unopinionated, minimalist web framework for Node.js

    *  [Gulp] - a toolkit for automating painful or time-consuming tasks in development workflow

    *  [MongoDB] - a free and open-source cross-platform document-oriented database program

    *  [Typescript] - super set of javascript that compliles to plain javascript

    *  [Angular] - a JavaScript-based open-source front-end web application framework

    *  [LeapMotion] - a computer hardware sensor device that supports hand and finger motions as input

    * [Voice Recognition] - A speech recognition, voice commands and speech synthesis javascript library
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

    $ npm install <= install npm packages

    $ mongod <= [optional] start MongoDB

    $ gulp serve <= start server in development mode

    ```

    

    ### 1.3 Work with environments

    

    | Environment | Command |

    | ------------- | --------------------- |

    | Development | `$ gulp serve` |

    | Production | `$ gulp serve:dist` |

    | Build Dist | `$ gulp build:dist` |

    | Test | Not supported yet... |

    
    
    
    

    ### 1.4. Configuration

    All the configuration is specified in the `./config/config.json` file, through the module `@amisolertis/utils-config`.

    *  **Express.** Configure `express.hostName`, `express.port` and `express.ip`.

    *  **MongoDB.** In order to enable connection with MongoDB, change `mongodb.connect` to `true` and configure `mongodb.host`, `mongodb.name` and `mongodb.port`.

    *  **Redis.** Edit `redis.ip`, `redis.port` and `redis.password` in order to connect with Redis.

    ### 1.5. Dependencies

    This project was developed with some specific library versions and tested working.Feel free to update them if they work.

    * The LeapMotion SDK used for developing is LeapDeveloperKit_2.3.1+31549_linux

    License

    ----

    Part of AmI-Solertis project. See [AMI ICS-FORTH] .


    ### 1.5 Future Work

    Still there is a bug when assistant reads news and user stops him he keeps talking.
    Features:
        Remove the hardcoded and local files.Connect media player with a music api like youtube and have dynamic content as well as the libraries for 
        playlists and favorites songs.

        Assistant should provide an indication somehow from the UI when he hears his name.It should be implemented a custom way of hearing the name so 
        we could have a bigger "hearing time" so when you say his name there is bigger period for responding.

        Leap should be calibrated in order the interaction at the lowest points of the screen to be easier.

        Then we could keep connecting more services to enrich the mirror.Like google calendar/rocket chat/ weather/ dynamic activities in timeline/news and the
        components under timeline.

    Demo Data 

    ```
    { 
    "_id" : ObjectId("5cc476abf1e08b72e5474979"), 
    "type" : "Hypnos", 
    "start" : NumberInt(23400000), 
    "icon" : "awaken", 
    "__v" : NumberInt(0)
    }
    // ----------------------------------------------
    {
        "_id" : ObjectId("5cc4784ef1e08b72e547497a"),
        "type" : "Food",
        "start" : NumberInt(27000000),
        "icon" : "food_prep",
        "__v" : NumberInt(0)
    }
    // ----------------------------------------------
    {
        "_id" : ObjectId("5cc479cdf1e08b72e547497b"), 
        "type" : "Commute", 
        "start" : NumberInt(35100000), 
        "icon" : "commute", 
        "end" : NumberInt(40500000), 
        "title" : "ETA: 1h 30min", 
        "__v" : NumberInt(0)
    }
    // ----------------------------------------------
    { 
        "_id" : ObjectId("5cc47eb5f1e08b72e547497c"), 
        "type" : "Work", 
        "start" : NumberInt(41400000), 
        "icon" : "work", 
        "end" : NumberInt(70200000), 
        "title" : "11:30-19:30", 
        "__v" : NumberInt(0)
    }
    // ----------------------------------------------
    { 
        "_id" : ObjectId("5cc47f57f1e08b72e547497d"), 
        "type" : "Commute", 
        "start" : NumberInt(72000000), 
        "icon" : "commute", 
        "end" : NumberInt(74700000), 
        "title" : "Pick Kids", 
        "__v" : NumberInt(0)
    }
    // ----------------------------------------------
    { 
        "_id" : ObjectId("5cc47fcc354dbd7dee1cdf5e"), 
        "type" : "Sleep", 
        "start" : NumberInt(85500000), 
        "icon" : "sleep", 
        "__v" : NumberInt(0)
    }
    // ----------------------------------------------
    { 
        "_id" : ObjectId("5cc481384a91527f6e67cd22"), 
        "type" : "Food", 
        "start" : NumberInt(80100000), 
        "icon" : "lunch", 
        "end" : NumberInt(83700000), 
        "title" : "Dinner", 
        "__v" : NumberInt(0)
    }
    // ----------------------------------------------
    { 
        "_id" : ObjectId("5cc482194a91527f6e67cd23"), 
        "type" : "Relax", 
        "start" : NumberInt(75600000), 
        "icon" : "relax", 
        "end" : NumberInt(79200000), 
        "title" : "Relax", 
        "__v" : NumberInt(0)
    }
    // ----------------------------------------------

    ```
    

    [//]: #  (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

    

    [AMI ICS-FORTH]: <http://ami.ics.forth.gr/>

    [node.js]: <http://nodejs.org>

    [express]: <http://expressjs.com>

    [Gulp]: <http://gulpjs.com>

    [MongoDB]: <https://www.mongodb.com/>

    [Typescript]: <https://www.typescriptlang.org/>

    [Angular]: <https://angular.io/>

    [LeapMotion]: <https://www.leapmotion.com/>
    
    [Voice Recognition]:<https://sdkcarlos.github.io/sites/artyom.html>