/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "common/utils", "jquery", "./v-datasource-service" ], function(Utils, $, datasourceService) {
    "use strict";
    var _subscriptionInstances = {}, bind = function(widget) {
        unbind(widget), _bindOutboundEventSource(widget), _bindInboundEventSource(widget), 
        _bindDataSource(widget);
    }, unbind = function(widget) {
        widget && (_subscriptionInstances[widget.id] && $.each(_subscriptionInstances[widget.id], function(key, subscription) {
            subscription.unsubscribe();
        }), delete _subscriptionInstances[widget.id]);
    }, _bindOutboundEventSource = function(widget) {
        var eventsSetting = widget.widgetSettings.events, addEventPublisher = function(eventSetting) {
            var dsChannelName = eventSetting.datasource_name ? eventSetting.datasource_name : widget.widgetSettings.datasource_name;
            if (dsChannelName.length && eventSetting.property.length) {
                var fn = function(event, data) {
                    VRuntime.postal.publish({
                        channel: Utils.slugify(eventSetting.datasource_name),
                        topic: eventSetting.property,
                        data: data
                    });
                };
                widget.$view.on(eventSetting.event, fn);
            }
        };
        if (eventsSetting && eventsSetting.outbound) for (var i = 0; i < eventsSetting.outbound.length; i++) addEventPublisher(eventsSetting.outbound[i]);
    }, _bindInboundEventSource = function(widget) {
        var eventsSetting = widget.widgetSettings.events, addEventSubscriber = function(eventSetting) {
            if ("function" == typeof widget[eventSetting.handler]) {
                _subscriptionInstances[widget.id] || (_subscriptionInstances[widget.id] = {});
                var dsChannelName = eventSetting.datasource_name ? eventSetting.datasource_name : widget.widgetSettings.datasource_name;
                dsChannelName.length && eventSetting.property.length && (_subscriptionInstances[widget.id][eventSetting.property.toUpperCase()] = VRuntime.postal.subscribe({
                    channel: Utils.slugify(dsChannelName),
                    topic: eventSetting.property + ".UPDATED",
                    callback: function(data) {
                        widget[eventSetting.handler].call(widget, data);
                    }
                }).distinctUntilChanged());
            }
        };
        if (eventsSetting && eventsSetting.inbound) for (var i = 0; i < eventsSetting.inbound.length; i++) addEventSubscriber(eventsSetting.inbound[i]);
    }, _bindDataSource = function(widgetInstance) {
        var dataSourceName = widgetInstance.id;
        if (widgetInstance.widgetSettings && widgetInstance.widgetSettings.global && widgetInstance.widgetSettings.global.datasource && widgetInstance.widgetSettings.global.datasource.name) {
            dataSourceName = widgetInstance.widgetSettings.global.datasource.name, _subscriptionInstances[widgetInstance.id] || (_subscriptionInstances[widgetInstance.id] = {});
            var WIDGET_STATUS_ERROR_MARKUP = function(code, err) {
                return '<div class="alert alert-error"><small> <strong>' + code + "</strong> " + err + '</small><button type="button" class="close" data-dismiss="alert">&times;</button></div>';
            }, WIDGET_PROCESSING_MARKUP = function() {
                return '<i class="icon-spinner icon-spin icon-large icon-3x"></i>';
            }, fetchSuccessCallBack = function(data) {
                widgetInstance.$view.parents(".module").removeClass("loading"), widgetInstance.$view.siblings(".icon-spinner, .alert").remove(), 
                "function" == typeof widgetInstance.update && widgetInstance.update.call(widgetInstance, data);
            }, fetchByIdSuccessCallBack = function(data) {
                widgetInstance.$view.parents(".module").removeClass("loading"), widgetInstance.$view.siblings(".icon-spinner, .alert").remove(), 
                "function" == typeof widgetInstance.updateById && widgetInstance.updateById.call(widgetInstance, data);
            }, actionSuccessCallback = function() {}, errorCallBack = function(err) {
                widgetInstance.$view.parents(".module").removeClass("loading"), widgetInstance.$view.siblings(".icon-spinner, .alert").remove(), 
                widgetInstance.$view.before(WIDGET_STATUS_ERROR_MARKUP("", err));
            }, processingCallBack = function() {
                widgetInstance.$view.parents(".module").addClass("loading"), widgetInstance.$view.siblings(".icon-spinner, .alert").remove(), 
                widgetInstance.$view.before(WIDGET_PROCESSING_MARKUP());
            }, datasourceInstance = datasourceService.get(dataSourceName);
            datasourceInstance && (_subscriptionInstances[widgetInstance.id].FETCH_SUCCESS = datasourceInstance.channel.subscribe({
                topic: "FETCH.SUCCESS",
                callback: fetchSuccessCallBack
            }), _subscriptionInstances[widgetInstance.id].FETCH_ERROR = datasourceInstance.channel.subscribe({
                topic: "FETCH.ERROR",
                callback: errorCallBack
            }), _subscriptionInstances[widgetInstance.id].FETCH_PROCESSING = datasourceInstance.channel.subscribe({
                topic: "FETCH.PROCESSING",
                callback: processingCallBack
            }), _subscriptionInstances[widgetInstance.id].FETCHBYID_SUCCESS = datasourceInstance.channel.subscribe({
                topic: "FETCHBYID.SUCCESS",
                callback: fetchByIdSuccessCallBack
            }), _subscriptionInstances[widgetInstance.id].FETCHBYID_ERROR = datasourceInstance.channel.subscribe({
                topic: "FETCHBYID.ERROR",
                callback: errorCallBack
            }), _subscriptionInstances[widgetInstance.id].FETCHBYID_PROCESSING = datasourceInstance.channel.subscribe({
                topic: "FETCHBYID.PROCESSING",
                callback: processingCallBack
            }), _subscriptionInstances[widgetInstance.id].CREATE_SUCCESS = datasourceInstance.channel.subscribe({
                topic: "CREATE.SUCCESS",
                callback: actionSuccessCallback
            }), _subscriptionInstances[widgetInstance.id].CREATE_ERROR = datasourceInstance.channel.subscribe({
                topic: "CREATE.ERROR",
                callback: errorCallBack
            }), _subscriptionInstances[widgetInstance.id].CREATE_PROCESSING = datasourceInstance.channel.subscribe({
                topic: "CREATE.PROCESSING",
                callback: processingCallBack
            }), _subscriptionInstances[widgetInstance.id].UPDATE_SUCCESS = datasourceInstance.channel.subscribe({
                topic: "UPDATE.SUCCESS",
                callback: actionSuccessCallback
            }), _subscriptionInstances[widgetInstance.id].UPDATE_ERROR = datasourceInstance.channel.subscribe({
                topic: "UPDATE.ERROR",
                callback: errorCallBack
            }), _subscriptionInstances[widgetInstance.id].UPDATE_PROCESSING = datasourceInstance.channel.subscribe({
                topic: "UPDATE.PROCESSING",
                callback: processingCallBack
            }), _subscriptionInstances[widgetInstance.id].REMOVE_SUCCESS = datasourceInstance.channel.subscribe({
                topic: "REMOVE.SUCCESS",
                callback: actionSuccessCallback
            }), _subscriptionInstances[widgetInstance.id].REMOVE_ERROR = datasourceInstance.channel.subscribe({
                topic: "REMOVE.ERROR",
                callback: errorCallBack
            }), _subscriptionInstances[widgetInstance.id].REMOVE_PROCESSING = datasourceInstance.channel.subscribe({
                topic: "REMOVE.PROCESSING",
                callback: processingCallBack
            }));
        }
    }, unbindAll = function() {
        $.each(_subscriptionInstances, function(widgetId) {
            $.each(_subscriptionInstances[widgetId], function(key, subscription) {
                subscription.unsubscribe();
            });
        }), _subscriptionInstances = {};
    }, BinderService = {
        bind: bind,
        unbind: unbind,
        unbindAll: unbindAll
    };
    return BinderService;
});