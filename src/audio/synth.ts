import { signal } from "@preact/signals";
import type { AudioSettings, OscillatorType } from "../types";

interface SynthProps {
  audioCtx: AudioContext;
}

//MIDI Note to Hz
const noteToHz = (note: number): number => {
  return 440 * Math.pow(2, (note - 69) / 12);
};

const audioSettings: AudioSettings = {
  global: {
    tempo: signal(120),
    sequenceSteps: signal(16),
    sequenceNotes: signal(13),
    noteMidiStart: signal(60),
  },
  oscillators: {
    osc1: {
      type: signal<OscillatorType>("sawtooth"),
      frequency: signal(noteToHz(60)),
      volume: signal(0.5),
      detune: signal(0),
    },
    osc2: {
      type: signal<OscillatorType>("sawtooth"),
      frequency: signal(noteToHz(60)),
      volume: signal(0.5),
      detune: signal(0),
    },
  },
  filter: {
    type: signal("lowpass"),
    frequency: signal(3000),
    resonance: signal(0),
  },
  envelope: {
    loudness: {
      attack: signal(0.01),
      release: signal(0.1),
    },
    filter: {
      attack: signal(0.01),
      release: signal(0.1),
      amount: signal(0),
    },
  },
  volume: {
    mainLevel: signal(0.5),
  },
  effects: {
    delay: {
      enabled: signal(false),
      time: signal(0.3),
      volume: signal(0.3),
    },
    chorus: {
      enabled: signal(false),
      time: signal(0.3),
      volume: signal(0.3),
    },
  },
};

export function synth({ audioCtx }: SynthProps) {
  const compressor = new DynamicsCompressorNode(audioCtx);
  const mainLevel = new GainNode(audioCtx, {
    gain: audioSettings.volume.mainLevel.value,
  });

  // Play Synth
  const playNote = (midiNote: number = 60) => {
    const frequency = noteToHz(midiNote);
    const time = audioCtx.currentTime;

    //Envelope
    const envelopeGain = new GainNode(audioCtx, { gain: 0.5 });
    envelopeGain.gain.setValueAtTime(0, time);
    envelopeGain.gain.linearRampToValueAtTime(
      0.5,
      time + audioSettings.envelope.loudness.attack.value
    );
    envelopeGain.gain.linearRampToValueAtTime(
      0,
      time +
        audioSettings.envelope.loudness.attack.value +
        audioSettings.envelope.loudness.release.value
    );

    //Filter
    const audioFilter = new BiquadFilterNode(audioCtx, {
      frequency: audioSettings.filter.frequency.value,
      type: audioSettings.filter.type.value,
    });

    //Delay
    if (audioSettings.effects.delay.enabled.value) {
      const delayVolume = 0.3;
      const delayTime = 60 / audioSettings.global.tempo.value;
      const delay = new DelayNode(audioCtx, { delayTime: delayTime });
      const delayGain = new GainNode(audioCtx, { gain: delayVolume });
      const wetGain = new GainNode(audioCtx, { gain: delayVolume });
      const delayFilter = new BiquadFilterNode(audioCtx, { frequency: 1750 });

      const lfo = new OscillatorNode(audioCtx, {
        type: "sine",
        frequency: 0.3,
      });
      const lfoGain = new GainNode(audioCtx, { gain: 0.003 });
      lfo.connect(lfoGain);
      lfoGain.connect(delay.delayTime);
      lfoGain.connect(delayFilter.frequency);
      lfo.start();

      envelopeGain.connect(delayFilter);
      delayFilter.connect(delay);
      delay.connect(delayGain);
      delayGain.connect(delayFilter);
      delay.connect(wetGain);
      wetGain.connect(compressor);
    }

    //Chorus
    if (audioSettings.effects.chorus.enabled.value) {
      const chorusDelay = new DelayNode(audioCtx, { delayTime: 15 / 1000 });
      const chorusGain = new GainNode(audioCtx, { gain: 0.4 });
      const chorusFilter = new BiquadFilterNode(audioCtx, { frequency: 4550 });

      const chorusLfo = new OscillatorNode(audioCtx, {
        type: "sine",
        frequency: 0.55,
      });
      const chorusLfoGain = new GainNode(audioCtx, { gain: 0.0043 });
      chorusLfo.connect(chorusLfoGain);
      chorusLfoGain.connect(chorusDelay.delayTime);
      chorusLfoGain.connect(chorusFilter.frequency);
      chorusLfo.start();

      envelopeGain.connect(chorusFilter);
      chorusFilter.connect(chorusDelay);
      chorusDelay.connect(chorusGain);
      chorusGain.connect(mainLevel);
    }
    
    audioFilter.connect(envelopeGain);
    envelopeGain.connect(compressor);
    compressor.connect(mainLevel);
    mainLevel.connect(audioCtx.destination);

    //Oscillator 1 Settings
    const osc1 = new OscillatorNode(audioCtx, {
      type: audioSettings.oscillators.osc1.type.value,
      frequency: audioSettings.oscillators.osc1.frequency.value,
      detune: audioSettings.oscillators.osc1.detune.value,
    });
    const osc1Level = new GainNode(audioCtx, {
      gain: audioSettings.oscillators.osc1.volume.value,
    });
    osc1.connect(osc1Level);

    //Oscillator 2 Settings
    const osc2 = new OscillatorNode(audioCtx, {
      type: audioSettings.oscillators.osc2.type.value,
      frequency: audioSettings.oscillators.osc2.frequency.value,
      detune: audioSettings.oscillators.osc2.detune.value,
    });
    const osc2Level = new GainNode(audioCtx, {
      gain: audioSettings.oscillators.osc2.volume.value,
    });
    osc2.connect(osc2Level);
    osc1Level.connect(audioFilter);
    osc2Level.connect(audioFilter);
    osc1.frequency.value = frequency;
    osc2.frequency.value = frequency;
    osc1.start(0);
    osc2.start(0);
    osc1.stop(
      time +
        audioSettings.envelope.loudness.attack.value +
        audioSettings.envelope.loudness.release.value
    );
    osc2.stop(
      time +
        audioSettings.envelope.loudness.attack.value +
        audioSettings.envelope.loudness.release.value
    );
  };
  return [audioSettings, playNote] as const;
}
