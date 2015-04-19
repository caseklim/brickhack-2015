angular
    .module('brickhack')
    .controller('ApplicationController', ApplicationController);

function ApplicationController($scope) {

	$scope.newUserCredentials = {
		email: null,
		password: null,
		phoneNumber: null,
		genres: null
	}
	
}