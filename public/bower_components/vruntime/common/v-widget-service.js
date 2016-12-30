/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "jquery", "common/utils", "./v-binder-service" ], function($, Utils, binderService) {
    "use strict";
    var widgetInstances = {}, create = function(WidgetClass, widgetId, settings, overwrite) {
        widgetId = Utils.slugify(widgetId);
        var ExtendedWidgetClass = WidgetClass.extend(overwrite);
        return widgetInstances[widgetId] = new ExtendedWidgetClass(widgetId, null, null, settings), 
        widgetInstances[widgetId];
    }, get = function(widgetId) {
        return getInstance(widgetId);
    }, getInstance = function(widgetId) {
        return widgetId = Utils.slugify(widgetId), widgetInstances[widgetId];
    }, render = function(widget, options, placeHolderModule) {
        var widgetSettings = widget.widgetSettings, widgetId = widget.id, $module = placeHolderModule.parents(".module"), moduleControls = $module.find(".module-widget-controls");
        placeHolderModule.html("Loading..."), placeHolderModule.parent().addClass("module-widget").removeClass("add-module");
        var icon = $('<span class="sprite data"/>');
        icon.attr("data-widgetid", widgetId), icon.attr("rel", "tooltip"), options = options ? options : {}, 
        placeHolderModule.html(""), placeHolderModule.append(widget.$view), widget.beforeRender(options.beforeRender), 
        widget.render(options.render), widget.afterRender(options.afterRender), widget.show(options.show), 
        moduleControls.find(".sprite").remove(), $module.removeClass("has-datasource"), 
        widgetSettings && widgetSettings.global && widgetSettings.global.datasource && (widgetSettings.global.datasource.name && ($module.attr("data-datasource", widgetSettings.global.datasource.name), 
        $module.addClass("has-datasource"), icon.attr("data-datasourceName", widgetSettings.global.datasource.name), 
        icon.attr("title", widgetSettings.global.datasource.name)), moduleControls.prepend(icon));
    }, destroy = function(widgetId) {
        widgetId && (widgetId = Utils.slugify(widgetId), "undefined" != typeof get(widgetId) && (delete widgetInstances[widgetId], 
        binderService.unbind(widgetInstances)));
    }, destroyAll = function() {
        binderService.unbindAll(), widgetInstances = {};
    }, WidgetService = {
        create: create,
        get: get,
        getInstance: getInstance,
        render: render,
        destroy: destroy,
        destroyAll: destroyAll
    };
    return WidgetService;
});