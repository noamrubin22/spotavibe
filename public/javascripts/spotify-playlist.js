
document.querySelector('button').onclick = () => {
  generatePlaylist(120, 'edm', 'BQAGbGnTPNeTw9i3rkN-nT2On_vg8K6yUr5QXM5O6y61Hf_6M64pXlxKnuj5shvJntUx0tFu8IZWgBT9VxbXsBMxlEFVA5EZITQpsYb9DCi5_hN1iRS0SrBLkFRpNCiJXy1Az5wmYwlcKLg8Jw');
}

// Call the generatePlaylist function when a POST request is made upon button click. Use dotTHEN notation to res.render a page with the information attained from the API!!!

const generatePlaylist = (bpm, genres, accessToken) => {
  axios({
    method: 'get',
    url: "https://api.spotify.com/v1/recommendations",
    headers: { Authorization: 'Bearer ' + accessToken },
    params: {
      limit: 5,
      seed_genres: genres,
      market: 'from_token',
      tempo: bpm
    }
  })
    .then(response => {
      // Here we can do something with the response object
      console.log(response.data)
      // res.json(response.data)

    })
    .catch(err => {
      // Here we catch the error and display it
      console.log(err)
    });
}

