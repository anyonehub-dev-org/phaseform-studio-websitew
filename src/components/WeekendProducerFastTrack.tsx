// Copyright (c) 2024-2026 anyone-Hub LLC. All rights reserved.
import React, { useState, useEffect } from 'react';
import { studioAudio } from '../audio/studioAudioEngine';
import { Sparkles, Calendar, Music, Sliders, CheckCircle2, ArrowRight, Play, Square, Volume2, ShieldCheck, Zap } from 'lucide-react';

interface GenrePreset {
  id: string;
  name: string;
  bpm: number;
  scale: string;
  rootMidi: number;
  vibe: string;
  chords: { name: string; midi: number; type: 'minor' | 'major' | 'sus4' | '7th' }[];
}

const GENRE_PRESETS: GenrePreset[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Midtempo',
    bpm: 105,
    scale: 'D Minor',
    rootMidi: 62,
    vibe: 'Heavy distorted basslines & razor synths',
    chords: [
      { name: 'Dm (i)', midi: 62, type: 'minor' },
      { name: 'Bb (VI)', midi: 58, type: 'major' },
      { name: 'F (III)', midi: 65, type: 'major' },
      { name: 'C (VII)', midi: 60, type: 'major' }
    ]
  },
  {
    id: 'liquid_dnb',
    name: 'Liquid Drum & Bass',
    bpm: 174,
    scale: 'F Minor',
    rootMidi: 65,
    vibe: 'Rolling breaks, warm Rhodes chords & sub bass',
    chords: [
      { name: 'Fm9 (i)', midi: 65, type: '7th' },
      { name: 'Dbmaj7 (VI)', midi: 61, type: 'major' },
      { name: 'Ab (III)', midi: 68, type: 'major' },
      { name: 'Eb (VII)', midi: 63, type: 'major' }
    ]
  },
  {
    id: 'synthwave',
    name: 'Melodic Synthwave',
    bpm: 120,
    scale: 'A Minor',
    rootMidi: 57,
    vibe: 'Nostalgic 80s analog arps & gated drums',
    chords: [
      { name: 'Am (i)', midi: 57, type: 'minor' },
      { name: 'F (VI)', midi: 53, type: 'major' },
      { name: 'C (III)', midi: 60, type: 'major' },
      { name: 'G (VII)', midi: 55, type: 'major' }
    ]
  },
  {
    id: 'dubstep',
    name: 'Bass Heavy Dubstep',
    bpm: 140,
    scale: 'E Phrygian',
    rootMidi: 64,
    vibe: 'Half-time sub drops, growls & punchy snares',
    chords: [
      { name: 'Em (i)', midi: 64, type: 'minor' },
      { name: 'F (bII)', midi: 65, type: 'major' },
      { name: 'G (III)', midi: 67, type: 'major' },
      { name: 'Dm (vii)', midi: 62, type: 'minor' }
    ]
  }
];

