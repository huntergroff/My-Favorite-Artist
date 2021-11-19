
//Search Endpoint getter.
//Parameter 'name': String name of artist.
async function getSearch(name) {
  const metadataResponse = await fetch(`https://genius.p.rapidapi.com/search?q=${name}`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "genius.p.rapidapi.com",
		"x-rapidapi-key": "4f81c53901msh04da30b18bd0b3ap11116djsn42a17ccf6801"
	}});
  console.log(metadataResponse);
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
  console.log(metadataResponse);
  const results = await metadataResponse.json();
  return results;
}

//Artist Endpoint getter.
//Parameter 'id': numeric id of artist
async function getArtistById(id) {
  const metadataResponse = await fetch("https://genius.p.rapidapi.com/artists/16775", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "genius.p.rapidapi.com",
		"x-rapidapi-key": "4f81c53901msh04da30b18bd0b3ap11116djsn42a17ccf6801"
	}
})
  console.log(metadataResponse);
  const results = await metadataResponse.json();
  return results;
}


async function getArtistTop10(name) {
  const artistBox = document.getElementById("artist");
  artistBox.innerHTML = name + " Top 10"
  
  const data = await getSearch(name);
  for (let i = 0; i < 10; i++) {
    const id = "topsong" + i;
    const topsong = data.response.hits[i].result.title_with_featured;
    
    const songBox = document.getElementById(id);
    songBox.innerHTML = (i+1) +": "+ topsong;
  }
}

async function getArtist(name) {
  const data = await getSearch(name);
  const topSongId = data.response.hits[0].result.id; 
  const topSong = await getSongById(topSongId);
}


