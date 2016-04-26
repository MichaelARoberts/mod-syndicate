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
app.controller('listCreator', function($scope,$http){

  // Eventually Fetch Mods from DB
  $scope.mods =  [
    {name: "Mod Name", dl: "www.someURL.data", info: "www.somedata.url"},
    {name: "Mod Name", dl: "www.someURL.data", info: "www.somedata.url"},
    {name: "Mod Name", dl: "www.someURL.data", info: "www.somedata.url"},
    {name: "Mod Name", dl: "www.someURL.data", info: "www.somedata.url"}
  ]

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

    return modSeries
  }

  // Save our data!
  $scope.saveData = function(){
    var fd = new FormData()
    var mods = $scope.getMods()

    console.log(mods)

    fd.append('mods', $scope.mods)
    fd.append('name', $scope.name)

    $http.post('/api/lists', fd, {
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    })

  }

})
