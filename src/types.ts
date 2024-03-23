import type { Signal } from "@preact/signals";

export type OscillatorType = "sine" | "square" | "sawtooth" | "triangle";

export type FilterType = "lowpass" | "highpass";

export type GlobalSettings = {
  tempo: Signal<number>;
  sequenceSteps: Signal<number>;
  sequenceNotes: Signal<number>;
  noteMidiStart: Signal<number>;
};

export type OscillatorSettings = {
  osc1: {
    type: Signal<OscillatorType>;
    frequency: Signal<number>;
    volume: Signal<number>;
    detune: Signal<number>;
  },
  osc2: {
    type: Signal<OscillatorType>;
    frequency: Signal<number>;
    volume: Signal<number>;
    detune: Signal<number>;
  }
};

export type FilterSettings = {
  type: Signal<FilterType>;
  frequency: Signal<number>;
  resonance: Signal<number>;
};

export type EnvelopeSettings = {
  loudness: {
    attack: Signal<number>;
    release: Signal<number>;
  },
  filter: {
    attack: Signal<number>;
    release: Signal<number>;
    amount: Signal<number>;
  }
};

export type VolumeSettings = {
  mainLevel: Signal<number>;
};

export type EffectsSettings = { 
  delay: {
    enabled: Signal<boolean>;
    time: Signal<number>;
    volume: Signal<number>;
  },
  chorus: {
    enabled: Signal<boolean>;
    time: Signal<number>;
    volume: Signal<number>;
  }
};

export type AudioSettings = {
  global: GlobalSettings,
  oscillators: OscillatorSettings;
  filter: FilterSettings;
  envelope: EnvelopeSettings;
  volume: VolumeSettings;
  effects: EffectsSettings;
};
