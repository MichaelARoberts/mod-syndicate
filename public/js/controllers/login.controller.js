var app = angular.module('app', [])
app.controller('loginController', function($scope,$http, $location){

  $scope.login = function(){
    var fd = new FormData()

    fd.append('username', $scope.username)
    fd.append('password', $scope.password)

    $http.post('/api/users/' + $scope.username, fd,{
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).success(function(res){
      console.log(res)
      $window.location.href = '/'
    })

  }
})
