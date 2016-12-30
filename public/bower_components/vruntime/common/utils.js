/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define(function() {
    var isOpera = !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0, isFirefox = "undefined" != typeof InstallTrigger, isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0, isChrome = !!window.chrome && !isOpera, isIE = !!document.documentMode || !1, isArray = function(value) {
        return value.constructor === Array;
    }, addAsPossiblePath = function(pathArray, path, value) {
        var type = typeof value;
        isArray(value) && (type = "array"), pathArray.push({
            path: path,
            type: type
        });
    }, shouldRecurse = function(value) {
        return isArray(value) ? !1 : value instanceof Object ? !0 : !1;
    }, Utils = {
        bind: function(context) {
            for (var funcList = Array.prototype.slice.call(arguments, 1), i = 0; i < funcList.length; i++) {
                var temp = context[funcList[i]];
                temp instanceof Function && (context[funcList[i]] = function() {
                    return temp.apply(context, arguments);
                });
            }
        },
        trim: function(obj) {
            for (var key in obj) "string" == typeof obj[key] && (obj[key] = obj[key] ? obj[key].trim() : "");
            return obj;
        },
        resolveJsonValue: function(data, jsonPath) {
            var value = data;
            if (jsonPath && jsonPath.length) {
                if ("$rawData" === jsonPath) return value;
                var jsonObjectArray = jsonPath.split(".");
                if (jsonObjectArray instanceof Array) for (var i = 0; i < jsonObjectArray.length; i++) value = value.hasOwnProperty(jsonObjectArray[i]) ? value[jsonObjectArray[i]] : "";
            }
            return value;
        },
        resolveJsonPath: function(data) {
            var pathArray = [], resolveJsonPath = function(rootPath, data) {
                for (var key in data) addAsPossiblePath(pathArray, rootPath + key, data[key]), shouldRecurse(data[key]) && resolveJsonPath(rootPath + key + ".", data[key]);
            };
            return addAsPossiblePath(pathArray, "$rawData", data), resolveJsonPath("", data), 
            pathArray;
        },
        isValidURL: function(url) {
            var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/?|cc:\\/\\/?(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
            return regex.test(url);
        },
        isValidURI: function(uri) {
            return new RegExp("^((cc:|https:|http:|[/][/]|www.)([a-z]|[A-Z]|[0-9]|[/.])*)$", "g").test(uri);
        },
        jsonToFormattedString: function(jsonObject) {
            if ("object" != typeof jsonObject) return jsonObject;
            try {
                return JSON.stringify(jsonObject, null, 4);
            } catch (ex) {
                return "error try to stringify json";
            }
        },
        getTypeFilteredOptions: function(options, type) {
            ("enum" == type || "textarea" == type) && (type = "string");
            for (var typeFilteredOptions = [], i = 0; i < options.length; i++) type == options[i].type ? typeFilteredOptions.push(options[i].path) : "string" == type && "number" == options[i].type && typeFilteredOptions.push(options[i].path);
            return typeFilteredOptions;
        },
        browser: {
            isOpera: isOpera,
            isFirefox: isFirefox,
            isSafari: isSafari,
            isChrome: isChrome,
            isIE: isIE
        },
        slugify: function(input) {
            return input || (input = ""), String(input).replace(/\W/g, "_").toLowerCase();
        },
        convertDateToLocal: function(date) {
            var uiDate = new Date(date);
            return uiDate;
        },
        convertDateToISO: function(date) {
            var convertedDate = new Date(Date.parse(date)).toISOString();
            return convertedDate;
        }
    };
    return Utils;
});