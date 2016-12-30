/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "knockout", "common/base-class", "common/services/base-rest-data-service" ], function(ko, BaseClass, BaseRestDataService) {
    var BaseCollection = BaseClass.extend({
        init: function(arrayOfObjects, options) {
            this.options = options;
            var defaults = {
                baseURL: ""
            };
            this.options = $.extend(!0, {}, defaults, options), this.ds = new BaseRestDataService(this.options.baseURL), 
            this.options && this.options.model && (this.Model = this.options.model), this.observableArray = ko.observableArray(), 
            this.activeModel = ko.observable(), this.activeModel.subscribe(this.onModelActive), 
            arrayOfObjects && arrayOfObjects.length && (this.set(arrayOfObjects), this.setActiveModel(this.observableArray()[0]));
        },
        set: function(arrayOfObjects) {
            for (var i = 0; i < arrayOfObjects.length; i++) this.add(this.createModel(arrayOfObjects[i]));
        },
        setBaseURL: function(baseURL) {
            this.ds.setBaseURL(baseURL), this.options.baseURL = baseURL;
        },
        toJSON: function() {
            var tmpArray = [];
            return ko.utils.arrayForEach(this.observableArray(), function(item) {
                tmpArray.push(item.toJSON());
            }), tmpArray;
        },
        add: function(model) {
            this.observableArray.push(model);
        },
        remove: function(model) {
            this.observableArray.remove(model);
        },
        fetch: function() {
            var dfr = $.Deferred(), self = this;
            return self.ds.baseUrl = self.options.baseURL, this.ds.getList().done(function(result) {
                self.observableArray([]), self.set(result.data ? result.data : result), dfr.resolve(result);
            }).fail(function(data) {
                dfr.reject(data);
            }), dfr.promise();
        },
        getById: function(id) {
            return ko.utils.arrayFirst(this.observableArray(), function(item) {
                return item.get("id") == id;
            });
        },
        setActiveModel: function(model) {
            this.activeModel(model);
        },
        onModelActive: function() {},
        createModel: function(obj) {
            var model = new this.Model(obj, {
                baseURL: this.options.baseURL
            });
            return model;
        },
        setActiveModelById: function(id) {
            this.setActiveModel(this.getById(id));
        }
    });
    return BaseCollection;
});