// Copyright (c) 2024-2026 anyone-Hub LLC. All rights reserved.
import React, { useState } from 'react';
import { Layers, Sliders, Radio, FolderSync, Shield, Cpu, Code2 } from 'lucide-react';

export const DesktopDawDeepDive: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'summing' | 'directlink' | 'mpe' | 'formats'>('summing');

  return (
    <section id="desktop-daw" className="w-full py-16 bg-[#08090B] border-b border-[#1F242D]">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#00E5FF] mb-2">
            <span>[DAW-01] PROFESSIONAL DESKTOP WORKSTATION DEEP-DIVE</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#F3F4F6] tracking-tight mb-3">
            PhaseForm Studio Desktop DAW
          </h2>
          <p className="text-sm text-[#8A94A6] leading-relaxed">
            Engineered in bare-metal modern C++23 for Windows, macOS, and Linux. Built from the ground up to eradicate the latency, jitter, and complex driver configuration that plague conventional DAWs.
          </p>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-[#1F242D] pb-3 font-mono text-xs">
          <button
            onClick={() => setActiveTab('summing')}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === 'summing'
                ? 'bg-[#101217] text-[#00E5FF] border border-[#00E5FF]/40 font-semibold'
                : 'text-[#8A94A6] hover:text-[#F3F4F6]'
            }`}
          >
            64-Bit Summing &amp; Vyukov MpscRingBuffer
          </button>
          <button
            onClick={() => setActiveTab('directlink')}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === 'directlink'
                ? 'bg-[#101217] text-[#00E5FF] border border-[#00E5FF]/40 font-semibold'
                : 'text-[#8A94A6] hover:text-[#F3F4F6]'
            }`}
          >
            Built-In DirectLink Daemon (Port 9088)
          </button>
          <button
            onClick={() => setActiveTab('mpe')}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === 'mpe'
                ? 'bg-[#101217] text-[#00E5FF] border border-[#00E5FF]/40 font-semibold'
                : 'text-[#8A94A6] hover:text-[#F3F4F6]'
            }`}
          >
            Native MPE &amp; MIDI 2.0 Lane Editing
          </button>
          <button
            onClick={() => setActiveTab('formats')}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === 'formats'
                ? 'bg-[#101217] text-[#00E5FF] border border-[#00E5FF]/40 font-semibold'
                : 'text-[#8A94A6] hover:text-[#F3F4F6]'
            }`}
          >
            Unified .pfpreset &amp; .pfkit Architecture
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="p-6 bg-[#0D0F14] border border-[#1F242D] rounded-lg">
          {activeTab === 'summing' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-xs font-mono text-[#00E5FF] uppercase mb-2">DETERMINISTIC AUDIO ENGINE</div>
                <h3 className="text-xl font-bold text-[#F3F4F6] mb-3">
                  64-Bit Float Summing &amp; Lock-Free Event Queues
                </h3>
                <p className="text-xs text-[#8A94A6] leading-relaxed mb-4">
                  Conventional DAWs suffer from priority inversions and thread contention when multiple MIDI controllers compete for the real-time audio thread. PhaseForm Studio Desktop employs a Dmitry Vyukov multi-producer single-consumer lock-free ring buffer (<code className="text-[#00E5FF]">MpscRingBuffer&lt;MidiEvent, 1024&gt;</code>) with explicit <code className="text-[#00E5FF]">std::memory_order_acquire/release</code> semantics.
                </p>
                <div className="space-y-2 font-mono text-xs text-[#8A94A6]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    <span className="text-[#F3F4F6]">Zero heap allocations</span> in the real-time audio callback.
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    <span className="text-[#F3F4F6]">Sample-accurate parameter automation</span> evaluated at sub-block resolution.
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    <span className="text-[#F3F4F6]">AVX-512 &amp; ARM NEON SIMD vectorization</span> for multi-track mixing.
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#08090B] border border-[#1F242D] rounded font-mono text-[11px] text-[#8A94A6] overflow-x-auto">
                <div className="text-[#10B981] mb-2">// PhaseForm Studio C++23 Lock-Free Audio Bus Summing</div>
                <pre className="text-[#F3F4F6] leading-relaxed">
{`template <size_t N>
struct MpscRingBuffer {
    std::atomic<size_t> head_{0};
    std::atomic<size_t> tail_{0};
    alignas(64) MidiEvent buffer_[N];

    bool push(const MidiEvent& ev) noexcept {
        size_t head = head_.load(std::memory_order_relaxed);
        if (head - tail_.load(std::memory_order_acquire) >= N) {
            return false; // Queue full
        }
        buffer_[head & (N - 1)] = ev;
        head_.store(head + 1, std::memory_order_release);
        return true;
    }
};`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'directlink' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-xs font-mono text-[#10B981] uppercase mb-2">ZERO-CONFIGURATION TELEMETRY</div>
                <h3 className="text-xl font-bold text-[#F3F4F6] mb-3">
                  Built-In DirectLink Daemon (Port 9088 TCP / 9188 UDP)
                </h3>
                <p className="text-xs text-[#8A94A6] leading-relaxed mb-4">
                  Eliminates the frustration of installing third-party virtual MIDI loopbacks (loopMIDI, rtpMIDI, IAC Bus). Launching PhaseForm Studio automatically initiates an embedded DirectLink background daemon that broadcasts mDNS discovery packets (<code className="text-[#10B981]">_phaseform._tcp</code>) and binds to Port 9088 TCP for high-speed non-blocking UMP ingestion.
                </p>
                <div className="space-y-2 font-mono text-xs text-[#8A94A6]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                    <span>Instant Wi-Fi auto-discovery via mDNS and UDP broadcast beacons.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                    <span>Hardware USB-C tethering support via ADB Reverse (127.0.0.1:9088).</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                    <span>Two-way 120 FPS telemetry push (LUFS, Peak meters, playhead positions).</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#08090B] border border-[#1F242D] rounded font-mono text-[11px] text-[#8A94A6] space-y-2">
                <div className="text-[#00E5FF] font-semibold">// UDP Broadcast Discovery Beacon Format</div>
                <div className="p-2 bg-[#101217] rounded border border-[#1F242D] text-[#F3F4F6]">
                  {`{"protocol": "phaseform_link", "host": "PhaseForm-Studio-Win64", "tcp_port": 9088, "version": "v2.4", "capabilities": ["ump_64", "direct_byte_buffer", "bs1770_lufs"]}`}
                </div>
                <div className="text-[10px] text-[#8A94A6]">
                  The Android MIDI Deck automatically detects this beacon in &lt;15ms and establishes a persistent TCP connection with TCP_NODELAY enabled.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mpe' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-xs font-mono text-[#FFB000] uppercase mb-2">EXPRESSIVE CONTROL LANES</div>
                <h3 className="text-xl font-bold text-[#F3F4F6] mb-3">
                  Full MPE &amp; 64-Bit MIDI 2.0 Per-Note Lane Editing
                </h3>
                <p className="text-xs text-[#8A94A6] leading-relaxed mb-4">
                  Traditional DAWs cram polyphonic pitch bend and aftertouch into global channel events. PhaseForm Studio provides dedicated per-note automation lanes directly within the piano roll, letting you inspect and edit microtonal glides from the Android MPE ribbon and 64-bit CC74 Timbre curves with surgical precision.
                </p>
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-2.5 bg-[#08090B] border border-[#1F242D] rounded">
                    <div className="text-[#FFB000] font-semibold mb-1">MPE PITCH GLIDE</div>
                    <div className="text-[10px] text-[#8A94A6]">Continuous X-axis pitch deflection mapped to Ch 2–16.</div>
                  </div>
                  <div className="p-2.5 bg-[#08090B] border border-[#1F242D] rounded">
                    <div className="text-[#00E5FF] font-semibold mb-1">CC 74 TIMBRE LANE</div>
                    <div className="text-[10px] text-[#8A94A6]">64-bit normalized float envelope driving ZDF filter cutoff.</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#08090B] border border-[#1F242D] rounded font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-[#8A94A6] text-[10px] pb-2 border-b border-[#1F242D]">
                  <span>MIDI 2.0 UMP RESOLUTION COMPARISON</span>
                  <span className="text-[#10B981]">4,294,967,296 STEPS</span>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#8A94A6]">Legacy MIDI 1.0 (7-bit CC):</span>
                    <span className="text-[#FF2A54]">128 Steps (Steppy zipper noise)</span>
                  </div>
                  <div className="h-1.5 bg-[#141720] rounded-full overflow-hidden">
                    <div className="bg-[#FF2A54] h-full w-[8%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#8A94A6]">PhaseForm MIDI 2.0 UMP (32-bit):</span>
                    <span className="text-[#10B981]">4.29B Steps (Analog Continuum)</span>
                  </div>
                  <div className="h-1.5 bg-[#141720] rounded-full overflow-hidden">
                    <div className="bg-[#10B981] h-full w-[100%]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'formats' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-xs font-mono text-[#FF2A54] uppercase mb-2">SEAMLESS INTEROPERABILITY</div>
                <h3 className="text-xl font-bold text-[#F3F4F6] mb-3">
                  Lossless .pfpreset, .pfkit, &amp; 4-Stem Project Sharing
                </h3>
                <p className="text-xs text-[#8A94A6] leading-relaxed mb-4">
                  Any sound created on the mobile Android synth or in the 160-slot sample programmer exports directly to PhaseForm Studio without loss of fidelity. The unified JSON schema and FlatBuffers binary interchange format preserves all sample envelopes, filter coefficients, and wavefolder parameters.
                </p>
                <div className="space-y-2 font-mono text-xs text-[#8A94A6]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#00E5FF]">.pfpreset</span>
                    <span>16-Voice Wavetable &amp; FM modulation patch state.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#10B981]">.pfkit</span>
                    <span>160-Slot Chromatic &amp; Pad mapping bundle with embedded PCM chunks.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#FFB000]">.pfstem</span>
                    <span>Mid/Side 4-stem separated wav tracks (Drums, Bass, Synths, Vocal).</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#08090B] border border-[#1F242D] rounded font-mono text-[11px] text-[#8A94A6]">
                <div className="text-[#10B981] mb-2">// Sample Format Serialization Header</div>
                <pre className="text-[#F3F4F6] leading-relaxed">
{`{
  "format": "phaseform_kit_v2",
  "magic_header": "0x50464B54", // PFKT
  "sample_rate": 48000,
  "bit_depth": 24,
  "total_slots": 160,
  "interpolation": "hermite_cubic_4pt",
  "crc32_checksum": "0x8E24C0A1"
}`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
