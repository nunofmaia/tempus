var app = angular.module('tempus', ['ngRoute', 'ngAnimate', 'controllers', 'directives', 'services'])
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


