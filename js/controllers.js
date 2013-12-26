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

module.controller('EventCtrl', function ($scope, $routeParams, $history, db) {
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
    	$history.pop(2);
    };

});

module.controller('TasksCtrl', function ($scope, $location, db, settings) {
    var tasks = db.getAll('tasks');
    $scope.tasks = tasks;
    // $scope.tasks = _.groupBy(tasks, function (e) {
    //     return e.id;
    // });
    $scope.category = settings.get('category');

    $scope.$watch('category', function (newVal, oldVal) {
        console.log(newVal, oldVal);
        settings.update('category', newVal);
    });
    $scope.selectTask = function (e) {
        $location.path('/tasks/' + e.id);
    }
});

module.controller('TaskCtrl', function ($scope, $routeParams, db, $history) {
    var id = $routeParams.id;
    $scope.task = db.getOne('tasks', id);

    $scope.add = function (t) {
        db.add('tasks', t);
        $scope.back();
    };

    $scope.save = function (t) {
        db.update('tasks', t);
        $scope.back();
    };

    $scope.delete = function (t) {
        db.delete('tasks', t.id);
        $history.pop(2);
    };

});

module.controller('NotesCtrl', function ($scope, $history, db) {
    var notes = db.getAll('notes');
    $scope.notes = notes;

    $scope.selectNote = function (n) {
        $history.push('/notes/' + n.id);
    }
});

module.controller('NoteCtrl', function ($scope, $routeParams, $history, db) {
    var id = $routeParams.id;
    $scope.note = db.getOne('notes', id);

    $scope.add = function (n) {
        db.add('notes', n);
        $scope.back();
    };

    $scope.save = function (n) {
        db.update('notes', n);
        $scope.back();
    };

    $scope.delete = function (n) {
        db.delete('notes', n.id);
        $history.pop(2);
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
    $scope.menus = ["events", "tasks", "notes", "notifications", "settings"]
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