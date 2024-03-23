import type { EffectsSettings } from "../types";

interface EffectsProps {
  effectsSettings: EffectsSettings;
}

export function Effects({ effectsSettings }: EffectsProps) {
  return (
    <div id="filter">
      <h2>Effects</h2>
      <fieldset
        id="filter-settings"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <legend>Audio Effects</legend>
        <div>
          <input
            type="checkbox"
            id="chorus"
            checked={effectsSettings.chorus.enabled}
            onInput={(e) => {
              effectsSettings.chorus.enabled.value = (
                e.target as HTMLInputElement
              ).checked;
            }}
          />
          <label htmlFor="chorus">Chorus</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="delay"
            checked={effectsSettings.delay.enabled}
            onInput={(e) => {
              effectsSettings.delay.enabled.value = (
                e.target as HTMLInputElement
              ).checked;
            }}
          />
          <label htmlFor="delay">Delay</label>
        </div>
      </fieldset>
    </div>
  );
}
