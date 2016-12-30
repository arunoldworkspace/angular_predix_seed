/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "require", "knockout", "jquery", "common/base-class" ], function(require, ko, $, BaseClass) {
    "use strict";
    var BaseView = BaseClass.extend({
        init: function() {
            var options = arguments[1] || {}, defaults = {
                templatePath: null,
                className: ""
            };
            this.id = arguments[0], this.errors = ko.observableArray(), this.options = $.extend(!0, {}, defaults, options), 
            this.$view = $("<div/>", {
                id: this.id,
                "class": this.options.className
            });
        },
        loadTemplate: function() {
            var self = this, dfr = $.Deferred(), html = "", templateName = "", templateFilename = "";
            if (this.options.templatePath && (templateName = this.options.templatePath.replace(/[/\\.]/g, "_"), 
            templateFilename = templateName.replace(/\W/g, "_").toLowerCase()), this.tmpl) dfr.resolve(self.$view); else {
                var templateCache = App.templates[templateName];
                templateCache || App._templates[templateName] && (templateCache = App._templates[templateName]()), 
                templateCache ? (self.$view.html(templateCache), self.tmpl = !0, dfr.resolve(self.$view)) : App._templates && App._templates[templateFilename] ? (html = App._templates[templateFilename](), 
                self.$view.html(html), self.tmpl = !0, dfr.resolve(self.$view)) : require([ "text!" + this.options.templatePath ], function(tmpl) {
                    self.$view.html(tmpl), self.tmpl = !0, App.templates[self.options.templatePath.replace(/[/\\.]/g, "_")] = tmpl, 
                    dfr.resolve(self.$view);
                });
            }
            return dfr.promise();
        },
        bindData: function(vm) {
            return vm ? ko.applyBindings(vm, document.getElementById(this.id)) : ko.applyBindings(this, document.getElementById(this.id)), 
            this;
        },
        afterRender: function() {
            return this;
        },
        show: function(options) {
            return this.$view.show(options), this;
        },
        hide: function(options) {
            return this.$view.hide(options), this;
        },
        clearErrors: function() {
            this.$view.find(".alert").removeClass("alert-error").hide(), this.errors([]);
        },
        showErrors: function(err) {
            var fieldLabel;
            this.clearErrors();
            for (var key in err.errors) fieldLabel = this.$view.find("[for='" + key + "']").text(), 
            this.errors.push({
                fieldId: key,
                fieldLabel: fieldLabel,
                errMsg: err.errors[key]
            });
            this.$view.find(".alert").addClass("alert-error").show();
        },
        publish: function(eventName, data) {
            App.router.trigger(eventName, data), $(document).trigger("App.*", {
                eventName: eventName,
                eventData: data
            });
        },
        subscribe: function(eventName, handler) {
            App.router.bind(eventName, handler);
        }
    });
    return BaseView;
});