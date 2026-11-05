// Copyright (c) 2024-2026 anyone-Hub LLC. All rights reserved.
import React, { useState } from 'react';
import { TopologyMode } from '../types/phaseform';
import { Network, BatteryCharging, Radio, Sliders, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export const TopologySelector: React.FC = () => {
  const [activeTopology, setActiveTopology] = useState<TopologyMode>('unified_local_off');

  return (
    <section id="topologies" className="w-full py-16 bg-[#08090B] border-b border-[#1F242D]">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#00E5FF] mb-2">
            <span>[ARCH-01] THREE-PILLAR ECOSYSTEM TOPOLOGY</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#F3F4F6] tracking-tight mb-3">
            Hardware &amp; Software Studio Topologies
          </h2>
          <p className="text-sm text-[#8A94A6] leading-relaxed">
            PhaseForm Studio and PhaseForm MIDI Deck are architected to operate as a unified hardware-grade workstation in the studio, a standalone C++23 AAudio synthesizer on the road, or a hybrid synchronized live performance rig.
          </p>
        </div>

        {/* 3 Topology Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <button
            onClick={() => setActiveTopology('unified_local_off')}
            className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
              activeTopology === 'unified_local_off'
                ? 'bg-[#0D0F14] border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.08)]'
                : 'bg-[#0D0F14]/60 border-[#1F242D] hover:border-[#8A94A6]/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-[#00E5FF] font-semibold">[TOPOLOGY A]</span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#141720] border border-[#1F242D] text-[#10B981] rounded">
                0.0% Mobile DSP
              </span>
            </div>
            <div className="text-base font-bold text-[#F3F4F6] mb-1">Unified Desktop + Local-Off</div>
            <div className="text-xs text-[#8A94A6] leading-relaxed">
              Desktop DAW handles 100% audio synthesis &amp; mixing; Android acts as pure 120Hz MPE &amp; telemetry controller.
            </div>
          </button>

          <button
            onClick={() => setActiveTopology('standalone_mobile')}
            className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
              activeTopology === 'standalone_mobile'
                ? 'bg-[#0D0F14] border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.08)]'
                : 'bg-[#0D0F14]/60 border-[#1F242D] hover:border-[#8A94A6]/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-[#10B981] font-semibold">[TOPOLOGY B]</span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#141720] border border-[#1F242D] text-[#8A94A6] rounded">
                Zero Computer
              </span>
            </div>
            <div className="text-base font-bold text-[#F3F4F6] mb-1">Standalone Mobile Workstation</div>
            <div className="text-xs text-[#8A94A6] leading-relaxed">
              Standalone C++23 AAudio synthesis on Android. 16-voice FM synth, 160-slot sampler, and full arrangement canvas.
            </div>
          </button>

          <button
            onClick={() => setActiveTopology('hybrid_split_stage')}
            className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
              activeTopology === 'hybrid_split_stage'
                ? 'bg-[#0D0F14] border-[#FFB000] shadow-[0_0_15px_rgba(255,176,0,0.08)]'
                : 'bg-[#0D0F14]/60 border-[#1F242D] hover:border-[#8A94A6]/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-[#FFB000] font-semibold">[TOPOLOGY C]</span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#141720] border border-[#1F242D] text-[#FFB000] rounded">
                24 PPQN Sync
              </span>
            </div>
            <div className="text-base font-bold text-[#F3F4F6] mb-1">Hybrid Split Stage Rig</div>
            <div className="text-xs text-[#8A94A6] leading-relaxed">
              Simultaneous dual-engine synthesis on stage. Nanosecond spin-wait MIDI clock lock over USB-C OTG or Wi-Fi.
            </div>
          </button>
        </div>

        {/* Detailed Interactive Diagram & Specs for Selected Topology */}
        <div className="p-6 bg-[#0D0F14] border border-[#1F242D] rounded-lg">
          {activeTopology === 'unified_local_off' && (
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#1F242D] mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#F3F4F6]">
                    Topology A: Unified Desktop DAW + Android Companion Controller ("Local Off")
                  </h3>
                  <div className="text-xs text-[#8A94A6] font-mono mt-0.5">
                    OperatingMode.DAW_CONTROLLER_LOCAL_OFF · nativeSetAudioMuted(true) · -90 dBFS Silence Bypass
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#10B981]">
                  <BatteryCharging className="w-4 h-4" />
                  <span>0.0% Mobile DSP Battery Drain</span>
                </div>
              </div>

              {/* Data Flow Architecture Visualizer */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 font-mono text-xs">
                {/* Mobile Surface Node */}
                <div className="p-4 bg-[#08090B] border border-[#1F242D] rounded-lg">
                  <div className="flex items-center justify-between text-[#10B981] mb-3">
                    <span className="font-semibold">ANDROID TOUCH SURFACE</span>
                    <span>120 FPS</span>
                  </div>
                  <ul className="space-y-2 text-[#8A94A6] text-[11px]">
                    <li className="flex items-center gap-1.5 text-[#F3F4F6]">
                      <span className="text-[#10B981]">►</span> 2-Octave MPE Ribbon (Pitch + CC74)
                    </li>
                    <li className="flex items-center gap-1.5 text-[#F3F4F6]">
                      <span className="text-[#10B981]">►</span> 25-Pad Velocity Matrix (&lt;0.45ms)
                    </li>
                    <li className="flex items-center gap-1.5 text-[#F3F4F6]">
                      <span className="text-[#10B981]">►</span> Inertial Kaoss XY Radar
                    </li>
                    <li className="pt-2 border-t border-[#1F242D] text-[#8A94A6]">
                      Audio DSP: <span className="text-[#FF2A54]">MUTED (Zero Battery Load)</span>
                    </li>
                  </ul>
                </div>

                {/* DirectLink Transport Conduit */}
                <div className="p-4 bg-[#101217] border border-[#1F242D] rounded-lg flex flex-col justify-center items-center text-center">
                  <div className="text-[10px] text-[#00E5FF] uppercase font-bold mb-2">DIRECTLINK WIRE BUS (PORT 9088)</div>
                  <div className="w-full flex items-center justify-between text-[11px] text-[#8A94A6] py-1 border-b border-[#1F242D]">
                    <span>Control Stream (Up)</span>
                    <span className="text-[#00E5FF]">0xBB 64-bit UMP Packets</span>
                  </div>
                  <div className="w-full flex items-center justify-between text-[11px] text-[#8A94A6] py-1 border-b border-[#1F242D]">
                    <span>Feedback Stream (Down)</span>
                    <span className="text-[#10B981]">120 FPS LUFS &amp; VU Telemetry</span>
                  </div>
                  <div className="w-full flex items-center justify-between text-[11px] text-[#8A94A6] py-1">
                    <span>Round-Trip Latency</span>
                    <span className="text-[#F3F4F6] font-semibold tabular-nums">&lt; 0.40 ms (USB/Wi-Fi)</span>
                  </div>
                </div>

                {/* Desktop DAW Workstation Node */}
                <div className="p-4 bg-[#08090B] border border-[#1F242D] rounded-lg">
                  <div className="flex items-center justify-between text-[#00E5FF] mb-3">
                    <span className="font-semibold">DESKTOP DAW WORKSTATION</span>
                    <span>C++23 SUMMING</span>
                  </div>
                  <ul className="space-y-2 text-[#8A94A6] text-[11px]">
                    <li className="flex items-center gap-1.5 text-[#F3F4F6]">
                      <span className="text-[#00E5FF]">►</span> Lock-Free Vyukov MpscRingBuffer
                    </li>
                    <li className="flex items-center gap-1.5 text-[#F3F4F6]">
                      <span className="text-[#00E5FF]">►</span> 64-bit Mix Engine &amp; VST3/CLAP
                    </li>
                    <li className="flex items-center gap-1.5 text-[#F3F4F6]">
                      <span className="text-[#00E5FF]">►</span> Real-Time ZDF 4-Pole Filtering
                    </li>
                    <li className="pt-2 border-t border-[#1F242D] text-[#8A94A6]">
                      ASIO / CoreAudio Latency: <span className="text-[#10B981]">1.8 ms @ 96kHz</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTopology === 'standalone_mobile' && (
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#1F242D] mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#F3F4F6]">
                    Topology B: Standalone Mobile Workstation (On-The-Go Production)
                  </h3>
                  <div className="text-xs text-[#8A94A6] font-mono mt-0.5">
                    OperatingMode.STANDALONE_MOBILE · C++23 PhaseFormDspCore · Exclusive AAudio Sub-2.8ms
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#10B981]">
                  <Cpu className="w-4 h-4" />
                  <span>Thread Pinned to Prime Core</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 font-mono text-xs">
                <div className="p-4 bg-[#08090B] border border-[#1F242D] rounded-lg space-y-3">
                  <div className="text-sm font-bold text-[#F3F4F6]">Full Native C++23 DSP Suite on Device</div>
                  <p className="text-[#8A94A6] text-xs leading-relaxed">
                    Zero computer tether required. The Android device executes the full 16-voice wavetable/FM engine, 160-slot sample programmer with 4-point Hermite cubic interpolation, 4-stem mid/side de-mixer, and OTT multi-band dynamics in hardware-exclusive AAudio.
                  </p>
                  <div className="text-[11px] text-[#10B981]">
                    ✓ sched_setaffinity pinned to arm64 Prime Cores (Cortex-X4 / X3)
                  </div>
                  <div className="text-[11px] text-[#10B981]">
                    ✓ 16KB Page-Aligned Native Shared Libraries (-Wl,-z,max-page-size=16384)
                  </div>
                </div>

                <div className="p-4 bg-[#08090B] border border-[#1F242D] rounded-lg space-y-3">
                  <div className="text-sm font-bold text-[#F3F4F6]">Unified Project &amp; Kit Exchange</div>
                  <p className="text-[#8A94A6] text-xs leading-relaxed">
                    Compose full multi-track projects using the 1,542-line <code className="text-[#00E5FF]">LiveArrangementCanvasView</code>. Export lossless <code className="text-[#00E5FF]">.pfpreset</code> synth patches and <code className="text-[#00E5FF]">.pfkit</code> 160-slot sample bundles directly into the Desktop DAW when returning to the studio.
                  </p>
                  <div className="text-[11px] text-[#00E5FF]">
                    ✓ 100% Binary Project Compatibility with PhaseForm Studio Desktop
                  </div>
                  <div className="text-[11px] text-[#00E5FF]">
                    ✓ 48kHz / 24-bit PCM Stem Bouncing to External Storage
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTopology === 'hybrid_split_stage' && (
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#1F242D] mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#F3F4F6]">
                    Topology C: Hybrid Split Stage Rig (Simultaneous Synthesis + Clock Sync)
                  </h3>
                  <div className="text-xs text-[#8A94A6] font-mono mt-0.5">
                    OperatingMode.HYBRID_SPLIT_STAGE · 24 PPQN Nanosecond Spin-Wait Sync · USB OTG &amp; Wi-Fi
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#FFB000]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Nanosecond Clock Drift &lt; 0.002%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 bg-[#08090B] border border-[#1F242D] rounded-lg">
                  <div className="text-[#FFB000] font-semibold text-xs mb-2">STAGE ROLE: DESKTOP DAW</div>
                  <div className="text-xs text-[#8A94A6] leading-relaxed">
                    Master playback authority running backing tracks, acoustic stems, heavy VST3 orchestral plugins, and Stage lighting DMX triggers.
                  </div>
                </div>
                <div className="p-4 bg-[#08090B] border border-[#1F242D] rounded-lg">
                  <div className="text-[#10B981] font-semibold text-xs mb-2">CLOCK ARBITER: 24 PPQN</div>
                  <div className="text-xs text-[#8A94A6] leading-relaxed">
                    Real-time MIDI Clock (<code className="text-[#00E5FF]">0xF8</code>) pulses with start (<code className="text-[#10B981]">0xFA</code>) and stop (<code className="text-[#FF2A54]">0xFC</code>) commands keeping mobile sequencer strictly phase-locked.
                  </div>
                </div>
                <div className="p-4 bg-[#08090B] border border-[#1F242D] rounded-lg">
                  <div className="text-[#00E5FF] font-semibold text-xs mb-2">STAGE ROLE: ANDROID DECK</div>
                  <div className="text-xs text-[#8A94A6] leading-relaxed">
                    Live solo instrument synthesizing screaming leads and cutting bass drops via hardware USB-C OTG stereo DAC straight to Front-of-House (FOH).
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
