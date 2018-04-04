var osc;
var playing = false;
var msg = 'click to play';

const moreScalePatterns = {
  majorDiatonic: [1,3,5,6,8,10,12,13],
  minorDiatonic: [1,3,4,5,8,9,11,13]
};

const songPatternA = [1,1,5,5,6,6,5,0,4,4,3,3,2,2,1,0];
const songPatternB = [5,5,4,4,3,3,2,0,5,5,4,4,3,3,2,0];
const songPatternC = [2,3,5,5,3,0,0,4,3,2,1];


function computeSemitones(rootNote) {
  let currentNote = rootNote;
  let semitones = [];

  for(let i=0; i<=12; i++) {
    semitones.push(currentNote);
    currentNote *= Math.pow(2, 1/12);
  }

  return semitones;
}

function computeScale(rootNote, pattern) {
  const semitones = this.computeSemitones(rootNote);

  if (!pattern) {
    return semitones;
  }

  return moreScalePatterns[pattern].map(scalePosition =>
    semitones[scalePosition]
  );
}


const semitones = computeSemitones(440);
const scaleNotes = computeScale(440, 'majorDiatonic');

function setup() {
  const twinklePattern = songPatternA.concat(songPatternB,songPatternA);
  phraseA = new p5.Phrase('twinklePhraseA', playNotes, twinklePattern);

  partA = new p5.Part();
  partA.addPhrase(phraseA);
  partA.setBPM(30);

  phraseB = new p5.Phrase('originalB', playNotes, songPatternC);

  partB = new p5.Part();
  partB.addPhrase(phraseB);
  partB.setBPM(30)

}

function draw() {
  background(0);
  text(msg, width/2, height/2);
}

function playNotes(time, note) {
  osc = new p5.Oscillator();
  osc.setType('sine');
  osc.start(time, scaleNotes[note - 1]);
  osc.amp(0, 0, 1);
  osc.stop(1);
}


const playTwinkleBtn = document.getElementById("twinkle");
// const playOriginalBtn = document.getElementById("original");

playTwinkleBtn.addEventListener("click", function(){
  partA.start();
});

// playOriginalBtn.addEventListener("click", function(){
//   partB.start();
// });

