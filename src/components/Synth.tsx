import { signal, effect } from "@preact/signals";

//Audio functions
import { synth } from "../audio/synth";

//UI Components
import { Oscillators } from "./Oscillators";
import { Filter } from "./Filter";
import { Envelopes } from "./Envelopes";
import { Effects } from "./Effects";
import SequenceGrid from "./SequenceGrid";
import { MainOutput } from "./MainOutput";
import { Globals } from "./Globals";

const audioCtx = new AudioContext();
const [audioSettings, playNote] = await synth({ audioCtx: audioCtx });

const sequenceGridData = [];
for (let i = 0; i < audioSettings.global.sequenceSteps.value; i++) {
  sequenceGridData[i] = signal([]);
}

const isSequencerPlaying = signal(false);
const sequenceId = signal(null);
const currentStep = signal(0);
const clearSequence = () => {
  currentStep.value = 0;
  if (sequenceId.value) {
    clearInterval(sequenceId.value);
  }
  if (isSequencerPlaying.value) {
    isSequencerPlaying.value = false;
  }
};

effect(() => {
  if (isSequencerPlaying.value) {
    sequenceId.value = setInterval(
      () => {
        currentStep.value =
          currentStep.value >= audioSettings.global.sequenceSteps.value
            ? 1
            : currentStep.value + 1;
        playSequence();
      },
      60000 / audioSettings.global.tempo.value / 2,
      currentStep
    );
  }
});

const playSequence = () => {
  sequenceGridData[currentStep.value - 1].value.forEach((midiNote, index) => {
    playNote(midiNote);
  });
};

const randomSequence = () => {
  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
  };
  const availableScales = [
    [null, 60, 62, 64, 65, 67, 69, 71, 72],
    [null, 60, 62, 63, 65, 67, 68, 70, 72],
    [null, 60, 63, 65, 66, 67, 70, 72],
  ];
  const scaleNotes = availableScales[getRandomInt(availableScales.length)];
  sequenceGridData.forEach((arr, i) => {
    const randomNote = scaleNotes[getRandomInt(scaleNotes.length)];
    if (randomNote) sequenceGridData[i].value = [randomNote];
  });
};

export default function Synth() {
  return (
    <div>
      <h1>Preact Synth</h1>
      <div id="synth-settings">
        <Oscillators oscSettings={audioSettings.oscillators} />
        <Filter filterSettings={audioSettings.filter} />
        <Effects effectsSettings={audioSettings.effects} />
        <Envelopes envelopeSettings={audioSettings.envelope} />
        <MainOutput volumeSettings={audioSettings.volume} />
        <Globals
          globalSettings={audioSettings.global}
          isSequencerPlaying={isSequencerPlaying}
        />
      </div>
      <div id="global-controls">
        <button onClick={randomSequence}>Random Sequence</button>
        <button
          onClick={() => {
            isSequencerPlaying.value = true;
          }}
        >
          Start Sequence
        </button>
        <button
          onClick={() => {
            clearSequence();
          }}
        >
          Stop Sequencer
        </button>
      </div>
      <SequenceGrid
        currentStep={currentStep}
        sequenceSteps={audioSettings.global.sequenceSteps}
        sequenceNotes={audioSettings.global.sequenceNotes}
        noteMidiStart={audioSettings.global.noteMidiStart}
        sequenceGridData={sequenceGridData}
        playNote={playNote}
      />
      <div id="current-step-indicator">Current Step: {currentStep.value}</div>
    </div>
  );
}
