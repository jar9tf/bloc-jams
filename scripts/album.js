	var setCurrentAlbum = function album(album) {
		currentAlbum = album;

	 var $albumTitle = $('.album-view-title');
	 var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');

 	 $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);

 	$albumSongList.empty();

 	for (i = 0; i < album.songs.length; i++)
 	{
 		var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);

 	}
 };

 	var albumTitle = document.getElementsByClassName("album-view-title")[0];					// Why did these declarations have to come out of the setCurrentAlbum function?
 	var albumArtist = document.getElementsByClassName("album-view-artist")[0];
 	var albumReleaseInfo = document.getElementsByClassName("album-view-release-info")[0];
 	var albumImage = document.getElementsByClassName("album-cover-art")[0];
 	var albumSongList = document.getElementsByClassName("album-view-song-list")[0];		



 var createSongRow = function(songNumber, songName, songLength)
 {
 	var template = 
 	  '<tr class ="album-view-song-item">'
 	+		'<td class="song-item-number" data-song-number=" ' + songNumber + '">' + songNumber + '</td>'
 	+		'<td class="song-item-title">' + songName + '</td>'
 	+		'<td class="song-item-duration">' + songLength + '</td>'
 	+ '</tr>'
 	;

 	var $row = $(template);

 	var clickHandler = function() {
	var songNumber = $(this).attr('data-song-number');

	if (currentlyPlayingSongNumber !== null) {
		// Revert to song number for currently playing song because user started playing new song.
		var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
		currentlyPlayingCell.html(currentlyPlayingSongNumber);
	}
	if (currentlyPlayingSongNumber !== songNumber) {
		// Switch from Play -> Pause button to indicate new song is playing.
		$(this).html(pauseButtonTemplate);
		currentlyPlayingSongNumber = songNumber;
	} else if (currentlyPlayingSong === songNumber) {
		// Switch from Pause -> Play button to pause currently playing song.
		$(this).html(playButtonTemplate);
		currentlyPlayingSongNumber = null;
	}
};

   var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
    };

 	$row.find('.song-item-number').click(clickHandler);

 	$row.hover(onHover, offHover);

 	return $row;
 };


 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></a>';

 var currentlyPlayingSongNumber = null;
 var currentAlbum = null;
 var currentSongFromAlbum = null;

$(document).ready(function()
 {
 	setCurrentAlbum(albumPicasso);
 	
 	var albums = [albumPicasso, albumMarconi, albumJustin];
 	var count = 1;

 	albumImage.addEventListener("click", function(event) {

 		setCurrentAlbum(albums[count]);
 		count++

 		if (count == albums.length)
 		{
 			count = 0;
 		}

 	});
 
 	
 });