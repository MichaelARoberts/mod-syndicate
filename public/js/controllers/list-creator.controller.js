// [================================]
//             Utility
// [================================]

$('.save-btn').click(function(e){
  e.preventDefault()
  return false
})

var getModNames = function(){
  var modNames = $('.mod-name-input').map(function(){
    return this.value
  }).get()
  return modNames
}

var getModDownloadURLs = function(){
  var modDownloads = $('.mod-download-input').map(function(){
    return this.value
  }).get()
  return modDownloads
}

var getModInfoURLs = function(){
  var modInfo = $('.mod-info-input').map(function(){
    return this.value
  }).get()
  return modInfo
}


// [================================]
//             Angular
// [================================]

var app = angular.module('app', [])

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

app.controller('listCreatorController', function($scope,$http, $location){

  $scope.init = function(){

    // Get the ID to load from the URL
    var params = $location.absUrl().split('/')
    $scope.id = params[params.length - 1]
    // Load the URL the user requested
    $scope.mods = [];
    $scope.fd = new FormData()

    $http.get('/api/lists/' + $scope.id).then(
      function(res){
        // If it's a new list, give the user 1 basic entry
        // If it's not a new list, load the data
        if(typeof res.data === "undefined" || res.data.mods.length == 0){
          $scope.mods = [{name:'default',download:'URL',info:'URL'}]
        } else {
          $scope.name = res.data.name
          $scope.desc = res.data.desc
          $scope.creator = res.data.creator
          $scope.game = res.data.game
          $scope.mods = JSON.parse(res.data.mods)
        }
      }
    )
  }

  // Add rows
  $scope.addRow = function(){
    $scope.mods.push({name:"", download:"", info:""})
  }

  // Remove rows
  $scope.removeRow = function(){
    $scope.mods.pop()
  }

  // Fetch all the mod Data!
  $scope.getMods = function(){
    var modNames = getModNames()
    var modDownloadURLs = getModDownloadURLs()
    var modInfoURLs = getModInfoURLs()

    var modSeries = new Array

    for(i = 0; i < modNames.length; i++){
      var mod = {
        'name': modNames[i],
        'download' : modDownloadURLs[i],
        'info' : modInfoURLs[i]
      }
      modSeries.push(mod)
    }

    return JSON.stringify(modSeries)
  }

  $scope.getFiles = function($files){
    angular.forEach($files, function (value, key) {
      $scope.fd.append('img', value)
    });
  }

  // Save our data!
  $scope.saveData = function($files){
    var params = $location.absUrl().split('/')
    $scope.id = params[params.length - 1]

    var mods = $scope.getMods()

    $scope.fd.append('mods', mods)
    $scope.fd.append('name', $scope.name)
    $scope.fd.append('desc', $scope.desc)
    $scope.fd.append('game', $scope.game)

    $http.put('/api/lists/' + $scope.id, $scope.fd, {
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).success(function(){
      console.log('Content Saved.')
    })

  }

})
