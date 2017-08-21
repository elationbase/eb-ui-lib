/*
 @name: cwModal
 @description: Simple modal window with transition options
 @version: 1.2.3
 @created: Oct. 2016
 @by: Chewy Dev Team

 * HTML Structure  *
 // Trigger open modal
 <a href="#" data-modal-target="my-modal-ID">Open Modal ID</a>
 // Modal Window
 <aside id="my-modal-ID" class="cw-modal">
 <div class="cw-modal-mask"></div>
 <div class="cw-modal-wrap">
 <div class="cw-modal-body">
 <header>
 <h2>Title Goes Here (not mandatory)</h2>
 <a href="#" class="cw-modal-close"></a>
 </header>
 <div class="cw-modal-content">
 <!-- Content Goes Here -->
 </div>
 </div>
 </div>
 </aside>

 * OPTIONS * add classes to aside.cw-modal *
 Size        //      Default: medium     //      Options: .cw-modal-sm || .cw-modal-lg
 Transition  //      Default: fade       //      Options: .cw-modal-slide || .cw-modal-grow || .cw-modal-shrink
 Color       //      Default: dark       //      Options: .cw-modal-light
 Time        //      Default: normal     //      Options: .cw-modal-slow || .cw-modal-fast


 * Optional external JS Calls  *
 <script>
 // Trigger open modal
 $('MY-SELECTOR').on('click', this, function() {
 $.publish('cwModal.launch', {target:'#my-modal-ID'});
 });
 // Trigger close modal
 $('MY-SELECTOR').on('click', this, function() {
 $.publish('cwModal.close');
 });
 </script>

 */

(function($, window, document) {
    "use strict";
    var winWidth, winHeight, modalWidth, modalHeight;
    var openModal;
    var cwModal = {
        launch: function (ele) {
            openModal = ele;
            $(ele).addClass('cw-modal-active');
            setTimeout(function(){
                $(ele).addClass('cw-modal-visible');
                cwModal.setPosition(ele);
            },10);
        },
        close: function (time) {
            $('.cw-modal').removeClass('cw-modal-visible');
            setTimeout(function(){
                $('.cw-modal').removeClass('cw-modal-active');
            }, time/2);
        },
        setPosition: function() {
            winWidth = $(window).width()/ 2;
            winHeight = $(window).height()/ 2;
            modalWidth = $(openModal + ' .cw-modal-body').width()/ 2;
            modalHeight = $(openModal + ' .cw-modal-body').height()/2;
            $(openModal + ' .cw-modal-wrap').css('left', winWidth - modalWidth);
            $(openModal + ' .cw-modal-content').css('maxHeight', (winHeight *2) - 100);
            if (modalHeight < winHeight) {
                $(openModal + ' .cw-modal-wrap').css('top', winHeight - modalHeight);
            }
        }
    };

    /* Open to public functions Modal Open and Close */
    $.subscribe('cwModal.launch',function(_, data){
        cwModal.launch(data.target);
    });
    $.subscribe('cwModal.close',function(_){
        cwModal.close();
    });
    $.subscribe('cwModal.setPosition',function(_){
        cwModal.setPosition();
    });


    $(document).ready(function(){

        // default transition time ms
        var time = 400;

        // Open Modal win with all tag elevents with the attribute "data-modal-target"
        $('body').on('click', '[data-modal-target]', this, function(event) {
            event.preventDefault();
            // Read the value of the attribute "data-modal-target"
            var target = '#' + $(this).data('modal-target');
            // Check class to set the speed of transition
            if ($(target).hasClass('cw-modal-fast')) {
                time = 200;
            } else if ($(target).hasClass('cw-modal-slow')) {
                time = 600;
            }
            // Open modal window object function
            cwModal.launch(target, time);
        });

        // Close Modal win with all elevents with .cw-modal-close" and ".cw-modal-mask" class
        $('body').on('click', '.cw-modal-close, .cw-modal-mask', this, function(event) {
            event.preventDefault();
            cwModal.close(time);
        });

        // Close Modal win with esc key. (BugFix: Use of keydown instead of keyup, to get the fullscreen mode on Chrome 48 Windows).
        $(document).keydown(function(event) {
            // Check key is esc && check modal win is open && check if video is not in full screen mode
            if (event.keyCode == 27 && $('.cw-modal').is(':visible') && window.innerHeight !== screen.height ) {
                // Close modal window object function
                cwModal.close(time);
            }
        });

        $(window).on("orientationchange", function() {
            if ($('.cw-modal').is(':visible')) {
                // Re-set modal position to center of window
                cwModal.setPosition();
                // setTimeout is temporary solution until we get a proper event chain
                setTimeout(function() {
                    cwModal.setPosition();
                }, 200);
            }
        });

    });


}(window.jQuery, window, document));
