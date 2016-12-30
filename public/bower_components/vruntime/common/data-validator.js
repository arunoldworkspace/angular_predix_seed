/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define(function() {
    var DataValidator = {
        isRequired: function(data, fieldName, errors) {
            return data && data[fieldName] && data[fieldName].length || (errors = errors || {}, 
            errors[fieldName] = Messages("validation.required")), errors;
        },
        isPatternValid: function(data, fieldName, pattern, errors) {
            return data && data[fieldName] && pattern.test(data[fieldName]) || (errors = errors || {}, 
            errors[fieldName] = Messages("validation.invalid")), errors;
        },
        isUrlValid: function(url) {
            var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
            return regex.test(url);
        },
        isNameValid: function(name) {
            var pattern = new RegExp(/^([a-zA-Z0-9 _\-]{2,19})$/g);
            return pattern.test(name);
        }
    };
    return DataValidator;
});