angular
    .module('brickhack')
    .controller('RegistrationController', RegistrationController);

function RegistrationController($scope, $location, appService) {
	
	//
	// Basic registration
	// 

	$scope.submitted = false;

	$scope.signUp = function (form) {
        if (form.$invalid) {
        	if (form.$error.email) {
        		$scope.message = {
        			type: 'danger',
        			content: 'That\'s not a valid email.'
        		};
        	} else if (form.$error.required) {
        		$scope.message = {
        			type: 'danger',
        			content: 'Please enter provide a value for both inputs.'
        		};
        	}
            return;
        }

        if ($scope.newUserCredentials.email == 'cklimkowsky@gmail.com') {
        	$scope.message = {
    			type: 'danger',
    			content: 'That email is already in use.'
    		};
        	return;
        } 

        $location.path('/sign-up/mobile-number');
	};

	//
	// Mobile phone
	//

	$scope.token = null;
	$scope.verified = false;

	$scope.savePhoneNumber = function (form) {
		if ($scope.newUserCredentials.phoneNumber) {
			var phoneRe = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/
	  		var digits = $scope.newUserCredentials.phoneNumber.replace(/\D/g, '');
	  		if (digits.match(phoneRe) == null) {
	  			$scope.message = {
        			type: 'danger',
        			content: 'That\'s not a valid phone number.'
        		};
	  			return;
			}
		}

		if (form.$error.required) {
        	$scope.message = {
    			type: 'danger',
    			content: 'Please enter a phone number.'
    		};
            return;
        }

		$scope.message = null;
		$scope.submitted = true;
	};

	$scope.verify = function () {
		$scope.verified = true;
		$scope.message = {
			type: 'success',
			content: 'You\'re all set! Click the button to continue.'
		};
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

	$scope.finishRegistration = function () {
		$scope.newUserCredentials.genres = $scope.selectedGenres;

		appService.storeUserInformation($scope.newUserCredentials)
			.success(function (result) {
				$location.path('/sign-up/finish');
			});
	}
}