angular
    .module('brickhack')
    .service('appService', appService);

function appService($http) {

    this.getGenres = function () {
        return $http.get('http://developer.echonest.com/api/v4/genre/list?api_key=2BAHYIYVDYCGJTE6U&format=json');
    };

    this.storeUserInformation = function (user) {
    	
    };
}