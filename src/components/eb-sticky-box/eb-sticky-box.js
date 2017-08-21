/*
    @name: cwStickyBox
    @description: Stick an element as the user scrolls as stops relative to another element
    @version: 1.2
    @created: March, 2017
    @by: ElationBase

    * HTML Structure  *
    <article>
        <section class="stick-box-parent">
            <!-- Content Goes Here -->
        </section>
        <section class="stick-box">
            <!-- Content Goes Here -->
        </section>
    </article>

    * OPTIONS *

    stickBox
    (selector of the element you want to stick)
    Sticky Selector:        default: '.stick-box'
                            options: Selector

    parentBox
    (selector of the element you want to start and stopr the stick)
    Parent Selector:        default: '.stick-box-parent'
                            options: Selector

    fixClass
    (Specific class name of the fixed CSS .is-fixed { position: fixed; } )
    Sticky Class:           default: 'is-fixed'
                            options: Class Name

    absClass
    (Specific class name of the absolute CSS .is-absolute { position: absolute; bottom: 0; } )
    Absolute Class:         default: 'is-absolute'
                            options: Class Name

    offsetTop
    ( Offset top pixels + | - to the parentBox to stick the element )
    Extra pixels to stick:  default: 0
                            options: integer

    offsetBottom
    ( Offset bottom pixels + | - to the parentBox to stick the element )
    Extra pixels to Stop:   default: 0
                            options: integer

    * JS Call  *
    <script>
        (function($) {
            $('.stick-box').cwStickyScrollBox();
        })(jQuery);
    </script>

 */

(function ($, window, document) {
  $.fn.extend({
    cwStickyScrollBox: function (options) {
      // options for the plugin
      var defaults = {
        stickBox: '.stick-box',
        parentBox: '.stick-box-parent',
        absClass: 'is-absolute',
        fixClass: 'is-fixed',
        offsetTop: 0,
        offsetBottom: 0
      };

      options = $.extend(defaults, options);

      return this.each(function () {
        var o = options,
          $stickBox = $(o.stickBox),
          stickBoxHeight = $stickBox.height(),
          stickBoxTop = $stickBox.offset().top,
          theNumStick = stickBoxTop - $(window).scrollTop(),
          $parentBox = $(o.parentBox),
          parentBoxHeight = $parentBox.innerHeight(),
          parentBoxTop = ($parentBox.offset().top + parentBoxHeight) - (stickBoxHeight + o.offsetTop),
          theNumParent = parentBoxTop - $(window).scrollTop(),
          absClass = o.absClass,
          fixClass = o.fixClass;

        var stickCheckout = function () {
          theNumStick = stickBoxTop - $(window).scrollTop();
          theNumParent = parentBoxTop - $(window).scrollTop();
          $stickBox.each(function () {
            if (parentBoxHeight > stickBoxHeight) {
              if (theNumStick >= o.offsetTop) {
                if ($stickBox.hasClass(fixClass) || $stickBox.hasClass(absClass)) {
                  $stickBox.removeClass(fixClass);
                  $stickBox.removeClass(absClass);
                }
              } else {
                if (theNumParent < o.offsetBottom) {
                  if (!$stickBox.hasClass(absClass)) {
                    $stickBox.removeClass(fixClass);
                    $stickBox.addClass(absClass);
                  }
                } else {
                  if (!$stickBox.hasClass(fixClass)) {
                    $stickBox.addClass(fixClass);
                    $stickBox.removeClass(absClass);
                  }
                }
              }
            }
          });
        }
        if (window.addEventListener) {
          window.addEventListener('scroll', stickCheckout);
          window.addEventListener('resize', function() {
              stickBoxTop = $stickBox.offset().top;
              theNumStick = stickBoxTop - $(window).scrollTop();
              parentBoxHeight = $parentBox.innerHeight();
              parentBoxTop = ($parentBox.offset().top + parentBoxHeight) - (stickBoxHeight + o.offsetTop);
          });
        }
      });
    }
  });
}(window.jQuery, window, document));
