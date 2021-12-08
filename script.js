//initalize the variable for list of profile pictures
var picList;

//set up function for search bar
async function search(text) {
  const artist = await getArtistByName(text);
  getArtistInfo(text);
  const mainDisplay = document.getElementById("maindisplay");
  mainDisplay.style.display = "none";
  const navBar = document.getElementById("navbarholder");
  navBar.style.visibility = "visible";
  const container = document.getElementById("container");
  container.style.visibility = "visible";
  const nicknamebox = document.getElementById("nicknames");
  nicknamebox.innerHTML = "AKA: ";
  deezerRenderAlbumsForArtist(artist.response.artist.name);
}
//set up function to read in the text from the search bar 
function getSearchBarText(bar) {
  if (event.key === "Enter") {
    search(bar.value);
    bar.value = "";
  }
}
//Search Endpoint getter.
//Parameter 'name': String name of artist.
async function getSearch(name) {
  const metadataResponse = await fetch(
    `https://genius.p.rapidapi.com/search?q=${name}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "genius.p.rapidapi.com",
        "x-rapidapi-key": "4f81c53901msh04da30b18bd0b3ap11116djsn42a17ccf6801"
      }
    }
  );
  const results = await metadataResponse.json();
  return results;
}
//Song Endpoint getter.
//Parameter 'id': numeric id of song.
async function getSongById(id) {
  const metadataResponse = await fetch(
    `https://genius.p.rapidapi.com/songs/${id}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "genius.p.rapidapi.com",
        "x-rapidapi-key": "4f81c53901msh04da30b18bd0b3ap11116djsn42a17ccf6801"
      }
    }
  );
  const results = await metadataResponse.json();
  return results;
}
//Artist Endpoint getter.
//Parameter 'id': numeric id of artist
async function getArtistById(id) {
  const metadataResponse = await fetch(
    `https://genius.p.rapidapi.com/artists/${id}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "genius.p.rapidapi.com",
        "x-rapidapi-key": "4f81c53901msh04da30b18bd0b3ap11116djsn42a17ccf6801"
      }
    }
  );
  const results = await metadataResponse.json();
  return results;
}
//Artist Songs Endpoint getter. NOTE: returns songs they're featured in or produced as well as wrote
//Parameter 'id': numeric id of artist.
async function getArtistSongsById(id) {
  const metadataResponse = await fetch(
    `https://genius.p.rapidapi.com/artists/${id}/songs?sort=popularity`,
    {
      method: "GET",
      headers: {
        sort: "popularity",
        "x-rapidapi-host": "genius.p.rapidapi.com",
        "x-rapidapi-key": "4f81c53901msh04da30b18bd0b3ap11116djsn42a17ccf6801"
      }
    }
  );
  const results = await metadataResponse.json();
  return results;
}
//DEEZER GETTERS
async function deezerGetSearch(name) {
  //const urlName = name.replaceAll(" ", "%20");
  const metadataResponse = fetch(
    `https://deezerdevs-deezer.p.rapidapi.com/search?q=${name}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
        "x-rapidapi-key": "4f81c53901msh04da30b18bd0b3ap11116djsn42a17ccf6801"
      }
    }
  );
  const results = await metadataResponse;
  const results2 = await results.json();
  //console.log(results2);
  return results2;
}
//Search Endpoint getter.
//Parameter 'name': String name of artist.
async function deezerGetArtistByName(name) {
  const data = await deezerGetSearch(name);
  const array = [];
  const limit = Math.max(data.data.length, 25);
  for (let i = 0; i < limit; i++) {
    const result = data.data[i].artist.id;
    array.push(result);
  }
  const mostCommonId = modeString(array);
  const artist = await deezerGetArtistById(mostCommonId);
  console.log(artist);
  return artist;
}
//Read in album names and album covers from Deezer
async function deezerRenderAlbumsForArtist(name) {
  const artist = await deezerGetArtistByName(name);
  const artistId = artist.id;
  const artistname = artist.name;
  const searchData = await deezerGetSearch(artistname);
  console.log(searchData);
  const mapOfAlbums = new Map();
  const limit = Math.max(searchData.data.length, 25);
  for (let i = 0; i < limit; i++) {
    const a = searchData.data[i].artist.id;
    if (a == artistId) {
      mapOfAlbums.set(searchData.data[i].album.title, searchData.data[i].album);
    }
  }
  console.log(mapOfAlbums);
//Refresh the album box
  const albumbox = document.getElementById("topalbumsbox");
  albumbox.innerHTML = "";
//Text for album box
  const relatedalbumstext = document.createElement("p");
  relatedalbumstext.id = "topalbums";
  relatedalbumstext.classList.add("headingtext");
  relatedalbumstext.innerHTML = "popular albums";
  albumbox.appendChild(relatedalbumstext);
//Add songs for album box
  for (let value of mapOfAlbums.values()) {
    const album = document.createElement("div");
    album.classList.add("song");
    albumbox.appendChild(album);

    const albumpicturebox = document.createElement("img");
    albumpicturebox.classList.add("songpicture");
    albumpicturebox.src = value.cover_small;
    album.appendChild(albumpicturebox);

    const albumtitle = document.createElement("p");
    albumtitle.classList.add("regulartext");
    albumtitle.innerHTML = value.title;
    album.appendChild(albumtitle);
  }

  return mapOfAlbums;
}
//Get artist info and artist info by id
async function deezerGetArtistById(id) {
  const metadataResponse = await fetch(
    `https://deezerdevs-deezer.p.rapidapi.com/artist/${id}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
        "x-rapidapi-key": "4f81c53901msh04da30b18bd0b3ap11116djsn42a17ccf6801"
      }
    }
  );
  const results = await metadataResponse;
  const results2 = await results.json();
  return results2;
}
//SPECIFIC FUNCTIONS
//Create top searches drop down
function dropdown() {
  const menu = document.getElementById("dropdown");
  if (menu.style.display == "none") {
    menu.style.display = "inline-block";
  } else {
    menu.style.display = "none";
  }
}
function dropdown2() {
  const menu = document.getElementById("dropdown2");
  if (menu.style.display == "none") {
    menu.style.display = "inline-block";
  } else {
    menu.style.display = "none";
  }
}
//Have top searches be clickable
window.onclick = function(event) {
  if (!event.target.matches("#topsearches")) {
    const menu = document.getElementById("dropdown");
    menu.style.display = "none";
  }
};
//Gets and displays artist info on page
async function getArtistInfo(name) {
  //intialize variables to put on page
  const artist = await getArtistByName(name);
  const topsongs = await getArtistSongsById(artist.response.artist.id);
  const artistName = artist.response.artist.name;
  const alias = artist.response.artist.alternate_names;
  const facebook = artist.response.artist.facebook_name;
  const insta = artist.response.artist.instagram_name;
  const twitter = artist.response.artist.twitter_name;
  const genius = artist.response.artist.url;
  const description = artist.response.artist.description.dom.children;
  const profilepic = artist.response.artist.image_url;
  const deezerArtist = await deezerGetArtistByName(artistName);
  const profpicBox = document.getElementById("picture");
  profpicBox.src = profilepic;
  //List of possible pictures for page
  picList = [
    artist.response.artist.image_url,
    artist.response.artist.header_image_url,
    deezerArtist.picture_medium
  ];
//Edit artist name
  const nameBox = document.getElementById("artistname");
  nameBox.innerHTML = artistName;
//Edit artist's aliases or nickname
  const limit = Math.min(alias.length, 4);
  const nicknameBox = document.getElementById("nicknames");
  for (let i = 0; i < limit; i++) {
    const aliasName = alias[i];
    nicknameBox.innerHTML += aliasName;
    if (i < limit - 1) {
      nicknameBox.innerHTML += ", ";
    }
  }
//Edit description
  const descriptionBox = document.getElementById("descriptionbox");
  descriptionBox.innerHTML = "";
  //Run description function
  ArtistDescription(description);
  console.log(deezerArtist);
//Add social media links and names
  const facebooklinkBox = document.getElementById("facebooklink");
  facebooklinkBox.href = "https://www.facebook.com/" + facebook;
  const facebookBox = document.getElementById("facebook");
  facebookBox.innerHTML = facebook;
  const instalinkBox = document.getElementById("instagramlink");
  instalinkBox.href = "https://www.instagram.com/" + insta + "/";
  const instaBox = document.getElementById("instagram");
  instaBox.innerHTML = insta;
  const twitterlinkBox = document.getElementById("twitterlink");
  twitterlinkBox.href = "https://twitter.com/" + twitter;
  const deezerLinkBox = document.getElementById("deezerlink");
  deezerLinkBox.href = deezerArtist.link;
  const twitterBox = document.getElementById("twitter");
  twitterBox.innerHTML = twitter;
  const geniuslinkBox = document.getElementById("geniuslink");
  geniuslinkBox.href = genius;
  const geniusBox = document.getElementById("genius");
  geniusBox.innerHTML = artistName;
  const deezerBox = document.getElementById("deezer");
  deezerBox.innerHTML = artistName;
//Add top 10 songs
  for (let i = 0; i < 10; i++) {
    const titleid = "songtitle" + i;
    const linkid = "songlink" + i;
    const pictureid = "songpicture" + i;
    const topsong = topsongs.response.songs[i].title_with_featured;
    const lyric = topsongs.response.songs[i].url;
    const songpic = topsongs.response.songs[i].song_art_image_url;

    const songBox = document.getElementById(titleid);
    console.log(topsong);
    songBox.innerHTML = topsong;

    const linkBox = document.getElementById(linkid);
    linkBox.href = lyric;

    const picBox = document.getElementById(pictureid);
    picBox.src = songpic;
  }
}
//Gets an artist by their name, rather than by ID
async function getArtistByName(name) {
  const data = await getSearch(name);

  const array = [];
  for (let i = 0; i < 10 /*data.response.hits.length*/; i++) {
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
//Function to pull and format artist's description from API
function ArtistDescription(descriptiontext) {
  const descriptionBox = document.getElementById("descriptionbox");
  for (let i = 0; i < descriptiontext.length; i++) {
    if (descriptiontext[i].children) {
      ArtistDescription(descriptiontext[i].children);
    } else {
      if (descriptiontext[i] === "") {
        descriptionBox.innerHTML += "<br /><br />";
      } else {
        descriptionBox.innerHTML += descriptiontext[i];
      }
    }
  }
}
//Function to switch the profile picture on click
function PicSwitch() {
  console.log("hello");
  const profpicBox = document.getElementById("picture");
  if (profpicBox.src == picList[0]) {
    profpicBox.src = picList[2];
  } else if (profpicBox.src == picList[2]) {
    profpicBox.src = picList[0];
  }
}
