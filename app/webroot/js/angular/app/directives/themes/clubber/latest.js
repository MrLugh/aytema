ayTemaDs.directive('latestPhotos',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/latest/photos.html',
        restrict : 'E',
        replace : true,
        controller:'latestPhotosCo',
        scope: {
            limit:'=',
            config:'=',
        },
        link: function(scope,element,attrs) {

        }
    }

}]);