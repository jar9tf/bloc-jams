 var albumPicasso = {
	title: "The Colors",
	artist: "Pablo Picasso",
	label: "Cubism",
	year: "1881",
	albumArtUrl: "assets/images/album_covers/01.png",

	songs: [
	{ title: "Blue", duration: "4:26" },
	{ title: "Green", duration: "3:14" },
	{ title: "Red", duration: "5:01" },
	{ title: "Pink", duration: "3:21" },
	{ title: "Magenta", duration: "2:15" }

	]
};

var albumMarconi = {
     title: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { title: 'Hello, Operator?', duration: '1:01' },
         { title: 'Ring, ring, ring', duration: '5:01' },
         { title: 'Fits in your pocket', duration: '3:21'},
         { title: 'Can you hear me now?', duration: '3:14' },
         { title: 'Wrong phone number', duration: '2:15'}
     ]
 };

var albumJustin = {
	title: "Rocking",
	artist: "Justin",
	label: "Justin Records",
	year: "2017",

	songs: [
	{ title: "HTML", duration: "5:00" },
	{ title: "CSS", duration: "4:00" },
	{ title: "Javascript", duration: "4:30" }

	]
};

 
var setCurrentAlbum = function album(album) {

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

 var findParentByClassName = function(element, targetClass){
 	if (element)
 	{
        if (element.parentElement && element.parentElement.className) {

 		if(element.parentElement === null)
 		{
 			console.log("No parent found");
 		}

 		else if(element.parentElement.className !== targetClass)
 		{
 			console.log("No parent found with that class name.");
 		}

 		else if(element.parentElement !== null && element.parentElement.className === targetClass)
 		{
 			var currentParent = element.parentElement;
 		}

 		while(currentParent.className !== targetClass && currentParent.className !== null) {
 			currentParent = currentParent.parentElement;
 		}

 		return currentParent;
 	}
 }
 };

var getSongItem = function(element) {
    switch (element.className) {
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }  
};

 var clickHandler = function(targetElement){
 	
 	var songItem = getSongItem(targetElement);

 	if (currentlyPlayingSong === null){
 		songItem.innerHTML = pauseButtonTemplate;
 		currentlyPlayingSong = songItem.getAttribute("data-song-number");
 	
	
 	}else if (currentlyPlayingSong === songItem.getAttribute("data-song-number")) {
 		songItem.innerHTML = playButtonTemplate;
 		currentlyPlayingSong = null;
 	

 	}else if (currentlyPlayingSong !== songItem.getAttribute("data-song-number")) {
 		var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
 		currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute("data-song-number");
 		songItem.innerHTML = pauseButtonTemplate;
 		currentlyPlayingSong = songItem.getAttribute("data-song-number");
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
 		//clickHandler Logic
 		

 	};

   var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSong) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSong) {
            songNumberCell.html(songNumber);
        }
    };

 	$row.find('.song-item-number').click(clickHandler);

 	$row.hover(onHover, offHover);

 	return $row;
 };

 var songListContainer = document.getElementsByClassName('album-view-song-list')[0];

var songRows = document.getElementsByClassName("album-view-song-item");

 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></a>';

 var currentlyPlayingSong = null;

$(document).ready(function()
 {
 	setCurrentAlbum(albumPicasso);

 	for (i = 0; i < songRows.length; i++){

 		songRows[i].addEventListener("click", function(event){
 			clickHandler(event.target);
 		});
 	}

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