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


app.controller('profileCreatorController', function($scope, $http, $location){

  $scope.init = function(){
    var params = $location.absUrl().split('/')
    $scope.username = params[params.length - 1]

    $http.get('/api/users/' + $scope.username).then(
      function(res){
        $scope.user = res.data
      }
    )


  }

  $scope.getProfileImage = function($files){
    angular.forEach($files, function (value, key) {
      $scope.fd.append('imgs', value)
    });
  }

})
