import type {
  OscillatorSettings,
  OscillatorType,
  VolumeSettings,
} from "../types";

interface OscProps {
  oscSettings: OscillatorSettings;
}

export function Oscillators({ oscSettings }: OscProps) {
  return (
    <div id="oscillators">
      <h2>Oscillators</h2>
      <div
        className="flex-container"
        style={{ display: "flex", justifyContent: "space-around" }}
      >
        <fieldset
          id="oscillator-1"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <legend>Oscillator 1</legend>
          <label htmlFor="osc1-type">Waveform</label>
          <select
            id="osc1-type"
            value={oscSettings.osc1.type.value}
            onInput={(e) => {
              let type = (e.target as HTMLInputElement).value;
              oscSettings.osc1.type.value = type as OscillatorType;
            }}
          >
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
          </select>
          <label htmlFor="osc2-type">Volume</label>
          <input
            type="range"
            id="osc1-volume"
            min="0"
            max="100"
            value={oscSettings.osc1.volume.value * 200}
            onInput={(e) => {
              oscSettings.osc1.volume.value =
                parseFloat((e.target as HTMLInputElement).value) / 200;
            }}
          />
          <label htmlFor="osc2-detune">Detune</label>
          <input
            type="range"
            id="osc1-detune"
            min="-25"
            max="25"
            value={oscSettings.osc1.detune.value}
            onInput={(e) => {
              oscSettings.osc1.detune.value = parseFloat(
                (e.target as HTMLInputElement).value
              );
            }}
          />
        </fieldset>
        <fieldset
          id="oscillator-2"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <legend>Oscillator 2</legend>
          <label htmlFor="osc2-type">Waveform</label>
          <select
            id="osc2-type"
            value={oscSettings.osc2.type.value}
            onInput={(e) => {
              let type = (e.target as HTMLInputElement).value;
              oscSettings.osc2.type.value = type as OscillatorType;
            }}
          >
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
          </select>
          <label htmlFor="osc2-type">Volume</label>
          <input
            type="range"
            id="osc2-volume"
            min="0"
            max="100"
            value={oscSettings.osc2.volume.value * 200}
            onInput={(e) => {
              oscSettings.osc2.volume.value =
                parseFloat((e.target as HTMLInputElement).value) / 200;
            }}
          />
          <label htmlFor="osc2-detune">Detune</label>
          <input
            type="range"
            id="osc2-detune"
            min="-25"
            max="25"
            value={oscSettings.osc2.detune.value}
            onInput={(e) => {
              oscSettings.osc2.detune.value = parseFloat(
                (e.target as HTMLInputElement).value
              );
            }}
          />
        </fieldset>
      </div>
    </div>
  );
}