/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "knockout", "common/base-class", "common/utils", "common/data-validator", "common/services/base-rest-data-service" ], function(ko, BaseClass, utils, validator, BaseRestDataService) {
    var BaseModel = BaseClass.extend({
        init: function(obj, options) {
            var defaults = {
                baseURL: ""
            };
            this.options = $.extend(!0, {}, defaults, options), this.ds = new BaseRestDataService(this.options.baseURL), 
            this.observables = {}, obj && this.set(obj);
        },
        errors: null,
        setBaseURL: function(baseURL) {
            this.ds.setBaseURL(baseURL), this.options.baseURL = baseURL;
        },
        validate: function() {
            return null;
        },
        isValid: function() {
            return this.errors = this.validate(utils.trim(this.toJSON())), null == this.errors ? !0 : !1;
        },
        set: function(obj, options) {
            var errors = this.validate(utils.trim($.extend(!0, {}, this.toJSON(), obj)));
            if (!options || options && !options.validate || options && options.validate && !errors) {
                for (var key in obj) this.observables.hasOwnProperty(key) ? this.observables[key](obj[key]) : this.observables[key] = ko.observable(obj[key]);
                this.id = this.resolveId();
            }
            return errors ? {
                errors: errors
            } : null;
        },
        get: function(observableName) {
            return this.observables[observableName]();
        },
        toJSON: function() {
            var tmpObj = {};
            for (var key in this.observables) tmpObj[key] = this.observables[key]();
            return tmpObj;
        },
        save: function() {
            var dfr = $.Deferred(), self = this;
            if (this.isValid()) {
                var inData = this.toJSON();
                this.id ? (delete inData.id, this.ds.update(this.id, inData).done(function(result) {
                    dfr.resolve({
                        id: result.data.newData
                    });
                }).fail(function(data) {
                    dfr.reject(data);
                })) : this.ds.create(inData).done(function(result) {
                    self.set({
                        id: result.data.newData
                    }), dfr.resolve(result), self.onCreateSuccessCallback();
                }).fail(function(data) {
                    dfr.reject(data);
                });
            } else dfr.reject({
                errors: this.errors
            });
            return dfr.promise();
        },
        destroy: function(data) {
            var dfr = $.Deferred();
            return this.id ? this.ds.remove(this.id, data).done(function(data) {
                dfr.resolve(data);
            }).fail(function(data) {
                dfr.reject(data);
            }) : dfr.reject(), dfr.promise();
        },
        fetch: function() {
            var dfr = $.Deferred(), self = this;
            return this.id ? this.ds.get(this.id).done(function(result) {
                self.set(result.data[0]), dfr.resolve(result);
            }).fail(function(data) {
                dfr.reject(data);
            }) : dfr.reject(), dfr.promise();
        },
        idMapper: function() {
            return null;
        },
        resolveId: function() {
            return this.idMapper() || (this.observables.id ? this.observables.id() : null);
        },
        onCreateSuccessCallback: function() {}
    });
    return BaseModel;
});