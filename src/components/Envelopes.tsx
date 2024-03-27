import type { EnvelopeSettings } from "../types";

interface EnvelopeProps {
  envelopeSettings: EnvelopeSettings;
}

export function Envelopes({ envelopeSettings }: EnvelopeProps) {
  return (
    <>
    <div>
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
          max="1"
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
          max="1"
          step=".01"
          value={envelopeSettings.loudness.release.value}
          onInput={(e) => {
            envelopeSettings.loudness.release.value = parseFloat(
              (e.target as HTMLInputElement).value
            );
          }}
        />
      </fieldset>
      </div>
      <div>
      <fieldset
        id="filter-settings"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <legend>Filter Envelope</legend>
        <label htmlFor="filter-envelope-attack">Attack</label>
        <input
          type="range"
          id="filter-envelope-attack"
          min="0"
          max="1"
          step=".01"
          value={envelopeSettings.filter.attack.value}
          onInput={(e) => {
            envelopeSettings.filter.attack.value = parseFloat(
              (e.target as HTMLInputElement).value
            );
          }}
        />
        <label htmlFor="filter-envelope-release">Release</label>
        <input
          type="range"
          id="filter-envelope-release"
          min="0"
          max="1"
          step=".01"
          value={envelopeSettings.filter.release.value}
          onInput={(e) => {
            envelopeSettings.filter.release.value = parseFloat(
              (e.target as HTMLInputElement).value
            );
          }}
        />
        <label htmlFor="filter-envelope-amount">Amount</label>
        <input
          type="range"
          id="filter-envelope-amount"
          list="filter-amount-markers"
          min="-100"
          max="100"
          step=".01"
          value={envelopeSettings.filter.amount.value}
          onInput={(e) => {
            envelopeSettings.filter.amount.value = parseFloat(
              (e.target as HTMLInputElement).value
            );
          }}
        />
        <datalist id="filter-amount-markers">
          <option value="-75"></option>
          <option value="-33"></option>
          <option value="0"></option>
          <option value="33"></option>
          <option value="75"></option>
        </datalist>
      </fieldset>
      </div>
    </>
  );
}
