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

app.controller('listCreatorController', function($scope,$http,$location,$window){

  $scope.init = function(){

    // Get the ID to load from the URL
    var params = $location.absUrl().split('/')
    $scope.url_id = params[params.length - 2]
    // Load the URL the user requested
    $scope.mods = [];
    $scope.fd = new FormData()

    $http.get('/api/lists/' + $scope.url_id).then(
      function(res){
        // If it's a new list, give the user 1 basic entry
        // If it's not a new list, load the data
        if(typeof res.data === "undefined" || res.data.mods === null || res.data.mods.length === 0){
          $scope.mods = [{name:'Mod Name', download:'URL', info:'URL'}]
        } else {
          $scope.name = res.data.name
          $scope.desc = res.data.desc
          $scope.creator = res.data.creator
          $scope.game = res.data.game
          $scope.mods = JSON.parse(res.data.mods)
          $scope.isPrivate = res.data.isPrivate
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

  $scope.getImages = function($files){
    angular.forEach($files, function (value, key) {
      $scope.fd.append('img', value)
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

  // Save our data!
  $scope.saveData = function($files){
    var params = $location.absUrl().split('/')
    $scope.url_id = params[params.length - 2]

    var mods = $scope.getMods()
    $scope.fd.append('mods', mods)
    $scope.fd.append('name', $scope.name)
    $scope.fd.append('desc', $scope.desc)
    $scope.fd.append('game', $scope.game)

    if($scope.isPrivate === null || $scope.isPrivate === undefined){
      $scope.isPrivate = false
    }
    $scope.fd.append('isPrivate', $scope.isPrivate)


    console.log($scope.isPrivate)

    $http.put('/api/lists/' + $scope.url_id, $scope.fd, {
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).success(function(){
      //$window.location.href = $location.absUrl()
      $scope.init()
    })

  }

})
