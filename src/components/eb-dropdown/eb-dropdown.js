/*
 @name: cwDropdown
 @description: Converts an Unorderlist ( UL > LI ) to a select box
 @version: 1.0.0
 @created: April 2017
 @by: ElationBase

 * HTML Structure  *
 // Trigger open modal
 <div class="eb-dropdown js-drop">
   <div class="eb-dropdown__trigger js-drop-trigger">
    <span class="js-selection-value">Grey</span>
   </div>
   <ul class="eb-dropdown__menu  js-drop-menu">
     <li><span class="js-drop-text">Brunswick Green</span></li>
     <li class="selected"><span class="js-drop-text">Charcoal</span></li>
     <li><span class="js-drop-text">Grey</span></li>
     <li><span class="js-drop-text">Nutmeg</span></li>
     <li><span class="js-drop-text">Brunswick Green</span></li>
     <li><span class="js-drop-text">Charcoal</span></li>
     <li><span class="js-drop-text">Grey</span></li>
     <li><span class="js-drop-text">Nutmeg</span></li>
   </ul>
 </div>
 */

(function ($, window, document) {
  'use strict';

  var cwDropdown = {
    selectors: {
      drop: '.js-drop',
      active: 'eb-dropdown--active',
      activeClass: '.eb-dropdown--active',
      trigger: '.js-drop-trigger',
      menu: '.js-drop-menu',
      body: 'body',
      selected: 'selected',
      value: '.js-selection-value',
      dropText: '.js-drop-text'
    },
    setPosition: function cwDropdownSetPosition($ele) {
      var triggerH = $ele.height();
      var $menu = $ele.siblings(this.selectors.menuClass);
      var menuH = $menu.height();
      var theH = (menuH / 2) - (triggerH / 2);
      return $menu.css('top', -theH);
    },
    open: function cwDropdownOpen($ele) {
      this.close($ele);
      this.setPosition($ele);
      return $ele.parent(this.selectors.drop).addClass(this.selectors.active);
    },
    close: function cwDropdownClose($ele) {
      return $(this.selectors.activeClass)
        .not($ele.parent(this.selectors.drop))
        .removeClass(this.selectors.active);
    },
    closeAll: function cwDropdownCloseAll() {
      return $(this.selectors.activeClass)
        .removeClass(this.selectors.active);
    },
    swapText: function cwDropdownSwapText($ele) {
      var text = $ele.children(this.selectors.dropText).text();
      $ele.parent().parent().find(this.selectors.value).html(text);
      $('.' + this.selectors.selected).removeClass(this.selectors.selected);
      $ele.addClass(this.selectors.selected);
    },
    init: function cwDropdownInit() {
      $(cwDropdown.selectors.body + ' *')
        .on('click', function () {
          if($(cwDropdown.selectors.drop).hasClass(cwDropdown.selectors.active)) {
            $(cwDropdown.selectors.activeClass).removeClass(cwDropdown.selectors.active);
          }
        });
      $(cwDropdown.selectors.body)
        .on('click', cwDropdown.selectors.trigger, function (event) {
          event.preventDefault();
          cwDropdown.open($(this));
        });
      $(cwDropdown.selectors.menu)
        .on('mousewheel DOMMouseScroll', function (event) {
          var oe = event.originalEvent;
          var delta = oe.wheelDelta || -oe.detail;
          this.scrollTop += (delta < 0 ? 1 : -1) * 30;
          event.preventDefault();
        });
      $(cwDropdown.selectors.body)
        .on('click', cwDropdown.selectors.menu + ' li', function (event) {
          event.preventDefault();
          cwDropdown.swapText($(this));
        });
    }
  };

  $(document).ready(cwDropdown.init);
}(window.jQuery, window, document));
