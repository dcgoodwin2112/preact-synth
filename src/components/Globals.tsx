import { Signal } from "@preact/signals";
import type { GlobalSettings } from "../types";

interface GlobalsProps {
  globalSettings: GlobalSettings;
  isSequencerPlaying: Signal<boolean>;
}

export function Globals({ globalSettings, isSequencerPlaying }: GlobalsProps) {
  return (
      <div id="globals">
        <fieldset
          id="tempo-settings"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <legend>Global</legend>
          <label htmlFor="tempo">Tempo</label>
          <input
            disabled={isSequencerPlaying.value}
            type="range"
            id="main-volume"
            min="0"
            max="240"
            value={globalSettings.tempo.value}
            onInput={(e) => {
              globalSettings.tempo.value = parseInt(
                (e.target as HTMLInputElement).value
              );
            }}
          />
         Current Tempo: <span>{globalSettings.tempo.value}</span>
        </fieldset>
      </div>
  );
}
