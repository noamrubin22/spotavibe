  document.addEventListener('DOMContentLoaded', () => {

    // initialize variables 
    let averageBPM;
    let restartButton;
    let lastClick = 0;
    const tapButton = document.getElementById("tapper")
    // const startButton = document.getElementById("startbutton")

    // call setupfunction to start the process
    setup();

    /* calls the functions needed for BPM calculation */
    function setup() {

      $("#tapper").one("click", function () {
        // visualize progress bar
        progress();

        tapButton.onclick = function () {

          // calculate BPM
          calculateBPM(lastClick);
        }
      })
    }

    /* calculates the BPM */
    function calculateBPM() {
      let BPM = [];
      // measure time and calculate BPM
      let time = new Date().getTime()
      // console.log("time:", time);
      let second = (time - lastClick);
      let BPMcalculator = 60000 / second;
      // show current BPM
      document.getElementById("BPM").innerText = Math.round(BPMcalculator);

      // calculate average BPM
      if (BPMcalculator > 20) {
        BPM.push(BPMcalculator);
        lastClick = time;
      }
      lastClick = time;
      averageBPM = Math.round((BPM.reduce((acc, val) => acc + val, 0)) / BPM.length);
      console.log("average: ", averageBPM)
    }

    /* visualization timer */
    function progress() {
      // inspired from https://codepen.io/zmuci/pen/rJooKr
      var speed = 5;
      var indexPB = speed * 60; // 60 FPS

      function tapFunction() {
        // make sure sendbutton is only visible when time is up
        // if (document.getElementById("sendbutton")) {
        //   document.querySelector("#form").removeChild(document.getElementById("sendbutton"));
        // }

        // calculates percentage on given speed, decreasing by time
        indexPB--;
        var percentage = getPercentage(indexPB, speed);
        timer();
        progressBar(percentage);

        // recursive function called when time is still running
        if (indexPB !== 0) {
          requestAnimationFrame(tapFunction);
          // when time is up
        } else {
          console.log("Time is up");

          // remove startbutton and tapbutton
          if (!!tapButton) {
            // document.querySelector(".tapper").removeChild(startButton);
            document.querySelector(".tapper").removeChild(tapButton);
          }
          // show average BPM 
          const tapper = document.body.querySelector(".tapper");
          let BPMplaceholder = document.createElement("H3");
          BPMplaceholder.setAttribute("id", "avgBPM");
          let textInput = document.createTextNode(`Average BPM : ${averageBPM}`);
          BPMplaceholder.appendChild(textInput);
          tapper.appendChild(BPMplaceholder);

          // create form for post request
          let formPost = document.createElement("FORM");
          formPost.setAttribute("method", "post");
          formPost.setAttribute("action", "/data/tapper");
          formPost.setAttribute("id", "form");
          tapper.appendChild(formPost);

          let inputPost = document.createElement("INPUT");
          inputPost.setAttribute("type", "hidden");
          inputPost.setAttribute("name", "avgBPM");
          inputPost.setAttribute("value", averageBPM);
          formPost.appendChild(inputPost);

          // create sendbutton for post request
          let sendButton = document.createElement("BUTTON");
          sendButton.setAttribute("id", "sendbutton")
          sendButton.setAttribute("type", "submit")
          sendButton.innerHTML = "SEND BPM!";
          formPost.appendChild(sendButton);

          // create restart button 
          restartButton = document.createElement("BUTTON");
          restartButton.setAttribute("id", "restartbutton");
          restartButton.innerHTML = "RESTART";
          let sendLink = document.createElement("a");
          sendLink.setAttribute("href", "/data/tapper");
          sendLink.setAttribute("id", "sendlink")
          tapper.appendChild(sendLink);
          document.querySelector("#sendlink").appendChild(restartButton);
        }
      }
      requestAnimationFrame(tapFunction);

      /* decreases the green width progress-bar based on percentage */
      function progressBar(percentage) {
        var progress = $('.progress-inner');
        progress.width(percentage + '%');
      }

      /* sets timer */
      function timer() {
        $('.timer').html((Math.round((indexPB * 1000 / (600) / 100) * 10) / 10).toFixed(1));
      }

      /* calculates percentage */
      function getPercentage(current, max) {
        return current * 100 / (max * 60);
      }
    }
  }, false);