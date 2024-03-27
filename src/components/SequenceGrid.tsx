import type { Signal } from "@preact/signals";

interface SequenceGridProps {
  currentStep: Signal<number>;
  sequenceSteps: Signal<number>;
  sequenceNotes: Signal<number>;
  noteMidiStart: Signal<number>;
  sequenceGridData: Array<any>;
  playNote: (midiNote?: number) => void;
}

export default function SequenceGrid({
  currentStep,
  sequenceSteps,
  sequenceNotes,
  noteMidiStart,
  sequenceGridData,
  playNote,
}: SequenceGridProps) {
  const GridButtons = [];
  for (let i = 0; i < sequenceSteps.value; i++) {
    const row = [];
    for (
      let j = noteMidiStart.value + sequenceNotes.value - 1;
      j >= noteMidiStart.value;
      j--
    ) {
      const noteOn = sequenceGridData[i].value.includes(j);
      const gridStepClass =
        currentStep.value === i + 1
          ? `grid-button-${noteOn ? "on" : "off"}-current-step`
          : ``;
      console.log(i + 1);
      row.push(
        <button
          className={`grid-button grid-button-${
            noteOn ? "on" : "off"
          } ${gridStepClass}`}
          onClick={() => {
            if (noteOn) {
              sequenceGridData[i].value = sequenceGridData[i].value.filter(
                (v) => v !== j
              );
            } else {
              sequenceGridData[i].value = [...sequenceGridData[i].value, j];
            }
          }}
        >
          <span className="visually-hidden">{noteOn ? "on" : "off"}</span>
        </button>
      );
    }
    GridButtons.push(row);
  }
  return (
    <div id="sequence-grid">
      <button onClick={() => playNote(72)} className="piano-key-white">
        C
      </button>
      <button onClick={() => playNote(71)} className="piano-key-white">
        B
      </button>
      <button onClick={() => playNote(70)} className="piano-key-black">
        A#/Bb
      </button>
      <button onClick={() => playNote(69)} className="piano-key-white">
        A
      </button>
      <button onClick={() => playNote(68)} className="piano-key-black">
        G#/Ab
      </button>
      <button onClick={() => playNote(67)} className="piano-key-white">
        G
      </button>
      <button onClick={() => playNote(66)} className="piano-key-black">
        F#/Gb
      </button>
      <button onClick={() => playNote(65)} className="piano-key-white">
        F
      </button>
      <button onClick={() => playNote(64)} className="piano-key-white">
        E
      </button>
      <button onClick={() => playNote(63)} className="piano-key-black">
        D#/Eb
      </button>
      <button onClick={() => playNote(62)} className="piano-key-white">
        D
      </button>
      <button onClick={() => playNote(61)} className="piano-key-black">
        C#/Db
      </button>
      <button onClick={() => playNote(60)} className="piano-key-white">
        C
      </button>
      {GridButtons}
    </div>
  );
}
