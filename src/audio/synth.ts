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
      volume: signal(0.4),
      detune: signal(0),
    },
    osc2: {
      type: signal<OscillatorType>("sawtooth"),
      frequency: signal(noteToHz(60)),
      volume: signal(0.4),
      detune: signal(0),
    },
  },
  filter: {
    type: signal("lowpass"),
    frequency: signal(5000),
    resonance: signal(1),
  },
  envelope: {
    loudness: {
      attack: signal(0.05),
      release: signal(0.22),
    },
    filter: {
      attack: signal(0.05),
      release: signal(0.22),
      amount: signal(0),
    },
  },
  volume: {
    mainLevel: signal(0.4),
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
    reverb: {
      enabled: signal(false),
    },
  },
};

export async function synth({ audioCtx }: SynthProps) {
  async function loadImpulseResponse(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioCtx.decodeAudioData(arrayBuffer);
  }
  const reverbBuffer = await loadImpulseResponse(
    `/ir/302-SmallHall.wav`
  );
  const reverb = new ConvolverNode(audioCtx);
  reverb.buffer = reverbBuffer;

  const compressor = new DynamicsCompressorNode(audioCtx);
  const mainLevel = new GainNode(audioCtx, {
    gain: audioSettings.volume.mainLevel.value,
  });

  // Play Synth
  const playNote = (midiNote: number = 60) => {
    const frequency = noteToHz(midiNote);
    const time = audioCtx.currentTime;

    mainLevel.gain.value = audioSettings.volume.mainLevel.value;

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
      Q: audioSettings.filter.resonance.value,
    });
    if (audioSettings.envelope.filter.amount.value !== 0) {
      const envelopeAmt = audioSettings.envelope.filter.amount.value * 100;
      audioFilter.frequency.setValueAtTime(
        audioSettings.filter.frequency.value,
        time
      );
      audioFilter.frequency.linearRampToValueAtTime(
        Math.min(
          Math.max(audioSettings.filter.frequency.value + envelopeAmt, 0),
          10000
        ),
        time + audioSettings.envelope.filter.attack.value
      );
      audioFilter.frequency.linearRampToValueAtTime(
        audioSettings.filter.frequency.value,
        time +
          audioSettings.envelope.filter.attack.value +
          audioSettings.envelope.filter.release.value
      );
    }

    const effectGainLimit = 0.88;
    //Reverb
    const reverbInput = new GainNode(audioCtx, { gain: effectGainLimit });
    const reverbOutput = new GainNode(audioCtx, { gain: effectGainLimit });
    if (audioSettings.effects.reverb.enabled.value) {
      const reverbVolume = 0.21;
      const reverbTime = 2.66;
      const reverbPreGain = new GainNode(audioCtx, { gain: reverbVolume });
      const reverbWetGain = new GainNode(audioCtx, { gain: reverbVolume });
      const reverbDryGain = new GainNode(audioCtx, { gain: effectGainLimit });
      reverbInput.connect(reverb);
      reverb.connect(reverbWetGain);
      reverbWetGain.connect(reverbOutput);
      reverbInput.connect(reverbDryGain);
      reverbDryGain.connect(reverbOutput);
      reverbPreGain.gain.linearRampToValueAtTime(0, time + reverbTime);
      reverbWetGain.gain.linearRampToValueAtTime(0, time + reverbTime);
    } else {
      reverbInput.connect(reverbOutput);
    }

    //Delay
    const delayInput = new GainNode(audioCtx, { gain: effectGainLimit });
    const delayOutput = new GainNode(audioCtx, { gain: effectGainLimit });
    if (audioSettings.effects.delay.enabled.value) {
      const delayVolume = 0.3;
      const delayTime = 60 / audioSettings.global.tempo.value;
      const delay = new DelayNode(audioCtx, { delayTime: delayTime });
      const delayGain = new GainNode(audioCtx, { gain: delayVolume });
      const delayWetGain = new GainNode(audioCtx, { gain: delayVolume });
      const delayDryGain = new GainNode(audioCtx, { gain: effectGainLimit });
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

      delayInput.connect(delayFilter);
      delayFilter.connect(delay);
      delay.connect(delayGain);
      delayGain.connect(delayFilter);
      delay.connect(delayWetGain);
      delayWetGain.connect(delayOutput);
      delayInput.connect(delayDryGain);
      delayDryGain.connect(delayOutput);
    } else {
      delayInput.connect(delayOutput);
    }

    //Chorus
    const chorusInput = new GainNode(audioCtx, { gain: effectGainLimit });
    const chorusOutput = new GainNode(audioCtx, { gain: effectGainLimit });
    if (audioSettings.effects.chorus.enabled.value) {
      const chorusDelay1 = new DelayNode(audioCtx, { delayTime: 0.004 });
      const chorusDelay2 = new DelayNode(audioCtx, { delayTime: 0.008 });
      const chorusDelay3 = new DelayNode(audioCtx, { delayTime: 0.012 });
      const chorusWetGain = new GainNode(audioCtx, { gain: 0.66 });
      const chorusDryGain = new GainNode(audioCtx, { gain: 0.66 });

      const chorusLfo = new OscillatorNode(audioCtx, {
        type: "sine",
        frequency: 0.5,
      });

      const chorusLfoGain = new GainNode(audioCtx, { gain: 0.002 });
      chorusLfo.connect(chorusLfoGain);
      chorusLfoGain.connect(chorusDelay1.delayTime);
      chorusLfo.start();

      chorusInput.connect(chorusDelay1);
      chorusDelay1.connect(chorusDelay2);
      chorusDelay2.connect(chorusDelay3);
      chorusDelay3.connect(chorusWetGain);
      chorusWetGain.connect(chorusOutput);
      chorusInput.connect(chorusDryGain);
      chorusDryGain.connect(chorusOutput);
    } else {
      chorusInput.connect(chorusOutput);
    }

    // Effects Chain
    envelopeGain.connect(chorusInput);
    chorusOutput.connect(delayInput);
    delayOutput.connect(reverbInput);
    reverbOutput.connect(mainLevel);

    audioFilter.connect(envelopeGain);
    mainLevel.connect(compressor);
    compressor.connect(audioCtx.destination);

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
