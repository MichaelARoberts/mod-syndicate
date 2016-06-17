var app = angular.module('app', [])
app.controller('modsController', function($scope, $http, $location, $window){

  $scope.init = function(){
    $http.get('/api/mods').then(
      function(res){
        $scope.mods = res.data
      }
    )
  }

  $scope.createMod = function(){
    var fd = new FormData()
    var url_id = new Date().valueOf()

    fd.append('url_id', url_id)
    fd.append('name', url_id)

    $http.post('/api/mods', fd,{
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).success(function(res){
      console.log(res)
      $window.location.href = '/mods/' + url_id
    })
  }

})
