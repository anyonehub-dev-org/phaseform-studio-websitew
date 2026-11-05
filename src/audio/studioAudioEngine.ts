// Copyright (c) 2024-2026 anyone-Hub LLC. All rights reserved.

class StudioAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private wavefolderNode: WaveShaperNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayGain: GainNode | null = null;
  private activeVoices: Map<number, { osc: OscillatorNode; gain: GainNode; filter?: BiquadFilterNode }> = new Map();
  private mpeVoice: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode; filter: BiquadFilterNode } | null = null;
  private isInitialized = false;
  private isMuted = false;

  public cutoffFreq = 3800;
  public resonanceQ = 2.4;
  public wavefolderDrive = 1.0;

  public init(): boolean {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return true;
    }

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass({ sampleRate: 48000 });

      // Master Chain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 1024;
      this.analyser.smoothingTimeConstant = 0.8;

      // 4-Pole Filter Simulation (Chained biquads for 24dB/oct)
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(this.cutoffFreq, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(this.resonanceQ, this.ctx.currentTime);

      // Waveshaper (Wavefolder Stompbox emulation)
      this.wavefolderNode = this.ctx.createWaveShaper();
      this.updateWavefolderCurve(1.0);

      // Stereo Ping-Pong / Slap Delay
      this.delayNode = this.ctx.createDelay(1.0);
      this.delayNode.delayTime.setValueAtTime(0.24, this.ctx.currentTime);
      this.delayGain = this.ctx.createGain();
      this.delayGain.gain.setValueAtTime(0.22, this.ctx.currentTime);

      // Routing: Synth -> Filter -> Wavefolder -> Master -> Analyser -> Destination
      this.filterNode.connect(this.wavefolderNode);
      this.wavefolderNode.connect(this.masterGain);

      // Delay send
      this.wavefolderNode.connect(this.delayNode);
      this.delayNode.connect(this.delayGain);
      this.delayGain.connect(this.masterGain);
      this.delayGain.connect(this.delayNode); // feedback loop

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      this.isInitialized = true;
      return true;
    } catch (e) {
      console.warn('WebAudio failed to initialize:', e);
      return false;
    }
  }

  private updateWavefolderCurve(drive: number) {
    if (!this.wavefolderNode || !this.ctx) return;
    const n = 2048;
    const curve = new Float32Array(n);
    const k = Math.max(0.1, drive * 3.5);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      // High-precision foldback formula
      const folded = Math.sin(x * k * Math.PI * 0.5);
      curve[i] = Math.tanh(folded * 1.2);
    }
    this.wavefolderNode.curve = curve;
  }

  public setCutoff(freq: number) {
    this.cutoffFreq = Math.max(20, Math.min(20000, freq));
    if (this.filterNode && this.ctx) {
      this.filterNode.frequency.setTargetAtTime(this.cutoffFreq, this.ctx.currentTime, 0.02);
    }
  }

  public setResonance(q: number) {
    this.resonanceQ = Math.max(0.1, Math.min(18, q));
    if (this.filterNode && this.ctx) {
      this.filterNode.Q.setTargetAtTime(this.resonanceQ, this.ctx.currentTime, 0.02);
    }
  }

  public setDrive(drive: number) {
    this.wavefolderDrive = drive;
    this.updateWavefolderCurve(drive);
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0.0 : 0.75, this.ctx.currentTime, 0.03);
    }
  }

  public getAudioContext(): AudioContext | null {
    return this.ctx;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  // --- Drum / Percussion Voices for MPC Pad Matrix ---
  public triggerPadVoice(padIndex: number, velocity: number = 0.85) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.filterNode) return;

    const t = this.ctx.currentTime;
    const vel = Math.max(0.1, Math.min(1.0, velocity));

    // Pad index mapping to authentic studio percussion
    const category = padIndex % 5;
    if (category === 0) {
      // Sub Kick (909 / Punchy Sine sweep)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(145, t);
      osc.frequency.exponentialRampToValueAtTime(42, t + 0.12);

      gain.gain.setValueAtTime(vel * 0.9, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(gain);
      gain.connect(this.filterNode);
      osc.start(t);
      osc.stop(t + 0.36);
    } else if (category === 1) {
      // Snare / Rimshot with noise burst
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(110, t + 0.08);
      oscGain.gain.setValueAtTime(vel * 0.5, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

      // Snare wire noise buffer
      const bufferSize = this.ctx.sampleRate * 0.2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(1400, t);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(vel * 0.45, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.filterNode);

      osc.connect(oscGain);
      oscGain.connect(this.filterNode);

      osc.start(t);
      whiteNoise.start(t);
      osc.stop(t + 0.22);
      whiteNoise.stop(t + 0.22);
    } else if (category === 2) {
      // Crisp 808/909 Closed / Open Hi-Hat
      const bufferSize = this.ctx.sampleRate * 0.12;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const hatSource = this.ctx.createBufferSource();
      hatSource.buffer = noiseBuffer;
      const hatFilter = this.ctx.createBiquadFilter();
      hatFilter.type = 'bandpass';
      hatFilter.frequency.setValueAtTime(7800 + (padIndex * 120), t);
      hatFilter.Q.setValueAtTime(3.5, t);

      const hatGain = this.ctx.createGain();
      const decay = padIndex > 10 ? 0.22 : 0.08;
      hatGain.gain.setValueAtTime(vel * 0.35, t);
      hatGain.gain.exponentialRampToValueAtTime(0.001, t + decay);

      hatSource.connect(hatFilter);
      hatFilter.connect(hatGain);
      hatGain.connect(this.filterNode);

      hatSource.start(t);
      hatSource.stop(t + decay + 0.02);
    } else if (category === 3) {
      // FM Percussion / Metallic Tom
      const carrier = this.ctx.createOscillator();
      const modulator = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();
      const carrierGain = this.ctx.createGain();

      carrier.type = 'sine';
      modulator.type = 'square';
      const baseFreq = 80 + (padIndex * 14);
      carrier.frequency.setValueAtTime(baseFreq, t);
      modulator.frequency.setValueAtTime(baseFreq * 2.45, t);

      modGain.gain.setValueAtTime(baseFreq * 2.8, t);
      modGain.gain.exponentialRampToValueAtTime(0.1, t + 0.18);

      carrierGain.gain.setValueAtTime(vel * 0.6, t);
      carrierGain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);

      modulator.connect(modGain);
      modGain.connect(carrier.frequency);

      carrier.connect(carrierGain);
      carrierGain.connect(this.filterNode);

      modulator.start(t);
      carrier.start(t);
      modulator.stop(t + 0.25);
      carrier.stop(t + 0.25);
    } else {
      // 808 Deep Reese / 808 Bass Stomp
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';

      const baseNoteFreq = 55 * Math.pow(2, (padIndex % 12) / 12);
      osc1.frequency.setValueAtTime(baseNoteFreq, t);
      osc2.frequency.setValueAtTime(baseNoteFreq * 1.01, t); // slight detune

      gain.gain.setValueAtTime(vel * 0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.filterNode);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.46);
      osc2.stop(t + 0.46);
    }
  }

  // --- MPE 2-Octave Ribbon Continuous Pitch & CC74 Timbre Voice ---
  public startMpeVoice(midiNote: number, timbreY: number = 0.5) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.filterNode) return;

    this.stopMpeVoice();
    const t = this.ctx.currentTime;
    const freq = 440 * Math.pow(2, (midiNote - 69) / 12);

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const localFilter = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(freq, t);
    osc2.frequency.setValueAtTime(freq * 0.998, t); // subtle chorusing

    localFilter.type = 'lowpass';
    const initialCutoff = 400 + Math.pow(timbreY, 2) * 8000;
    localFilter.frequency.setValueAtTime(initialCutoff, t);
    localFilter.Q.setValueAtTime(4.0, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.exponentialRampToValueAtTime(0.45, t + 0.03);

    osc1.connect(localFilter);
    osc2.connect(localFilter);
    localFilter.connect(gain);
    gain.connect(this.filterNode);

    osc1.start(t);
    osc2.start(t);

    this.mpeVoice = { osc1, osc2, gain, filter: localFilter };
  }

  public updateMpeVoice(continuousMidiPitch: number, timbreY: number) {
    if (!this.mpeVoice || !this.ctx) return;
    const t = this.ctx.currentTime;
    const freq = 440 * Math.pow(2, (continuousMidiPitch - 69) / 12);
    this.mpeVoice.osc1.frequency.setTargetAtTime(freq, t, 0.015);
    this.mpeVoice.osc2.frequency.setTargetAtTime(freq * 0.998, t, 0.015);

    // CC 74 Timbre maps to local formant brightness
    const targetCutoff = 400 + Math.pow(timbreY, 2) * 8500;
    this.mpeVoice.filter.frequency.setTargetAtTime(targetCutoff, t, 0.02);
  }

  public stopMpeVoice() {
    if (!this.mpeVoice || !this.ctx) return;
    const t = this.ctx.currentTime;
    const { osc1, osc2, gain } = this.mpeVoice;
    gain.gain.setValueAtTime(gain.gain.value, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    setTimeout(() => {
      try {
        osc1.stop();
        osc2.stop();
        osc1.disconnect();
        osc2.disconnect();
        gain.disconnect();
      } catch {
        // ignore already stopped
      }
    }, 80);
    this.mpeVoice = null;
  }

  // --- Scale-Locked Polyphonic Chord Generator for Beginners ---
  public triggerScaleChord(rootMidi: number, chordType: 'minor' | 'major' | 'sus4' | '7th' = 'minor') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.filterNode) return;

    const t = this.ctx.currentTime;
    let intervals = [0, 3, 7]; // minor
    if (chordType === 'major') intervals = [0, 4, 7];
    else if (chordType === 'sus4') intervals = [0, 5, 7];
    else if (chordType === '7th') intervals = [0, 3, 7, 10];

    intervals.forEach((semi, idx) => {
      if (!this.ctx || !this.filterNode) return;
      const note = rootMidi + semi;
      const freq = 440 * Math.pow(2, (note - 69) / 12);

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.22 / intervals.length, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

      osc.connect(gain);
      gain.connect(this.filterNode);

      osc.start(t);
      osc.stop(t + 1.25);
    });
  }
}

export const studioAudio = new StudioAudioEngine();
