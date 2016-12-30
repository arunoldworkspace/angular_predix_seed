/*
predix-workbench - 14.1.0 - Monday, June 16th, 2014, 2:54:17 PM 

Copyright © 2012-2014 General Electric Company. All rights reserved. 
The copyright to the computer software herein is the property of General Electric Company. The software may be used and/or copied only 
with the written permission of General Electric Company or in accordance with the terms and conditions stipulated in the agreement/contract under which the software has been supplied.
*/
define([ "jquery", "common/views/base-view", "bootstrap-modal" ], function($, BaseView) {
    $.fn.modal.Constructor.prototype.enforceFocus = function() {};
    var BaseModalView = BaseView.extend({
        init: function() {
            var defaults = {
                openOnShow: !1
            };
            return this._super.apply(this, arguments), this.options = $.extend(!0, {}, defaults, this.options), 
            this;
        },
        afterRender: function() {
            return this.$view.find(".modal").modal({
                show: !1,
                backdrop: "static"
            }), this.$view.find(".modal").on("shown", function() {
                var input = $(this).find("input[type=text]:first");
                input.length > 0 && input.focus();
            }), this;
        },
        show: function() {
            return this._super(), this.options.openOnShow === !0 && this.open(), this;
        },
        open: function() {
            var openModals = this.$view.find(".modal.in");
            if (!openModals.length) {
                var modalZIndex = this.getModalZIndex();
                this.$view.find(".modal").css("z-index", modalZIndex).modal("show");
                var $viewBackdrop = $(".modal-backdrop").filter("[data-viewid='" + this.id + "']");
                $viewBackdrop.length ? $viewBackdrop.css("z-index", 1e3 * $(".modal-backdrop").length + 50) : $(".modal-backdrop:not(div[data-viewid])").css("z-index", 1e3 * $(".modal-backdrop").length + 50).attr("data-viewid", this.id);
            }
        },
        hide: function() {
            return this.options.openOnShow && this.close(), this;
        },
        close: function(forceClose) {
            return this.$view.find(".modal").modal("hide"), forceClose ? $(".modal-backdrop[data-viewid='" + this.id + "']").remove() : void 0;
        },
        getModalZIndex: function() {
            return 2e3 * ($(document).find(".modal.in").length + 1);
        }
    });
    return BaseModalView;
});