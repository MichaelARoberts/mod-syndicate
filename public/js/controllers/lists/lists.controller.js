$('.ui.dropdown').dropdown()
$('.ui.rating').rating();

app.controller('listsController', function($scope,$http,$window,$sce){

  $scope.init = function(){
    $http.get('/api/lists').then(function(res){
      $scope.lists = res.data
    })
  }

  $scope.createList = function(){
    var fd = new FormData()
    var url_id = new Date().valueOf()

    fd.append('url_id', url_id)
    fd.append('name', url_id)

    $http.post('/api/lists', fd,{
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).success(function(res){
      console.log(res)
      $window.location.href = '/lists/' + url_id
    })
  }

  $scope.modTotal = function(modData){
    var mods = JSON.parse(modData)
    return mods.length
  }


})
