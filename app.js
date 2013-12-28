var app = angular.module('tempus', ['ngRoute', 'ngAnimate', 'controllers', 'directives', 'services'])
    .config(['$routeProvider', function ($routeProvider) {
       $routeProvider
        .when('/lockscreen', {
            templateUrl: 'partials/lockscreen.html',
            controller: 'LockscreenCtrl'
        })
        .when('/notification', {
            templateUrl: 'partials/notification.html',
            controller: 'NotificationCtrl'
        })
        .when('/events', {
            templateUrl: 'partials/events.html',
            controller: 'EventsCtrl'
        })
        .when('/events/:date/:id', {
            templateUrl: 'partials/event.html',
            controller: 'EventCtrl'
        })
        .when('/events/add', {
            templateUrl: 'partials/add_event.html',
            controller: 'EventCtrl'
        })
        .when('/events/:date/:id/edit', {
            templateUrl: 'partials/edit_event.html',
            controller: 'EventCtrl'
        })
        .when('/events/:date/:id/delete', {
            templateUrl: 'partials/delete_event.html',
            controller: 'EventCtrl'
        })
        .when('/tasks', {
            templateUrl: 'partials/tasks.html',
            controller: 'TasksCtrl'
        })
        .when('/tasks/add', {
            templateUrl: 'partials/add_task.html',
            controller: 'TaskCtrl'
        })
        .when('/tasks/categories', {
            templateUrl: 'partials/tasks_views.html',
            controller: 'TasksCtrl'
        })
        .when('/tasks/:id', {
            templateUrl: 'partials/task.html',
            controller: 'TaskCtrl'
        })
		.when('/tasks/:id/edit', {
            templateUrl: 'partials/edit_task.html',
            controller: 'TaskCtrl'
        })
		.when('/tasks/:id/delete', {
            templateUrl: 'partials/delete_task.html',
            controller: 'TaskCtrl'
        })
        .when('/notes', {
            templateUrl: 'partials/notes.html',
            controller: 'NotesCtrl'
        })
        .when('/notes/add', {
            templateUrl: 'partials/add_note.html',
            controller: 'NoteCtrl'
        })
        .when('/notes/:id', {
            templateUrl: 'partials/note.html',
            controller: 'NoteCtrl'
        })
        .when('/notes/:id/edit', {
            templateUrl: 'partials/edit_note.html',
            controller: 'NoteCtrl'
        })
        .when('/notes/:id/delete', {
            templateUrl: 'partials/delete_note.html',
            controller: 'NoteCtrl'
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
            controller: 'SpeechCtrl'
        })
        .when('/listen/listened', {
            templateUrl: 'partials/micro_listened.html',
            controller: 'SpeechCtrl'
        })
        .when('/listen/add-event', {
            templateUrl: 'partials/add_speech_event.html',
            controller: 'SpeechCtrl'
        })
        .when('/keyboard', {
            templateUrl: 'partials/keyboard.html',
            controller: function ($scope) {
                $scope.message = '';
            }
        })
        .otherwise({
            redirectTo: 'lockscreen'
        });

    }]);


