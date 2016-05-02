var rowTemplate = '<tr class="mod-row">\
    <td>\
      <div class="input-group">\
        <div class="input-group-addon">\
          <i class="fa fa-cube"/>\
        </div>\
        <input type="text" placeholder="Mod Name" class="form-control mod-name-input" onClick="this.select();"/>\
      </div>\
    </td>\
    <td>\
      <div class="input-group">\
        <div class="input-group-addon">\
          <i class="fa fa-download"/>\
        </div>\
        <input type="text" placeholder="Download URL" class="form-control mod-download-input" onClick="this.select();"/>\
      </div>\
    </td>\
    <td>\
      <div class="input-group">\
        <div class="input-group-addon">\
          <i class="fa fa-info-circle"/>\
        </div>\
        <input type="text" placeholder="Info URL" class="form-control mod-info-input" onClick="this.select();"/>\
      </div>\
    </td>\
  </tr>\
';

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

function fullArray(n) {
  var arr = Array.apply(null, Array(n));
  return arr.map(function (x, i) { return i });
}


// [================================]
//             Angular Stuff
// [================================]

var app = angular.module('app', [])
app.controller('listCreator', function($scope,$http, $location){

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
          var data = JSON.parse(res.data.mods)
          $scope.mods = data
        }

      }
    )
  }

  // Add rows
  $scope.addRows = function(number){
    var size = fullArray(number)
    for (let x of size){
      $('#modList').append(rowTemplate)
    }
  }

  // Remove rows
  $scope.removeRows = function(number){
    var size = fullArray(number)
    for (let x of size){
      let mods = $('.mod-row').toArray()
      let length = mods.length
      mods[length-1].remove();
    }
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
