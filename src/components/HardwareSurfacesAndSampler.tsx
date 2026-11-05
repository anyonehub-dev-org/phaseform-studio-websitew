// Copyright (c) 2024-2026 anyone-Hub LLC. All rights reserved.
import React, { useState } from 'react';
import { SampleSlot } from '../types/phaseform';
import { studioAudio } from '../audio/studioAudioEngine';
import { Volume2, Sliders, Layers, Play, Check } from 'lucide-react';

const INITIAL_SAMPLE_SLOTS: SampleSlot[] = [
  { slotId: 128, type: 'pad', noteOrPad: 'PAD 01', name: 'Analog 909 Sub Kick', category: 'kick', assignedFile: 'kick_909_sub_48k.wav', tuningSemitones: 0, velocityCurve: 'Exponential', triggerMode: 'One-Shot', rootKey: 36 },
  { slotId: 129, type: 'pad', noteOrPad: 'PAD 02', name: 'Snappy Layered Snare', category: 'snare', assignedFile: 'snr_crisp_transient.wav', tuningSemitones: 2, velocityCurve: 'Linear', triggerMode: 'One-Shot', rootKey: 38 },
  { slotId: 130, type: 'pad', noteOrPad: 'PAD 03', name: 'Metallic Closed 808 Hat', category: 'hihat', assignedFile: 'hat_cl_808_metallic.wav', tuningSemitones: 0, velocityCurve: 'Compressed', triggerMode: 'One-Shot', rootKey: 42 },
  { slotId: 131, type: 'pad', noteOrPad: 'PAD 04', name: 'FM Percussion Resonance', category: 'perc', assignedFile: 'perc_fm_resonator.wav', tuningSemitones: -3, velocityCurve: 'Linear', triggerMode: 'Gate', rootKey: 45 },
  { slotId: 132, type: 'pad', noteOrPad: 'PAD 05', name: 'Neuro Bass Res Reese', category: 'bass', assignedFile: 'bass_reese_detuned.wav', tuningSemitones: 0, velocityCurve: 'Exponential', triggerMode: 'Loop', rootKey: 33 },
  { slotId: 60, type: 'keygroup', noteOrPad: 'KEY C4', name: 'Warm Rhodes Multi-Sample', category: 'lead', assignedFile: 'rhodes_vel4_c4.wav', tuningSemitones: 0, velocityCurve: 'Linear', triggerMode: 'Gate', rootKey: 60 },
  { slotId: 62, type: 'keygroup', noteOrPad: 'KEY D4', name: 'Warm Rhodes Multi-Sample', category: 'lead', assignedFile: 'rhodes_vel4_d4.wav', tuningSemitones: 0, velocityCurve: 'Linear', triggerMode: 'Gate', rootKey: 62 },
  { slotId: 64, type: 'keygroup', noteOrPad: 'KEY E4', name: 'Vocal Choir Ambient Pad', category: 'pad', assignedFile: 'choir_lush_stereo.wav', tuningSemitones: 1, velocityCurve: 'Exponential', triggerMode: 'Loop', rootKey: 64 },
];

