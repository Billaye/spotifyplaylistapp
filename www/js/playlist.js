angular.module('app.playlist', [])


.factory('Playlist',function($http){

	var allPlaylist = angular.fromJson(window.localStorage['allplaylist'] || '[]');



	function persist()
	{
		window.localStorage['allplaylist'] = angular.toJson(allPlaylist);
	}
	
	return {

		list:function()
		{
			return allPlaylist;
		},

		get:function(id)
		{
			for (i = 0; i < allPlaylist.length; i++)
			{
				if(allPlaylist[i].id === id)
				{
					return allPlaylist[i];
				}   
			}
			return undefined;

		},

		update: function(playlist)
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
		},

		search: function(results)
		{
			var query = document.getElementById("query").value;
			$http.get('https://api.spotify.com/v1/search?type=track&market=AU&limit=10&q=' + query )
			.success(function(response)
			{
				angular.forEach(response.tracks.items, function(items)
				{
					results.push(items);
					console.log(items);
				});

			});
		},

		add: function(track,playlist)
		{
			var isDup = false;
			angular.forEach(playlist, function(songs)
			{
				if (track.uri == songs.uri)
				{
					console.log("Song is already in playlist");
					isDup = true;
				} 
			});

			if (isDup == false)
				playlist.push(track);

		},

		save: function(button,playlist)
		{
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
		    	|| playlist.length == 0)
		    {
		    	console.log("Please fill out fields");
		    	return false;
		    }
		    else if ( duplicateName == true)
		    {
		    	console.log("Duplicate playlist name");
		    	return false;
		    }

		    var object = 
		    {
		    	"id" : new Date().getTime().toString(),
		    	"playlistname": document.getElementById("pName").value,
		    	"playlist": playlist
		    };

		    allPlaylist.push(object); 


		    if (button == "Pause")
		    {
		    	audioObject.pause();
		    }

		    persist();

		}


	}
	
	

});