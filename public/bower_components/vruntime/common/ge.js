/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "common/base-class", "common/base-application", "common/data-validator", "common/utils", "common/logger", "common/containers/base-modal-container", "common/containers/base-view-container", "common/models/base-collection", "common/models/base-model", "common/services/base-data-service", "common/services/base-rest-data-service", "common/services/proxy-data-service", "common/services/realtime-data-service", "common/views/base-modal-view", "common/views/base-view", "common/views/base-widget", "common/views/chart-widget", "common/views/iids-widget", "sammy" ], function(BaseClass, BaseApplication, DataValidator, Utils, Logger, BaseModalContainer, BaseViewContainer, BaseCollection, BaseModel, BaseDataService, BaseRestDataService, BaseProxyDataService, BaseRealtimeDataService, BaseModalView, BaseView, BaseWidget, ChartWidget, IIDSWidget, sammy) {
    var ge = ge || {};
    ge = {
        namespace: function(ns) {
            var i, len, parts = ns.split("."), object = this;
            for ("ge" == parts[0] && (parts = parts.slice(1)), i = 0, len = parts.length; len > i; i++) object[parts[i]] || (object[parts[i]] = {}), 
            object = object[parts[i]];
            return object;
        }
    }, ge.Logger = Logger, ge.Common = {}, ge.Common.BaseClass = BaseClass, ge.Common.BaseApplication = BaseApplication, 
    ge.Common.Utils = Utils, ge.Common.DataValidator = DataValidator, ge.Common.BaseCollection = BaseCollection, 
    ge.Common.BaseModel = BaseModel, ge.Common.BaseModalContainer = BaseModalContainer, 
    ge.Common.BaseViewContainer = BaseViewContainer, ge.Common.BaseView = BaseView, 
    ge.Common.BaseModalView = BaseModalView, ge.Common.BaseWidget = BaseWidget, ge.Common.BaseDataService = BaseDataService, 
    ge.Common.BaseRestDataService = BaseRestDataService, ge.Common.BaseProxyDataService = BaseProxyDataService, 
    ge.Common.BaseRealtimeDataService = BaseRealtimeDataService, ge.Common.BaseChartWidget = ChartWidget, 
    ge.Common.BaseIIDSWidget = IIDSWidget;
    var cache = {};
    ge.namespace("ge.Utilities"), ge.Utilities = {};
    var key = "SXGWLZPDOKFIVUHJYTQBNMACERxswgzldpkoifuvjhtybqmncare";
    return ge.namespace("ge.Crypto"), ge.Crypto = {
        encode: function(uncoded) {
            uncoded = uncoded.toUpperCase().replace(/^\s+|\s+$/g, "");
            for (var chr, coded = "", i = uncoded.length - 1; i >= 0; i--) chr = uncoded.charCodeAt(i), 
            coded += chr >= 65 && 90 >= chr ? key.charAt(chr - 65 + 26 * Math.floor(2 * Math.random())) : String.fromCharCode(chr);
            return encodeURIComponent(coded);
        },
        decode: function(coded) {
            if (void 0 === coded) return !1;
            coded = decodeURIComponent(coded);
            for (var chr, uncoded = "", i = coded.length - 1; i >= 0; i--) chr = coded.charAt(i), 
            uncoded += chr >= "a" && "z" >= chr || chr >= "A" && "Z" >= chr ? String.fromCharCode(65 + key.indexOf(chr) % 26) : chr;
            return uncoded;
        }
    }, ge.namespace("ge.Templates"), ge.Templates = {
        tmpl: function tmpl(str, data) {
            var fn = /\W/.test(str) ? new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" + str.replace(/[\r\t\n]/g, " ").split("<%").join("	").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("	").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');") : cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML);
            return data ? fn(data) : fn;
        }
    }, ge.namespace("ge.Cookies"), ge.Cookies = {
        get: function(c_name) {
            var i, x, y, cookies = document.cookie.split(";");
            for (i = 0; i < cookies.length; i++) if (x = cookies[i].substr(0, cookies[i].indexOf("=")), 
            y = cookies[i].substr(cookies[i].indexOf("=") + 1), x = x.replace(/^\s+|\s+$/g, ""), 
            x == c_name) return unescape(y);
        },
        set: function(c_name, value, exdays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var c_value = escape(value) + (null == exdays ? "" : "; expires=" + exdate.toUTCString());
            return document.cookie = c_name + "=" + c_value;
        },
        clear: function(name) {
            return this.set(name, "");
        }
    }, ge.namespace("ge.MessageBus"), ge.MessageBus = {
        trigger: function(name, data) {
            sammy && sammy.trigger ? sammy.trigger(name, data) : $(window.document).trigger(name, data);
        },
        bind: function(name, callback) {
            sammy && sammy.bind ? sammy.bind(name, callback) : $(window.document).on(name, callback);
        }
    }, window.ge = ge, ge;
});