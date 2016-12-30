/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "jquery", "knockout", "declarative-visualizations", "common/views/base-widget" ], function($, ko, d3, BaseWidget) {
    var IIDSWidget = BaseWidget.extend({
        init: function() {
            this._super.apply(this, arguments), this._createViewModelFromSchema.call(this);
        },
        render: function() {
            return ko.applyBindings(this, this.$view.get(0).children[0]), this.show(), this._initComponent(), 
            this.update({}), this;
        },
        update: function(data) {
            return this._updateViewModelWithData(this._transformData(data)), this.getComponent().update(this.$view.get(0).children[0]), 
            this;
        }
    });
    return IIDSWidget;
});