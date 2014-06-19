# Notum
--------------
[ ![Codeship Status for peeter-tomberg/notum](https://codeship.io/projects/bbcf01d0-da23-0131-bf92-4e1afa282a9f/status)](https://codeship.io/projects/24265)


Notum enables you to have protected / public routes in your application. If you wish to disable protection on a route, please check [Public routes](#public-routes)


## Installation
```
bower install notum
```

### Setup requirejs
```javascript
    var requirejs = {
        "paths": {
            "Notum" : "bower_components/notum/src",
            "underscore" : "bower_components/underscore/underscore"
        }
    };

```

### Setup
```javascript

    var Backbone = require('backbone');
    var Notum = require('Notum/Notum');
    
    var unauthorized = function () {
        logger.info('Unauthorized')
        app.execute('navigate:login');
    };

    var notum = new Notum({
        backbone : Backbone,
        callback : unauthorized,
        authorized : false
    });
    notum.wrap(); //Needs to be called before you create your routers
```

#### After login
```javascript
    if (!notum.resume()) {
        app.execute('navigate:home');
    }
```

### Public routes
```javascript
    var Router = Marionette.AppRouter.extend({

        isProtected : false,

        appRoutes: {
            'home' : 'index'
        }
    });

```