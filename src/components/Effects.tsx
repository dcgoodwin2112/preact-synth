import type { EffectsSettings } from "../types";

interface EffectsProps {
  effectsSettings: EffectsSettings;
}

export function Effects({ effectsSettings }: EffectsProps) {
  return (
    <div id="effects">
      <fieldset id="effects-settings">
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
        <div>
          <input
            type="checkbox"
            id="reverb"
            checked={effectsSettings.reverb.enabled}
            onInput={(e) => {
              effectsSettings.reverb.enabled.value = (
                e.target as HTMLInputElement
              ).checked;
            }}
          />
          <label htmlFor="reverb">Reverb</label>
        </div>
      </fieldset>
    </div>
  );
}
