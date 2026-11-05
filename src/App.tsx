// Copyright (c) 2024-2026 anyone-Hub LLC. All rights reserved.
import React, { useState } from 'react';
import { StudioHeader } from './components/StudioHeader';
import { HeroSection } from './components/HeroSection';
import { WeekendProducerFastTrack } from './components/WeekendProducerFastTrack';
import { InteractiveLiveConsole } from './components/InteractiveLiveConsole';
import { TopologySelector } from './components/TopologySelector';
import { DesktopDawDeepDive } from './components/DesktopDawDeepDive';
import { DspRackInspector } from './components/DspRackInspector';
import { HardwareSurfacesAndSampler } from './components/HardwareSurfacesAndSampler';
import { DirectLinkProtocolSpec } from './components/DirectLinkProtocolSpec';
import { BenchmarksAndDownloadMatrix } from './components/BenchmarksAndDownloadMatrix';
import { StudioFooter } from './components/StudioFooter';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F3F4F6] flex flex-col font-sans selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
      {/* Top Bar adhering to Top Bar Contract */}
      <StudioHeader 
        onScrollToSection={scrollToSection} 
        activeSection={activeSection} 
      />

      <main className="flex-1 w-full">
        {/* Dual-Flagship Hero with Official Logos & Quick Download Cards */}
        <HeroSection onScrollToSection={scrollToSection} />

        {/* The Weekend Producer Fast-Track: Produce a Song in a Weekend Alone */}
        <WeekendProducerFastTrack />

        {/* Dual-Screen Live Telemetry & WebAudio Hardware/Software Visualizer */}
        <InteractiveLiveConsole />

        {/* Interactive 3-Pillar Ecosystem Topology Switcher */}
        <TopologySelector />

        {/* Desktop DAW Architecture Deep Dive */}
        <DesktopDawDeepDive />

        {/* 10-Stage C++23 DSP Core & Transfer Function Canvas Graph */}
        <DspRackInspector />

        {/* Hardware-Grade Touch Surfaces & Universal 160-Slot Sample Programmer */}
        <HardwareSurfacesAndSampler />

        {/* DirectLink Wire Protocol & Developer Spec */}
        <DirectLinkProtocolSpec />

        {/* Verified Engineering Benchmarks & Official Download Matrix */}
        <BenchmarksAndDownloadMatrix />
      </main>

      {/* Corporate anyone-Hub Network Footer */}
      <StudioFooter />
    </div>
  );
}
