// Copyright (c) 2024-2026 anyone-Hub LLC. All rights reserved.
import React from 'react';
import { ASSET_PATHS } from '../constants/assets';
import { ExternalLink, Mail, Shield, Code, Cpu } from 'lucide-react';

export const StudioFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#08090B] border-t border-[#1F242D] pt-12 pb-16 font-mono text-xs">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#1F242D]">
          
          {/* Brand & Manifesto Column */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <img 
                src={ASSET_PATHS.phaseformStudioLogo} 
                alt="PhaseForm Studio Logo" 
                className="w-8 h-8 rounded border border-[#1F242D] object-cover"
              />
              <span className="text-sm font-bold text-[#F3F4F6] tracking-tight">
                anyone-Hub LLC
              </span>
            </div>
            <p className="text-xs text-[#8A94A6] leading-relaxed max-w-sm">
              Sovereign Deep-Tech &amp; Cybernetic Precision. Local-first execution, bare-metal C++23 &amp; Rust audio engineering, and zero predatory subscriptions.
            </p>
            <div className="text-[11px] text-[#8A94A6]">
              Founded &amp; architected by <span className="text-[#F3F4F6]">Thomas Alan Slinkard Jr (Tom Slinkard)</span>.
            </div>
          </div>

          {/* Column 2: Audio Engineering Suite */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-[#F3F4F6] uppercase tracking-wider">
              Audio Ecosystem
            </div>
            <ul className="space-y-1.5 text-[#8A94A6] text-xs">
              <li>
                <a href="#desktop-daw" className="hover:text-[#00E5FF] transition-colors">PhaseForm Studio (DAW)</a>
              </li>
              <li>
                <a href="#telemetry-console" className="hover:text-[#00E5FF] transition-colors">PhaseForm MIDI Deck</a>
              </li>
              <li>
                <a href="#dsp-rack" className="hover:text-[#00E5FF] transition-colors">10-Stage C++23 DSP Rack</a>
              </li>
              <li>
                <a href="#directlink-spec" className="hover:text-[#00E5FF] transition-colors">DirectLink Wire Protocol</a>
              </li>
              <li>
                <a href="#benchmarks-download" className="hover:text-[#00E5FF] transition-colors">16KB Page-Aligned Builds</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Corporate Domains */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-[#F3F4F6] uppercase tracking-wider">
              Network Apex
            </div>
            <ul className="space-y-1.5 text-[#8A94A6] text-xs">
              <li>
                <a href="https://anyonehub.tech" target="_blank" rel="noopener noreferrer" className="hover:text-[#00E5FF] transition-colors flex items-center gap-1">
                  <span>anyonehub.tech</span>
                  <ExternalLink className="w-3 h-3 text-[#8A94A6]" />
                </a>
              </li>
              <li>
                <a href="https://phaseform-studio.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-[#00E5FF] transition-colors flex items-center gap-1">
                  <span>phaseform-studio.xyz</span>
                  <ExternalLink className="w-3 h-3 text-[#8A94A6]" />
                </a>
              </li>
              <li>
                <a href="https://anyonehub.us.kg" target="_blank" rel="noopener noreferrer" className="hover:text-[#00E5FF] transition-colors flex items-center gap-1">
                  <span>anyonehub.us.kg</span>
                  <ExternalLink className="w-3 h-3 text-[#8A94A6]" />
                </a>
              </li>
              <li>
                <a href="https://foundational-biomimetics.info" target="_blank" rel="noopener noreferrer" className="hover:text-[#00E5FF] transition-colors flex items-center gap-1">
                  <span>foundational-biomimetics.info</span>
                  <ExternalLink className="w-3 h-3 text-[#8A94A6]" />
                </a>
              </li>
              <li>
                <a href="https://info-dev.io" target="_blank" rel="noopener noreferrer" className="hover:text-[#00E5FF] transition-colors flex items-center gap-1">
                  <span>info-dev.io</span>
                  <ExternalLink className="w-3 h-3 text-[#8A94A6]" />
                </a>
              </li>
              <li>
                <a href="https://anyone-hub.me" target="_blank" rel="noopener noreferrer" className="hover:text-[#00E5FF] transition-colors flex items-center gap-1">
                  <span>anyone-hub.me</span>
                  <ExternalLink className="w-3 h-3 text-[#8A94A6]" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Verification */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-[#F3F4F6] uppercase tracking-wider">
              Engineering Support
            </div>
            <div className="space-y-2 text-[#8A94A6] text-xs">
              <a 
                href="mailto:tomslinkard@anyonehub.tech" 
                className="flex items-center gap-2 hover:text-[#00E5FF] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>tomslinkard@anyonehub.tech</span>
              </a>
              <a 
                href="mailto:anyonehub.us.kg@foundational-biomimetics.info" 
                className="flex items-center gap-2 hover:text-[#00E5FF] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="truncate">anyonehub.us.kg@foundational-biomimetics.info</span>
              </a>
              <div className="pt-2 text-[11px] text-[#8A94A6]">
                Package: <span className="text-[#F3F4F6]">com.anyonehub.phaseformstudio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#8A94A6] text-[11px]">
          <div>
            &copy; 2024&ndash;2026 anyone-Hub LLC. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Deterministic C++23 Engine</span>
            <span>&middot;</span>
            <span>64-Bit MIDI 2.0 UMP</span>
            <span>&middot;</span>
            <span>ITU-R BS.1770 Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
