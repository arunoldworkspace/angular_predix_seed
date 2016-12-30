/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "common/base-class", "common/v-logger-service", "common/v-i18n-service" ], function(BaseClass, LoggerService) {
    var _data = (LoggerService.create("datasource"), null), BaseDataService = BaseClass.extend({
        init: function(baseUrl) {
            this.setBaseURL(baseUrl);
        },
        setBaseURL: function(baseURL) {
            this.baseUrl = baseURL;
        },
        transport: {
            get: function() {
                return null;
            },
            getById: function() {
                return null;
            },
            update: function() {
                return null;
            },
            create: function() {
                return null;
            },
            remove: function() {
                return null;
            }
        },
        update: function(id, data) {
            var dfr = $.Deferred();
            return this.transport.update.call(this, id, data, function(data, xhr) {
                dfr.resolve(data, xhr);
            }, function(data, xhr) {
                dfr.reject(data, xhr);
            }), dfr.promise();
        },
        create: function(data) {
            var dfr = $.Deferred();
            return this.transport.create.call(this, data, function(data, xhr) {
                dfr.resolve(data, xhr);
            }, function(data, xhr) {
                dfr.reject(data, xhr);
            }), dfr.promise();
        },
        remove: function(id) {
            var dfr = $.Deferred();
            return this.transport.remove.call(this, id, function(data, xhr) {
                dfr.resolve(data, xhr);
            }, function(data, xhr) {
                dfr.reject(data, xhr);
            }), dfr.promise();
        },
        getById: function(id, urlParamsObj) {
            var dfr = $.Deferred();
            return this.transport.getById.call(this, id, urlParamsObj, function(data, xhr) {
                dfr.resolve(data, xhr);
            }, function(data, xhr) {
                dfr.reject(data, xhr);
            }), dfr.promise();
        },
        get: function(urlParamsObj) {
            var dfr = $.Deferred(), self = this;
            return this.transport.get.call(this, urlParamsObj, function(data, xhr) {
                self.set(data), dfr.resolve(data, xhr);
            }, function(data, xhr) {
                dfr.reject(data, xhr);
            }), dfr.promise();
        },
        getList: function() {},
        setCustomClass: function(customClass) {
            this.baseUrl = "cc://" + customClass;
        },
        transformSettingsAttrToURLParamsObj: function(settingsAttributes) {
            var urlParamsObj = {};
            if (settingsAttributes) for (var key in settingsAttributes) urlParamsObj.hasOwnProperty(key) || (urlParamsObj[key] = []), 
            urlParamsObj[key].push(settingsAttributes[key]);
            return urlParamsObj;
        },
        transformSettingsAttrToURLParams: function(settingsAttributes) {
            var urlParamsObj = this.transformSettingsAttrToURLParamsObj(settingsAttributes), urlParams = "";
            if (urlParamsObj) {
                for (var key in urlParamsObj) urlParams += key + "=" + urlParamsObj[key] + "&";
                urlParams = urlParams.length ? urlParams.substring(0, urlParams.length - 1) : "";
            }
            return urlParams;
        },
        set: function(data) {
            _data = data;
        },
        data: function() {
            return _data;
        }
    });
    return BaseDataService;
});