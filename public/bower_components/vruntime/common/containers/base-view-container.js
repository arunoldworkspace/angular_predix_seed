/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "require", "common/views/base-view" ], function(require, BaseView) {
    var BaseViewContainer = BaseView.extend({
        init: function() {
            arguments[0] = arguments[0] + "-container", arguments[1] = arguments[1] ? arguments[1] : {}, 
            arguments[1].className = ("views-container " + (arguments[1].className || "")).trim(), 
            this._super.apply(this, arguments);
            var defaults = {
                templatePath: "common/templates/containers/base-view-container.html"
            };
            $.extend(this.options, defaults, arguments[1] || {}), this.regions = {}, this.addRegion("header"), 
            this.addRegion("main-left"), this.addRegion("main-center"), this.addRegion("main-right"), 
            this.addRegion("footer");
        },
        afterRender: function() {},
        addRegion: function(regionId) {
            this.regions[regionId] = {};
        },
        addView: function(view, regionId) {
            var dfr = $.Deferred(), self = this;
            if (this.regions[regionId].hasOwnProperty(view.id)) dfr.resolve(); else {
                this.regions[regionId][view.id] = view;
                var $region = $("#" + self.id).find("div[data-region='" + regionId + "']");
                $.when(view.loadTemplate()).done(function(tmpl) {
                    $region.append(tmpl), view.afterRender().bindData(), dfr.resolve();
                });
            }
            return dfr.promise();
        },
        removeView: function() {},
        show: function(options) {
            return this.$view.show(options), this;
        },
        hide: function(options) {
            return this.$view.hide(options), this;
        },
        bindData: function() {
            for (var regionId in this.regions) for (var viewId in this.regions[regionId]) this.regions[regionId][viewId].bindData();
            return this;
        }
    });
    return BaseViewContainer;
});