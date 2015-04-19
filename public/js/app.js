angular
    .module('brickhack', ['ngRoute', 'ui.bootstrap'])
    .config(config);

function config($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'ApplicationController'
        })
        .when('/sign-up/basic', {
            templateUrl: 'partials/sign-up.html',
            controller: 'RegistrationController'
        })
        .when('/sign-up/mobile-number', {
            templateUrl: 'partials/mobile-number.html',
            controller: 'RegistrationController'
        })
        .when('/sign-up/music-preferences', {
            templateUrl: 'partials/music-preferences.html',
            controller: 'RegistrationController'
        })
        .when('/sign-up/finish', {
            templateUrl: 'partials/finish.html',
            controller: 'RegistrationController'
        })
        .when('/sign-in', {
            templateUrl: 'partials/sign-in.html',
            controller: 'LoginController'
        })
        .otherwise({
            redirectTo: '/'
        });

}