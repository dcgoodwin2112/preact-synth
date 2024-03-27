import { FilterType, FilterSettings } from "../types";

interface FilterProps {
  filterSettings: FilterSettings;
}

export function Filter({ filterSettings }: FilterProps) {
  return (
    <div id="filter">
      <fieldset
        id="filter-settings"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <legend>Filter Settings</legend>
        <label htmlFor="filter-type">Filter Type</label>
        <select
          id="filter-type"
          value={filterSettings.type.value}
          onInput={(e) => {
            let type = (e.target as HTMLInputElement).value;
            filterSettings.type.value = type as FilterType;
          }}
        >
          <option value="lowpass">Lowpass</option>
          <option value="highpass">Highpass</option>
        </select>
        <label htmlFor="filter-frequency">Cutoff Frequency</label>
        <input
          type="range"
          id="filter-frequency"
          min="80"
          max="10000"
          value={filterSettings.frequency.value}
          onInput={(e) => {
            filterSettings.frequency.value = parseFloat(
              (e.target as HTMLInputElement).value
            );
          }}
        />
        <label htmlFor="filter-resonance">Resonance</label>
        <input
          type="range"
          id="filter-resonance"
          min="1"
          max="40"
          step=".1"
          value={filterSettings.resonance.value}
          onInput={(e) => {
            filterSettings.resonance.value = parseFloat(
              (e.target as HTMLInputElement).value
            );
          }}
        />
      </fieldset>
    </div>
  );
}
