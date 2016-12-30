/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "require", "common/utils", "jquery", "sammy", "common/containers/base-modal-container", "common/base-class" ], function(require, utils, $, Sammy, BaseModalContainer, BaseClass) {
    "use strict";
    var BaseModalContainer = BaseModalContainer, BaseApplication = BaseClass.extend({
        views: {},
        viewContainers: {},
        models: {},
        collections: {},
        templates: {},
        dataServices: {},
        slugify: function(what) {
            return what || (what = ""), String(what).replace(/\W/g, "_").toLowerCase();
        },
        init: function() {
            this.router = Sammy(arguments[0] || "body"), this.router.log = function() {}, this.router.log("Start application initialization"), 
            this.router.log("Application options: " + JSON.stringify(arguments[1])), this.currentRouteViewContainer = {}, 
            this.router.raise_errors = !0, this.router._checkFormSubmission = function() {
                return !1;
            };
            var defaults = {
                authenticate: null,
                start: null
            };
            this.options = $.extend(!0, defaults, arguments[1] || {}), this.router.log("Application initialized with options: " + JSON.stringify(this.options));
        },
        addRoute: function(httpMethod, path, routeName) {
            var dfr = $.Deferred(), self = this;
            return require([ "app/routes/" + routeName ], function(routeObject) {
                self.router.route(httpMethod, path, routeObject.main), routeObject.before && (self.router.before(path, routeObject.before), 
                self.router.log("Router before added: path: " + path)), routeObject.after && self.router.after(path, routeObject.after), 
                dfr.resolve();
            }), dfr.promise();
        },
        addRoutes: function(routes) {
            var dfr = $.Deferred(), routeArr = [];
            if (routes.length) {
                for (var i = 0; i < routes.length; i++) routeArr.push(this.addRoute(routes[i].type, routes[i].path, routes[i].name));
                $.when.apply(this, routeArr).done(function() {
                    dfr.resolve();
                });
            } else dfr.resolve();
            return dfr.promise();
        },
        addAuthRoute: function() {
            var dfr = $.Deferred(), self = this;
            return this.options.authenticate ? $.when(this.addRoute("get", this.options.authenticate.route.path, this.options.authenticate.route.name)).done(function() {
                self.addAroundCallback(), "undefined" == typeof self.dataServices.authentication && self.options.authenticate.dataService && (self.dataServices.authentication = self.options.authenticate.dataService, 
                dfr.resolve());
            }) : dfr.resolve(), dfr.promise();
        },
        addAuthDataService: function(dataService) {
            this.authDataService = dataService;
        },
        addAroundCallback: function() {
            var self = this;
            this.router.around(function(callback) {
                var context = this;
                if (self.router.log("Around router executed: " + context.path), context.path.indexOf(self.options.authenticate.route.path)) {
                    var unauthenticatedCallback = callback;
                    self.router.bind("USER_AUTHENTICATED", function() {
                        unauthenticatedCallback();
                    }), $.when(self.isAuthenticated()).done(function() {
                        self.router.log("User authenticated continue path: " + context.path), callback();
                    }).fail(function() {
                        self.router.log("Redirect to authentication path: " + self.options.authenticate.route.path), 
                        self.router.runRoute("get", self.options.authenticate.route.path);
                    });
                } else callback();
            });
        },
        start: function(startPath) {
            var self = this;
            return $.when(this.addAuthRoute(), this.addRoutes(this.options.routes)).then(function() {
                self.router.run(startPath), self.router.log("Application started with path: " + startPath), 
                self.router.get("/#", function() {
                    self.redirectToRouter(startPath);
                });
            }), this;
        },
        redirectToRoute: function(path) {
            location.hash = path;
        },
        isAuthenticated: function() {
            var dfr = $.Deferred();
            return this.dataServices.authentication.getList().done(function(result) {
                result.success ? dfr.resolve(result) : dfr.reject(result);
            }).fail(function() {
                dfr.reject();
            }), dfr.promise();
        },
        createView: function(View, viewName, options) {
            return "undefined" == typeof this.views[viewName] && (this.views[viewName] = new View(viewName, options)), 
            this.views[viewName];
        },
        createViewContainer: function(ViewContainer, viewContainerName, options) {
            return "undefined" == typeof this.viewContainers[viewContainerName] && (this.viewContainers[viewContainerName] = new ViewContainer(viewContainerName, options)), 
            this.viewContainers[viewContainerName];
        },
        createDataService: function(DataService, dataServiceName, baseURL, options) {
            return "undefined" == typeof this.dataServices[dataServiceName] && (this.dataServices[dataServiceName] = new DataService(baseURL, options)), 
            this.dataServices[dataServiceName];
        },
        createModel: function(ModelType, modelName, initialData, options) {
            return "undefined" == typeof this.models[modelName] && (this.models[modelName] = new ModelType(initialData, options)), 
            this.models[modelName];
        },
        createCollection: function(CollectionType, collectionName, initialDataArray, options) {
            return "undefined" == typeof this.collections[collectionName] && (this.collections[collectionName] = new CollectionType(initialDataArray, options)), 
            this.collections[collectionName];
        },
        addViewContainer: function(viewContainer) {
            var self = this, dfr = $.Deferred();
            return viewContainer.loadTemplate().done(function(tmpl) {
                0 == self.router.$element().find("#" + viewContainer.id).length && (self.router.$element().append(tmpl), 
                viewContainer.afterRender()), dfr.resolve();
            }), dfr.promise();
        },
        swap: function(viewContainer) {
            this.currentRouteViewContainer.$view && this.currentRouteViewContainer.id != viewContainer.id && (this.currentRouteViewContainer instanceof BaseModalContainer && viewContainer instanceof BaseModalContainer ? this.currentRouteViewContainer.hide() : this.currentRouteViewContainer instanceof BaseModalContainer && !(viewContainer instanceof BaseModalContainer) ? this.currentRouteViewContainer.hide() : this.currentRouteViewContainer instanceof BaseModalContainer || viewContainer instanceof BaseModalContainer || this.currentRouteViewContainer.hide()), 
            this.currentRouteViewContainer = viewContainer, this.currentRouteViewContainer.show();
        }
    });
    return BaseApplication;
});