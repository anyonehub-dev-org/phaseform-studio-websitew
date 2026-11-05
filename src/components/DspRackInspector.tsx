// Copyright (c) 2024-2026 anyone-Hub LLC. All rights reserved.
import React, { useState, useEffect, useRef } from 'react';
import { DspStage } from '../types/phaseform';
import { Sliders, Cpu, Activity, Zap, Play } from 'lucide-react';

const DSP_STAGES: DspStage[] = [
  {
    id: 'stage-01',
    index: 'STAGE 01',
    name: 'Dual Sound Generators',
    subsystem: 'OSC & SAMPLER ENGINE',
    description: '16-Voice Wavetable/FM Synthesizer paired with a 160-Slot Native Sampler (Slots 0..127 Chromatic Keygroups + Slots 128..152 MPC Pads) with 4-point Hermite cubic resampling and envelope-weighted least-energy voice stealing.',
    cppFormula: `// Hermite 4-point, 3rd-order interpolation for 48kHz resampling
inline float hermite4p(float x, float y0, float y1, float y2, float y3) noexcept {
    const float c0 = y1;
    const float c1 = 0.5f * (y2 - y0);
    const float c2 = y0 - 2.5f * y1 + 2.0f * y2 - 0.5f * y3;
    const float c3 = 0.5f * (y3 - y0) + 1.5f * (y1 - y2);
    return ((c3 * x + c2) * x + c1) * x + c0;
}`,
    parameters: [
      { name: 'FM Modulation Index', key: 'fmIndex', value: 2.4, min: 0, max: 10, unit: 'x', step: 0.1 },
      { name: 'Harmonic Detune', key: 'detune', value: 7, min: 0, max: 50, unit: 'cents', step: 1 },
      { name: 'Wavetable Position', key: 'wtPos', value: 0.35, min: 0, max: 1, unit: '%', step: 0.01 }
    ],
    features: ['160 Sample Slots', 'Hermite Cubic Resampling', 'Zero-Allocation Voice Stealing']
  },
  {
    id: 'stage-02',
    index: 'STAGE 02',
    name: 'Formant & Temporal Modulation',
    subsystem: 'THROAT RESONATOR & CHOPPER',
    description: 'Dual 3-biquad vocal formant resonator modeling human phonetic tracts (A, E, I, O, U) coupled with a tempo-synced chopper LFO for stutter, trance-gate, and granular chopping.',
    cppFormula: `// Dual 3-Biquad Formant Throat Resonator Direct Form II Transposed
void processFormants(float in, float& out, const FormantCoeffs& f) noexcept {
    float y = 0.0f;
    for (int i = 0; i < 3; ++i) {
        y += biquadDF2T(in, f.b0[i], f.b1[i], f.b2[i], f.a1[i], f.a2[i], state[i]);
    }
    out = in * (1.0f - f.wet) + y * f.wet;
}`,
    parameters: [
      { name: 'Formant Vowel Morph', key: 'vowelMorph', value: 0.62, min: 0, max: 1, unit: 'morph', step: 0.01 },
      { name: 'Resonator Q (Throat Width)', key: 'throatQ', value: 8.5, min: 1, max: 20, unit: 'Q', step: 0.5 },
      { name: 'Stutter Rate (16th Grid)', key: 'stutterRate', value: 4, min: 1, max: 16, unit: 'steps', step: 1 }
    ],
    features: ['3-Biquad Vocal Resonator', 'Tempo-Synced Chopper LFO', 'Vowel Phonation Morphing']
  },
  {
    id: 'stage-03',
    index: 'STAGE 03',
    name: '4-Pole ZDF Filter Matrix',
    subsystem: 'NON-LINEAR ANALOG CORE',
    description: 'Zero-Delay Feedback 24dB/octave ladder filter featuring non-linear saturation within each integrator loop, single-pole zipper-free parameter smoothing (kSmoothingCoeff = 0.05f), and self-oscillation resonance.',
    cppFormula: `// ZDF 4-Pole Ladder with Integrator Saturation & Traversal
float stepZDF(float x, float g, float k) noexcept {
    float S = s0 + g*(s1 + g*(s2 + g*s3));
    float u = fastTanh((x - k * S) / (1.0f + k * g * g * g * g));
    float v0 = fastTanh(g * (u - s0)); float y0 = v0 + s0; s0 = y0 + v0;
    float v1 = fastTanh(g * (y0 - s1)); float y1 = v1 + s1; s1 = y1 + v1;
    float v2 = fastTanh(g * (y1 - s2)); float y2 = v2 + s2; s2 = y2 + v2;
    float v3 = fastTanh(g * (y2 - s3)); float y3 = v3 + s3; s3 = y3 + v3;
    return y3;
}`,
    parameters: [
      { name: 'Cutoff Frequency', key: 'cutoff', value: 3400, min: 20, max: 20000, unit: 'Hz', step: 10 },
      { name: 'Resonance Feedback (K)', key: 'resonance', value: 3.2, min: 0.1, max: 4.0, unit: 'k', step: 0.05 },
      { name: 'Drive Saturation', key: 'drive', value: 1.8, min: 0.5, max: 5.0, unit: 'x', step: 0.1 }
    ],
    features: ['Zero-Delay Feedback', 'Nonlinear Integrators', 'Zipper-Free Smoothing']
  },
  {
    id: 'stage-04',
    index: 'STAGE 04',
    name: 'Nonlinear Harmonics & Sub-Lock',
    subsystem: 'WAVEFOLDER & CROSSOVER',
    description: '8-stage folding distortion stompbox paired with an 88.3Hz Linkwitz-Riley 4th-order (24dB/oct) crossover that locks sub-bass frequencies below 88.3Hz into mono, guaranteeing tight punch on club sound systems.',
    cppFormula: `// 8-Stage Wavefolder & 88.3Hz Linkwitz-Riley Sub-Lock
inline float fold8(float x, float drive) noexcept {
    float v = x * drive;
    for (int i = 0; i < 8; ++i) {
        if (v > 1.0f) v = 2.0f - v;
        else if (v < -1.0f) v = -2.0f - v;
    }
    return v;
}`,
    parameters: [
      { name: 'Fold Iterations', key: 'foldIterations', value: 6, min: 1, max: 8, unit: 'stages', step: 1 },
      { name: 'Wavefolder Drive', key: 'foldDrive', value: 2.8, min: 1.0, max: 8.0, unit: 'x', step: 0.1 },
      { name: 'Sub-Lock Crossover', key: 'subCrossover', value: 88.3, min: 40, max: 150, unit: 'Hz', step: 0.5 }
    ],
    features: ['8-Stage Foldback Drive', '88.3Hz LR-4 Crossover', 'Club Mono Sub-Lock']
  },
  {
    id: 'stage-05',
    index: 'STAGE 05',
    name: 'Multi-Band Dynamics & Phase',
    subsystem: '3-BAND OTT & HILBERT SHIFTER',
    description: '3-Band Over-The-Top (OTT) upward and downward compressor, combined with a 12th-order Hilbert transform quadrature frequency shifter for barber-pole phasing, metallic detuning, and acoustic comb flanging.',
    cppFormula: `// Hilbert Transform 90-degree Quadrature Filter Pair
void processHilbert(float in, float& iOut, float& qOut) noexcept {
    // 6-stage cascaded allpass network computing sin/cos analytical signal
    float a = allpassBranchA.process(in);
    float b = allpassBranchB.process(in);
    iOut = a; // Real in-phase
    qOut = b; // Imaginary 90-deg quadrature
}`,
    parameters: [
      { name: 'OTT Compression Depth', key: 'ottDepth', value: 65, min: 0, max: 100, unit: '%', step: 1 },
      { name: 'Hilbert Frequency Shift', key: 'hilbertShift', value: 24, min: -500, max: 500, unit: 'Hz', step: 1 },
      { name: 'Comb Flange Feedback', key: 'combFeedback', value: 0.72, min: 0, max: 0.98, unit: 'fb', step: 0.01 }
    ],
    features: ['3-Band Upward/Downward OTT', '12th-Order Hilbert Shifter', 'Flange Comb Matrix']
  },
  {
    id: 'stage-06',
    index: 'STAGE 06',
    name: 'Mastering & Spatial Bus',
    subsystem: '8-BAND EQ & DIFFUSION REVERB',
    description: '8-band parametric biquad equalizer with proportional Q, 8-comb/4-allpass Schroeder-Moorer stereo diffusion reverberator, and sample-accurate sidechain ducking envelope follower.',
    cppFormula: `// Parametric Biquad with Proportional Q & Stereo Diffusion
float processBiquad(float in, const BiquadCoeffs& c, BiquadState& s) noexcept {
    float out = c.b0 * in + s.d1;
    s.d1 = c.b1 * in - c.a1 * out + s.d2;
    s.d2 = c.b2 * in - c.a2 * out;
    return out;
}`,
    parameters: [
      { name: 'EQ Air Shelf (12kHz)', key: 'airShelf', value: 2.5, min: -12, max: 12, unit: 'dB', step: 0.5 },
      { name: 'Reverb Decay Time', key: 'reverbDecay', value: 3.2, min: 0.2, max: 15, unit: 'sec', step: 0.1 },
      { name: 'Sidechain Ducking Depth', key: 'ducking', value: 75, min: 0, max: 100, unit: '%', step: 1 }
    ],
    features: ['8-Band Parametric EQ', 'Stereo Comb/Allpass Reverb', 'Dynamic Sidechain Ducking']
  },
  {
    id: 'stage-07',
    index: 'STAGE 07',
    name: '4-Stem De-Mixer & Brickwall Protection',
    subsystem: 'STEM SEPARATION & MASTERING',
    description: 'Real-time Mid/Side 4-stem de-mixing matrix (Drums, Bass, Synths, Vocal), 2-stage ITU-R BS.1770 K-weighted LUFS meter, and Stage 12 SIMD fastTanh soft-clipper preventing digital overs.',
    cppFormula: `// Mid/Side 4-Stem De-Mixer Matrix & Fast SIMD Tanh Clipper
inline float fastTanh(float x) noexcept {
    const float x2 = x * x;
    const float a = x * (135135.0f + x2 * (17325.0f + x2 * (378.0f + x2)));
    const float b = 135135.0f + x2 * (62370.0f + x2 * (3150.0f + x2 * 28.0f));
    return a / b;
}`,
    parameters: [
      { name: 'Stem Separation Focus', key: 'stemFocus', value: 0.85, min: 0, max: 1, unit: 'sep', step: 0.01 },
      { name: 'LUFS Target Ceiling', key: 'lufsCeiling', value: -14.0, min: -24, max: -8, unit: 'LUFS', step: 0.5 },
      { name: 'Clipper Threshold', key: 'clipThresh', value: -0.3, min: -3.0, max: 0.0, unit: 'dBTP', step: 0.1 }
    ],
    features: ['Mid/Side 4-Stem De-Mixer', 'BS.1770-4 K-Weighting', 'SIMD Soft-Clipper']
  }
];

