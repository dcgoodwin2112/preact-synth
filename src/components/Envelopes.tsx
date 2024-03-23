import type { EnvelopeSettings } from "../types";

interface EnvelopeProps {
  envelopeSettings: EnvelopeSettings;
}

export function Envelopes({ envelopeSettings }: EnvelopeProps) {
  return (
    <div id="filter">
      <h2>Envelopes</h2>
      <fieldset
        id="filter-settings"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <legend>Loudness Envelope</legend>
        <label htmlFor="loudness-envelope-attack">Attack</label>
        <input
          type="range"
          id="loudness-envelope-attack"
          min="0"
          max=".5"
          step=".01"
          value={envelopeSettings.loudness.attack.value}
          onInput={(e) => {
            envelopeSettings.loudness.attack.value = parseFloat(
              (e.target as HTMLInputElement).value
            );
          }}
        />
        <label htmlFor="loudness-envelope-release">Release</label>
        <input
          type="range"
          id="loudness-envelope-release"
          min="0"
          max=".5"
          step=".01"
          value={envelopeSettings.loudness.release.value}
          onInput={(e) => {
            envelopeSettings.loudness.release.value =
              parseFloat((e.target as HTMLInputElement).value);
          }}
        />
      </fieldset>
    </div>
  );
}
