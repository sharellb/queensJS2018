console.log("I AM LOADED");

const audioContext = new(window.AudioContext || window.webkitAudioContext);


const scalePatterns = {
  majorDiatonic: [0,2,4,5,7,9,11,12],
  minorDiatonic: [0,2,3,5,7,8,10,12]
};

class Scale {
  constructor(rootNote, pattern, audioContext) {
    this.audioContext = audioContext;
    this.scaleNotes = this.computeScale(rootNote, pattern);
  }

  computeScale(rootNote, pattern) {
    const semitones = this.computeSemitones(rootNote);

    if (!pattern) {
      return semitones;
    }

    return scalePatterns[pattern].map(scalePosition =>
      semitones[scalePosition]
    );
  }

  computeSemitones(rootNote) {
    let currentNote = rootNote;
    let semitones = [];

    for(let i=0; i<=12; i++) {
      semitones.push(currentNote);
      currentNote *= Math.pow(2, 1/12);
    }

    return semitones;
  }

  playScale(beatsPerMinute) {
    console.log('playScale');
    const noteDuration = 60/beatsPerMinute;

    this.scaleNotes.forEach((val, i) => {
      const note = new Sound(audioContext);
      const startTime = noteDuration*(i+1);
      note.play(val, startTime, noteDuration);
    });
  }
}

class Sound {
  constructor(audioContext) {
    this.audioContext = audioContext;
  }

  init() {
    this.oscillator = audioContext.createOscillator();
    this.gainNode = audioContext.createGain();
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(audioContext.destination);
  }

  play(value, startTime, noteDuration) {
    this.init();
    const currentTime = this.audioContext.currentTime;
    this.oscillator.frequency.value = value;
    this.gainNode.gain.setTargetAtTime(1, currentTime, 0);

    this.oscillator.start(startTime + currentTime);
    this.stop(startTime + currentTime, noteDuration);
  }

  stop(startTime, noteDuration) {
    this.gainNode.gain.setTargetAtTime(0, startTime + noteDuration, 0.015);
    this.oscillator.stop(startTime + noteDuration + 0.015);
  }
}

const playSineBtn = document.getElementById("sine");
const playSquareBtn = document.getElementById("square");
const playSawtoothBtn = document.getElementById("sawtooth");
const playTriangleBtn = document.getElementById("triangle");
const playChromaticScaleBtn = document.getElementById("chromatic-scale");
const playMajorScaleBtn = document.getElementById("major-scale");
const playMinorScaleBtn = document.getElementById("minor-scale");

playSineBtn.addEventListener("click", function(){
  playWave("sine");
});

playSquareBtn.addEventListener("click", function(){
  playWave("square");
});

playSawtoothBtn.addEventListener("click", function(){
  playWave("sawtooth");
});

playTriangleBtn.addEventListener("click", function(){
  playWave("triangle");
});


function playWave(waveType) {
  let oscillator = audioContext.createOscillator();
  oscillator.type = waveType;
  let gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  const currentTime = audioContext.currentTime;

  oscillator.start(currentTime);
  oscillator.stop(currentTime + 1);
}


playChromaticScaleBtn.addEventListener("click", function(){
  playScalePattern("");
});

playMajorScaleBtn.addEventListener("click", function(){
  playScalePattern("majorDiatonic");
});

playMinorScaleBtn.addEventListener("click", function(){
  playScalePattern("minorDiatonic");
});

function playScalePattern(scaleName) {
  const scale = new Scale(440, scaleName, audioContext);
  scale.playScale(120);
}
