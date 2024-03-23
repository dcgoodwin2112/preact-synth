import type { VolumeSettings } from "../types";

interface MainOutputProps {
  volumeSettings: VolumeSettings;
}

export function MainOutput({ volumeSettings }: MainOutputProps) {
  return (
    <div>
      <div id="main-output">
        <h2>Main Output</h2>
        <fieldset
          id="main-output-settings"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <legend>Volume</legend>
          <label htmlFor="main-volume">Volume</label>
          <input
            type="range"
            id="main-volume"
            min="0"
            max="100"
            value={volumeSettings.mainLevel.value * 200}
            onInput={(e) => {
              volumeSettings.mainLevel.value =
                parseFloat((e.target as HTMLInputElement).value) / 200;
            }}
          />
        </fieldset>
      </div>
    </div>
  );
}
