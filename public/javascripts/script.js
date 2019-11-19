let averageBPM;
document.addEventListener('DOMContentLoaded', () => {

  const tapButton = document.getElementById("tapper")
  const startButton = document.getElementById("startbutton")

  startButton.onclick = function () {
    console.clear();
    progress();
    let lastClick = 0;
    tapButton.onclick = function () {
      calculateBPM();
    }

    /* calculates the tapped BPM */
    function calculateBPM() {
      let BPM = [];
      // measure time
      let time = new Date().getTime()
      console.log("time:", time);
      let second = (time - lastClick);
      let BPMcalculator = 60000 / second;
      document.getElementById("BPM").innerText = Math.round(BPMcalculator);

      // calculate BPM and push to array
      if (BPMcalculator > 20) {
        BPM.push(BPMcalculator);
        lastClick = time;
      }
      lastClick = time;

      // calculate average BPM
      averageBPM = (BPM.reduce((acc, val) => acc + val, 0)) / BPM.length;
      console.log("average: ", averageBPM)
    }

    function progress() {
      // inspired from https://codepen.io/zmuci/pen/rJooKr
      var speed = 5;
      var indexPB = speed * 60; // 60 FPS

      function myFunction() {
        // make sure sendbutton is only visible when time is up
        if (document.getElementById("sendbutton")) {
          document.querySelector("body").removeChild(document.getElementById("sendbutton"));
        }

        // frame per seconds decreases
        indexPB--;
        // calculates percentage on given speed
        var percentage = getPercentage(indexPB, speed);
        // timer is called and progress is visualized
        timer();
        progressBar(percentage);

        // recursive function called when time is still running
        if (indexPB !== 0) {
          requestAnimationFrame(myFunction);
        } else {
          console.log("Time is up");
          // show average BPM 
          let BPMplaceholder = document.createElement("H3");
          document.body.appendChild(BPMplaceholder);
          let t = document.createTextNode(`average BPM: ${Math.round(averageBPM)}`);
          BPMplaceholder.appendChild(t);
          // averageBPMM.setAttribute("id", "avgBPM")
          // document.body.appendChild(averageBPMM);
          // averageBPMM.appendChild(document.createTextNode(averageBPM));

          // restart or send
          let sendButton = document.createElement("BUTTON");
          sendButton.setAttribute("id", "sendbutton")
          let sendLink = document.createElement("a");
          sendLink.setAttribute("href", "/data/output");
          sendLink.setAttribute("id", "sendlink")
          document.body.appendChild(sendLink);
          document.querySelector("#sendlink").appendChild(sendButton);
          sendButton.innerHTML = "SEND BPM!";

          // restart
          restartButton = document.createElement("BUTTON");
          restartButton.setAttribute("id", "restartbutton");
          restartButton.innerHTML = "RESTART"
        }
      }
      requestAnimationFrame(myFunction);

      /* decreases the green-width progress-bar based on percentage */
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
  }

}, false);