export const DspRackInspector: React.FC = () => {
  const [selectedStageIndex, setSelectedStageIndex] = useState(2); // Stage 03 ZDF default
  const [params, setParams] = useState<Record<string, number>>({
    cutoff: 3400,
    resonance: 3.2,
    drive: 1.8,
    fmIndex: 2.4,
    vowelMorph: 0.62,
    throatQ: 8.5,
    foldDrive: 2.8,
    subCrossover: 88.3,
    hilbertShift: 24,
    airShelf: 2.5,
    reverbDecay: 3.2,
    stemFocus: 0.85
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentStage = DSP_STAGES[selectedStageIndex];

  const handleParamChange = (key: string, val: number) => {
    setParams(prev => ({ ...prev, [key]: val }));
  };

  // Draw Transfer Function / Frequency & Phase Response Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Clear background
    ctx.fillStyle = '#08090B';
    ctx.fillRect(0, 0, w, h);

    // Grid lines (dB lines & Frequency decades: 20Hz, 100Hz, 1kHz, 10kHz, 20kHz)
    ctx.strokeStyle = '#1F242D';
    ctx.lineWidth = 1;

    const freqs = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
    freqs.forEach(f => {
      const logMin = Math.log10(20);
      const logMax = Math.log10(20000);
      const x = ((Math.log10(f) - logMin) / (logMax - logMin)) * w;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();

      ctx.fillStyle = '#8A94A6';
      ctx.font = '9px JetBrains Mono';
      ctx.fillText(f >= 1000 ? `${f / 1000}k` : `${f}`, x + 3, h - 6);
    });

    // Horizontal dB lines (+12, +6, 0, -6, -12, -24, -48 dB)
    const dbLines = [12, 6, 0, -6, -12, -24, -48];
    dbLines.forEach(db => {
      const y = h / 2 - (db / 24) * (h * 0.35);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();

      ctx.fillStyle = db === 0 ? '#00E5FF' : '#8A94A6';
      ctx.font = '9px JetBrains Mono';
      ctx.fillText(`${db > 0 ? '+' : ''}${db}dB`, 6, y - 3);
    });

    // Draw Transfer Function Curve based on selected stage
    ctx.beginPath();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#00E5FF';

    const logMin = Math.log10(20);
    const logMax = Math.log10(20000);

    for (let px = 0; px < w; px++) {
      const f = Math.pow(10, logMin + (px / w) * (logMax - logMin));
      let magDb = 0;

      if (selectedStageIndex === 2) {
        // ZDF 4-Pole Lowpass
        const cutoff = params.cutoff || 3400;
        const q = params.resonance || 3.2;
        const normF = f / cutoff;
        const baseMag = 1.0 / Math.sqrt(1 + Math.pow(normF, 8)); // 24dB/oct
        // Resonance peak near cutoff
        const resPeak = (q / 3.0) * Math.exp(-Math.pow((f - cutoff) / (cutoff * 0.3), 2));
        magDb = 20 * Math.log10(Math.max(0.001, baseMag + resPeak));
      } else if (selectedStageIndex === 0) {
        // Dual Sound Generators
        magDb = Math.sin(f * 0.005) * 4.0 - Math.log10(f) * 2;
      } else if (selectedStageIndex === 1) {
        // Formant Vocal Throats (Formant Peaks)
        const p1 = 600, p2 = 1800, p3 = 2800;
        const peak1 = 12 * Math.exp(-Math.pow((f - p1) / 120, 2));
        const peak2 = 9 * Math.exp(-Math.pow((f - p2) / 200, 2));
        const peak3 = 6 * Math.exp(-Math.pow((f - p3) / 300, 2));
        magDb = peak1 + peak2 + peak3 - 10;
      } else if (selectedStageIndex === 3) {
        // Wavefolder & Sub-Lock Crossover (88.3Hz)
        const subCut = params.subCrossover || 88.3;
        magDb = f < subCut ? 3.0 : 0.0 - (f > 10000 ? (f - 10000) * 0.001 : 0);
      } else if (selectedStageIndex === 4) {
        // Multi-Band Dynamics OTT (Multi-band compression curve)
        magDb = 4.0 * Math.sin(Math.log10(f) * 3);
      } else if (selectedStageIndex === 5) {
        // 8-Band EQ & Spatial Bus
        const air = params.airShelf || 2.5;
        magDb = f > 8000 ? (air * ((f - 8000) / 12000)) : 0;
      } else {
        // Stage 07 Stem De-Mixer Mid/Side
        magDb = 0;
      }

      // Convert dB to Y coordinate (0 dB is at h/2)
      const py = h / 2 - (magDb / 24) * (h * 0.35);
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Phase Response Trace (Amber line)
    ctx.beginPath();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(255, 176, 0, 0.65)';
    for (let px = 0; px < w; px++) {
      const f = Math.pow(10, logMin + (px / w) * (logMax - logMin));
      const phaseDeg = -180 * (f / 10000); // progressive phase lag
      const py = h / 2 - (phaseDeg / 180) * (h * 0.3);
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

  }, [selectedStageIndex, params]);

  return (
    <section id="dsp-rack" className="w-full py-16 bg-[#08090B] border-b border-[#1F242D]">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#00E5FF] mb-2">
            <span>[DSP-02] UNIFIED C++23 SIGNAL CHAIN ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#F3F4F6] tracking-tight mb-3">
            Shared 10-Stage C++23 DSP &amp; 4-Stem De-Mixer Core
          </h2>
          <p className="text-sm text-[#8A94A6] leading-relaxed">
            The exact same deterministic C++23 audio algorithm powers both the Desktop DAW's native track processing and the Android standalone synth. Click any stage to inspect its real-time transfer function, phase curve, and C++23 algorithmic formulas.
          </p>
        </div>

        {/* 7-Stage Rack Selector Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-8">
          {DSP_STAGES.map((stage, idx) => (
            <button
              key={stage.id}
              onClick={() => setSelectedStageIndex(idx)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer font-mono ${
                selectedStageIndex === idx
                  ? 'bg-[#101217] border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.1)]'
                  : 'bg-[#0D0F14] border-[#1F242D] hover:border-[#8A94A6]/30'
              }`}
            >
              <div className="text-[10px] text-[#00E5FF] font-semibold mb-1">{stage.index}</div>
              <div className="text-xs font-bold text-[#F3F4F6] truncate mb-0.5">{stage.name}</div>
              <div className="text-[9px] text-[#8A94A6] truncate">{stage.subsystem}</div>
            </button>
          ))}
        </div>

        {/* Main Stage Inspector: Graph (Left) + Code & Interactive Controls (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 bg-[#0D0F14] border border-[#1F242D] rounded-lg">
          {/* Left: Transfer Function Canvas Graph */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F242D] mb-4">
              <div>
                <span className="text-xs font-mono text-[#00E5FF] font-semibold">{currentStage.index}: </span>
                <span className="text-sm font-bold text-[#F3F4F6] ml-1">{currentStage.name}</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-[#00E5FF]">
                  <span className="w-2 h-0.5 bg-[#00E5FF]" /> Magnitude (dB)
                </span>
                <span className="flex items-center gap-1.5 text-[#FFB000]">
                  <span className="w-2 h-0.5 bg-[#FFB000]" /> Phase (Deg)
                </span>
              </div>
            </div>

            {/* Canvas Graph Viewport */}
            <div className="border border-[#1F242D] rounded overflow-hidden bg-[#08090B] relative mb-4">
              <canvas 
                ref={canvasRef} 
                width={700} 
                height={260} 
                className="w-full h-[260px] block"
              />
              <div className="absolute top-2 right-3 text-[10px] font-mono text-[#8A94A6] bg-[#08090B]/80 px-2 py-1 rounded border border-[#1F242D]">
                LOGARITHMIC FFT 20Hz – 20kHz
              </div>
            </div>

            {/* Stage Description & Architectural Highlights */}
            <div className="p-3 bg-[#08090B] border border-[#1F242D] rounded text-xs text-[#8A94A6] leading-relaxed">
              <p className="mb-2">{currentStage.description}</p>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-[#1F242D]/80">
                {currentStage.features.map((feat, fidx) => (
                  <span key={fidx} className="text-[10px] font-mono text-[#10B981] bg-[#141720] px-2 py-0.5 rounded border border-[#1F242D]">
                    ✓ {feat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Live Parameter Sliders & C++23 Formula */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            {/* Live Sliders */}
            <div className="mb-6">
              <div className="text-xs font-mono text-[#F3F4F6] font-semibold uppercase mb-3 flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>REAL-TIME STAGE PARAMETERS</span>
              </div>

              <div className="space-y-4">
                {currentStage.parameters.map((p) => {
                  const currentVal = params[p.key] !== undefined ? params[p.key] : p.value;
                  return (
                    <div key={p.key} className="p-3 bg-[#08090B] border border-[#1F242D] rounded font-mono text-xs">
                      <div className="flex items-center justify-between text-[#8A94A6] mb-1.5">
                        <span className="text-[#F3F4F6]">{p.name}</span>
                        <span className="text-[#00E5FF] font-semibold tabular-nums">
                          {currentVal} {p.unit}
                        </span>
                      </div>
                      <input 
                        type="range"
                        min={p.min}
                        max={p.max}
                        step={p.step}
                        value={currentVal}
                        onChange={(e) => handleParamChange(p.key, parseFloat(e.target.value))}
                        className="w-full accent-[#00E5FF] cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exact C++23 Algorithmic Formula */}
            <div className="p-3 bg-[#08090B] border border-[#1F242D] rounded font-mono text-[11px] text-[#8A94A6] overflow-x-auto">
              <div className="text-[#00E5FF] font-semibold mb-1 text-[10px] uppercase">
                // Deterministic C++23 Algorithmic Implementation
              </div>
              <pre className="text-[#F3F4F6] leading-relaxed text-[10px]">
                {currentStage.cppFormula}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
