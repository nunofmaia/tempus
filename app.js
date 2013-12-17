var app = angular.module('tempus', ['ngRoute', 'ngAnimate'])
    .config(['$routeProvider', function ($routeProvider) {
       $routeProvider
        .when('/lockscreen', {
            templateUrl: 'partials/lockscreen.html',
            controller: 'LockscreenCtrl'
        })
        .when('/events', {
            templateUrl: 'partials/events.html',
            controller: 'EventsCtrl'
        })
        .when('/event', {
            templateUrl: 'partials/event.html',
            controller: 'EventCtrl'
        })
        .when('/event/add', {
            templateUrl: 'partials/add_event.html',
            controller: 'EventCtrl'
        })
        .when('/event/edit', {
            templateUrl: 'partials/edit_event.html',
            controller: 'EditEventCtrl'
        })
        .when('/event/delete', {
            templateUrl: 'partials/delete_event.html',
            controller: 'EventsCtrl'
        })
	    .when('/event/delete', {
            templateUrl: 'partials/delete_event.html',
            controller: 'EventsCtrl'
        })
        .when('/settings', {
            templateUrl: 'partials/settings.html',
            controller: 'SettingsCtrl'
        })
        .when('/settings/profiles', {
            templateUrl: 'partials/profiles_settings.html',
            controller: 'SettingsCtrl'
        })
        .when('/home', {
            templateUrl: 'partials/homescreen.html',
            controller: 'HomeCtrl'
        })
	.when('/listen', {
            templateUrl: 'partials/micro_standby.html',
            controller: 'ListenCtrl'
        })
	.when('/listen/listened', {
            templateUrl: 'partials/micro_listened.html',
            controller: 'ListenCtrl'
        })
        .otherwise({
            redirectTo: 'lockscreen'
        })
	.when('/listen/add-event', {
            templateUrl: 'partials/add_speech_event.html',
            controller: 'ListenCtrl'
        })
    .otherwise({
            redirectTo: 'lockscreen'
        })
    }]);

app.controller('LockscreenCtrl', function ($scope) {

});

app.controller('EventsCtrl', function ($scope, $location) {


});

app.controller('EventCtrl', function ($scope) {
    var s = document.getElementById('select-add');

    $scope.addEvent = function () {
        var evt = {
            name: $scope.name,
            time: $scope.time,
            place: $scope.place,
            frequency: s.selectedIndex
        };

        $scope.days[1].events.push(evt);
        $scope.back();
    };

});

app.controller('EditEventCtrl', function ($scope, $location) {
    var s = document.getElementById('select-edit');
    var i = $scope.selectedEvent.event.frequency;
    s.options[i].selected = true;

    $scope.name = $scope.selectedEvent.event.name;
    $scope.date = $scope.selectedEvent.event.date;
    $scope.time = $scope.selectedEvent.event.time;
    $scope.place = $scope.selectedEvent.event.place;

    $scope.save = function () {
        console.log($scope.name);
        $scope.selectedEvent.event.name = $scope.name;       
        $scope.selectedEvent.event.date = $scope.date;       
        $scope.selectedEvent.event.time = $scope.time;       
        $scope.selectedEvent.event.place = $scope.place;       
        $scope.selectedEvent.event.frequency = s.selectedIndex;       

        $scope.back();
    };

});

app.controller('SettingsCtrl', function ($scope) {

});

app.controller('HomeCtrl', function ($scope) {

});

app.controller('ListenCtrl', function ($scope, $location, $timeout) {

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

app.controller('AppCtrl', function ($scope, $location) {
    var index = 0;
    $scope.menus = ["events", "tasks", "notifications", "settings"]
    $scope.menu = $scope.menus[index];

    $scope.hourFormat = 'HH:mm';
    $scope.dateFormat = 'EEEE, MMMM dd';
    
    $scope.selectedEvent = null;
    
    $scope.days = [
        {
            desc: 'Today',
            events: [
                {
                    name: 'Dinner with Jennifer',
                    time: '20:00',
                    date: '2013-12-13',
                    place: 'Sesame Street',
                    frequency: 2
                }
            ]
        },
        {
            desc: 'Tomorrow',
            events: [
                {
                    name: 'Christmas party',
                    time: '09:00',
                    date: '2013-12-14',
                    place: 'Hot Club',
                    frequency: 3
                }
            ]
        }
    ];

    
    $scope.editEvent = function () {
        $location.path('/event/edit');
    };

    $scope.removeEvent = function () {
        var p = $scope.selectedEvent.parent;
        var c = $scope.selectedEvent.child;
        $scope.days[p].events.splice(c, 1);

        $scope.selectedEvent = undefined;

        window.history.go(-2);
    };

    $scope.back = function () {
        var path = $location.path();
        if (path != '/home') {
            window.history.back(); 
        }
    };
    
    $scope.unlock = function () {
        var path = $location.path();
        if (path != '/lockscreen') {
            $location.path('/lockscreen').replace();
        } else {
            $scope.menu = 'events';
            index = 0;
            $location.path('/home').replace();
        }
    }
    
    $scope.speak = function () {
        var path = $location.path();
        if (path != '/lockscreen') {
            $location.path('/listen');
        }
    }
    
    $scope.selectEvent = function (parentIndex, index) {
        $scope.selectedEvent = {
            parent: parentIndex,
            child: index,
            event: $scope.days[parentIndex].events[index]
        };

        $location.path('/event');
    }

    $scope.nextMenu = function () {
        index = (index + 1) % $scope.menus.length;
        $scope.menu = $scope.menus[index];
    };

    $scope.profile = "default";

    $scope.changeProfile = function (profile) {
        $scope.profile = profile;
    }
});

app.directive('currentTime', function($timeout, dateFilter) {
    // return the directive link function. (compile function not needed)
    return function(scope, element, attrs) {
        var format,  // date format
        timeoutId; // timeoutId, so that we can cancel the time updates

// u    sed to update the UI
        function updateTime() {
            element.text(dateFilter(new Date(), format));
        }
        
        // watch the expression, and update the UI on change.
        scope.$watch(attrs.currentTime, function(value) {
            format = value;
            updateTime();
        });
        
        // schedule update in one second
        function updateLater() {
            // save the timeoutId for canceling
            timeoutId = $timeout(function() {
                updateTime(); // update DOM
                updateLater(); // schedule another update
            }, 1000);
        }
        
        // listen on DOM destroy (removal) event, and cancel the next UI update
        // to prevent updating time ofter the DOM element was removed.
        element.bind('$destroy', function() {
            $timeout.cancel(timeoutId);
        });
        
        updateLater(); // kick off the UI update process.
    }
});
