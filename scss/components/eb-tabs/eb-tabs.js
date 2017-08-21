/*
 @name: cwTabs
 @description: Page tabs content
 @version: 1.0.1
 @created: Aug. 2016
 @by: Chewy Dev Team

 * HTML Structure  *
 <section class="cw-tabs">
     <nav class="cw-tabs__head">
         <ul>
             <li><a href="#{{YOUR-TARGET-1}}" data-tab-target="{{YOUR-TARGET-1}}">{{TAB-NAME-1}}</a></li>
             <li><a href="#{{YOUR-TARGET-2}}" data-tab-target="{{YOUR-TARGET-2}}">{{TAB-NAME-2}}</a></li>
         </ul>
     </nav>
     <div class="cw-tabs__body">
         <article id="{{YOUR-TARGET-1}}" data-tab-content="{{YOUR-TARGET-1}}">
             <h2>{{TAB-NAME-1}}</h2>
             <p>{{TAB-CONTENT-1}}</p>
         </article>
         <article id="{{YOUR-TARGET-2}}" data-tab-content="{{YOUR-TARGET-2}}">
             <h2>{{TAB-NAME-2}}</h2>
             <p>{{TAB-CONTENT-2}}</p>
         </article>
     </div>
 </section>

 * OPTIONS * add class to .cw-tab *
 Size        //      Default: large     //      Options: .cw-tab--sm
 */

(function($, window, document) {
    "use strict";

    var visibleClass = 'cw-tab--visible',
        hiddenClass = 'cw-tab--hidden',
        tabContent = '[data-tab-content]',
        tabs = '.cw-tabs__head li';

    var cwTab = {
        set: function () {
            $(tabContent + ':not(:first-child)').addClass(hiddenClass);
            $(tabContent + ':first-child').addClass(visibleClass);
            $(tabs).removeClass(visibleClass);
            $(tabs + ':first-child').addClass(visibleClass);
        },
        switch: function (target, $ele) {
            $(tabContent).removeClass(visibleClass).addClass(hiddenClass);
            $(target).removeClass(hiddenClass).addClass(visibleClass);
            $(tabs).removeClass(visibleClass);
            $ele.addClass(visibleClass);
        },
    };

    /* Open to public functions Tab Set ( Use in product.js )*/
    // Usage: $.publish('cwTab.set');
    $.subscribe('cwTab.set',function(_){
        cwTab.set();
    });


    $(document).ready(function(){

        cwTab.set();

        // Switch tab, all tag elevents with the data attribute "data-tab-content"
        $('.cw-tabs, .product-bottom').on('click', '[data-tab-target]', function(event) {
            event.preventDefault();
            // Read the value of the attribute "data-tab-content" and set link variable
            var target = '[data-tab-content="' + $(this).data('tab-target') + '"]';
            var $ele = $(this).parent();
            // Switch tab object function
            cwTab.switch(target, $ele);
        });

    });

}(window.jQuery, window, document));
