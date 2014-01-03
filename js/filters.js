var module = angular.module('filters', []);

module.filter('moment', function (moment) {
	return function (dateString) {
		return moment(dateString).calendar();
	}
});