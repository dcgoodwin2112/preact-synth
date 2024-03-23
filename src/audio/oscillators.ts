import type { OscillatorSettings } from "../types";

interface OscProps {
  audioCtx: AudioContext;
  oscSettings: OscillatorSettings;
}

export function oscillators({ audioCtx, oscSettings }: OscProps) {
  //Oscillator 1 Settings
  const osc1 = new OscillatorNode(audioCtx, {
    type: oscSettings.osc1.type.value,
    frequency: oscSettings.osc1.frequency.value,
    detune: oscSettings.osc1.detune.value,
  });
  const osc1Level = new GainNode(audioCtx, {
    gain: oscSettings.osc1.volume.value,
  });
  osc1.connect(osc1Level);

  //Oscillator 2 Settings
  const osc2 = new OscillatorNode(audioCtx, {
    type: oscSettings.osc2.type.value,
    frequency: oscSettings.osc2.frequency.value,
    detune: oscSettings.osc2.detune.value,
  });
  const osc2Level = new GainNode(audioCtx, {
    gain: oscSettings.osc2.volume.value,
  });
  osc2.connect(osc2Level);

  return [osc1, osc2, osc1Level, osc2Level] as const;
}
