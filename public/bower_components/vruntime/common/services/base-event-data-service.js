/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "require", "postal", "common/utils", "common/services/base-data-service", "common/v-logger-service", "common/v-i18n-service" ], function(require, postal, utils, BaseDataService, LoggerService, i18nService) {
    var logger = LoggerService.create("datasource"), fireSuccessEvent = function(topic, data) {
        postal.publish({
            channel: this.channelName,
            topic: topic + ".SUCCESS",
            data: data
        });
    }, fireErrorEvent = function(topic, err) {
        logger.error(i18nService.messages("VRuntime.datasource.response.error", JSON.stringify(err))), 
        postal.publish({
            channel: this.channelName,
            topic: topic + ".ERROR",
            data: err
        });
    }, fireProcessingEvent = function(topic) {
        postal.publish({
            channel: this.channelName,
            topic: topic + ".PROCESSING",
            data: null
        });
    }, firePropertyUpdatedEvent = function(propertyName, data) {
        postal.publish({
            channel: this.channelName,
            topic: propertyName + ".UPDATED",
            data: data
        });
    }, topics = {
        fetch: "FETCH",
        fetchById: "FETCHBYID",
        create: "CREATE",
        update: "UPDATE",
        remove: "DELETE"
    }, ProxyDataEventService = BaseDataService.extend({
        init: function(dataSourceName, baseUrl, settings) {
            this._super(baseUrl);
            var self = this;
            this.baseUrl = baseUrl, this.channel = postal.channel(dataSourceName), this.channelName = dataSourceName, 
            this.properties = settings, this.resetDatasourceSubscriptions(), this.on(topics.fetch, function(data) {
                var urlParamsObj = null;
                data && data.urlParamsObj && (urlParamsObj = data.urlParamsObj), fireProcessingEvent.call(self, topics.fetch), 
                self.transport.get.call(self, urlParamsObj, function(data) {
                    self.set(data), fireSuccessEvent.call(self, topics.fetch, data);
                }, function(err) {
                    fireErrorEvent.call(self, topics.fetch, err);
                });
            }), this.on(topics.fetchById, function(data) {
                var urlParamsObj = null, id = null;
                data && data.urlParamsObj && (urlParamsObj = data.urlParamsObj), data && data.id && (id = data.id), 
                fireProcessingEvent.call(self, topics.fetchById), self.transport.getById.call(self, id, urlParamsObj, function(data) {
                    self.set(data), fireSuccessEvent.call(self, topics.fetchById, data);
                }, function(err) {
                    fireErrorEvent.call(self, topics.fetchById, err);
                });
            }), this.on(topics.update, function(data) {
                var id = null;
                data && data.id && (id = data.id), fireProcessingEvent.call(self, topics.update), 
                self.transport.update.call(self, id, data, function(data) {
                    fireSuccessEvent.call(self, topics.update, data);
                }, function(err) {
                    fireErrorEvent.call(self, topics.update, err);
                });
            }), this.on(topics.create, function(data) {
                fireProcessingEvent.call(self, topics.create), self.transport.create.call(self, data, function(data) {
                    fireSuccessEvent.call(self, topics.create, data);
                }, function(err) {
                    fireErrorEvent.call(self, topics.create, err);
                });
            }), this.on(topics.remove, function(data) {
                var id = null;
                data && data.id && (id = data.id), fireProcessingEvent.call(self, topics.remove), 
                self.transport.remove.call(self, id, function(data) {
                    fireSuccessEvent.call(self, topics.remove, data);
                }, function(err) {
                    fireErrorEvent.call(self, topics.remove, err);
                });
            });
            var addEventSubscriber = function(property) {
                var self = this;
                property && property.length && this.on(property, function(data) {
                    firePropertyUpdatedEvent.call(self, property, data);
                });
            };
            if (settings) for (property in settings) addEventSubscriber.call(this, property);
        },
        trigger: function(event, data) {
            event && event.length && (topics.hasOwnProperty(event) && (event = event.toUpperCase()), 
            this.channel.publish({
                topic: event,
                data: data
            }));
        },
        subscribe: function(event, callback) {
            this.on(event, callback);
        },
        on: function(event, callback) {
            event && event.length && "function" == typeof callback && (topics.hasOwnProperty(event) && (event = event.toUpperCase()), 
            this.channel.subscribe({
                topic: event,
                callback: callback
            }));
        },
        set: function(data) {
            this._super(data), this.trigger("CHANGE", data);
        },
        resetDatasourceSubscriptions: function() {
            var subscriptions;
            subscriptions = postal.utils.getSubscribersFor(this.channelName, "CHANGE"), $.each(subscriptions, function(i, sub) {
                sub && sub.unsubscribe();
            });
            for (action in topics) subscriptions = postal.utils.getSubscribersFor(this.channelName, topics[action]), 
            $.each(subscriptions, function(i, sub) {
                sub && sub.unsubscribe();
            }), subscriptions = postal.utils.getSubscribersFor(this.channelName, topics[action] + ".SUCCESS"), 
            $.each(subscriptions, function(i, sub) {
                sub && sub.unsubscribe();
            }), subscriptions = postal.utils.getSubscribersFor(this.channelName, topics[action] + ".PROCESSING"), 
            $.each(subscriptions, function(i, sub) {
                sub && sub.unsubscribe();
            }), subscriptions = postal.utils.getSubscribersFor(this.channelName, topics[action] + ".ERROR"), 
            $.each(subscriptions, function(i, sub) {
                sub && sub.unsubscribe();
            });
            for (property in this.properties) subscriptions = postal.utils.getSubscribersFor(this.channelName, property), 
            $.each(subscriptions, function(i, sub) {
                sub && sub.unsubscribe();
            }), subscriptions = postal.utils.getSubscribersFor(this.channelName, property + ".UPDATED"), 
            $.each(subscriptions, function(i, sub) {
                sub && sub.unsubscribe();
            });
        }
    });
    return ProxyDataEventService;
});