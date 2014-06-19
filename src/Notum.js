define(function (require) {
    'use strict';


    var _ = require('underscore');

    /**
     * @class Notum
     * @param options.backbone {Backbone} the Backbone instance we'll wrap
     * @param options.callback {Function} the callback that will be triggered if we try to access a private route as an unauthorized user. <b>The first argument will be
     * a Function you should call when the user has authenticated </b>
     * @param options.authorized {Boolean} determines if we're authorized or not
     * @constructor
     */
    function Notum(options) {

        if (!options) {
            throw new Error('Options cannot be empty');
        }

        this.backbone = options.backbone;
        this.callback = options.callback;

        this.setAuthorized(options.authorized);

    }

    /**
     * Sets whether the user is authorized or not
     * @method setAuthorized
     * @param {boolean} authorized
     * @returns {Notum}
     */
    Notum.prototype.setAuthorized = function (authorized) {
        this.isAuthorized = authorized;
        return this;
    };

    /**
     *
     * Unwraps Backbone Router
     * @method unwrap
     * @returns {Notum}
     */
    Notum.prototype.unwrap = function () {
        if (!this.original) {
            throw new Error('Cannot unwrap since the function hasn\'t been wrapped');
        }
        this.this.backbone.Router.prototype.route = this.original;
        delete this.original;
        return this;
    };


    /**
     * Wraps backbone router
     * @method wrap
     * @returns {Notum}
     */
    Notum.prototype.wrap = function () {


        if (this.original) {
            throw new Error('Cannot wrap twice');
        }

        var notum = this;

        this.original = this.backbone.Router.prototype.route;
        this.backbone.Router.prototype.route = _.wrap(this.backbone.Router.prototype.route, function (originalRoute, route, name, callback) {

            if (this.isProtected === false) {
                originalRoute.call(this, route, name, callback);
            }
            else {

                var newCallback = _.wrap(callback, function(originalCallback){

                    var callbackArguments = Array.prototype.slice.call(arguments);
                    callbackArguments.shift(); //The first argument is the actual callback we're calling

                    var authorizedInvocation = function () {
                        originalCallback.apply(this, callbackArguments);
                    };

                    if (!notum.isAuthorized) {
                        notum.callback(authorizedInvocation);
                    }
                    else {
                        authorizedInvocation();
                    }
                });
                originalRoute.call(this, route, name, newCallback);
            }
        });

        return this;

    };

    return Notum;
});





