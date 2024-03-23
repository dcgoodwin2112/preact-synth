import type { Signal } from "@preact/signals";

interface SequenceGridProps {
  sequenceSteps: Signal<number>;
  sequenceNotes: Signal<number>;
  noteMidiStart: Signal<number>;
  sequenceGridData: any;
}

export default function SequenceGrid({
  sequenceSteps,
  sequenceNotes,
  noteMidiStart,
  sequenceGridData,
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
      row.push(
        <button
          className={`grid-button grid-button-${noteOn ? "on" : "off"}`}
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
          {j}
        </button>
      );
    }
    GridButtons.push(row);
  }
  // const notes = 12;
  // const steps = 16;
  // const grid = [];
  // for (let i = 0; i < notes; i++) {
  //   const row = [];
  //   for (let j = 0; j < steps; j++) {
  //     row.push(<GridElement />);
  //   }
  //   grid.push(<div>{row}</div>);
  // }
  return (
    <div id="sequence-grid">
      <div className="piano-key-white">C</div>
      <div className="piano-key-white">B</div>
      <div className="piano-key-black">A#/Bb</div>
      <div className="piano-key-white">A</div>
      <div className="piano-key-black">G#/Ab</div>
      <div className="piano-key-white">G</div>
      <div className="piano-key-black">F#/Gb</div>
      <div className="piano-key-white">F</div>
      <div className="piano-key-white">E</div>
      <div className="piano-key-black">D#/Eb</div>
      <div className="piano-key-white">D</div>
      <div className="piano-key-black">C#/Db</div>
      <div className="piano-key-white">C</div>
      {GridButtons}
    </div>
  );
}

// function GridElement() {
//   const onOff = useSignal(false);
//   return (
//     <button
//       className={`grid-button grid-button-${onOff.value ? "on" : "off"}`}
//       onClick={() => (onOff.value = !onOff.value)}
//     ></button>
//   );
// }
