var app = angular.module('app', ['ngSanitize'])

app.controller('modViewerController', function($scope, $http, $location){
  $scope.init = function(){
    var params = $location.absUrl().split('/')
    $scope.url_id = params[params.length - 1]

    $http.get('/api/mods/' + $scope.url_id).then(
      function(res){
        $scope.mods = res.data
      }
    )

  }
})