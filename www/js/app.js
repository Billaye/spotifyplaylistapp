// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
( function(){

  var app = angular.module('app', ['ionic','app.playlist']);
  var audioObject = null;
  
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

app.controller('MainCtrl',function($scope,$rootScope,$ionicHistory,Playlist)
{
  $rootScope.StopPlay = function()
  {
    if ($rootScope.isNative)
    {
        location.href = 'jmh-ios://back'
    } else{
      if (audioObject != null && audioObject.paused == false)
        audioObject.pause();
      $ionicHistory.goBack();
    }

  };
 
});


app.controller('AddCtrl',function($scope,$http,$state,Playlist)
{

  $scope.playlist = [];
  $scope.title = "Add Playlist";
  $scope.buttonName = "Preview";

  $scope.Search = function()
  {
     $scope.results = [];
     Playlist.search($scope.results);
  }
  $scope.RemoveFromPlaylist = function(index)
  {
    $scope.playlist.splice(index,1);
  }

  $scope.AddToPlaylist = function(track)
  {
	   Playlist.add(track,$scope.playlist);
  };
  
  $scope.Save = function()
  {
      if ((Playlist.save($scope.buttonName,$scope.playlist)) != false)
      {
        $state.go("home");
      }
  };
  
  $scope.Preview = function(song)
  { 
    if ($scope.buttonName  == "Pause")
    {
      audioObject.pause();
      $scope.buttonName  = "Preview";
    }
    else
    {
      audioObject = new Audio(song.preview_url);
      audioObject.addEventListener("ended",function()
      {
          $scope.$apply(function()
          { 
            $scope.buttonName  = "Preview";
          });
      });
      audioObject.play();
      $scope.buttonName  = "Pause";
  };

};

});

app.controller('EditPlaylist',function($scope,$state,$http,Playlist)
{
    
  $scope.playlistObj = Playlist.get($state.params.name);
  $scope.plName = $scope.playlistObj.playlistname;
  $scope.playlist = $scope.playlistObj.playlist;

  $scope.title = "Edit Playlist"
  $scope.buttonName = "Preview";



$scope.Search = function()
  {
     $scope.results = [];
     Playlist.search($scope.results);
  }
  $scope.RemoveFromPlaylist = function(index)
  {
    $scope.playlist.splice(index,1);
  }

  $scope.AddToPlaylist = function(track)
  {
     Playlist.add(track,$scope.playlist);
  };
  
  $scope.Save = function()
  {
      if ((Playlist.save($scope.buttonName,$scope.playlist)) != false)
      {
        $state.go("home");
      }
  };
  
  $scope.Preview = function(song)
  { 
      if ($scope.buttonName  == "Pause")
      {
        audioObject.pause();
        $scope.buttonName  = "Preview";
      }
      else
      {
        audioObject = new Audio(song.preview_url);
        audioObject.addEventListener("ended",function()
        {
          $scope.$apply(function()
          { 
            $scope.buttonName = "Preview";
          });
        });

      audioObject.play();
      $scope.buttonName  = "Pause";
      } 

  };

  $scope.Save = function()
  {
     // Flag invalid if no playlist name
     if (document.getElementById("pName").value == ""
      || playlist.length == 0)
     {
      console.log("Please fill out fields");
      return false;
    }
    var obj = 
    {
      "id" : $scope.playlistObj.id,
      "playlistname": document.getElementById("pName").value,
      "playlist": $scope.playlist
    };

    Playlist.update(obj);

    if (button == "Pause")
    {
      audioObject.pause();
    }
    $state.go('home');

  };

});

app.controller('EditCtrl',function($scope,$state,$http,Playlist)
{

  $scope.allPlaylist = angular.fromJson(window.localStorage['allplaylist'] || '[]');
  

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