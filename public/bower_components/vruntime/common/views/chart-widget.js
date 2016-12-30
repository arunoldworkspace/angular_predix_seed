/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "jquery", "common/views/base-widget" ], function($, BaseWidget) {
    var ChartWidget = BaseWidget.extend({
        beforeRender: function() {
            return this.$view.addClass("module-highcharts vwidget"), this;
        },
        render: function() {
            return this._super.apply(this, arguments), this.update(this.widgetSettings.data), 
            this;
        },
        afterRender: function() {
            var self = this;
            return this.$view.parent().resize(function() {
                var module = self.$view.parent().width() - 30;
                self.getComponent().setSize(module, self.$view.parent().height() - 30, !1);
            }).resize(), this;
        },
        _getCategories: function(data) {
            var categoriesArray = [];
            if (this.widgetSettings.X_AXIS) {
                var xAxis = this.widgetSettings.X_AXIS;
                if (data instanceof Array) for (var i = 0; i < data.length; i++) data[i].hasOwnProperty(xAxis) && categoriesArray.push(data[i][xAxis]);
            }
            return categoriesArray;
        },
        update: function(rawData) {
            var columnJsonArray = this._transformData(rawData);
            if (columnJsonArray instanceof Array && columnJsonArray.length) {
                for (;this._component.series.length > 0; ) this._component.series[0].remove(!1);
                if (this._component.xAxis && this._component.xAxis[0]) {
                    var categoriesArray = this._getCategories(rawData);
                    categoriesArray.length && this._component.xAxis[0].setCategories(categoriesArray, !1);
                }
                for (var x = 0; x < columnJsonArray.length; x++) {
                    var details = columnJsonArray[x], data = details.data;
                    try {
                        this._component.addSeries(details, !1);
                    } catch (e) {
                        var dataArray = [];
                        try {
                            if (data instanceof Array && data[0] instanceof Array) {
                                for (var i = 0; i < data.length; i++) {
                                    var dataPoint = data[i];
                                    dataPoint instanceof Array && (dataArray[i] = {
                                        y: dataPoint[0],
                                        name: dataPoint[1]
                                    });
                                }
                                details.data = dataArray, this._component.addSeries(details);
                            } else details.data = eval(data), this._component.addSeries(details);
                        } catch (ee) {
                            logger.warn(chart.title.text + ": " + ee);
                        }
                    }
                }
                this._component.redraw();
            }
        },
        _initComponent: function() {}
    });
    return ChartWidget;
});