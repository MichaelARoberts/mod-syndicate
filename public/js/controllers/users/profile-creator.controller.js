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
    $scope.fd = new FormData()
    var params = $location.absUrl().split('/')
    $scope.username = params[params.length - 1]


    $http.get('/api/users/' + $scope.username).then(
      function(res){
        $scope.user = res.data
        $scope.fname = res.data.fname
        $scope.lname = res.data.lname
        $scope.email = res.data.email
        $scope.bio = res.data.bio
        $scope.twitter = res.data.twitter_link
        $scope.facebook = res.data.facebook_link
      }
    )
  }

  $scope.getProfileImage = function($files){
    angular.forEach($files, function (value, key) {
      $scope.fd.append('profile_pic_location', value)
    });
  }

  $scope.saveUser = function(){
    $scope.fd.append('fname', $scope.fname)
    $scope.fd.append('lname', $scope.lname)
    $scope.fd.append('email', $scope.email)
    $scope.fd.append('bio', $scope.bio)
    $scope.fd.append('twitter_link', $scope.twitter)
    $scope.fd.append('facebook_link', $scope.facebook)

    $http.put('/api/users/' + $scope.username, $scope.fd, {
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).success(function(){
      console.log('Content Saved.')
    })
  }

})
