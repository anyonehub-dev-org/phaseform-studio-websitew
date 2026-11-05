// Copyright (c) 2024-2026 anyone-Hub LLC. All rights reserved.
import React from 'react';
import { ASSET_PATHS } from '../constants/assets';
import { Monitor, Smartphone, ArrowRight, ShieldCheck, Activity, Zap, Radio } from 'lucide-react';

interface HeroSectionProps {
  onScrollToSection: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToSection }) => {
  return (
    <section id="hero" className="relative w-full pt-12 pb-16 border-b border-[#1F242D] overflow-hidden bg-grid-pattern">
      {/* Engineering Corner Crosshair Guides */}
      <div className="absolute top-4 left-6 text-[#1F242D] font-mono text-xs select-none pointer-events-none">
        + [SYS-ARCH-2026] // ANYONE-HUB CORP +
      </div>
      <div className="absolute top-4 right-6 text-[#1F242D] font-mono text-xs select-none pointer-events-none">
        + 48kHz / 64-BIT UMP LINK +
      </div>

      <div className="max-w-[1440px] mx-auto px-6">
        {/* Overline & Typography */}
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#00E5FF] mb-3">
            <span>ANYONE-HUB LLC</span>
            <span className="text-[#8A94A6]">/</span>
            <span className="text-[#10B981] font-bold">PRODUCE A FULL SONG IN A WEEKEND ALONE</span>
            <span className="text-[#8A94A6]">/</span>
            <span>C++23 DETERMINISTIC CORE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F3F4F6] text-wrap:balance leading-[1.08] mb-4">
            PHASEFORM STUDIO &amp; MIDI DECK
          </h1>

          <p className="text-lg text-[#8A94A6] max-w-3xl leading-relaxed text-wrap:balance mb-6">
            A full-featured C++23 Desktop DAW engineered from the ground up to be <span className="text-[#F3F4F6] font-semibold">user-friendly, intuitive, and easy to master in a single weekend</span>. Say goodbye to the steep 6-month learning curve of traditional software—compose with intelligent scale-locking, visual signal flow, and zero-jitter 64-bit MIDI 2.0 DirectLink telemetry.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <button
              onClick={() => onScrollToSection('weekend-fast-track')}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#00E5FF] hover:bg-[#00D0E8] text-black font-bold text-xs uppercase tracking-wider rounded transition-colors shadow-[0_0_15px_rgba(0,229,255,0.25)] cursor-pointer"
            >
              <span>The Weekend Producer Fast-Track</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="text-xs font-mono text-[#8A94A6] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span>Zero Prior Music Theory Required · Scale-Lock Protected</span>
            </div>
          </div>
        </div>

        {/* Dual Primary Download Matrix Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Card 1: Desktop DAW */}
          <div className="relative p-6 bg-[#0D0F14] border border-[#1F242D] rounded-lg group hover:border-[#00E5FF]/40 transition-colors">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={ASSET_PATHS.phaseformStudioLogo} 
                  alt="PhaseForm Studio Desktop Logo" 
                  className="w-14 h-14 rounded border border-[#1F242D] object-cover bg-black"
                />
                <div>
                  <div className="text-[11px] font-mono text-[#00E5FF] uppercase tracking-wider">[DAW-01] Desktop Workstation</div>
                  <h3 className="text-xl font-bold text-[#F3F4F6]">PhaseForm Studio Desktop</h3>
                  <div className="text-xs text-[#8A94A6]">Windows · macOS · Linux</div>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 bg-[#141720] border border-[#1F242D] text-[#8A94A6] rounded">
                v2.4 Production
              </span>
            </div>

            <p className="text-xs text-[#8A94A6] leading-relaxed mb-5">
              Native C++23 multi-track DAW with 64-bit internal summing, VST3/CLAP hosting, sample-accurate automation, and built-in DirectLink daemon (Port 9088 TCP).
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#1F242D]/80">
              <button 
                onClick={() => onScrollToSection('benchmarks-download')}
                className="flex items-center gap-2 px-3.5 py-2 bg-[#141720] hover:bg-[#1F242D] text-xs font-medium text-[#F3F4F6] border border-[#1F242D] rounded transition-colors"
              >
                <Monitor className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Windows x64 (.exe / .msi)</span>
              </button>
              <button 
                onClick={() => onScrollToSection('benchmarks-download')}
                className="flex items-center gap-2 px-3.5 py-2 bg-[#141720] hover:bg-[#1F242D] text-xs font-medium text-[#F3F4F6] border border-[#1F242D] rounded transition-colors"
              >
                <span>macOS Universal (.dmg)</span>
              </button>
              <button 
                onClick={() => onScrollToSection('benchmarks-download')}
                className="flex items-center gap-2 px-3.5 py-2 bg-[#141720] hover:bg-[#1F242D] text-xs font-medium text-[#F3F4F6] border border-[#1F242D] rounded transition-colors"
              >
                <span>Linux (.AppImage)</span>
              </button>
            </div>
          </div>

          {/* Card 2: Android MIDI Deck */}
          <div className="relative p-6 bg-[#0D0F14] border border-[#1F242D] rounded-lg group hover:border-[#10B981]/40 transition-colors">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={ASSET_PATHS.phaseformMidiLogo} 
                  alt="PhaseForm MIDI Deck Android Logo" 
                  className="w-14 h-14 rounded border border-[#1F242D] object-cover bg-black"
                />
                <div>
                  <div className="text-[11px] font-mono text-[#10B981] uppercase tracking-wider">[MOBILE-02] Android Instrument &amp; Controller</div>
                  <h3 className="text-xl font-bold text-[#F3F4F6]">PhaseForm MIDI Deck</h3>
                  <div className="text-xs text-[#8A94A6]">Google Play · Standalone 64-bit APK</div>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 bg-[#141720] border border-[#1F242D] text-[#10B981] rounded">
                16KB Page-Aligned
              </span>
            </div>

            <p className="text-xs text-[#8A94A6] leading-relaxed mb-5">
              Dual-mode mobile instrument: Zero-latency Standalone AAudio Synthesizer &amp; 120Hz MPE Piano Ribbon / 25-Pad Controller with Local-Off battery bypass.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#1F242D]/80">
              <button 
                onClick={() => onScrollToSection('benchmarks-download')}
                className="flex items-center gap-2 px-3.5 py-2 bg-[#141720] hover:bg-[#1F242D] text-xs font-medium text-[#F3F4F6] border border-[#1F242D] rounded transition-colors"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Google Play Store (AAB 34.6MB)</span>
              </button>
              <button 
                onClick={() => onScrollToSection('benchmarks-download')}
                className="flex items-center gap-2 px-3.5 py-2 bg-[#141720] hover:bg-[#1F242D] text-xs font-medium text-[#F3F4F6] border border-[#1F242D] rounded transition-colors"
              >
                <span>Standalone APK (94.5MB arm64)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Ecosystem Telemetry Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#0D0F14] border border-[#1F242D] rounded-lg mb-8 font-mono text-xs">
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-[#00E5FF] shrink-0" />
            <div>
              <div className="text-[#8A94A6] text-[10px] uppercase">Touch-to-Queue Latency</div>
              <div className="text-[#F3F4F6] font-semibold tabular-nums">&lt; 0.45 ms (MpscRingBuffer)</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Radio className="w-4 h-4 text-[#10B981] shrink-0" />
            <div>
              <div className="text-[#8A94A6] text-[10px] uppercase">DirectLink Telemetry</div>
              <div className="text-[#F3F4F6] font-semibold tabular-nums">120 FPS Locked / 0xBB UMP</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 text-[#FFB000] shrink-0" />
            <div>
              <div className="text-[#8A94A6] text-[10px] uppercase">DSP Block Time</div>
              <div className="text-[#F3F4F6] font-semibold tabular-nums">&lt; 1.15 ms @ 192f / 48kHz</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-[#FF2A54] shrink-0" />
            <div>
              <div className="text-[#8A94A6] text-[10px] uppercase">Local-Off Battery Drain</div>
              <div className="text-[#F3F4F6] font-semibold tabular-nums">0.0% DSP (-90dBFS Bypass)</div>
            </div>
          </div>
        </div>

        {/* Cinematic Dual Ecosystem Hardware Showcase Photo */}
        <div className="relative rounded-lg overflow-hidden border border-[#1F242D] bg-[#08090B]">
          <img 
            src={ASSET_PATHS.studioDawChassis} 
            alt="PhaseForm Studio Desktop DAW and MIDI Deck Hardware Rig"
            className="w-full h-auto max-h-[520px] object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090B] via-transparent to-transparent pointer-events-none" />

          {/* Precision Engineering Overlays */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#08090B]/85 backdrop-blur-md px-3 py-1.5 border border-[#1F242D] rounded text-[11px] font-mono text-[#F3F4F6]">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>DIRECTLINK PROTOCOL BUS ACTIVE (PORT 9088 TCP)</span>
          </div>

          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#08090B]/85 backdrop-blur-md px-3 py-1.5 border border-[#1F242D] rounded text-[11px] font-mono text-[#8A94A6]">
            <span>TOTAL ECOSYSTEM REPOSITORY: 106/106 SUITE PASSING</span>
          </div>
        </div>
      </div>
    </section>
  );
};
