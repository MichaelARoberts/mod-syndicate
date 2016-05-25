var app = angular.module('app', [])
app.controller('signupController', function($scope,$http, $location, $window){

  $scope.signup = function(){
    var fd = new FormData()

    fd.append('username', $scope.username)
    fd.append('password', $scope.password)
    fd.append('email', $scope.email)
    fd.append('fname', $scope.fname)
    fd.append('lname', $scope.lname)
    fd.append('age', $scope.age)

    $http.post('/api/users', fd,{
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).success(function(res){
      console.log(res)
      $window.location.href = '/login'
    })
  }
})
