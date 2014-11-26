ayTemaDs.directive('themePhotographer',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/photographer/index.html',
        restrict : 'E',
        replace : true,
        controller:'themePhotographerCo',
        scope: true,
        link: function(scope,element,attrs) {

            var triggerBttn = angular.element(document.getElementById( 'trigger-overlay' ));
            var overlay = angular.element(document.querySelector( 'div.overlay' ));
            var closeBttn = overlay[0].querySelector( 'button.overlay-close');

            function toggleOverlay() {
                if( overlay.hasClass('open') ) {
                    overlay.removeClass('open');
                    overlay.addClass('close');
                    var onEndTransitionFn = function( ev ) {
                        if( support.transitions ) {
                            if( ev.propertyName !== 'visibility' ) return;
                            this.removeEventListener( transEndEventName, onEndTransitionFn );
                        }
                        overlay.removeClass('close');
                    };
                    if( support.transitions ) {
                        overlay[0].addEventListener( transEndEventName, onEndTransitionFn );
                    }
                    else {
                        onEndTransitionFn();
                    }
                }
                else if( !overlay.hasClass('close') ) {
                    overlay.addClass('open');
                }
            }            

            element.ready(function(){

                $(".panel-title a").click(function(e){
                   $('body').addClass('show-nav');
                   $('.overlay-door').addClass('open');
                   e.preventDefault();
                });

                $("#trigger-overlay").click(function(e) {
                    $('#menu .in').collapse('hide');
                    $('body').toggleClass('show-nav');
                    e.preventDefault();
                });

                transEndEventNames = {
                    'WebkitTransition': 'webkitTransitionEnd',
                    'MozTransition': 'transitionend',
                    'OTransition': 'oTransitionEnd',
                    'msTransition': 'MSTransitionEnd',
                    'transition': 'transitionend'
                },

                transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
                support = { transitions : Modernizr.csstransitions };

                triggerBttn[0].addEventListener( 'click', toggleOverlay );


                $(".video-menu").on('click', function(e) {
                    e.preventDefault();
                    var evt = document.createEvent('UIEvents');
                    evt.initUIEvent('resize', true, false,window,0);
                    window.dispatchEvent(evt); 
                });

                $(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
                    event.preventDefault();
                    return $(this).ekkoLightbox({
                        always_show_close: true,
                        gallery_parent_selector: '.gallery',
                    });
                });

            });

        }
    }

}]);


ayTemaDs.directive('fbComments',['$FB','$timeout',
function($FB,$timeout){
    return {
        templateUrl : getPath('tpl')+'/themes/photographer/comments.html',
        restrict : 'E',
        replace : true,
        link: function(scope,element,attrs) {

            element.ready(function(){
                $timeout(function(){
                    scope.$FB = $FB;
                    scope.commentsUrl       = attrs.href;
                    scope.commentsNumposts  = attrs.dataNumposts || 5 ;
                    scope.commentsColor     = attrs.dataColorscheme || 'light';

                    scope.$watch('$FB.loaded',function(value) {
                        if(value){
                            if (typeof $FB  != "undefined"){
                                $FB.XFBML.parse($('.fb-comments .fb_iframe_widget').get(0));
                                $FB.XFBML.parse($('.fb-comments-count .fb_iframe_widget').get(0));                                
                            }
                        }
                    },true);

                    scope.$apply();
                },0);
            });

        } 
    }

}]);