var app = angular.module('app', ['ngSanitize'])

app.controller('profileViewerController', function($scope, $http, $location){
  $scope.init = function(){
    var params = $location.absUrl().split('/')
    $scope.username = params[params.length - 1]

    $http.get('/api/users/' + $scope.username).then(
      function(res){
        $scope.user = res.data
      }
    )

    console.log($scope.user)
  }
})
