function loginCo($scope,userSv,$rootScope) {

	$scope.email			= '';
	$scope.username 		= '';
	$scope.firstname		= '';
	$scope.lastname			= '';
	$scope.password 		= '';
	$scope.password_confirm = '';
	$scope.remember			= '';
	$scope.conditions		= false;

	$scope.mode		= 'login';

	$scope.message = '';

	$rootScope.$on("unauthorized",function(){
		userSv.setUser({});
	});

	$scope.login = function() {

		if (!$scope.username.length) {
			$scope.message = 'username is required';
			return false;
		}

		if (!$scope.password.length) {
			$scope.message = 'password is required';
			return false;
		}

		$scope.message = '';
		userSv.login({username:$scope.username,password:$scope.password})
		.then(
			function(d){$scope.message = '';},
			function(d){
				console.log(d);
				$scope.message = d.message.text;
			}
		);
		return false;
	}

	$scope.register = function() {

		if (!$scope.email.length) {
			$scope.message = 'email is required';
			return false;
		}

		if (!$scope.username.length) {
			$scope.message = 'username is required';
			return false;
		}

		if (!$scope.firstname.length) {
			$scope.message = 'first name is required';
			return false;
		}

		if (!$scope.lastname.length) {
			$scope.message = 'last name is required';
			return false;
		}

		if (!$scope.password.length) {
			$scope.message = 'password is required';
			return false;
		}

		if (!$scope.password_confirm.length) {
			$scope.message = 'password confirmation is required';
			return false;
		}

		if (!$scope.conditions) {
			$scope.message = 'terms and conditions are required';
			return false;
		}

		$scope.message = '';
		userSv.register({
			email:$scope.email,
			username:$scope.username,
			firstname:$scope.firstname,
			lastname:$scope.lastname,
			password:$scope.password,
			password_confirm:$scope.password_confirm,
			conditions:$scope.conditions,
		})
		.then(function(d){
			$scope.message = d.message.text;
		});
		return false;
	}	

	$scope.setMode = function(mode) {
		$scope.message = '';
		if (mode == 'register') {
			$scope.mode = 'register';
			return;
		}
		$scope.mode = 'login';
	}
}