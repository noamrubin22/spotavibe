let genresArr = [
  "acoustic",
  "afrobeat",
  "alt-rock",
  "alternative",
  "ambient",
  "anime",
  "blues",
  "brazil",
  "breakbeat",
  "chicago-house",
  "chill",
  "classical",
  "club",
  "comedy",
  "country",
  "dance",
  "deep-house",
  "detroit-techno",
  "disco",
  "disney",
  "drum-and-bass",
  "dub",
  "dubstep",
  "edm",
  "electro",
  "electronic",
  "folk",
  "french",
  "funk",
  "garage",
  "german",
  "gospel",
  "grindcore",
  "groove",
  "guitar",
  "happy",
  "hard-rock",
  "hardcore",
  "hardstyle",
  "hip-hop",
  "holidays",
  "house",
  "indie",
  "indie-pop",
  "j-dance",
  "j-idol",
  "j-pop",
  "j-rock",
  "jazz",
  "k-pop",
  "latin",
  "latino",
  "minimal-techno",
  "movies",
  "new-age",
  "new-release",
  "opera",
  "party",
  "piano",
  "pop",
  "pop-film",
  "post-dubstep",
  "power-pop",
  "progressive-house",
  "psych-rock",
  "punk",
  "punk-rock",
  "r-n-b",
  "rainy-day",
  "reggae",
  "reggaeton",
  "road-trip",
  "rock",
  "rock-n-roll",
  "romance",
  "salsa",
  "samba",
  "show-tunes",
  "singer-songwriter",
  "sleep",
  "songwriter",
  "soul",
  "soundtracks",
  "spanish",
  "study",
  "summer",
  "swedish",
  "synth-pop",
  "tango",
  "techno",
  "trance",
  "trip-hop",
  "work-out",
  "world-music"
]
const dropdown = document.getElementById('dropdown')


genresArr.forEach(el => {
  const option = `<option value=${el}>${el}</option>`
  dropdown.innerHTML += option
})