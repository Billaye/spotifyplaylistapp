// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
( function(){

  var app = angular.module('app', ['ionic']);


  var allPlaylist = angular.fromJson(window.localStorage['allplaylist'] || '[]');
  
  function persist()
  {
    window.localStorage['allplaylist'] = angular.toJson(allPlaylist);
  }

  function getPlaylist(id)
  {
    for (i = 0; i < allPlaylist.length; i++)
    {
      if(allPlaylist[i].id === id)
      {
        return allPlaylist[i];
      }   
    }
    return undefined;
    
  }
  function updatePlaylist(playlist)
  {
   for (i = 0; i < allPlaylist.length; i++)
   {
    if(allPlaylist[i].id === playlist.id)
    {
      allPlaylist[i] = playlist;
      persist();
      return;
    }   
  }
}


app.config(function($stateProvider, $urlRouterProvider)
{

  $stateProvider.state('home',{
    url: '/home',
    templateUrl: 'templates/home.html'
  });

  $stateProvider.state('add',{
    url: '/add',
    templateUrl: 'templates/add.html',
    controller:'AddCtrl'
  });

  $stateProvider.state('edit',{
    url: '/edit',
    templateUrl: 'templates/edit.html',
    controller:'EditCtrl'
  });

  $stateProvider.state('editPlaylist',{
    url: '/edit/:name',
    templateUrl: 'templates/add.html',
    controller:'EditPlaylist'

  });

  $urlRouterProvider.otherwise('/home');

});

// We clicked back - Stop playing music!
/*
$rootScope.$on('$stateChangeStart', function()
{


});
*/
app.controller('ListCtrl',function($http,$scope)
{

  $scope.songs = [];


});

app.controller('AddCtrl',function($scope,$http,$state)
{

  $scope.playlist = [];
  $scope.title = "Add Playlist";
  $scope.buttonName = "Preview";
  var audioObject = null;

  $scope.Search = function()
  {
    $scope.results = [];
    var query = document.getElementById("query").value;
    console.log("The query is " + query);
    $http.get('https://api.spotify.com/v1/search?type=track&market=AU&limit=10&q=' + query )
    .success(function(response)
    {
      angular.forEach(response.tracks.items, function(items)
      {
       $scope.results.push(items);
       console.log(items);
     });

    });

  };
  
  $scope.RemoveFromPlaylist = function(track)
  {
    var index = $scope.playlist.indexOf(track);
    $scope.playlist.splice(index,1);
  }

  $scope.AddToPlaylist = function(track)
  {
	  //Effective way to implement a search.
	  var isDup = false;
	  angular.forEach($scope.playlist, function(songs)
	  {
      if (track.uri == songs.uri)
      {
       console.log("Song is already in playlist");
       isDup = true;
     } 
   });
	  
	  if (isDup == false)
      $scope.playlist.push(track);
  };
  
  $scope.Save = function(){

    var duplicateName = false;
    angular.forEach(allPlaylist, function(child)
    {
     if (child.playlistname == document.getElementById("pName").value)
     {
      duplicateName = true;
    }
  });

    // Flag invalid if no playlist name
    if (document.getElementById("pName").value == ""
     || $scope.playlist.length == 0)
    {

      console.log("Please fill out fields");
      return;
    }
    else if ( duplicateName == true)
    {
      console.log("Duplicate playlist name");
      return;
    }

    var object = 
    {
      "id" : new Date().getTime().toString(),
      "playlistname": document.getElementById("pName").value,
      "playlist": $scope.playlist
    };

    //TODO: How to store playlists? 
    allPlaylist.push(object); 


		// Display in struct or hashmap?
    if ($scope.buttonName == "Pause")
    {
      console.log("in pause");
      audioObject.pause();
    }
    persist();
    $state.go("home");
  };
  
  $scope.Preview = function(song)
  { 

    console.log(document.getElementById("pName").value);
    if ($scope.buttonName == "Pause")
    {
      console.log("in pause");
      audioObject.pause();
    }
    else
    {
      audioObject = new Audio(song.preview_url);
      audioObject.play();

    }
    if ($scope.buttonName == "Preview")
      $scope.buttonName = "Pause";
    else
      $scope.buttonName = "Preview";

  };

});

app.controller('EditPlaylist',function($scope,$state,$http)
{
    
  $scope.playlistObj = getPlaylist($state.params.name);
  $scope.plName = $scope.playlistObj.playlistname;
  $scope.playlist = $scope.playlistObj.playlist;
  $scope.title = "Edit Playlist"
   $scope.buttonName = "Preview";
  //function that does a search and finds the needed object.


  $scope.Search = function()
  {
    $scope.results = [];
    var query = document.getElementById("query").value;
    console.log("The query is " + query);
    $http.get('https://api.spotify.com/v1/search?type=track&market=AU&limit=10&q=' + query )
    .success(function(response)
    {
      angular.forEach(response.tracks.items, function(items)
      {
       $scope.results.push(items);
       console.log(items);
     });

    });

  };
  $scope.RemoveFromPlaylist = function(track)
  {
    var index = $scope.playlist.indexOf(track);
    $scope.playlist.splice(index,1);
  }

  $scope.AddToPlaylist = function(track)
  {
    //Effective way to implement a search.
    var isDup = false;
    angular.forEach($scope.playlist, function(songs)
    {
      if (track.uri == songs.uri)
      {
        console.log("Song is already in playlist");
        isDup = true;
      } 
    });
    
    if (isDup == false)
      $scope.playlist.push(track);
  };

  $scope.Preview = function(song)
  { 

    console.log(document.getElementById("pName").value);
    if ($scope.buttonName == "Pause")
    {
      console.log("in pause");
      audioObject.pause();
    }
    else
    {
      audioObject = new Audio(song.preview_url);
      audioObject.play();

    }
    if ($scope.buttonName == "Preview")
      $scope.buttonName = "Pause";
    else
      $scope.buttonName = "Preview";

  };


  $scope.Save = function()
  {

    var obj = 
    {
      "id" : $scope.playlistObj.id,
      "playlistname": document.getElementById("pName").value,
      "playlist": $scope.playlist
    };
    //Create the object again here.
    updatePlaylist(obj);
    $state.go('home');


    //Go to add playlist and be able to submit edited version
    // Prefil name & array and overwrite old playlist.
    // Disallow editing of name.update: 



  };

});

app.controller('EditCtrl',function($scope,$state,$http)
{

  $scope.allPlaylist = allPlaylist;
  

});



app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
  if(window.cordova && window.cordova.plugins.Keyboard) {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
  }
  if(window.StatusBar) {
    StatusBar.styleDefault();
  }
});
})

}());