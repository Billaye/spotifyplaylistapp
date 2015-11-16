// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
( function(){


var app = angular.module('app', ['ionic']);


app.config(function($stateProvider, $urlRouterProvider)
{

  $stateProvider.state('home',{
    url: '/home',
    templateUrl: 'templates/home.html'
  });

  $stateProvider.state('add',{
    url: '/add',
    templateUrl: 'templates/edit.html',
    controller:'AddCtrl'
  });

  $stateProvider.state('edit',{
    url: '/edit/:noteId',
    templateUrl: 'templates/edit.html',
    controller:'EditCtrl'
  });

  $urlRouterProvider.otherwise('/home');

});


app.controller('ListCtrl',function($http,$scope)
{

  $scope.songs = [];
  $scope.testSpotify = function()
  {
/*
    $http.get('https://api.spotify.com/v1/albums/6akEvsycLGftJxYudPjmqK/tracks?offset=0&limit=2')
    .success(function(response)
*/
    $http.get('https://api.spotify.com/v1/tracks/0lJ9m0NDQ99yBPE9fsT6gP')
    .success(function(response)
    {

      $scope.songs.push(response);
      console.log(response);

      /*
      angular.forEach(response.items, function(child)
      {
        $scope.songs.push(child);
        console.log(child);
      });
*/

      //console.log(angular.toJson(response));
    });
  };

});

app.controller('AddCtrl',function($scope,$http)
{
  var word = "The Hills";
  $scope.results = [];

  $scope.title = "Add Playlist";
  $http.get('https://api.spotify.com/v1/search?type=track&market=AU&limit=10&q=' + word )
  .success(function(response)
  {
    angular.forEach(response.tracks.items, function(items){
       $scope.results.push(items);
        console.log(items);
    });

  });
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