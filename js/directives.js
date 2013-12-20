var module = angular.module('directives', []);

module.directive('currentTime', function($timeout, dateFilter) {
    return function(scope, element, attrs) {
        var format,
        timeoutId; 
        function updateTime() {
            element.text(dateFilter(new Date(), format));
        }
        
        scope.$watch(attrs.currentTime, function(value) {
            format = value;
            updateTime();
        });
        
        function updateLater() {
            timeoutId = $timeout(function() {
                updateTime();
                updateLater();
            }, 1000);
        }
        
        element.bind('$destroy', function() {
            $timeout.cancel(timeoutId);
        });
        
        updateLater();
    }
});