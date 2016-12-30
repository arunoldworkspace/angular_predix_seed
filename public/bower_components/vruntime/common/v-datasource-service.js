/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "common/services/proxy-data-service", "common/services/realtime-data-service", "common/utils", "./v-logger-service", "./v-i18n-service" ], function(ProxyDataEventService, ProxyRealTimeEventService, Utils) {
    "use strict";
    var isWebsocketProtocal = function(url) {
        return url && url.length && url.length > 0 && (url = url.toLowerCase(), "ws://" === url.substring(0, 5) || "wss://" === url.substring(0, 6)) ? !0 : !1;
    }, dataSourceInstances = {}, create = function(dataSourceName, baseURL, settings) {
        var dataSourceName = Utils.slugify(dataSourceName);
        return dataSourceInstances[dataSourceName] instanceof ProxyDataEventService && dataSourceInstances[dataSourceName] instanceof ProxyRealTimeEventService || (dataSourceInstances[dataSourceName] = isWebsocketProtocal(baseURL) ? new ProxyRealTimeEventService(dataSourceName, baseURL, settings) : new ProxyDataEventService(dataSourceName, baseURL, settings)), 
        dataSourceInstances[dataSourceName];
    }, get = function(dataSourceName) {
        return getInstance(dataSourceName);
    }, getInstance = function(dataSourceName) {
        var datasource = dataSourceInstances[Utils.slugify(dataSourceName)];
        return datasource;
    }, destroy = function(dataSourceName) {
        dataSourceName && (dataSourceName = Utils.slugify(dataSourceName), "undefined" != typeof get(dataSourceName) && delete dataSourceInstances[dataSourceName]);
    }, destroyAll = function() {
        dataSourceInstances = {};
    }, DataSourceService = {
        create: create,
        get: get,
        getInstance: getInstance,
        destroy: destroy,
        destroyAll: destroyAll
    };
    return DataSourceService;
});