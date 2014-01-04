var module = angular.module('filters', []);

module.filter('moment', function (moment) {
	return function (dateString) {
		return moment(dateString).calendar();
	}
});

module.filter('capitalize', function() {
    return function(input, scope) {
        if (input!=null) {
            return input.substring(0,1).toUpperCase()+input.substring(1);
        }
    }
});