export const WeekendProducerFastTrack: React.FC = () => {
  const [activeDay, setActiveDay] = useState<'friday' | 'saturday' | 'sunday'>('friday');
  const [selectedGenre, setSelectedGenre] = useState<GenrePreset>(GENRE_PRESETS[0]);
  const [isPlayingGroove, setIsPlayingGroove] = useState(false);
  const [activeChordIndex, setActiveChordIndex] = useState<number | null>(null);
  const [scaleLockEnabled, setScaleLockEnabled] = useState(true);

  // Handle chord strike
  const playChord = (chord: { name: string; midi: number; type: 'minor' | 'major' | 'sus4' | '7th' }, idx: number) => {
    setActiveChordIndex(idx);
    studioAudio.triggerScaleChord(chord.midi, chord.type);
    setTimeout(() => setActiveChordIndex(null), 350);
  };

  // Automated simple 4-bar groove loop in sandbox
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let step = 0;

    if (isPlayingGroove) {
      const stepMs = (60000 / selectedGenre.bpm) / 2; // 8th notes
      intervalId = setInterval(() => {
        // Kick on 1 and 3 (steps 0, 4)
        if (step % 8 === 0 || step % 8 === 4) {
          studioAudio.triggerPadVoice(0, 0.85); // Kick
        }
        // Snare on 2 and 4 (steps 2, 6)
        if (step % 8 === 2 || step % 8 === 6) {
          studioAudio.triggerPadVoice(1, 0.75); // Snare
        }
        // Hat on every other 8th
        if (step % 2 === 1) {
          studioAudio.triggerPadVoice(2, 0.4); // Hi-Hat
        }

        // Trigger chord progression automatically every 8 steps
        if (step % 8 === 0) {
          const chordIdx = Math.floor(step / 8) % selectedGenre.chords.length;
          const chord = selectedGenre.chords[chordIdx];
          setActiveChordIndex(chordIdx);
          studioAudio.triggerScaleChord(chord.midi, chord.type);
          setTimeout(() => setActiveChordIndex(null), 400);
        }

        step = (step + 1) % (8 * selectedGenre.chords.length);
      }, stepMs);
    } else {
      setActiveChordIndex(null);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlayingGroove, selectedGenre]);

  return (
    <section id="weekend-fast-track" className="w-full py-16 bg-[#08090B] border-b border-[#1F242D] relative overflow-hidden">
      {/* Background Subtle Radar Glow */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-[#10B981]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        
        {/* Core Headline & Mission */}
        <div className="max-w-4xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#00E5FF] mb-3">
            <Sparkles className="w-4 h-4 text-[#00E5FF]" />
            <span>[FAST-TRACK-01] THE WEEKEND PRODUCER PROMISE // ZERO PRIOR EXPERIENCE NEEDED</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F3F4F6] text-wrap:balance leading-[1.1] mb-4">
            Learn to Produce a Full Song in a Weekend. Alone.
          </h2>

          <p className="text-base text-[#8A94A6] leading-relaxed max-w-3xl text-wrap:balance">
            Traditional DAWs intimidate new creators with arcane routing matrices, cryptic sub-menus, and months of tutorial frustration. PhaseForm Studio was engineered from the first line of C++23 to be <span className="text-[#F3F4F6] font-semibold">radically intuitive, visual, and user-friendly</span>—empowering any beginner to sit down Friday evening and export a broadcast-ready, finished track by Sunday night.
          </p>
        </div>

        {/* 3-Day Weekend Roadmap Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <button
            onClick={() => setActiveDay('friday')}
            className={`p-5 rounded-lg border text-left transition-all cursor-pointer font-mono ${
              activeDay === 'friday'
                ? 'bg-[#0D0F14] border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.1)]'
                : 'bg-[#0D0F14]/60 border-[#1F242D] hover:border-[#8A94A6]/30'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[#00E5FF] font-bold">DAY 1 // FRIDAY NIGHT</span>
              <span className="text-[10px] text-[#8A94A6] bg-[#141720] px-2 py-0.5 rounded border border-[#1F242D]">2 HOURS</span>
            </div>
            <div className="text-base font-bold text-[#F3F4F6] mb-1 font-sans">Zero-Config Setup &amp; First Groove</div>
            <p className="text-xs text-[#8A94A6] leading-relaxed font-sans">
              No ASIO driver headaches. Open the app, pair your Android phone via instant DirectLink, pick a curated kit, and tap out your first 4-bar drum beat with automatic groove quantize.
            </p>
          </button>

          <button
            onClick={() => setActiveDay('saturday')}
            className={`p-5 rounded-lg border text-left transition-all cursor-pointer font-mono ${
              activeDay === 'saturday'
                ? 'bg-[#0D0F14] border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                : 'bg-[#0D0F14]/60 border-[#1F242D] hover:border-[#8A94A6]/30'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[#10B981] font-bold">DAY 2 // SATURDAY</span>
              <span className="text-[10px] text-[#8A94A6] bg-[#141720] px-2 py-0.5 rounded border border-[#1F242D]">4 HOURS</span>
            </div>
            <div className="text-base font-bold text-[#F3F4F6] mb-1 font-sans">Scale-Lock Melodies &amp; Chords</div>
            <p className="text-xs text-[#8A94A6] leading-relaxed font-sans">
              Engage Scale-Lock: it is mathematically impossible to hit a wrong note. Trigger lush chords with single pads, glide smooth leads on the MPE ribbon, and shape timbres with Kaoss XY.
            </p>
          </button>

          <button
            onClick={() => setActiveDay('sunday')}
            className={`p-5 rounded-lg border text-left transition-all cursor-pointer font-mono ${
              activeDay === 'sunday'
                ? 'bg-[#0D0F14] border-[#FFB000] shadow-[0_0_15px_rgba(255,176,0,0.1)]'
                : 'bg-[#0D0F14]/60 border-[#1F242D] hover:border-[#8A94A6]/30'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[#FFB000] font-bold">DAY 3 // SUNDAY</span>
              <span className="text-[10px] text-[#8A94A6] bg-[#141720] px-2 py-0.5 rounded border border-[#1F242D]">3 HOURS</span>
            </div>
            <div className="text-base font-bold text-[#F3F4F6] mb-1 font-sans">Arrangement &amp; One-Click Mastering</div>
            <p className="text-xs text-[#8A94A6] leading-relaxed font-sans">
              Drop 4 stems into the visual timeline, apply automatic sidechain ducking, and engage the ITU-R BS.1770 mastering bus (-14 LUFS). Export clean lossless audio for Spotify in one click.
            </p>
          </button>
        </div>

        {/* Interactive "Weekend Song Starter" Simulator */}
        <div className="p-6 bg-[#0D0F14] border border-[#1F242D] rounded-lg mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1F242D] mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#00E5FF] uppercase font-semibold">
                <Music className="w-3.5 h-3.5" />
                <span>INTERACTIVE WEEKEND SONG STARTER SANDBOX</span>
              </div>
              <h3 className="text-xl font-bold text-[#F3F4F6] mt-0.5">
                Try the Beginner-Friendly Workflow Right Now
              </h3>
            </div>

            {/* Play / Stop Demo Groove */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlayingGroove(!isPlayingGroove)}
                className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-semibold transition-colors cursor-pointer ${
                  isPlayingGroove
                    ? 'bg-[#FF2A54] hover:bg-[#E02447] text-white shadow-[0_0_12px_rgba(255,42,84,0.3)]'
                    : 'bg-[#10B981] hover:bg-[#0E9F6E] text-black shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                }`}
              >
                {isPlayingGroove ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlayingGroove ? 'Stop Weekend Groove' : 'Audition Finished Song Groove'}</span>
              </button>

              <button
                onClick={() => setScaleLockEnabled(!scaleLockEnabled)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded border text-xs font-mono transition-colors cursor-pointer ${
                  scaleLockEnabled
                    ? 'bg-[#101217] border-[#00E5FF] text-[#00E5FF]'
                    : 'bg-[#08090B] border-[#1F242D] text-[#8A94A6]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>{scaleLockEnabled ? 'Scale-Lock ON (Zero Bad Notes)' : 'Scale-Lock OFF'}</span>
              </button>
            </div>
          </div>

          {/* Genre Template Selector */}
          <div className="mb-6">
            <div className="text-xs font-mono text-[#8A94A6] mb-2 uppercase">1. CHOOSE A STARTER GENRE TEMPLATE</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {GENRE_PRESETS.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => {
                    setSelectedGenre(genre);
                    setIsPlayingGroove(false);
                  }}
                  className={`p-3 rounded border text-left font-mono transition-all cursor-pointer ${
                    selectedGenre.id === genre.id
                      ? 'bg-[#161B24] border-[#00E5FF] text-[#F3F4F6]'
                      : 'bg-[#08090B] border-[#1F242D] text-[#8A94A6] hover:border-[#8A94A6]/30'
                  }`}
                >
                  <div className="text-xs font-bold text-[#F3F4F6] truncate mb-0.5">{genre.name}</div>
                  <div className="text-[10px] text-[#00E5FF]">{genre.bpm} BPM · {genre.scale}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive 4-Chord Palette */}
          <div className="p-4 bg-[#08090B] border border-[#1F242D] rounded-lg mb-6">
            <div className="flex items-center justify-between text-xs font-mono text-[#8A94A6] mb-3">
              <span className="uppercase">2. CLICK OR TAP CHORDS TO TRIGGER SCALE-LOCKED HARMONIES</span>
              <span className="text-[#10B981]">{selectedGenre.scale} Harmonic Matrix</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {selectedGenre.chords.map((chord, idx) => {
                const isTriggered = activeChordIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => playChord(chord, idx)}
                    className={`p-4 rounded-lg border text-center font-mono transition-all duration-100 cursor-pointer select-none ${
                      isTriggered
                        ? 'bg-[#00E5FF] text-black border-white scale-95 shadow-[0_0_15px_rgba(0,229,255,0.5)]'
                        : 'bg-[#101217] hover:bg-[#1A1E26] text-[#F3F4F6] border-[#1F242D]'
                    }`}
                  >
                    <div className="text-lg font-extrabold tracking-tight mb-1">{chord.name}</div>
                    <div className={`text-[10px] ${isTriggered ? 'text-black/80' : 'text-[#8A94A6]'}`}>
                      Chord Step {idx + 1} ({chord.type.toUpperCase()})
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visual Signal Path & Why It's Simple */}
          <div className="p-4 bg-[#101217] border border-[#1F242D] rounded-lg font-mono text-xs">
            <div className="text-[11px] text-[#00E5FF] font-semibold mb-2 uppercase">
              // HOW PHASEFORM REMOVES 90% OF TRADITIONAL DAW COMPLEXITY:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[#8A94A6] text-[11px]">
              <div className="p-2.5 bg-[#08090B] border border-[#1F242D] rounded">
                <div className="text-[#F3F4F6] font-semibold mb-1">1. Smart Scale Snapping</div>
                <div>No music theory needed. Every ribbon key and pad physically aligns to your chosen musical key.</div>
              </div>
              <div className="p-2.5 bg-[#08090B] border border-[#1F242D] rounded">
                <div className="text-[#F3F4F6] font-semibold mb-1">2. Zero Bus Routing</div>
                <div>Drums, bass, synths, and FX are pre-wired to dedicated stems with auto-clearing EQ cutoffs.</div>
              </div>
              <div className="p-2.5 bg-[#08090B] border border-[#1F242D] rounded">
                <div className="text-[#F3F4F6] font-semibold mb-1">3. Kaoss XY Macros</div>
                <div>One intuitive touchpad shapes filter, resonance, and crunch simultaneously without menu dives.</div>
              </div>
              <div className="p-2.5 bg-[#08090B] border border-[#1F242D] rounded">
                <div className="text-[#F3F4F6] font-semibold mb-1">4. Intelligent Limiter</div>
                <div>Master bus is factory-locked to -14.2 LUFS. It is impossible to accidentally distort or clip.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Head-to-Head Comparison: PhaseForm vs Legacy DAWs */}
        <div className="border border-[#1F242D] rounded-lg overflow-hidden bg-[#0D0F14]">
          <div className="p-4 bg-[#101217] border-b border-[#1F242D]">
            <h3 className="text-sm font-bold font-mono text-[#F3F4F6] uppercase tracking-wider">
              Why Beginners Succeed with PhaseForm vs. Why They Quit Legacy DAWs
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1F242D] font-mono text-xs">
            {/* Column 1: Legacy DAWs */}
            <div className="p-5 space-y-3 bg-[#08090B]/60">
              <div className="text-xs font-bold text-[#FF2A54] uppercase flex items-center gap-2">
                <span>✕</span> Legacy Complex DAWs (Pro Tools, Cubase, Reaper)
              </div>
              <ul className="space-y-2 text-[#8A94A6] text-[11px] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF2A54]">✕</span> Requires installing ASIO4ALL, virtual MIDI loopbacks, and troubleshooting driver buffer crashes.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF2A54]">✕</span> Hundreds of hidden menus, arcane mixer aux busses, and routing matrices with zero visual cues.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF2A54]">✕</span> Blank screen paralysis: No built-in scale guides or chord palettes, making beginners play off-key notes.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF2A54]">✕</span> 6+ months average learning curve before completing a single cohesive song.
                </li>
              </ul>
            </div>

            {/* Column 2: PhaseForm Studio */}
            <div className="p-5 space-y-3 bg-[#0D0F14]">
              <div className="text-xs font-bold text-[#10B981] uppercase flex items-center gap-2">
                <span>✓</span> PhaseForm Studio &amp; MIDI Deck
              </div>
              <ul className="space-y-2 text-[#F3F4F6] text-[11px] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981]">✓</span> Launch and play immediately. DirectLink auto-connects to your Android phone or tablet in seconds.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981]">✓</span> Exposed Swiss-grid layout with 4 visual stems and instant drag-and-drop signal chain.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981]">✓</span> Built-in Scale-Lock and Chord Palettes guarantee every harmony sounds musically cohesive.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981]">✓</span> Learn the entire workflow in one weekend and export your first finished track by Sunday evening.
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
