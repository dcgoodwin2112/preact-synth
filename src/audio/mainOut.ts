import { effect } from "@preact/signals";
import { VolumeSettings } from "../types";

interface MainOutProps {
  audioCtx: AudioContext;
  volumeSettings: VolumeSettings;
}

export function mainOut({ audioCtx, volumeSettings }: MainOutProps) {
  const mainLevel = new GainNode(audioCtx, {
    gain: volumeSettings.mainLevel.value,
  });
  // effect(() => {
  //   if (mainLevel.gain.value !== volumeSettings.mainLevel.value) {
  //     mainLevel.gain.value = volumeSettings.mainLevel.value;
  //   }
  // });
  return mainLevel;
}
