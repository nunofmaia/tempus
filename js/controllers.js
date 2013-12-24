var module = angular.module('controllers', []);

module.controller('LockscreenCtrl', function ($scope) {

});

module.controller('EventsCtrl', function ($scope, $location, db, _) {
	var events = db.getAll('events');
	$scope.events = _.groupBy(events, function (e) {
		return e.date;
	});

	$scope.selectEvent = function (e) {
		$location.path('/events/' + e.date + '/' + e.id);
	}

});

module.controller('EventCtrl', function ($scope, $location, $routeParams, db) {
	var date = $routeParams.date;
	var id = $routeParams.id;
	$scope.evt = db.getOne('events', id);

    var s = document.getElementById('select-add');

    $scope.add = function (e) {
    	var s = document.getElementById('select-add');
        var evt = {
            name: e.name,
            time: e.time,
            date: e.date,
            place: e.place,
            frequency: s.selectedIndex
        };

        db.add('events', evt);
        $scope.back();
    };

    $scope.save = function (e) {
    	var s = document.getElementById('select-edit');
    	var evt = {
    		id: e.id,
            name: e.name,
            time: e.time,
            date: e.date,
            place: e.place,
            frequency: s.selectedIndex
        };

    	db.update('events', evt);
    	$scope.back();
    };

    $scope.delete = function (e) {
    	db.delete('events', e.id);
    	$location.path('/events').replace();
    };

});

module.controller('SettingsCtrl', function ($scope, settings) {
    $scope.profile = settings.get('profile');

    $scope.$watch('profile', function (newVal, oldVal) {
        console.log(newVal, oldVal);
        settings.update('profile', newVal);
    });

});

module.controller('HomeCtrl', function ($scope) {

});

module.controller('ListenCtrl', function ($scope, $location, $timeout) {

    $scope.name = 'Meeting with John';
    $scope.time = '15:00';
    $scope.date = '2013-12-14';

    $scope.listen = function () {
        console.log('Listening...');
        $timeout(function () {
            $location.path('/listen/listened').replace();
        }, 5000);
    };

    $scope.confirm = function () {
        console.log('Listening...');
        $timeout(function () {
            $location.path('/listen/add-event').replace();
        }, 3000);
    };

    $scope.acceptEvent = function () {
        var s = document.getElementById('select-speech');
        var evt = {
            name: $scope.name,
            time: $scope.time,
            date: $scope.date,
            place: $scope.place,
            frequency: s.selectedIndex
        };

        $scope.days[1].events.push(evt);

        $location.path('/events').replace();

    };


});

module.controller('AppCtrl', function ($scope, $rootScope, $location, $history) {
    var index = 0;
    $scope.menus = ["events", "tasks", "notifications", "settings"]
    $scope.menu = $scope.menus[index];

    $scope.hourFormat = 'HH:mm';
    $scope.dateFormat = 'EEEE, MMMM dd';


    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        if (!$history.init($location.path())) {
            $history.push($location.path());
        }

        $history.dump();
    });

    $scope.back = function () {
        var path = $location.path();
        if (path != '/home') {
            $history.pop();
        }
    };

    $scope.unlock = function () {
        var path = $location.path();
        $history.erase();

        if (path != '/lockscreen') {
            $history.push('/lockscreen');
        } else {
            $scope.menu = 'events';
            index = 0;
            $history.push('/home');
        }
    }

    $scope.speak = function () {
        var path = $location.path();
        if (path != '/lockscreen') {
            $location.path('/listen');
        }
    }


    $scope.nextMenu = function () {
        index = (index + 1) % $scope.menus.length;
        $scope.menu = $scope.menus[index];
    };

    //$scope.profile = "default";

    $scope.changeProfile = function (profile) {
        $scope.profile = profile;
    }
});