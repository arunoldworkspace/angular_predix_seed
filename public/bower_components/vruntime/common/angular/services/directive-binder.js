/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "angular", "common/utils", "vruntime-services-module", "vruntime" ], function(angular, utils, services) {
    return services.factory("directiveBinder", function() {
        var _subscriptionInstances = {}, bind = function(scope, datasource, events) {
            unbind(scope), null != datasource && _bindDatasource(scope, datasource), null != events && _bindEvents(scope, events);
        }, unbind = function(scope) {
            _subscriptionInstances[scope._id] && $.each(_subscriptionInstances[scope._id], function(key, subscription) {
                subscription.unsubscribe();
            }), delete _subscriptionInstances[scope._id];
        }, _bindEvents = function(scope, events) {
            _createSubscriptionInstance(scope._id), _bindOutboundEventSource(scope, events), 
            _bindInboundEventSource(scope, events);
        }, _bindOutboundEventSource = function(scope, eventsSetting) {
            var addEventPublisher = function(eventSetting) {
                if (eventSetting.datasource_name.length && eventSetting.property.length) {
                    var fn = function(event, data) {
                        VRuntime.postal.publish({
                            channel: utils.slugify(eventSetting.datasource_name),
                            topic: eventSetting.property,
                            data: data
                        });
                    };
                    $("#holder" + scope._id).on(eventSetting.event, fn);
                }
            };
            if (eventsSetting && eventsSetting.outbound) for (var i = 0; i < eventsSetting.outbound.length; i++) addEventPublisher(eventsSetting.outbound[i]);
        }, _bindInboundEventSource = function(scope, eventsSetting) {
            var addEventSubscriber = function(eventSetting) {
                if ("function" == typeof scope[eventSetting.handler]) {
                    var dsChannelName = eventSetting.datasource_name;
                    dsChannelName.length && eventSetting.property.length && (_subscriptionInstances[scope._id][eventSetting.property.toUpperCase()] = VRuntime.postal.subscribe({
                        channel: utils.slugify(dsChannelName),
                        topic: eventSetting.property + ".UPDATED",
                        callback: function(data) {
                            scope[eventSetting.handler].call(scope, data);
                        }
                    }).distinctUntilChanged());
                }
            };
            if (eventsSetting && eventsSetting.inbound) for (var i = 0; i < eventsSetting.inbound.length; i++) addEventSubscriber(eventsSetting.inbound[i]);
        }, _bindDatasource = function(scope, datasource) {
            _createSubscriptionInstance(scope._id), _subscriptionInstances[scope._id].FETCH_SUCCESS = datasource.channel.subscribe({
                topic: "FETCH.SUCCESS",
                callback: function(data) {
                    var $holder = $("#holder" + scope._id);
                    $holder.find(".datasource-processing-overlay").remove(), _updatePropertiesFromDatasource(scope, data);
                }
            }), _subscriptionInstances[scope._id].FETCH_ERROR = datasource.channel.subscribe({
                topic: "FETCH.ERROR",
                callback: function(err) {
                    var $holder = $("#holder" + scope._id);
                    $holder.find(".datasource-processing-overlay").remove();
                    var errorMarkup = '<div class="alert alert-error"><small>' + err + '</small><button type="button" class="close" data-dismiss="alert">&times;</button></div>', $error = $(errorMarkup);
                    $holder.prepend($error);
                }
            }), _subscriptionInstances[scope._id].FETCH_PROCESSING = datasource.channel.subscribe({
                topic: "FETCH.PROCESSING",
                callback: function() {
                    var $holder = $("#holder" + scope._id);
                    $holder.find(".alert-error").remove();
                    var $overlay = $('<i class="icon-spinner icon-spin icon-large icon-3x"></i>').addClass("datasource-processing-overlay").css({
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#fff",
                        "z-index": 1e4
                    });
                    $holder.append($overlay);
                }
            });
        }, _createSubscriptionInstance = function(id) {
            _subscriptionInstances[id] || (_subscriptionInstances[id] = {});
        }, _updatePropertiesFromDatasource = function(scope, data) {
            var datasourceConfig = scope._datasourceConfig;
            for (var propertyToUpdate in datasourceConfig) {
                var datasourceValue = utils.resolveJsonValue(data, datasourceConfig[propertyToUpdate]);
                scope[propertyToUpdate] = datasourceValue;
            }
            scope.$apply();
        }, unbindAll = function() {
            $.each(_subscriptionInstances, function(id) {
                $.each(_subscriptionInstances[id], function(key, subscription) {
                    subscription.unsubscribe();
                });
            }), _subscriptionInstances = {};
        };
        return {
            bind: bind,
            unbind: unbind,
            unbindAll: unbindAll
        };
    });
});