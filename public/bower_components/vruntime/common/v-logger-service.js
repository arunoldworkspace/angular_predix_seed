/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "common/logger", "common/utils" ], function(Logger, Utils) {
    "use strict";
    var _loggerInstances = {}, create = function(category) {
        return _loggerInstances[Utils.slugify(category)] ? _loggerInstances[Utils.slugify(category)] : _loggerInstances[Utils.slugify(category)] = new Logger(Utils.slugify(category));
    }, getInstance = function(category) {
        return _loggerInstances[Utils.slugify(category)] ? _loggerInstances[Utils.slugify(category)] : null;
    };
    return {
        create: create,
        getInstance: getInstance,
        global: Logger
    };
});