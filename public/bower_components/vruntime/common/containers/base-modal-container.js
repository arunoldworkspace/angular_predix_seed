/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "common/containers/base-view-container" ], function(BaseViewContainer) {
    var BaseModalContainer = BaseViewContainer.extend({
        init: function() {
            this._super.apply(this, arguments);
            var defaults = {
                templatePath: "common/templates/containers/base-modal-container.html"
            };
            $.extend(this.options, defaults, arguments[1]), this.regions = {}, this.addRegion("main");
        },
        show: function() {
            for (var viewId in this.regions.main) this.regions.main[viewId].show();
        },
        hide: function() {
            for (var viewId in this.regions.main) this.regions.main[viewId].hide();
        }
    });
    return BaseModalContainer;
});