async function search(text) {
  if(event.key === 'Enter') {
    const artist = await getArtistByName(text.value);
    getArtistTop10(text.value);
    text.value = "";
    }
}


//Search Endpoint getter.
//Parameter 'name': String name of artist.
async function getSearch(name) {
  const metadataResponse = await fetch(`https://genius.p.rapidapi.com/search?q=${name}`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "genius.p.rapidapi.com",
		"x-rapidapi-key": "4f81c53901msh04da30b18bd0b3ap11116djsn42a17ccf6801"
	}});
  const results = await metadataResponse.json();
  return results;
}

//Song Endpoint getter.
//Parameter 'id': numeric id of song.
async function getSongById(id) {
  const metadataResponse = await fetch(`https://genius.p.rapidapi.com/songs/${id}`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "genius.p.rapidapi.com",
		"x-rapidapi-key": "4f81c53901msh04da30b18bd0b3ap11116djsn42a17ccf6801"
	}
})
  const results = await metadataResponse.json();
  return results;
}

//Artist Endpoint getter.
//Parameter 'id': numeric id of artist
async function getArtistById(id) {
  const metadataResponse = await fetch(`https://genius.p.rapidapi.com/artists/${id}`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "genius.p.rapidapi.com",
		"x-rapidapi-key": "4f81c53901msh04da30b18bd0b3ap11116djsn42a17ccf6801"
	}
})
  const results = await metadataResponse.json();
  return results;
}

//Artist Songs Endpoint getter. NOTE: returns songs they're featured in or produced as well as wrote
//Parameter 'id': numeric id of artist.
async function getArtistSongsById(id) {
  const metadataResponse = await fetch(`https://genius.p.rapidapi.com/artists/${id}/songs?sort=popularity`, {
	"method": "GET",
	"headers": {
    "sort" : "popularity",
		"x-rapidapi-host": "genius.p.rapidapi.com",
		"x-rapidapi-key": "4f81c53901msh04da30b18bd0b3ap11116djsn42a17ccf6801"
	}
})
  const results = await metadataResponse.json();
  return results;
}

//SPECIFIC FUNCTIONS

//Gets and displays top 10 songs by named artist
async function getArtistTop10(name) {
  const artist = await getArtistByName(name);
  const topsongs = await getArtistSongsById(artist.response.artist.id);
  const artistName = artist.response.artist.name;
  
  const artistBox = document.getElementById("artist");
  artistBox.innerHTML = artistName + " Top 10"
  
  for (let i = 0; i < 10; i++) {
    const id = "topsong" + i;
    const topsong = topsongs.response.songs[i].title;
    const songBox = document.getElementById(id);
    songBox.innerHTML = (i+1) +": "+ topsong;
  }
  
}

//Gets an artist by their name, rather than by ID
async function getArtistByName(name) {
  const data = await getSearch(name);
  
  const array = [];
  for (let i=0; i < 10/*data.response.hits.length*/; i++) {
    const result = data.response.hits[i].result.primary_artist.id;
    array.push(result);
  }
  const mostCommonId = modeString(array);
  const artist = await getArtistById(mostCommonId);
  console.log(artist);
  return artist;
}

//taken from https://stackoverflow.com/questions/1053843/get-the-element-with-the-highest-occurrence-in-an-array
//gets the most frequently occuring element in an array.
function modeString(array) {
  if (array.length == 0) return null;

  var modeMap = {},
    maxEl = array[0],
    maxCount = 1;

  for (var i = 0; i < array.length; i++) {
    var el = array[i];

    if (modeMap[el] == null) modeMap[el] = 1;
    else modeMap[el]++;

    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    } else if (modeMap[el] == maxCount) {
      maxEl += "&" + el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
}