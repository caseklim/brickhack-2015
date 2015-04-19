angular
    .module('brickhack')
    .controller('RegistrationController', RegistrationController);

function RegistrationController($scope, $location, appService) {
	
	//
	// Basic registration
	// 

	$scope.submitted = false;

	$scope.credentials = {
		email: null,
		password: null
	};

	$scope.signUp = function (form) {
        $scope.submitted = true;

        if (form.$invalid) {
        	if (form.$error.email) {
        		$scope.message = 'Please enter a valid email.';
        	} else if (form.$error.required) {
        		$scope.message = 'Please enter provide a value for both inputs.';
        	}
            return;
        }

        if ($scope.credentials.email == 'cklimkowsky@gmail.com') {
        	$scope.message = 'That email address is already in use.';
        	return;
        } else {
        	$scope.submitted = false;
        }

        $location.path('/sign-up/mobile-number');
	};

	//
	// Music preferences
	//

	$scope.selectedGenre = null;

	appService.getGenres()
		.success(function (result) {
			$scope.genres = result.response.genres;
		});

	$scope.selectedGenres = [];

	$scope.onGenreSelect = function ($item, $model, $label) {
		$scope.selectedGenres.push($item);
		$scope.selectedGenre = null;
	};

	$scope.removeGenre = function (genre) {
		for (var i = 0; i < $scope.selectedGenres.length; i++) {
			if ($scope.selectedGenres[i].name == genre.name) {
				$scope.selectedGenres.splice(i, 1);
				return;
			}
		};
	};
}