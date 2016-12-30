/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "jquery", "knockout", "common/views/base-widget" ], function($, ko, BaseWidget) {
    var HighchartsIIDSWidget = BaseWidget.extend({
        init: function() {
            this._super.apply(this, arguments), this._createViewModelFromSchema.call(this);
        },
        _getChartOptions: function() {
            return {};
        },
        _getSeriesAndCategories: function() {
            return {};
        },
        _createErrorMessage: function(e) {
            var errorUrlIndex = e.indexOf(":");
            return parent.window.Messages("widget.highcharts.error") + e.substring(errorUrlIndex);
        },
        _initComponent: function(options) {
            var chartOptions = this._getChartOptions();
            $.extend(chartOptions, options), this.setComponent(new Highcharts.Chart(chartOptions));
        },
        render: function(options) {
            return ko.applyBindings(this, this.$view.get(0).children[0]), this.show(), this._updateViewModelWithData(this._transformData({})), 
            this._initComponent(options), this.update(this.data()), this;
        },
        update: function(data) {
            this._updateViewModelWithData(this._transformData(data));
            var seriesAndCategories = this._getSeriesAndCategories(), seriesArray = seriesAndCategories.series, categoriesArray = seriesAndCategories.categories;
            if (seriesArray && categoriesArray) {
                for (;this._component.series.length > 0; ) this._component.series[0].remove(!1);
                this._component.xAxis && this._component.xAxis[0] && categoriesArray.length && this._component.xAxis[0].setCategories(categoriesArray, !1);
                try {
                    for (var x = 0; x < seriesArray.length; x++) this._component.addSeries(seriesArray[x], !1);
                } catch (e) {
                    this.$view.empty();
                    var error = this._createErrorMessage(e);
                    this.$view.before("<div class='alert alert-error'>" + error + "</div>");
                }
                this._component.redraw();
            }
            return this;
        }
    });
    return HighchartsIIDSWidget;
});