/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "common/v-widget-service", "common/v-binder-service", "common/v-datasource-service", "common/utils", "postal", "common/v-logger-service", "common/v-i18n-service" ], function(WidgetService, BinderService, DataSourceService, Utils, postal, LoggerService, i18nService) {
    "use strict";
    var vruntime = {
        init: function() {
            return window.vRuntime = this, window.VRuntime = this, this;
        },
        services: {
            widget: WidgetService,
            datasource: DataSourceService,
            binder: BinderService
        },
        widget: WidgetService,
        datasource: DataSourceService,
        binder: BinderService,
        logger: LoggerService,
        messages: i18nService.messages,
        postal: postal,
        utils: {
            datetime: {
                toLocal: Utils.convertDateToLocal,
                toISO: Utils.convertDateToISO
            },
            string: {
                slugify: Utils.slugify
            },
            browser: Utils.browser
        }
    };
    return vruntime.init();
});