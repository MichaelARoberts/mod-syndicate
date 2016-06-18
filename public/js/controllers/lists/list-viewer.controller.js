var app = angular.module('app', ['ngSanitize'])

app.controller('listViewerController', function($scope,$http,$location,$sce){
  var params = $location.absUrl().split('/')
  $scope.id = params[params.length - 1]

  $scope.init = function(){
    // Get the ID to load from the URL
    var params = $location.absUrl().split('/')
    $scope.url_id = params[params.length - 1]

    // Load the URL the user requested
    $http.get('/api/lists/' + $scope.url_id).then(
      function(res){
        $scope.name = res.data.name
        $scope.desc = res.data.html_desc
        $scope.creator = res.data.creator
        $scope.game = res.data.game
        $scope.image_loc = res.data.image_loc
        $scope.mods = JSON.parse(res.data.mods)
      }
    )
    console.log($scope.desc)
  }



})
