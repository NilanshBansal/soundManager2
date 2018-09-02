  function formatMilliseconds(milliseconds) {
    var hours = Math.floor(milliseconds / 3600000);
    milliseconds = milliseconds % 3600000;
    var minutes = Math.floor(milliseconds / 60000);
    milliseconds = milliseconds % 60000;
    var seconds = Math.floor(milliseconds / 1000);
    milliseconds = Math.floor(milliseconds % 1000);

    return (hours > 0 ? hours : '0') + ':' +
      (minutes < 10 ? '0' : '') + minutes + ':' +
      (seconds < 10 ? '0' : '') + seconds + ':' +
      (milliseconds < 100 ? '0' : '') + (milliseconds < 10 ? '0' : '') + milliseconds;
  }

  let transcript = [0.43, 3.69, 7.85, 9.82, 15.52, 17.49, 22.32, 25.34, 28.93];

  var player = {
    btnPlay: document.querySelector('.player__play'),
    btnStop: document.querySelector('.player__stop'),
    btnPrevious: document.querySelector('.player__previous'),
    btnNext: document.querySelector('.player__next'),
    btnVolumeDown: document.querySelector('.player__volume-down'),
    btnVolumeUp: document.querySelector('.player__volume-up'),
    timeElapsed: document.querySelector('.player__time-elapsed'),
    timeTotal: document.querySelector('.player__time-total'),
    volume: document.querySelector('.player__volume-info'),
    transcript_elements: document.getElementsByClassName('transcript'),
  };
  var audio = null;
  var colorChangedIndex = null;

  function getIndexTranscript(curPos) {
    return Math.max.apply(Math, transcript.filter(function (x) { return x <= curPos }));
  }

  soundManager.setup({
    useFastPolling: true,
    useHighPerformance: true,
    onready: function () {
      audio = soundManager.createSound({
        id: 'audio',
        //  url: 'http://freshly-ground.com/data/audio/mpc/20090119%20-%20Untitled%20Groove.mp3',
        url: 'audio.wav',
        whileloading: function () {
          player.timeTotal.textContent = formatMilliseconds(audio.durationEstimate);
        },
        whileplaying: function () {
          player.timeElapsed.textContent = formatMilliseconds(audio.position);
          let transcriptTime = getIndexTranscript(audio.position / 1000);
          let index = transcript.indexOf(transcriptTime);
          if (index == -1) {
            index = 0;
          }
          if (colorChangedIndex != null) {
            player.transcript_elements[colorChangedIndex].style.color = "black";
          }
          player.transcript_elements[index].style.color = "red";
          colorChangedIndex = index;

        },
        onload: function () {
          player.timeTotal.textContent = formatMilliseconds(audio.duration);
        },
        onfinish: function () {
          var event;
          try {
            // Internet Explorer does not like this statement
            event = new Event('click');
          } catch (ex) {
            event = document.createEvent('MouseEvent');
            event.initEvent('click', true, false);
          }
          player.btnStop.dispatchEvent(event);
        }
      });
    }
  });




  player.btnPlay.addEventListener('click', function () {
    if (audio === null) {
      return;
    }

    if (audio.playState === 0 || audio.paused === true) {
      audio.play();
      this.classList.add('is-playing');
    } else {
      audio.pause();
      this.classList.remove('is-playing');
    }
  });

  player.btnStop.addEventListener('click', function () {
    if (audio === null) {
      return;
    }

    audio.stop();
    document.querySelector('.player__time-elapsed').textContent = formatMilliseconds(0);
    player.btnPlay.classList.remove('is-playing');
  });

  player.btnVolumeDown.addEventListener('click', function () {
    if (audio === null) {
      return;
    }

    var volume = audio.volume - 10 < 0 ? 0 : audio.volume - 10;
    audio.setVolume(volume);
    player.volume.textContent = volume;
  });

  player.btnVolumeUp.addEventListener('click', function () {
    if (audio === null) {
      return;
    }

    var volume = audio.volume + 10 > 100 ? 100 : audio.volume + 10;
    audio.setVolume(volume);
    player.volume.textContent = volume;
  });

  player.btnPrevious.addEventListener('click', function () {
    if (audio === null) {
      return;
    }

    var position = audio.position - 3000 < 0 ? 0 : audio.position - 3000;
    audio.setPosition(position);
    player.timeElapsed.textContent = formatMilliseconds(audio.position);
  });

  player.btnNext.addEventListener('click', function () {
    if (audio === null) {
      return;
    }

    var position = audio.position + 3000 > audio.duration ? audio.duration : audio.position + 3000;
    if (position === audio.duration) {
      var event;
      try {
        // Internet Explorer does not like this statement
        event = new Event('click');
      } catch (ex) {
        event = document.createEvent('MouseEvent');
        event.initEvent('click', true, false);
      }
      player.btnStop.dispatchEvent(event);
    } else {
      audio.setPosition(position);
      player.timeElapsed.textContent = formatMilliseconds(audio.position);
    }
  });

  Object.keys(player.transcript_elements).forEach(function (key) {
    player.transcript_elements[key].addEventListener('click', function () {
      if (audio === null) {
        return;
      }
      console.log(player.transcript_elements[key]['id']);
      let stringId = player.transcript_elements[key]['id'];
      stringId = stringId.substr(1);
      let id = parseInt(stringId);
      console.log(id);
      audio.setPosition((transcript[id - 1]) * 1000);
      player.timeElapsed.textContent = formatMilliseconds(audio.position);
      console.log((transcript[id - 1]) * 1000);
    });
  });