export const HardwareSurfacesAndSampler: React.FC = () => {
  const [selectedSlot, setSelectedSlot] = useState<SampleSlot>(INITIAL_SAMPLE_SLOTS[0]);
  const [slots, setSlots] = useState<SampleSlot[]>(INITIAL_SAMPLE_SLOTS);
  const [viewMode, setViewMode] = useState<'pads' | 'keygroups'>('pads');

  const updateCurrentSlot = (patch: Partial<SampleSlot>) => {
    const updated = { ...selectedSlot, ...patch };
    setSelectedSlot(updated);
    setSlots(slots.map(s => s.slotId === updated.slotId ? updated : s));
  };

  const handleAudition = () => {
    if (selectedSlot.type === 'pad') {
      const padIdx = selectedSlot.slotId - 128;
      studioAudio.triggerPadVoice(padIdx, 0.9);
    } else {
      studioAudio.triggerPadVoice(3, 0.85);
    }
  };

  const displayedSlots = slots.filter(s => viewMode === 'pads' ? s.type === 'pad' : s.type === 'keygroup');

  return (
    <section className="w-full py-16 bg-[#08090B] border-b border-[#1F242D]">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#00E5FF] mb-2">
            <span>[SURFACES-03] HARDWARE ERGONOMICS &amp; SAMPLE ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#F3F4F6] tracking-tight mb-3">
            Hardware-Grade Surfaces &amp; 160-Slot Sampler
          </h2>
          <p className="text-sm text-[#8A94A6] leading-relaxed">
            Engineered with raw Android <code className="text-[#00E5FF]">awaitPointerEventScope</code> down-contact dispatch for sub-0.45ms touch latency. The universal 160-slot sample programmer lets you map raw 24-bit PCM audio with Hermite cubic 4-point resampling across all 128 MIDI keys and 25 MPC pads.
          </p>
        </div>

        {/* 3 Hardware Surface Architecture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="p-5 bg-[#0D0F14] border border-[#1F242D] rounded-lg">
            <div className="flex items-center justify-between text-xs font-mono text-[#00E5FF] mb-2">
              <span>[SURFACE-A]</span>
              <span className="text-[#10B981]">&lt; 0.45ms Latency</span>
            </div>
            <h3 className="text-base font-bold text-[#F3F4F6] mb-2">DrumPadMatrixController</h3>
            <p className="text-xs text-[#8A94A6] leading-relaxed mb-3">
              Direct pointer down event listener bypassing conventional Jetpack Compose gesture recognition. Supports 4x4 (16) and 5x5 (25) MPC grids with dynamic RGB category rings and Note-Repeat ribbon.
            </p>
            <div className="text-[11px] font-mono text-[#8A94A6] pt-3 border-t border-[#1F242D]">
              Event Route: <span className="text-[#F3F4F6]">PointerInput → MpscRingBuffer</span>
            </div>
          </div>

          <div className="p-5 bg-[#0D0F14] border border-[#1F242D] rounded-lg">
            <div className="flex items-center justify-between text-xs font-mono text-[#FFB000] mb-2">
              <span>[SURFACE-B]</span>
              <span className="text-[#00E5FF]">MIDI 2.0 64-bit</span>
            </div>
            <h3 className="text-base font-bold text-[#F3F4F6] mb-2">RibbonKeyController</h3>
            <p className="text-xs text-[#8A94A6] leading-relaxed mb-3">
              2-octave continuous touch surface with MPE voice channel rotation (Ch 2–16). X-axis provides continuous microtonal pitch bends while Y-axis maps to 64-bit CC 74 Timbre brightness without stepping.
            </p>
            <div className="text-[11px] font-mono text-[#8A94A6] pt-3 border-t border-[#1F242D]">
              Resolution: <span className="text-[#F3F4F6]">32-bit Float UMP Envelope</span>
            </div>
          </div>

          <div className="p-5 bg-[#0D0F14] border border-[#1F242D] rounded-lg">
            <div className="flex items-center justify-between text-xs font-mono text-[#FF2A54] mb-2">
              <span>[SURFACE-C]</span>
              <span className="text-[#FFB000]">120Hz Inertial Physics</span>
            </div>
            <h3 className="text-base font-bold text-[#F3F4F6] mb-2">KaossXySurface</h3>
            <p className="text-xs text-[#8A94A6] leading-relaxed mb-3">
              Inertial physics vector controller with simulated spring return and friction damping. Pre-mapped to ZDF Filter Cutoff (Parameter ID 9) and Wavefolder Drive (Parameter ID 12).
            </p>
            <div className="text-[11px] font-mono text-[#8A94A6] pt-3 border-t border-[#1F242D]">
              Refresh Rate: <span className="text-[#F3F4F6]">120 FPS Locked Render</span>
            </div>
          </div>
        </div>

        {/* Interactive Universal 160-Slot Sample Programmer */}
        <div className="p-6 bg-[#0D0F14] border border-[#1F242D] rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F242D] mb-6">
            <div>
              <div className="text-xs font-mono text-[#00E5FF] uppercase font-semibold">PROGRAMMER UTILITY</div>
              <h3 className="text-lg font-bold text-[#F3F4F6]">Universal 160-Slot Sample Programmer</h3>
            </div>

            <div className="flex items-center gap-2 bg-[#08090B] border border-[#1F242D] rounded p-1 font-mono text-xs">
              <button
                onClick={() => setViewMode('pads')}
                className={`px-3 py-1 rounded transition-colors ${
                  viewMode === 'pads' ? 'bg-[#1F242D] text-[#00E5FF] font-semibold' : 'text-[#8A94A6]'
                }`}
              >
                MPC Pads (128..152)
              </button>
              <button
                onClick={() => setViewMode('keygroups')}
                className={`px-3 py-1 rounded transition-colors ${
                  viewMode === 'keygroups' ? 'bg-[#1F242D] text-[#00E5FF] font-semibold' : 'text-[#8A94A6]'
                }`}
              >
                Chromatic Keys (0..127)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Slot List */}
            <div className="lg:col-span-5 space-y-2">
              <div className="text-xs font-mono text-[#8A94A6] mb-2 uppercase">SELECT ASSIGNED HARDWARE SLOT</div>
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                {displayedSlots.map((slot) => (
                  <button
                    key={slot.slotId}
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full p-2.5 rounded border text-left font-mono text-xs flex items-center justify-between transition-colors ${
                      selectedSlot.slotId === slot.slotId
                        ? 'bg-[#161B24] border-[#00E5FF] text-[#F3F4F6]'
                        : 'bg-[#08090B] border-[#1F242D] text-[#8A94A6] hover:border-[#8A94A6]/30'
                    }`}
                  >
                    <div>
                      <span className="text-[#00E5FF] font-semibold mr-2">{slot.noteOrPad}</span>
                      <span className="text-[#F3F4F6]">{slot.name}</span>
                    </div>
                    <span className="text-[10px] text-[#8A94A6] uppercase">{slot.category}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Slot Inspector & Parameters */}
            <div className="lg:col-span-7 bg-[#08090B] border border-[#1F242D] rounded-lg p-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#1F242D] mb-4">
                <div>
                  <span className="text-xs text-[#00E5FF] font-bold">{selectedSlot.noteOrPad}: </span>
                  <span className="text-xs text-[#F3F4F6] ml-1">{selectedSlot.assignedFile}</span>
                </div>
                <button
                  onClick={handleAudition}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#10B981] hover:bg-[#0E9F6E] text-black font-semibold rounded transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Audition Slot</span>
                </button>
              </div>

              {/* Tuning Slider */}
              <div className="space-y-4 mb-4">
                <div>
                  <div className="flex justify-between text-[#8A94A6] mb-1">
                    <span>SEMITONE TUNING (-12..+12 ST)</span>
                    <span className="text-[#00E5FF] tabular-nums font-semibold">
                      {selectedSlot.tuningSemitones > 0 ? `+${selectedSlot.tuningSemitones}` : selectedSlot.tuningSemitones} st
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-12}
                    max={12}
                    step={1}
                    value={selectedSlot.tuningSemitones}
                    onChange={(e) => updateCurrentSlot({ tuningSemitones: parseInt(e.target.value) })}
                    className="w-full accent-[#00E5FF] cursor-pointer"
                  />
                </div>

                {/* Velocity Curve */}
                <div>
                  <div className="text-[#8A94A6] mb-1.5 uppercase">VELOCITY RESPONSE CURVE</div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Linear', 'Exponential', 'Compressed'] as const).map((curve) => (
                      <button
                        key={curve}
                        onClick={() => updateCurrentSlot({ velocityCurve: curve })}
                        className={`p-2 rounded border text-center transition-colors ${
                          selectedSlot.velocityCurve === curve
                            ? 'bg-[#1F242D] border-[#00E5FF] text-[#00E5FF] font-semibold'
                            : 'bg-[#101217] border-[#1F242D] text-[#8A94A6]'
                        }`}
                      >
                        {curve}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trigger Mode */}
                <div>
                  <div className="text-[#8A94A6] mb-1.5 uppercase">SAMPLE PLAYBACK TRIGGER MODE</div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['One-Shot', 'Gate', 'Loop'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => updateCurrentSlot({ triggerMode: mode })}
                        className={`p-2 rounded border text-center transition-colors ${
                          selectedSlot.triggerMode === mode
                            ? 'bg-[#1F242D] border-[#10B981] text-[#10B981] font-semibold'
                            : 'bg-[#101217] border-[#1F242D] text-[#8A94A6]'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-[#101217] border border-[#1F242D] rounded text-[11px] text-[#8A94A6]">
                Interpolation: <span className="text-[#F3F4F6]">Hermite Cubic 4-Point Resampling to 48kHz Stereo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
