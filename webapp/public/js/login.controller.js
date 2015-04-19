angular
    .module('brickhack')
    .controller('LoginController', LoginController);

function LoginController($scope, $location) {
	
	$scope.submitted = false;

	$scope.credentials = {
		email: null,
		password: null
	};

	$scope.logIn = function (form) {
        $scope.submitted = true;

        if (form.$invalid) {
        	if (form.$error.email) {
        		$scope.message = 'Please enter a valid email.';
        	} else if (form.$error.required) {
        		$scope.message = 'Please enter provide a value for both inputs.';
        	}
            return;
        }

        if ($scope.credentials.email == 'cklimkowsky@gmail.com' && $scope.credentials.password == 'password') {
        	$scope.submitted = false;
        	// TODO: Redirect the user to their home page
        } else {
        	$scope.message = 'Incorrect username or password.';
        	return;
        }
	};
}