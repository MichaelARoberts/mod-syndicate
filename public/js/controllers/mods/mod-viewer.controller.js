var app = angular.module('app', ['ngSanitize'])

app.controller('modViewerController', function($scope, $http, $location){
  $scope.init = function(){
    var params = $location.absUrl().split('/')
    $scope.url_id = params[params.length - 1]

    $http.get('/api/mods/' + $scope.url_id).then(
      function(res){
        $scope.mods = res.data
        $scope.name = res.data.name
        $scope.desc = res.data.html_desc
        $scope.creator = res.data.creator
        $scope.game = res.data.game
        $scope.image_locs = res.data.image_locs
      }
    )

    $http.get('/api/me').then(
      function(res){
        $scope.me = res.data
        $scope.created_lists = res.data.created_lists
      }
    )
  }
})
$('.ui.dropdown').dropdown();
