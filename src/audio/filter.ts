import { effect } from "@preact/signals";
import type { FilterSettings } from "../types";

interface FilterProps {
  audioCtx: AudioContext;
  filterSettings: FilterSettings;
}

export function filter({audioCtx, filterSettings}: FilterProps) {
  const audioFilter = new BiquadFilterNode(audioCtx);
  audioFilter.frequency.value = filterSettings.frequency.value;
  audioFilter.type = filterSettings.type.value;
  // effect(() => {
  //   if (audioFilter.type !== filterSettings.type.value) {
  //     audioFilter.type = filterSettings.type.value;
  //   }
  //   if (audioFilter.frequency.value !== filterSettings.frequency.value) {
  //     audioFilter.frequency.value = filterSettings.frequency.value;
  //   }
  // });
  return audioFilter;
}