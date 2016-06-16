var app = angular.module('app', [])

app.controller('listViewerController', function($scope,$http, $location){
  var params = $location.absUrl().split('/')
  $scope.id = params[params.length - 1]

  $scope.init = function(){
    // Get the ID to load from the URL
    var params = $location.absUrl().split('/')
    $scope.id = params[params.length - 1]
    // Load the URL the user requested
    $scope.mods = [];
    $http.get('/api/lists/' + $scope.id).then(
      function(res){
        $scope.name = res.data.name
        $scope.desc = res.data.desc
        $scope.creator = res.data.creator
        $scope.game = res.data.game
        $scope.image_loc = res.data.image_loc
        $scope.mods = JSON.parse(res.data.mods)
      }
    )
  }



})