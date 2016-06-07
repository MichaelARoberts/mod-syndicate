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
app.controller('listCreatorController', function($scope,$http, $location){

  $scope.init = function(){

    // Get the ID to load from the URL
    var params = $location.absUrl().split('/')
    $scope.id = params[params.length - 1]
    // Load the URL the user requested
    $scope.mods = [];

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

  // Save our data!
  $scope.saveData = function(){
    var params = $location.absUrl().split('/')
    $scope.id = params[params.length - 1]

    var fd = new FormData()
    var mods = $scope.getMods()
    console.log(mods)

    fd.append('mods', mods)
    fd.append('name', $scope.name)
    fd.append('desc', $scope.desc)
    fd.append('game', $scope.game)

    $http.put('/api/lists/' + $scope.id, fd, {
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).success(function(){
      console.log('Content Saved.')
    })

  }

})
