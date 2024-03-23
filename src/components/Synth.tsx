import { signal, effect } from "@preact/signals";

//Audio functions
import { synth } from "../audio/synth";

//UI Components
import { Oscillators } from "./Oscillators";
import { Filter } from "./Filter";
import { Envelopes } from "./Envelopes";
import {Effects} from "./Effects";
import SequenceGrid from "./SequenceGrid";
import { MainOutput } from "./MainOutput";

const audioCtx = new AudioContext();
const [audioSettings, playNote] = synth({audioCtx: audioCtx});

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
          currentStep.value >= audioSettings.global.sequenceSteps.value ? 1 : currentStep.value + 1;
        console.log("current step: ", currentStep.value);
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

export default function Synth() {
  return (
    <div>
      <div id="synth-settings">
        <Oscillators oscSettings={audioSettings.oscillators} />
        <Filter filterSettings={audioSettings.filter} />
        <Envelopes envelopeSettings={audioSettings.envelope} />
        <MainOutput volumeSettings={audioSettings.volume} />
        <Effects effectsSettings={audioSettings.effects}/>
      </div>
      <div id="global-controls">
        <button onClick={() => playNote()}>Play Synth</button>
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
        sequenceSteps={audioSettings.global.sequenceSteps}
        sequenceNotes={audioSettings.global.sequenceNotes}
        noteMidiStart={audioSettings.global.noteMidiStart}
        sequenceGridData={sequenceGridData}
      />
    </div>
  );
}
