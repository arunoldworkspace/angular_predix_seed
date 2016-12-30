/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "require", "postal", "common/utils", "common/services/base-event-data-service", "common/v-logger-service", "common/v-i18n-service", "jquery.form" ], function(require, postal, utils, BaseEventDataService, LoggerService, i18nService) {
    var logger = LoggerService.create("datasource"), _ajax = function(method, id, data, urlParams) {
        var dfr = $.Deferred(), contentType = this.contentType ? this.contentType : "application/json", serviceEndPoint = this.baseUrl;
        id && (serviceEndPoint = serviceEndPoint + "/" + id.toString()), urlParams && (serviceEndPoint = serviceEndPoint + "?" + urlParams), 
        serviceEndPoint = encodeURI(serviceEndPoint);
        var headers = $.extend({}, {
            "Service-End-Point": serviceEndPoint
        }, this.headers), ajaxErrorHandler = function(xhr) {
            var err;
            try {
                err = $.parseJSON(xhr.responseText).responseText || $.parseJSON(xhr.responseText).error || $.parseJSON(xhr.responseText).error_message;
            } catch (ex) {
                err = i18nService.messages("DataServiceManagerImpl.webservice.exception");
            }
            logger.error(i18nService.messages("VRuntime.datasource.response.error", err)), dfr.reject(err, xhr);
        };
        return data && "object" == typeof data && method && "POST" === method && "" === serviceEndPoint ? $(data).ajaxSubmit({
            type: "POST",
            url: "/upload",
            contentType: "multipart/form-data",
            headers: headers,
            success: function(resData, status, xhr) {
                dfr.resolve(resData, xhr);
            },
            error: ajaxErrorHandler
        }) : (data ? data = JSON.stringify($.extend({}, data)) : contentType = "", $.ajax({
            type: method,
            url: this.transport.api,
            headers: headers,
            contentType: contentType,
            data: data,
            cache: !1,
            success: function(proxydata, status, xhr) {
                var data = proxydata.hasOwnProperty("data") ? proxydata.data : proxydata;
                dfr.resolve(data, xhr);
            },
            error: ajaxErrorHandler
        })), dfr.promise();
    }, ProxyDataService = BaseEventDataService.extend({
        init: function(dataSourceName, baseUrl) {
            this._super.apply(this, arguments);
            arguments.length >= 1 && (this.baseUrl = "/upload" == arguments[1] ? "" : arguments[1]), 
            arguments.length >= 3 && (this.headers = arguments[2]), logger.info("rest initializing " + baseUrl);
        },
        transport: {
            api: "/dataController/proxy",
            get: function(urlParamsObj, successCallback, errorCallback) {
                var urlParams = this.transformSettingsAttrToURLParams(urlParamsObj), self = this;
                _ajax.call(this, "GET", null, null, urlParams).done(function(data, xhr) {
                    self.set(data), successCallback(data, xhr);
                }).fail(function(err, xhr) {
                    errorCallback(err, xhr);
                });
            },
            getById: function(id, urlParamsObj, successCallback, errorCallback) {
                var urlParams = this.transformSettingsAttrToURLParams(urlParamsObj);
                _ajax.call(this, "GET", id, null, urlParams).done(function(data, xhr) {
                    successCallback(data, xhr);
                }).fail(function(err, xhr) {
                    errorCallback(err, xhr);
                });
            },
            update: function(id, data, successCallback, errorCallback) {
                data = $.extend(!0, {}, data ? data : null), _ajax.call(this, "PUT", id, data, null).done(function(data, xhr) {
                    successCallback(data, xhr);
                }).fail(function(err, xhr) {
                    errorCallback(err, xhr);
                });
            },
            create: function(data, successCallback, errorCallback) {
                _ajax.call(this, "POST", null, data, null).done(function(data, xhr) {
                    successCallback(data, xhr);
                }).fail(function(err, xhr) {
                    errorCallback(err, xhr);
                });
            },
            remove: function(id, successCallback, errorCallback) {
                _ajax.call(this, "DELETE", id, null, null).done(function(data, xhr) {
                    successCallback(data, xhr);
                }).fail(function(err, xhr) {
                    errorCallback(err, xhr);
                });
            }
        }
    });
    return ProxyDataService;
});