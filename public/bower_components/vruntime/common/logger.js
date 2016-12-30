/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define(function() {
    var console = "object" == typeof window.console ? window.console : "", Logger = function() {
        function Logger(category) {
            this.category = category, Logger.prototype.setLevel(Logger.globalLevel);
        }
        return Logger.NONE = 4, Logger.ERROR = 3, Logger.WARN = 2, Logger.SUCCESS = 1, Logger.INFO = 0, 
        Logger.globalLevel = Logger.NONE, Logger.traceCaller = !1, Logger.getGlobalLevel = function() {
            return Logger.globalLevel;
        }, Logger.setGlobalLevel = function(level) {
            Logger.globalLevel = level;
        }, Logger.getCallerTracing = function() {
            return Logger.traceCaller;
        }, Logger.setCallerTracing = function(enable) {
            Logger.traceCaller = enable;
        }, Logger.listeners = [], Logger.addListener = function(listener) {
            Logger.listeners.push(listener);
        }, Logger.callListeners = function(level, category, message) {
            for (var i in Logger.listeners) Logger.listeners[i].call(this, level, category, message);
        }, Logger.prototype.category = "", Logger.prototype.getLevel = function() {
            return this.level;
        }, Logger.prototype.setLevel = function(level) {
            this.level = level;
        }, Logger.prototype.canLog = function(level) {
            return Logger.globalLevel < Logger.NONE && Logger.globalLevel <= level || this.level < Logger.NONE && this.level <= level;
        }, Logger.prototype.format = function(message) {
            var prefix = "";
            try {
                Logger.traceCaller && arguments.callee.caller.caller.$name && (prefix = "@" + arguments.callee.caller.caller.$name + " ");
            } catch (ex) {}
            return prefix + "[" + this.category + "] " + message.toString();
        }, Logger.prototype.error = function(message) {
            var fm = this.format(message);
            console && this.canLog(Logger.ERROR) && console.error(fm), Logger.callListeners(Logger.ERROR, this.category, message);
        }, Logger.prototype.warn = function(message) {
            var fm = this.format(message);
            console && this.canLog(Logger.WARN) && console.warn(fm), Logger.callListeners(Logger.WARN, this.category, message);
        }, Logger.prototype.success = function(message) {
            var fm = this.format(message);
            console && this.canLog(Logger.SUCCESS) && console.info(fm), Logger.callListeners(Logger.SUCCESS, this.category, message);
        }, Logger.prototype.info = function(message) {
            var fm = this.format(message);
            console && this.canLog(Logger.INFO) && console.log(fm), Logger.callListeners(Logger.INFO, this.category, message);
        }, Logger.prototype.log = Logger.prototype.info, Logger;
    }();
    return Logger;
});