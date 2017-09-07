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

var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         /*At #10, we bind() the timeupdate event to currentSoundFile. 
         timeupdate is a custom Buzz event that fires repeatedly while time 
         elapses during song playback.
         */

         currentSoundFile.bind('timeupdate', function(event) {

             /* At #11, we use a new method for calculating the 
             seekBarFillRatio. We use Buzz's  getTime() method to get the 
             current time of the song and the getDuration() method for 
             getting the total length of the song. Both values return time 
             in seconds.
             */

             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
             setCurrentTimeInPlayerBar(this.getTime());
         });
     }
 };
var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    /* At #1, we use the built-in JavaScript Math.max() function 
    to make sure our percentage isn't less than zero and the Math.min() 
    function to make sure it doesn't exceed 100.
    */
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    /* At #2, we convert our percentage to a string and add the % 
    character. When we set the width of the .fill class and the 
    left value of the .thumb class, the CSS interprets the value as 
    a percent instead of a unit-less number between 0 and 100
    */
    
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

var setupSeekBars = function(){
    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function(event){
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();

        var seekBarFillRatio = offsetX / barWidth;

        updateSeekPercentage($(this), seekBarFillRatio);

        if ($(this).parent().attr("class") === "seek-control"){

            currentSoundFile.setTime(seekBarFillRatio * currentSoundFile.getDuration());
        }

        else if($(this).parent().attr("class") === "control-group volume"){

            currentSoundFile.setVolume(seekBarFillRatio * 100);
        }
    });

    $seekBars.find('.thumb').mousedown(function(event) {
    	/*
         At #8, we are taking the context of the event and wrapping it in 
         jQuery. In this scenario, this will be equal to the .thumb node 
         that was clicked. Because we are attaching an event to both the 
         song seek and volume control, this is an important way for us to 
         determine which of these nodes dispatched the event. We can then
         use the  parent method, which will select the immediate parent of 
         the node. This will be whichever seek bar this .thumb belongs to.
         */
         var $seekBar = $(this).parent();
 
         /* #9 introduces a new way to track events, jQuery's bind() event. 
         bind() behaves similarly to addEventListener() in that it takes a 
         string of an event instead of wrapping the event in a method like 
         we've seen with all other jQuery events thus far. We use bind() 
         because it allows us to namespace event listeners 
         (we'll discuss namespacing, shortly). The event handler inside the 
         bind() call is identical to the  click behavior.
         */

         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
 
         // #10

         /*Finally, at #10, we bind the mouseup event with a .thumb namespace. 
         The event handler uses the unbind() event method, which removes the 
         previous event listeners that we just added. If we fail to unbind() them, 
         the thumb and fill would continue to move even after the user released the 
         mouse. Comment out this block to demonstrate the unintended behavior.
		*/

         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
};

var setCurrentTimeInPlayerBar = function(currentTime){
	$(".current-time").html(buzz.toTimer(currentSoundFile.getTime()));
}

var setTotalTimeInPlayerBar = function(totalTime) {
	$(".total-time").html(buzz.toTimer(currentSoundFile.getDuration()));
}

 var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();

    // Update the Player Bar information
    updatePlayerBarSong();

    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
}; 

var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();

    // Update the Player Bar information
    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var updatePlayerBarSong = function() {

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    
};

var setSong = function(songNumber){

    if (currentSoundFile) {
        currentSoundFile.stop();

    }

	currentlyPlayingSongNumber = parseInt(songNumber);
	currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         // #2
         formats: [ 'mp3' ],
         preload: true
     });

    setVolume(currentVolume);
};

var getSongNumberCell = function(number){
	return $('.song-item-number[data-song-number="' + number + '"]');

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
 	+		'<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
 	+		'<td class="song-item-title">' + songName + '</td>'
 	+		'<td class="song-item-duration">' + songLength + '</td>'
 	+ '</tr>'
 	;

 	var $row = $(template);

 	var clickHandler = function() {
	var songNumber = parseInt($(this).attr('data-song-number'));

	if (currentlyPlayingSongNumber !== null) {

		// Revert to song number for currently playing song because user started playing new song.
		var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
		currentlyPlayingCell.html(currentlyPlayingSongNumber);
	}
	if (currentlyPlayingSongNumber !== songNumber) {
		// Switch from Play -> Pause button to indicate new song is playing.
		
		setSong(songNumber);
        currentSoundFile.play();
		updateSeekBarWhileSongPlays();
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

        var $volumeFill = $(".volume .fill");
        var $volumeThumb = $(".volume .thumb");
        $volumeFill.width(currentVolume + "%");
        $volumeThumb.css({left: currentVolume + "%"});

        $(this).html(pauseButtonTemplate);
        updatePlayerBarSong();

	} else if (currentlyPlayingSongNumber === songNumber) {

        if (currentSoundFile.isPaused()) {

            $(this).html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPauseButton);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
        }

        else {
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentSoundFile = currentSoundFile.pause();
        }
	}
};

   var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
    };

 	$row.find('.song-item-number').click(clickHandler);

 	$row.hover(onHover, offHover);

 	return $row;
 };

var seek = function(time){
	if (currentSoundFile){
		currentSoundFile.setTime(time);
	}
}

 var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
 }

 var toggleFromPlayerBar = function(){ 

 var songNumberCell = getSongNumberCell(currentlyPlayingSongNumber);             //Can you have a look at this for me?
 	if (currentSoundFile !== null){
 		if (currentSoundFile.isPaused()) {
            // Change play button on song row to pause button.
            // Change player bar to pause button.
            // Play it!
            songNumberCell.html(pauseButtonTemplate);
            $playPause.html(playerBarPauseButton);
            currentSoundFile.play();
 		} else {
            // Change play button on song row to play button.
            // Change player bar to play button.
            // Pause it!
            songNumberCell.html(playButtonTemplate);
            $playPause.html(playerBarPlayButton);
            currentSoundFile.pause();
        }
 	}
 }


 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></a>';
 var playerBarPlayButton = '<span class="ion-play"></span>';
 var playerBarPauseButton = '<span class="ion-pause"></span>';

 var currentlyPlayingSongNumber = null;
 var currentAlbum = null;
 var currentSongFromAlbum = null;
 var currentSoundFile = null;
 var currentVolume = 80;

 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');

 var $playPause = $('.main-controls .play-pause');

$(document).ready(function()
 {
 	setCurrentAlbum(albumPicasso);
 	setupSeekBars();
 	$previousButton.click(previousSong);
    $nextButton.click(nextSong);
 	
 	var albums = [albumPicasso, albumMarconi, albumJustin];
 	var count = 1;

    $playPause.click(toggleFromPlayerBar);

 	albumImage.addEventListener("click", function(event) {

 		setCurrentAlbum(albums[count]);
 		count++

 		if (count == albums.length)
 		{
 			count = 0;
 		}

 	});
 
 	
 });