angular
    .module('brickhack', ['ngRoute'])
    .config(config);

function config($routeProvider) {
    console.log('test');
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'ApplicationController'
        })
        .when('/sign-up/basic', {
            templateUrl: 'partials/sign-up.html',
            controller: 'ApplicationController'
        })
        .when('/sign-up/mobile-number', {
            templateUrl: 'partials/mobile-number.html',
            controller: 'ApplicationController'
        })
        .when('/sign-up/music-preferences', {
            templateUrl: 'partials/music-preferences.html',
            controller: 'ApplicationController'
        })
        .when('/sign-in', {
            templateUrl: 'partials/sign-in.html',
            controller: 'ApplicationController'
        })
        .otherwise({
            redirectTo: '/'
        });

}