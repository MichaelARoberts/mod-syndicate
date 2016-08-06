var app = angular.module('app', ['ngSanitize'])

app.directive('ngFiles', ['$parse', function($parse){
  function fn_link(scope, element, attrs){
    var onChange = $parse(attrs.ngFiles)
    element.on('change', function(event){
      onChange(scope, {$files: event.target.files })
    })
  }
  return {
    link: fn_link
  }
}])

app.controller('modCreatorController', function($scope, $http, $location){
  $scope.fd = new FormData()

  $scope.init = function(){
    var params = $location.absUrl().split('/')
    $scope.url_id = params[params.length - 2]

    $http.get('/api/mods/' + $scope.url_id).then(
      function(res){
        $scope.mod = res.data
        $scope.name =  res.data.name,
        $scope.desc =  res.data.desc,
        $scope.game = res.data.game,
        $scope.isPrivate = res.data.isPrivate
      }
    )
  }

  $scope.getImages = function($files){
    angular.forEach($files, function (value, key) {
      $scope.fd.append('images_loc', value)
    });
  }

  $scope.getFile = function($files){
    angular.forEach($files, function (value, key) {
      $scope.fd.append('mod_file', value)
    });
  }

  // Checkbox Handler
  $('.ui.checkbox').checkbox({
    onChange: function() {
      if($('.ui.checkbox').checkbox('is checked')){
        $scope.isPrivate = true
      } else {
        $scope.isPrivate = false
      }
    }
  });

  $scope.saveData = function($files){
    var params = $location.absUrl().split('/')
    $scope.url_id = params[params.length - 2]

    if($scope.isPrivate === null || $scope.isPrivate === undefined){
      $scope.isPrivate = false
    }
    $scope.fd.append('isPrivate', $scope.isPrivate)
    $scope.fd.append('name', $scope.name)
    $scope.fd.append('desc', $scope.desc)
    $scope.fd.append('game', $scope.game)

    $http.put('/api/mods/' + $scope.url_id, $scope.fd, {
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).success(function(){
      $scope.init()
    })
  }
})
