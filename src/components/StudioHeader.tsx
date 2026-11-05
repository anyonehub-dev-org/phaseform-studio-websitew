// Copyright (c) 2024-2026 anyone-Hub LLC. All rights reserved.
import React from 'react';
import { ASSET_PATHS } from '../constants/assets';
import { Download, Cpu } from 'lucide-react';

interface StudioHeaderProps {
  onScrollToSection: (sectionId: string) => void;
  activeSection: string;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({ onScrollToSection, activeSection }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#08090B]/90 backdrop-blur-md border-b border-[#1F242D]">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <img 
            src={ASSET_PATHS.phaseformStudioLogo} 
            alt="PhaseForm Logo" 
            className="w-8 h-8 rounded border border-[#1F242D] object-cover"
          />
          <a 
            href="#hero" 
            onClick={(e) => { e.preventDefault(); onScrollToSection('hero'); }}
            className="text-base font-semibold tracking-tight text-[#F3F4F6] hover:text-[#00E5FF] transition-colors whitespace-nowrap"
          >
            PHASEFORM <span className="text-[#8A94A6] font-normal text-xs ml-1 font-mono">STUDIO &amp; MIDI DECK</span>
          </a>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-wider font-medium text-[#8A94A6]">
          <button 
            onClick={() => onScrollToSection('weekend-fast-track')} 
            className={`transition-colors whitespace-nowrap hover:text-[#00E5FF] font-semibold flex items-center gap-1.5 ${activeSection === 'weekend-fast-track' ? 'text-[#00E5FF]' : 'text-[#F3F4F6]'}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
            <span>Weekend Fast-Track</span>
          </button>
          <button 
            onClick={() => onScrollToSection('telemetry-console')} 
            className={`transition-colors whitespace-nowrap hover:text-[#F3F4F6] ${activeSection === 'telemetry-console' ? 'text-[#00E5FF]' : ''}`}
          >
            Live Console
          </button>
          <button 
            onClick={() => onScrollToSection('topologies')} 
            className={`transition-colors whitespace-nowrap hover:text-[#F3F4F6] ${activeSection === 'topologies' ? 'text-[#00E5FF]' : ''}`}
          >
            Topologies
          </button>
          <button 
            onClick={() => onScrollToSection('desktop-daw')} 
            className={`transition-colors whitespace-nowrap hover:text-[#F3F4F6] ${activeSection === 'desktop-daw' ? 'text-[#00E5FF]' : ''}`}
          >
            Desktop DAW
          </button>
          <button 
            onClick={() => onScrollToSection('dsp-rack')} 
            className={`transition-colors whitespace-nowrap hover:text-[#F3F4F6] ${activeSection === 'dsp-rack' ? 'text-[#00E5FF]' : ''}`}
          >
            C++23 DSP Core
          </button>
          <button 
            onClick={() => onScrollToSection('directlink-spec')} 
            className={`transition-colors whitespace-nowrap hover:text-[#F3F4F6] ${activeSection === 'directlink-spec' ? 'text-[#00E5FF]' : ''}`}
          >
            DirectLink Wire
          </button>
          <button 
            onClick={() => onScrollToSection('benchmarks-download')} 
            className={`transition-colors whitespace-nowrap hover:text-[#F3F4F6] ${activeSection === 'benchmarks-download' ? 'text-[#00E5FF]' : ''}`}
          >
            Benchmarks
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-[#8A94A6] border-r border-[#1F242D] pr-4">
            <Cpu className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="tabular-nums">v2.4 DESKTOP · RC-4 ANDROID</span>
          </div>
          <button 
            onClick={() => onScrollToSection('benchmarks-download')}
            className="flex items-center gap-2 px-4 py-2 bg-[#101217] hover:bg-[#1A1E26] text-[#F3F4F6] border border-[#1F242D] hover:border-[#00E5FF]/40 rounded text-xs font-medium tracking-wide transition-colors whitespace-nowrap shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Download Suite</span>
          </button>
        </div>
      </div>
    </header>
  );
};
