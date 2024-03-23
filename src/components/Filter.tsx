import { FilterType, FilterSettings } from "../types";

interface FilterProps {
  filterSettings: FilterSettings;
}

export function Filter({ filterSettings }: FilterProps) {
  return (
    <div id="filter">
      <h2>Filter</h2>
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
        <input type="range" id="filter-frequency" min="80" max="6000" value={(filterSettings.frequency.value)} onInput={(e) => {
           filterSettings.frequency.value = parseFloat((e.target as HTMLInputElement).value);
        }}/>
      </fieldset>
    </div>
  );
}
