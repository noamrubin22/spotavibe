
// document.querySelector('button').onclick = () => {
//   generatePlaylist(120, 'edm', 'BQCuf__UBiT6cvltW8cWoCD2kQ2uJNK8qGt2N5KD7jis0D_hqfJ5X-1ILBVwaEoo8s9TDSIvjHR6fkbkOI0ZbWVRpKFlf6kkH0bX9rTuJ2Kk2kcK44vg39OUcEHSgTCEo8ZGYtvcPY9XCXVeFw');
// }

// Call the generatePlaylist function when a POST request is made upon button click. Use dotTHEN notation to res.render a page with the information attained from the API!!!

// const generatePlaylist = (bpm, genres, accessToken) => {
//   axios({
//     method: 'get',
//     url: "https://api.spotify.com/v1/recommendations",
//     headers: { Authorization: 'Bearer ' + accessToken },
//     params: {
//       limit: 5,
//       seed_genres: genres,
//       market: 'from_token',
//       tempo: bpm
//     }
//   })
//     .then(response => {
//       // Here we can do something with the response object
//       console.log(response.data)
//       // res.json(response.data)

//     })
//     .catch(err => {
//       // Here we catch the error and display it
//       console.log(err)
//     });
// }

