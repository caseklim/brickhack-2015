angular
    .module('brickhack')
    .service('appService', appService);

function appService($http) {

    this.getGenres = function () {
        return $http.get('http://developer.echonest.com/api/v4/genre/list?api_key=2BAHYIYVDYCGJTE6U&format=json');
    };

    this.create = function (user) {
    	return $http.post('/users', user);
    };

    this.verify = function (token) {
    	// return $http.post('/verify', token);
    };
}