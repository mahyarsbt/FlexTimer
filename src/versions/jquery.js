import FlexTimer from '../index.js';

(function ($) {
  $.fn.flexTimer = function (options) {
    return this.each(function () {
      const instance = new FlexTimer(this, options);
      $(this).data('flexTimer', instance);
    });
  };
})(jQuery);
