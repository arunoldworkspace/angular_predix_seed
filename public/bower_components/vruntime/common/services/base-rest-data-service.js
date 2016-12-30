/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "require", "jquery", "common/services/base-data-service", "common/utils" ], function(require, $, BaseDataService, utils) {
    var ajax = function(type, urlParams, data, dfr) {
        var ajaxErrorHandler = function(xhr) {
            var err;
            try {
                err = $.parseJSON(xhr.responseText);
            } catch (ex) {
                err = {
                    errors: {
                        DataService: [ "unable to parse error return from server end point." ]
                    }
                };
            }
            dfr.reject(err);
        };
        $.ajax({
            type: type,
            url: this.baseUrl + (urlParams || ""),
            dataType: "json",
            contentType: "application/json",
            data: data && JSON.stringify(data),
            cache: !1,
            success: function(res) {
                dfr.resolve(res);
            },
            error: ajaxErrorHandler
        });
    }, BaseRestDataService = BaseDataService.extend({
        init: function(baseUrl, options) {
            return this.baseUrl = baseUrl, this.options = {
                update: "PUT",
                create: "POST",
                remove: "DELETE",
                get: "GET"
            }, $.extend(this.options, options), this;
        },
        setBaseURL: function(baseURL) {
            this.baseUrl = baseURL;
        },
        update: function(id, data) {
            var dfr = $.Deferred(), errors = this.validate(utils.trim(data));
            return errors ? dfr.reject({
                errors: errors
            }) : ajax.call(this, this.options.update, "/" + id, data, dfr), dfr.promise();
        },
        create: function(data) {
            var dfr = $.Deferred(), errors = this.validate(utils.trim(data));
            return errors ? dfr.reject({
                errors: errors
            }) : ajax.call(this, this.options.create, null, data, dfr), dfr.promise();
        },
        remove: function(id, data) {
            var dfr = $.Deferred();
            return ajax.call(this, this.options.remove, "/" + id, data, dfr), dfr.promise();
        },
        get: function(id) {
            var dfr = $.Deferred();
            return ajax.call(this, this.options.get, "/" + id, null, dfr), dfr.promise();
        },
        getList: function() {
            var dfr = $.Deferred();
            return ajax.call(this, this.options.get, null, null, dfr), dfr.promise();
        },
        validate: function() {
            return null;
        },
        isRequired: function(data, fieldName, errors) {
            return data && data[fieldName] && data[fieldName].length || (errors = errors || {}, 
            errors[fieldName] = Messages("validation.required")), errors;
        }
    });
    return BaseRestDataService;
});