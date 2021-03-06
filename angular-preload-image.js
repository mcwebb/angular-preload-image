angular.module('angular-preload-image', []);
angular.module('angular-preload-image').factory('preLoader', function(){
    return function (url, successCallback, errorCallback) {
        //Thank you Adriaan for this little snippet: http://www.bennadel.com/members/11887-adriaan.htm
        angular.element(new Image()).bind('load', function(){
            successCallback();
        }).bind('error', function(){
            errorCallback();
        }).attr('src', url);
    };
});
angular.module('angular-preload-image').directive('preloadImage', ['preLoader', function(preLoader){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var loadingImage = attrs.defaultImage || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRkRDQzM1Ij4NCiAgPGNpcmNsZSB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4IDApIiBjeD0iMCIgY3k9IjE2IiByPSIwIj4NCiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJyIiB2YWx1ZXM9IjA7IDQ7IDA7IDAiIGR1cj0iMS4ycyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIwIg0KICAgICAga2V5dGltZXM9IjA7MC4yOzAuNzsxIiBrZXlTcGxpbmVzPSIwLjIgMC4yIDAuNCAwLjg7MC4yIDAuNiAwLjQgMC44OzAuMiAwLjYgMC40IDAuOCIgY2FsY01vZGU9InNwbGluZSIgLz4NCiAgPC9jaXJjbGU+DQogIDxjaXJjbGUgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTYgMCkiIGN4PSIwIiBjeT0iMTYiIHI9IjAiPg0KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIHZhbHVlcz0iMDsgNDsgMDsgMCIgZHVyPSIxLjJzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgYmVnaW49IjAuMyINCiAgICAgIGtleXRpbWVzPSIwOzAuMjswLjc7MSIga2V5U3BsaW5lcz0iMC4yIDAuMiAwLjQgMC44OzAuMiAwLjYgMC40IDAuODswLjIgMC42IDAuNCAwLjgiIGNhbGNNb2RlPSJzcGxpbmUiIC8+DQogIDwvY2lyY2xlPg0KICA8Y2lyY2xlIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI0IDApIiBjeD0iMCIgY3k9IjE2IiByPSIwIj4NCiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJyIiB2YWx1ZXM9IjA7IDQ7IDA7IDAiIGR1cj0iMS4ycyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIwLjYiDQogICAgICBrZXl0aW1lcz0iMDswLjI7MC43OzEiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC42IDAuNCAwLjg7MC4yIDAuNiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPg0KICA8L2NpcmNsZT4NCjwvc3ZnPg==";

            attrs.$set('src', loadingImage);

            attrs.$observe('primarySrc', function (url) {
                if (!url) {
                    if (attrs.fallbackImage !== undefined) {
                        attrs.$set('src', attrs.fallbackImage);
                    }
                    return;
                } else {
                    attrs.$set('src', loadingImage);
                }
                preLoader(url, function () {
                    scope.$emit('image:load:success', url);
                    attrs.$set('src', url);
                }, function () {
                    scope.$emit('image:load:fail', url);
                    if (attrs.fallbackImage !== undefined) {
                        attrs.$set('src', attrs.fallbackImage);
                    }
                });
            });
        }
    };
}]);
angular.module('angular-preload-image').directive('preloadBgImage', ['preLoader', function(preLoader){
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            if (attrs.preloadBgImage !== undefined) {
                //Define default image
                scope.default = attrs.defaultImage || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wEWEygNWiLqlwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAMSURBVAjXY/j//z8ABf4C/tzMWecAAAAASUVORK5CYII=";
                element.css({
                    'background-image': 'url("' + scope.default + '")'
                });
                preLoader(attrs.preloadBgImage, function(){
                    element.css({
                        'background-image': 'url("' + attrs.preloadBgImage + '")'
                    });
                }, function(){
                    if (attrs.fallbackImage !== undefined) {
                        element.css({
                            'background-image': 'url("' + attrs.fallbackImage + '")'
                        });
                    }
                });
            }
        }
    };
}]);
