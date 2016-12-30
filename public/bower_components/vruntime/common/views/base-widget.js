/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "knockout", "common/views/base-view", "common/utils" ], function(ko, BaseView, utils) {
    var BaseWidget = BaseView.extend({
        init: function(id, schema, template, widgetSettings) {
            this._super.apply(this, arguments), this.$view.css("display", "none"), this.schema = schema ? schema : this.schema, 
            this.template = template ? template : this.template, widgetSettings ? this.widgetSettings = widgetSettings : "";
        },
        template: null,
        schema: null,
        widgetSettings: null,
        _component: null,
        _initComponent: function() {
            null === this._component && (this._component = this.$view);
        },
        _transformData: function(data) {
            return data;
        },
        beforeRender: function() {
            return this.$view.html(this.template), this;
        },
        show: function(options) {
            options = options ? options : {}, this.$view.show(options.speed, options.easing, options.callback);
        },
        render: function() {
            return this._initComponent(), this;
        },
        getComponent: function() {
            return this._component;
        },
        setComponent: function(component) {
            this._component = component;
        },
        update: function() {
            return this;
        },
        _createViewModelFromSchema: function() {
            if (this.schema && this.schema.properties) {
                var subProps, props = this.schema.properties, propName = "", aggrKey = [];
                for (var key in props) if ("undefined" == typeof props[key].computed) {
                    var val = props[key]["default"];
                    this[key] = "[object Array]" === Object.prototype.toString.call(val) ? ko.observableArray([]) : ko.observable(" ");
                } else {
                    subProps = props[key].computed, propName = "";
                    for (var i = 0; i < subProps.length; i++) {
                        propName = subProps[i].name;
                        var val = props[key]["default"];
                        this[propName] = "[object Array]" === Object.prototype.toString.call(val) ? ko.observableArray([]) : ko.observable(" ");
                    }
                    this[key] = ko.computed(function() {
                        for (var i = 0; i < subProps.length; i++) propName = subProps[i].name, aggrKey[i] = "default" === vm[propName]() ? "" : vm[propName]();
                        return aggrKey.join(" ");
                    }, this);
                }
            }
        },
        _updateViewModelWithData: function(data) {
            if (data = data ? data : {}, this.schema && this.schema.properties && this.widgetSettings) {
                var val, props = this.schema.properties, settingProps = this.widgetSettings.properties;
                for (var key in props) if ("undefined" == typeof props[key].computed) settingProps.hasOwnProperty(key) && (val = "object" != typeof settingProps[key] ? settingProps[key] : "undefined" == typeof settingProps[key].$ref ? settingProps[key].value : utils.resolveJsonValue(data, settingProps[key].$ref), 
                "undefined" != typeof val && this[key](val)); else {
                    subProps = props[key].computed, propName = "";
                    for (var i = 0; i < subProps.length; i++) propName = subProps[i].name, settingProps.hasOwnProperty(propName) && ("object" != typeof settingProps[propName] ? this.vm[propName](settingProps[propName]) : "undefined" != typeof settingProps[propName].$ref && (val = utils.resolveJsonValue(data, settingProps[propName].$ref), 
                    "undefined" != typeof val && this.vm[propName](val)), aggrKey[i] = "default" === this.vm[propName]() ? "" : this.vm[propName]());
                    this[key](aggrKey.join(" "));
                }
            }
        },
        trigger: function(event, data) {
            this.$view.trigger(event, data);
        }
    });
    return BaseWidget;
});