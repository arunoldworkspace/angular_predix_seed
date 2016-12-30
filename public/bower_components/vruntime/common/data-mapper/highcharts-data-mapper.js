/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "lodash" ], function(_) {
    var HighchartsDataMapper = function(options) {
        function translateData(formatAppropriately) {
            "Zeros" == dataPadding ? padDataWith(0) : "Nulls" == dataPadding && padDataWith(null);
            for (var workingSeries = {}, workingCategories = {}, i = 0; i < data.length; i++) {
                var dataPoint = data[i], seriesName = dataPoint[seriesKey];
                workingSeries.hasOwnProperty(seriesName) || (workingSeries[seriesName] = {
                    name: seriesName,
                    data: []
                });
                var xValue = dataPoint[xAxisKey], yValue = dataPoint[yAxisKey];
                formatAppropriately(workingSeries, workingCategories, seriesName, xValue, yValue);
            }
            for (var key in workingSeries) series.push(workingSeries[key]);
            for (var key in workingCategories) categories.push(workingCategories[key]);
        }
        function formatAsTuples(workingSeries, workingCategories, seriesName, xValue, yValue) {
            workingSeries[seriesName].data.push([ xValue, yValue ]);
        }
        function formatAsSeriesAndCategories(workingSeries, workingCategories, seriesName, xValue, yValue) {
            workingCategories.hasOwnProperty(xValue) || (workingCategories[xValue] = xValue), 
            workingSeries[seriesName].data.push(yValue);
        }
        function padDataWith(padValue) {
            for (var xAxisValues = _.chain(data).pluck(xAxisKey).uniq().value(), seriesNames = _.chain(data).pluck(seriesKey).uniq().value(), transformedData = [], i = 0; i < seriesNames.length; i++) {
                var seriesName = seriesNames[i], seriesIdentifyingProperties = {};
                seriesIdentifyingProperties[seriesKey] = seriesName;
                for (var xAxisIndexedDataPoints = _.chain(data).where(seriesIdentifyingProperties).indexBy(xAxisKey).value(), paddedSeries = [], j = 0; j < xAxisValues.length; j++) if (xAxisIndexedDataPoints.hasOwnProperty(xAxisValues[j])) paddedSeries.push(xAxisIndexedDataPoints[xAxisValues[j]]); else {
                    var paddingObject = {};
                    paddingObject[xAxisKey] = xAxisValues[j], paddingObject[seriesKey] = seriesName, 
                    paddingObject[yAxisKey] = padValue, paddedSeries.push(paddingObject);
                }
                transformedData = transformedData.concat(paddedSeries);
            }
            data = transformedData;
        }
        var xAxisKey, yAxisKey, seriesKey, dataPadding, data, categories = [], series = [];
        options && (xAxisKey = options.xAxisKey, yAxisKey = options.yAxisKey, seriesKey = options.seriesKey, 
        dataPadding = options.dataPadding, data = options.data), this.isNumerical = function() {
            if (data.length > 0) {
                var dataPoint = data[0];
                if ("string" == typeof dataPoint[xAxisKey]) return !1;
            }
            return !0;
        }, this.getSeriesAsTuples = function() {
            return xAxisKey && yAxisKey && seriesKey && dataPadding && data && translateData(formatAsTuples), 
            series;
        }, this.getSeriesAsArray = function() {
            return xAxisKey && yAxisKey && seriesKey && dataPadding && data && translateData(formatAsSeriesAndCategories), 
            series;
        }, this.getCategories = function() {
            return series.length <= 0 && xAxisKey && yAxisKey && seriesKey && dataPadding && data && translateData(this.isNumerical() ? formatAsTuples : formatAsSeriesAndCategories), 
            categories;
        };
    };
    return HighchartsDataMapper;
});