define(function (require) {
    'use strict';

    var Notum = require('Notum/Notum');
    var Backbone = require('backbone');
    var Marionette = require('marionette');
    var _ = require('underscore');


    var Location = function (href) {
        this.replace(href);
    };

    _.extend(Location.prototype, {

        parser: document.createElement('a'),

        replace: function (href) {
            this.parser.href = href;
            _.extend(this, _.pick(this.parser,
                'href',
                'hash',
                'host',
                'search',
                'fragment',
                'pathname',
                'protocol'
            ));
            // In IE, anchor.pathname does not contain a leading slash though
            // window.location.pathname does.
            if (!/^\//.test(this.pathname)) this.pathname = '/' + this.pathname;
        },

        toString: function () {
            return this.href;
        }

    });

    describe('notum', function () {

        var notum;
        var callback = jasmine.createSpy();
        var location;

        beforeEach(function () {
            location = new Location('http://example.com');
            Backbone.history = _.extend(new Backbone.History(), {location: location});
            notum = new Notum({
                backbone: Backbone,
                callback: callback,
                authorized: true
            });
            notum.wrap();
        });

        afterEach(function () {
            callback.calls.reset();
            Backbone.history.stop();
        });

        it('should throw an error when not initialized with options', function () {
            expect(function () {
                return new Notum();
            }).toThrow();
        });

        it('should invoke the callback if we try to start the routers as an unauthorized user', function () {

            notum.setAuthorized(false);
            location.replace('http://example.com#private');

            var privateCallback = jasmine.createSpy('privateCallback');

            (new (Marionette.AppRouter.extend({
                isProtected: true,

                appRoutes: {
                    'private': 'private'
                },
                controller: {
                    'private': privateCallback
                }
            }))());
            Backbone.history.start();

            expect(callback).toHaveBeenCalled();
            /**
             * First function for the callback should be a function that should be invoked when a user has logged in
             */
            expect(callback.calls.argsFor(0)[0] instanceof Function).toBeTruthy();
            /**
             * Since we're not authorized we shouldn't have hit the route either
             */
            expect(privateCallback).not.toHaveBeenCalled();

            /**
             * Lets assume we've authorized now and wish to invoke the route now
             */
            callback.calls.argsFor(0)[0]();
            expect(privateCallback).toHaveBeenCalled();


        });

        it('should invoke the public route if we start the routers', function () {

            notum.setAuthorized(false);
            location.replace('http://example.com#public');

            var publicCallback = jasmine.createSpy('publicCallback');

            (new (Marionette.AppRouter.extend({

                isProtected:  false,

                appRoutes: {
                    'public': 'public'
                },
                controller: {
                    'public': publicCallback
                }
            }))());
            Backbone.history.start();

            expect(callback).not.toHaveBeenCalled();
            expect(publicCallback).toHaveBeenCalled();
        });

        it('should throw an error when wrapped twice', function () {
            expect(function () {
                notum.wrap();
            }).toThrow(new Error('Cannot wrap twice'));
        });
    });

})
;