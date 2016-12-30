/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "jquery", "common/services/base-event-data-service", "common/v-logger-service", "common/v-i18n-service" ], function($, BaseEventDataService, LoggerService, i18nService) {
    var isWebsocket = !1;
    window.WebSocket && (isWebsocket = !0);
    var logger = LoggerService.create("datasource"), RealtimeDataService = BaseEventDataService.extend({
        init: function() {
            this._super.apply(this, arguments);
            var self = this;
            window.onclose = function() {
                self.transport.close.call(self);
            };
        },
        transport: {
            api: ("http:" == window.location.protocol ? "ws:" : "wss:") + "//" + window.location.host + "/api/v2/websocket",
            open: function(successCallback, errorCallback) {
                var self = this, error = "";
                if ("undefined" != typeof window.WebSocket) {
                    var waitCounter = 1;
                    if (null == this.websocket || this.websocket && (3 == this.websocket.readyState || 2 == this.websocket.readyState)) this.websocket = new WebSocket(this.transport.api + "?serviceEndPoint=" + encodeURI(this.baseUrl)), 
                    this.websocket.onopen = function() {
                        logger.success("websocket opened " + self.baseUrl), "function" == typeof successCallback && successCallback();
                    }, this.websocket.onclose = function() {
                        var error = i18nService.messages("VRuntime.datasource.websocket.closed", self.baseUrl);
                        logger.warn(error), "function" == typeof errorCallback && errorCallback(error);
                    }, this.websocket.onerror = function(event) {
                        logger.error(event.data), "function" == typeof errorCallback && errorCallback(event.data);
                    }; else if (this.websocket && this.websocket.readyState && 1 == this.websocket.readyState) logger.success("websocket already opened " + this.baseUrl), 
                    "function" == typeof successCallback && successCallback(); else {
                        var wait = function() {
                            1 == self.websocket.readyState ? (logger.success("websocket opened " + self.baseUrl), 
                            "function" == typeof successCallback && successCallback()) : waitCounter > 5 ? (error = i18nService.messages("VRuntime.datasource.endpoint.unavailable", self.baseUrl), 
                            logger.error(error), "function" == typeof errorCallback && errorCallback(error)) : setTimeout(function() {
                                wait();
                            }, 1e3), waitCounter++;
                        };
                        wait();
                    }
                } else error = i18nService.messages("VRuntime.datasource.websocket.notSupported"), 
                logger.error(error), "function" == typeof errorCallback && errorCallback(error);
            },
            close: function() {
                this.websocket && this.websocket.readyState && 4 != this.websocket.readyState && this.websocket.close();
            },
            get: function(urlParams, successCallback, errorCallback) {
                var self = this, openSuccessCallback = function() {
                    self.websocket.onmessage = function(event) {
                        var data = event.data;
                        if (data) try {
                            data = JSON.parse(data);
                        } catch (e) {} finally {
                            self.set(data), "function" == typeof successCallback && successCallback(data);
                        }
                    };
                };
                this.transport.open.call(this, openSuccessCallback, errorCallback);
            },
            update: function(message) {
                var self = this, openSuccessCallback = function() {
                    logger.info("websocket send " + message), self.websocket.send(message);
                }, errorCallback = function() {};
                this.transport.open.call(this, openSuccessCallback, errorCallback);
            }
        },
        update: function(message) {
            this.transport.update.call(this, message);
        },
        create: function() {},
        remove: function() {},
        getById: function() {},
        get: function(successCallback, errorCallback) {
            this.transport.get.call(this, null, successCallback, errorCallback);
        },
        open: function(onSuccessCallback, onErrorCallback) {
            this.transport.open.call(this, onSuccessCallback, onErrorCallback);
        },
        close: function() {
            this.transport.close.call(this);
        }
    });
    return RealtimeDataService;
});