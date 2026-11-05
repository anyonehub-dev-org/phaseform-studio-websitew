// Copyright (c) 2024-2026 anyone-Hub LLC. All rights reserved.
import React, { useState, useEffect, useRef } from 'react';
import { studioAudio } from '../audio/studioAudioEngine';
import { UmpPacket } from '../types/phaseform';
import { Play, Square, Circle, Volume2, VolumeX, Radio, Cpu, RefreshCw, Zap } from 'lucide-react';

export const InteractiveLiveConsole: React.FC = () => {
  // Transport & Audio State
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [bpm, setBpm] = useState(128);
  const [barBeat, setBarBeat] = useState('004.2.1');
  const [padGridSize, setPadGridSize] = useState<5 | 4>(5);
  const [activePadIndex, setActivePadIndex] = useState<number | null>(null);

  // Surface Telemetry
  const [kaossPos, setKaossPos] = useState({ x: 0.65, y: 0.45 });
  const [mpePitchNote, setMpePitchNote] = useState<number | null>(null);
  const [mpeTimbre, setMpeTimbre] = useState(0.5);

  // DirectLink Packet Stream
  const [packetLog, setPacketLog] = useState<UmpPacket[]>([
    {
      id: 'pkt-01',
      timestamp: '19:00:12.441',
      direction: 'mobile_to_daw',
      messageType: 'UMP_64',
      rawHex: '0x40903C00 0x00007F00',
      decoded: 'NOTE_ON Ch:1 Note:60 (C4) Vel:127',
      latencyMs: 0.38
    },
    {
      id: 'pkt-02',
      timestamp: '19:00:12.449',
      direction: 'mobile_to_daw',
      messageType: 'UMP_64',
      rawHex: '0x40B04A00 0x0000B200',
      decoded: 'CC74_TIMBRE Ch:1 Val:0.695 (ZDF Cutoff)',
      latencyMs: 0.32
    },
    {
      id: 'pkt-03',
      timestamp: '19:00:12.457',
      direction: 'daw_to_mobile',
      messageType: 'DIRECTLINK_JSON',
      rawHex: '{"lufs":-14.2,"pkL":-0.3,"pos":4.2}',
      decoded: 'TELEMETRY 120FPS [LUFS: -14.2 | Pk: -0.3 dBTP]',
      latencyMs: 0.41
    }
  ]);

  const [totalPackets, setTotalPackets] = useState(14820);
  const [lufsMomentary, setLufsMomentary] = useState(-14.2);
  const [peakL, setPeakL] = useState(-0.8);
  const [peakR, setPeakR] = useState(-1.1);

  // Canvas Refs
  const oscilloscopeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const timelineCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const kaossRef = useRef<HTMLDivElement | null>(null);
  const ribbonRef = useRef<HTMLDivElement | null>(null);
  const isDraggingKaoss = useRef(false);
  const isDraggingRibbon = useRef(false);

  // Push new UMP packet
  const emitPacket = (direction: 'mobile_to_daw' | 'daw_to_mobile', messageType: 'UMP_64' | 'UMP_MIDI1' | 'DIRECTLINK_JSON', rawHex: string, decoded: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    const newPacket: UmpPacket = {
      id: `pkt-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: timeStr,
      direction,
      messageType,
      rawHex,
      decoded,
      latencyMs: +(0.25 + Math.random() * 0.22).toFixed(2)
    };
    setPacketLog(prev => [newPacket, ...prev.slice(0, 7)]);
    setTotalPackets(c => c + 1);
  };

  // Mute / Unmute
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    studioAudio.setMuted(next);
  };

  // Handle MPC Pad Strike
  const handlePadStrike = (index: number) => {
    setActivePadIndex(index);
    setTimeout(() => setActivePadIndex(null), 140);

    // Trigger studio synthesized drum/sample voice
    studioAudio.triggerPadVoice(index, 0.9);

    // Format UMP 64-bit Hex
    const noteHex = (36 + index).toString(16).padStart(2, '0').toUpperCase();
    const hex1 = `0x4090${noteHex}00`;
    const hex2 = '0x00007F00';
    emitPacket('mobile_to_daw', 'UMP_64', `${hex1} ${hex2}`, `NOTE_ON Pad:${index + 1} Note:${36 + index} Vel:127`);
  };

  // Handle Kaoss Drag
  const handleKaossMove = (clientX: number, clientY: number) => {
    if (!kaossRef.current) return;
    const rect = kaossRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height)); // inverted Y
    setKaossPos({ x, y });

    // Modulate audio engine ZDF Cutoff & Drive
    const cutoff = 80 + Math.pow(x, 2.5) * 19000;
    const drive = 0.5 + y * 3.5;
    studioAudio.setCutoff(cutoff);
    studioAudio.setDrive(drive);

    // Hex UMP packet
    const cutoffHex = Math.floor(x * 65535).toString(16).padStart(4, '0').toUpperCase();
    const driveHex = Math.floor(y * 65535).toString(16).padStart(4, '0').toUpperCase();
    emitPacket('mobile_to_daw', 'UMP_64', `0x40B009${cutoffHex} 0x40B00C${driveHex}`, `KAOSS_XY Cutoff:${Math.round(cutoff)}Hz Drive:${drive.toFixed(2)}x`);
  };

  // Handle MPE Ribbon Glide
  const handleRibbonMove = (clientX: number, clientY: number, isDown: boolean) => {
    if (!ribbonRef.current) return;
    const rect = ribbonRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));

    const continuousPitch = 48 + x * 24; // 2 octaves (C3 to C5)
    setMpePitchNote(continuousPitch);
    setMpeTimbre(y);

    if (isDown) {
      studioAudio.startMpeVoice(continuousPitch, y);
      const noteHex = Math.floor(continuousPitch).toString(16).padStart(2, '0').toUpperCase();
      emitPacket('mobile_to_daw', 'UMP_64', `0x4091${noteHex}00 0x00007800`, `MPE_NOTE_ON Ch:2 Pitch:${continuousPitch.toFixed(2)} Timbre:${y.toFixed(2)}`);
    } else {
      studioAudio.updateMpeVoice(continuousPitch, y);
    }
  };

  const handleRibbonUp = () => {
    isDraggingRibbon.current = false;
    studioAudio.stopMpeVoice();
    if (mpePitchNote !== null) {
      const noteHex = Math.floor(mpePitchNote).toString(16).padStart(2, '0').toUpperCase();
      emitPacket('mobile_to_daw', 'UMP_64', `0x4081${noteHex}00 0x00000000`, `MPE_NOTE_OFF Ch:2 Note:${Math.floor(mpePitchNote)}`);
      setMpePitchNote(null);
    }
  };

  // 60FPS Desktop DAW Arrangement & Oscilloscope Render Loop
  useEffect(() => {
    let animId: number;
    let playhead = 0;

    const render = () => {
      // 1. Oscilloscope Render
      const oscCanvas = oscilloscopeCanvasRef.current;
      if (oscCanvas) {
        const ctx = oscCanvas.getContext('2d');
        if (ctx) {
          const w = oscCanvas.width;
          const h = oscCanvas.height;

          // Clear background
          ctx.fillStyle = '#08090B';
          ctx.fillRect(0, 0, w, h);

          // Gridlines
          ctx.strokeStyle = 'rgba(31, 36, 45, 0.8)';
          ctx.lineWidth = 1;
          for (let x = 0; x < w; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
          }
          for (let y = 0; y < h; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
          }

          // Center crosshair
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.beginPath();
          ctx.moveTo(0, h / 2);
          ctx.lineTo(w, h / 2);
          ctx.stroke();

          // Get Real Analyser Data if available
          const analyser = studioAudio.getAnalyser();
          const bufferLength = analyser ? analyser.fftSize : 512;
          const dataArray = new Uint8Array(bufferLength);
          if (analyser) {
            analyser.getByteTimeDomainData(dataArray);
          }

          // Channel L (Cyan)
          ctx.strokeStyle = '#00E5FF';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          const sliceWidth = w / bufferLength;
          let x = 0;
          for (let i = 0; i < bufferLength; i++) {
            const v = analyser ? dataArray[i] / 128.0 : 1.0 + Math.sin(i * 0.08 + playhead * 4) * (isPlaying ? 0.25 : 0.02);
            const y = (v * h) / 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            x += sliceWidth;
          }
          ctx.stroke();

          // Channel R (Orange/Phase trace)
          ctx.strokeStyle = 'rgba(255, 176, 0, 0.7)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          x = 0;
          for (let i = 0; i < bufferLength; i++) {
            const v = analyser ? (dataArray[(i + 12) % bufferLength] / 128.0) : 1.0 + Math.cos(i * 0.08 + playhead * 4) * (isPlaying ? 0.22 : 0.02);
            const y = (v * h) / 2 + 1;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            x += sliceWidth;
          }
          ctx.stroke();
        }
      }

      // 2. Arrangement Timeline Render
      const timeCanvas = timelineCanvasRef.current;
      if (timeCanvas) {
        const ctx = timeCanvas.getContext('2d');
        if (ctx) {
          const w = timeCanvas.width;
          const h = timeCanvas.height;
          ctx.fillStyle = '#0D0F14';
          ctx.fillRect(0, 0, w, h);

          // Track lanes: Drums, Bass, Synths, FX
          const tracks = [
            { name: '01 DRUMS', color: '#00E5FF' },
            { name: '02 BASS', color: '#10B981' },
            { name: '03 SYNTH', color: '#FFB000' },
            { name: '04 FX/VOCAL', color: '#FF2A54' }
          ];

          const laneHeight = h / tracks.length;

          tracks.forEach((track, idx) => {
            const y = idx * laneHeight;
            // Divider
            ctx.strokeStyle = '#1F242D';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();

            // Track Header
            ctx.fillStyle = '#101217';
            ctx.fillRect(0, y, 75, laneHeight);
            ctx.fillStyle = '#8A94A6';
            ctx.font = '10px JetBrains Mono';
            ctx.fillText(track.name, 8, y + laneHeight / 2 + 3);

            // Audio Blocks
            ctx.fillStyle = `${track.color}20`;
            ctx.strokeStyle = `${track.color}80`;
            ctx.lineWidth = 1;

            // Pattern blocks
            for (let b = 0; b < 4; b++) {
              const bx = 85 + b * 110;
              const bw = 95;
              ctx.fillRect(bx, y + 4, bw, laneHeight - 8);
              ctx.strokeRect(bx, y + 4, bw, laneHeight - 8);

              // Pseudo waveform peaks inside clip
              ctx.strokeStyle = track.color;
              ctx.beginPath();
              for (let p = 0; p < bw; p += 6) {
                const ph = ((Math.sin(p * 0.4 + idx) + 1) / 2) * (laneHeight - 16);
                ctx.moveTo(bx + p, y + laneHeight / 2 - ph / 2);
                ctx.lineTo(bx + p, y + laneHeight / 2 + ph / 2);
              }
              ctx.stroke();
            }
          });

          // Playhead
          if (isPlaying) {
            playhead = (playhead + 0.005) % 1.0;
            const px = 75 + playhead * (w - 75);
            ctx.strokeStyle = '#F3F4F6';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(px, 0);
            ctx.lineTo(px, h);
            ctx.stroke();

            // Playhead triangle cap
            ctx.fillStyle = '#00E5FF';
            ctx.beginPath();
            ctx.moveTo(px - 5, 0);
            ctx.lineTo(px + 5, 0);
            ctx.lineTo(px, 7);
            ctx.closePath();
            ctx.fill();
          }
        }
      }

      // Update Bar:Beat counter
      if (isPlaying) {
        const totalBeats = Math.floor(playhead * 16) + 1;
        const currentBar = Math.floor(totalBeats / 4) + 1;
        const currentBeat = (totalBeats % 4) + 1;
        setBarBeat(`00${currentBar}.${currentBeat}.1`);
        setLufsMomentary(-14.2 + (Math.sin(playhead * 20) * 0.6));
        setPeakL(-0.3 + Math.sin(playhead * 15) * 0.4);
        setPeakR(-0.4 + Math.cos(playhead * 15) * 0.4);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <section id="telemetry-console" className="w-full py-12 bg-[#08090B] border-b border-[#1F242D]">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#00E5FF] mb-1">
              <span>[LINK-03] HARDWARE/SOFTWARE DIRECTLINK TELEMETRY CONSOLE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F3F4F6] tracking-tight">
              Dual-Screen Workstation &amp; Controller Surface
            </h2>
            <p className="text-xs text-[#8A94A6] max-w-2xl mt-1">
              Interactive bi-directional bridge. Tap any mobile pad, drag the MPE ribbon, or modulate the Kaoss radar to synthesize audio, drive the Desktop DAW timeline, and log raw 64-bit UMP bytes in real time.
            </p>
          </div>

          {/* Sound Mute & Transport Bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-mono transition-colors ${
                isMuted 
                  ? 'bg-[#101217] border-[#1F242D] text-[#8A94A6]' 
                  : 'bg-[#101217] border-[#00E5FF]/40 text-[#00E5FF]'
              }`}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isMuted ? 'LOCAL OFF (-90dBFS)' : 'LIVE WEBAUDIO ACTIVE'}</span>
            </button>
          </div>
        </div>

        {/* 3-Column Split Console: Desktop DAW (Left) | DirectLink Bus (Center) | Android MIDI Deck (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* ================= PANE 1: DESKTOP DAW MASTER (5 COLS) ================= */}
          <div className="lg:col-span-5 bg-[#0D0F14] border border-[#1F242D] rounded-lg p-4 flex flex-col">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1F242D] mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00E5FF]" />
                <span className="text-xs font-mono font-semibold text-[#F3F4F6]">PHASEFORM STUDIO // DESKTOP DAW</span>
              </div>
              <span className="text-[10px] font-mono text-[#8A94A6]">48kHz / 64-bit Summing</span>
            </div>

            {/* Transport & Timecode Strip */}
            <div className="flex items-center justify-between p-2.5 bg-[#08090B] border border-[#1F242D] rounded mb-3 font-mono">
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-1.5 rounded transition-colors ${isPlaying ? 'bg-[#10B981] text-black' : 'bg-[#141720] text-[#F3F4F6] hover:bg-[#1F242D]'}`}
                  title={isPlaying ? "Pause Transport" : "Start Transport"}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
                <button 
                  onClick={() => setIsPlaying(false)}
                  className="p-1.5 bg-[#141720] hover:bg-[#1F242D] text-[#8A94A6] rounded transition-colors"
                  title="Stop Transport"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
                <button 
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-1.5 rounded transition-colors ${isRecording ? 'bg-[#FF2A54] text-white animate-pulse' : 'bg-[#141720] text-[#8A94A6] hover:bg-[#1F242D]'}`}
                  title="Arm Recording"
                >
                  <Circle className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-[#8A94A6] text-[10px] mr-1">POS</span>
                  <span className="text-[#00E5FF] font-semibold tabular-nums">{barBeat}</span>
                </div>
                <div>
                  <span className="text-[#8A94A6] text-[10px] mr-1">BPM</span>
                  <span className="text-[#F3F4F6] tabular-nums">{bpm}</span>
                </div>
              </div>
            </div>

            {/* 4-Stem Arrangement Canvas */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#8A94A6] mb-1">
                <span>4-STEM ARRANGEMENT TIMELINE</span>
                <span>4 BARS LOOP</span>
              </div>
              <div className="border border-[#1F242D] rounded overflow-hidden">
                <canvas 
                  ref={timelineCanvasRef} 
                  width={520} 
                  height={150} 
                  className="w-full h-[150px] block"
                />
              </div>
            </div>

            {/* Dual-Trace Oscilloscope */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#8A94A6] mb-1">
                <span className="text-[#00E5FF]">DUAL-TRACE OSCILLOSCOPE (ZDF OUTPUT)</span>
                <span className="text-[10px]">L: 00E5FF · R: FFB000</span>
              </div>
              <div className="border border-[#1F242D] rounded overflow-hidden relative">
                <canvas 
                  ref={oscilloscopeCanvasRef} 
                  width={520} 
                  height={110} 
                  className="w-full h-[110px] block"
                />
                <div className="absolute top-1.5 right-2 text-[10px] font-mono text-[#8A94A6] bg-[#08090B]/80 px-1.5 py-0.5 rounded">
                  {Math.round(studioAudio.cutoffFreq)} Hz Cutoff
                </div>
              </div>
            </div>

            {/* ITU-R BS.1770 LUFS & True-Peak Master Bus */}
            <div className="p-3 bg-[#08090B] border border-[#1F242D] rounded mt-auto font-mono text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#8A94A6] text-[11px]">MASTER BUS ITU-R BS.1770</span>
                <span className="text-[10px] text-[#10B981]">AES-128 COMPLIANT</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="bg-[#101217] p-2 rounded border border-[#1F242D]">
                  <div className="text-[10px] text-[#8A94A6]">LUFS INTEGRATED</div>
                  <div className="text-sm font-bold text-[#F3F4F6] tabular-nums">-14.2 LUFS</div>
                </div>
                <div className="bg-[#101217] p-2 rounded border border-[#1F242D]">
                  <div className="text-[10px] text-[#8A94A6]">MOMENTARY LUFS</div>
                  <div className="text-sm font-bold text-[#00E5FF] tabular-nums">{lufsMomentary.toFixed(1)} LUFS</div>
                </div>
              </div>

              {/* Stereo Meter Bar */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-[#8A94A6] w-3">L</span>
                  <div className="flex-1 h-2 bg-[#141720] rounded-sm overflow-hidden flex">
                    <div className="bg-[#10B981] h-full" style={{ width: '70%' }} />
                    <div className="bg-[#FFB000] h-full" style={{ width: '18%' }} />
                    <div className="bg-[#FF2A54] h-full" style={{ width: '4%' }} />
                  </div>
                  <span className="text-[#8A94A6] w-14 text-right tabular-nums">{peakL.toFixed(1)} dBTP</span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-[#8A94A6] w-3">R</span>
                  <div className="flex-1 h-2 bg-[#141720] rounded-sm overflow-hidden flex">
                    <div className="bg-[#10B981] h-full" style={{ width: '68%' }} />
                    <div className="bg-[#FFB000] h-full" style={{ width: '19%' }} />
                    <div className="bg-[#FF2A54] h-full" style={{ width: '3%' }} />
                  </div>
                  <span className="text-[#8A94A6] w-14 text-right tabular-nums">{peakR.toFixed(1)} dBTP</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= PANE 2: DIRECTLINK WIRE BRIDGE (3 COLS) ================= */}
          <div className="lg:col-span-3 bg-[#0D0F14] border border-[#1F242D] rounded-lg p-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F242D] mb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="text-xs font-mono font-semibold text-[#F3F4F6]">DIRECTLINK BRIDGE</span>
              </div>
              <span className="text-[10px] font-mono text-[#10B981]">PORT 9088 TCP</span>
            </div>

            {/* Bridge Status Cards */}
            <div className="space-y-2 mb-3 font-mono text-xs">
              <div className="p-2 bg-[#08090B] border border-[#1F242D] rounded flex items-center justify-between">
                <span className="text-[#8A94A6] text-[11px]">mDNS Beacon:</span>
                <span className="text-[#10B981] text-[11px]">_phaseform._tcp</span>
              </div>
              <div className="p-2 bg-[#08090B] border border-[#1F242D] rounded flex items-center justify-between">
                <span className="text-[#8A94A6] text-[11px]">Round-Trip Latency:</span>
                <span className="text-[#00E5FF] font-semibold tabular-nums">0.38 ms</span>
              </div>
              <div className="p-2 bg-[#08090B] border border-[#1F242D] rounded flex items-center justify-between">
                <span className="text-[#8A94A6] text-[11px]">Packet Throughput:</span>
                <span className="text-[#F3F4F6] tabular-nums">120 Hz (DirectByteBuffer)</span>
              </div>
              <div className="p-2 bg-[#08090B] border border-[#1F242D] rounded flex items-center justify-between">
                <span className="text-[#8A94A6] text-[11px]">Packets Ingested:</span>
                <span className="text-[#FFB000] font-semibold tabular-nums">{totalPackets.toLocaleString()}</span>
              </div>
            </div>

            {/* Animated Pipe Indicator */}
            <div className="p-2 bg-[#101217] border border-[#1F242D] rounded mb-3 flex items-center justify-center gap-3 text-xs font-mono">
              <span className="text-[#00E5FF]">MOBILE [0xBB]</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                <span className="text-[#10B981]">⇄</span>
              </div>
              <span className="text-[#F3F4F6]">DAW MPSC QUEUE</span>
            </div>

            {/* Live UMP 64-bit Hex Packet Feed */}
            <div className="flex-1 flex flex-col min-h-[220px]">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#8A94A6] mb-1.5">
                <span>LIVE 64-BIT UMP PACKET STREAM</span>
                <RefreshCw className="w-3 h-3 text-[#8A94A6]" />
              </div>
              
              <div className="flex-1 bg-[#08090B] border border-[#1F242D] rounded p-2 overflow-y-auto space-y-2 font-mono text-[10px]">
                {packetLog.map((pkt) => (
                  <div key={pkt.id} className="p-1.5 bg-[#101217] border border-[#1F242D] rounded hover:border-[#00E5FF]/30 transition-colors">
                    <div className="flex items-center justify-between text-[#8A94A6] mb-0.5">
                      <span className={pkt.direction === 'mobile_to_daw' ? 'text-[#00E5FF]' : 'text-[#10B981]'}>
                        {pkt.direction === 'mobile_to_daw' ? '▲ MOB→DAW' : '▼ DAW→MOB'}
                      </span>
                      <span className="tabular-nums">{pkt.latencyMs}ms</span>
                    </div>
                    <div className="text-[#F3F4F6] font-semibold truncate">{pkt.rawHex}</div>
                    <div className="text-[#8A94A6] text-[9px] truncate">{pkt.decoded}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= PANE 3: ANDROID MIDI DECK SURFACE (4 COLS) ================= */}
          <div className="lg:col-span-4 bg-[#0D0F14] border border-[#1F242D] rounded-lg p-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F242D] mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-xs font-mono font-semibold text-[#F3F4F6]">PHASEFORM MIDI DECK // ANDROID</span>
              </div>
              
              {/* Grid Toggle: 5x5 or 4x4 */}
              <div className="flex items-center gap-1 bg-[#08090B] border border-[#1F242D] rounded p-0.5 text-[10px] font-mono">
                <button 
                  onClick={() => setPadGridSize(5)}
                  className={`px-1.5 py-0.5 rounded ${padGridSize === 5 ? 'bg-[#1F242D] text-[#00E5FF]' : 'text-[#8A94A6]'}`}
                >
                  5x5 (25)
                </button>
                <button 
                  onClick={() => setPadGridSize(4)}
                  className={`px-1.5 py-0.5 rounded ${padGridSize === 4 ? 'bg-[#1F242D] text-[#00E5FF]' : 'text-[#8A94A6]'}`}
                >
                  4x4 (16)
                </button>
              </div>
            </div>

            {/* Zero-Delay MPC Velocity Pad Matrix */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#8A94A6] mb-1.5">
                <span>VELOCITY PAD MATRIX (&lt; 0.45ms TOUCH-TO-QUEUE)</span>
                <span className="text-[#10B981] text-[10px]">RGB ILLUMINATED</span>
              </div>
              
              <div 
                className={`grid gap-1.5 bg-[#08090B] p-2 rounded border border-[#1F242D]`}
                style={{
                  gridTemplateColumns: `repeat(${padGridSize}, minmax(0, 1fr))`
                }}
              >
                {Array.from({ length: padGridSize * padGridSize }).map((_, i) => {
                  const category = i % 5;
                  const catColor = 
                    category === 0 ? '#00E5FF' :
                    category === 1 ? '#FFB000' :
                    category === 2 ? '#10B981' :
                    category === 3 ? '#FF2A54' : '#8B5CF6';

                  const isHit = activePadIndex === i;

                  return (
                    <button
                      key={i}
                      onMouseDown={() => handlePadStrike(i)}
                      onTouchStart={(e) => { e.preventDefault(); handlePadStrike(i); }}
                      className={`aspect-square rounded flex flex-col items-center justify-center p-1 font-mono transition-all duration-75 cursor-pointer relative overflow-hidden select-none ${
                        isHit 
                          ? 'scale-95 border-2 border-white' 
                          : 'bg-[#101217] hover:bg-[#161A22] border border-[#1F242D]'
                      }`}
                      style={{
                        backgroundColor: isHit ? catColor : undefined,
                        boxShadow: isHit ? `0 0 14px ${catColor}` : undefined
                      }}
                    >
                      <span className={`text-[10px] font-bold ${isHit ? 'text-black' : 'text-[#F3F4F6]'}`}>
                        P{i + 1}
                      </span>
                      <span className={`text-[8px] ${isHit ? 'text-black/80' : 'text-[#8A94A6]'}`}>
                        {category === 0 ? 'KICK' : category === 1 ? 'SNR' : category === 2 ? 'HAT' : category === 3 ? 'TOM' : 'SUB'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2-Octave MPE Ribbon (Pitch Glide & CC74 Timbre) */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#8A94A6] mb-1">
                <span>2-OCTAVE MPE RIBBON (GLIDE X / CC74 TIMBRE Y)</span>
                {mpePitchNote !== null && (
                  <span className="text-[#00E5FF] text-[10px] font-semibold tabular-nums">
                    Note: {mpePitchNote.toFixed(1)} · Timbre: {mpeTimbre.toFixed(2)}
                  </span>
                )}
              </div>
              <div 
                ref={ribbonRef}
                onMouseDown={(e) => {
                  isDraggingRibbon.current = true;
                  handleRibbonMove(e.clientX, e.clientY, true);
                }}
                onMouseMove={(e) => {
                  if (isDraggingRibbon.current) {
                    handleRibbonMove(e.clientX, e.clientY, false);
                  }
                }}
                onMouseUp={handleRibbonUp}
                onMouseLeave={handleRibbonUp}
                onTouchStart={(e) => {
                  e.preventDefault();
                  isDraggingRibbon.current = true;
                  const t = e.touches[0];
                  handleRibbonMove(t.clientX, t.clientY, true);
                }}
                onTouchMove={(e) => {
                  if (isDraggingRibbon.current) {
                    const t = e.touches[0];
                    handleRibbonMove(t.clientX, t.clientY, false);
                  }
                }}
                onTouchEnd={handleRibbonUp}
                className="h-14 bg-gradient-to-r from-[#101217] via-[#161B24] to-[#101217] border border-[#1F242D] rounded relative cursor-crosshair overflow-hidden select-none"
              >
                {/* Visual Key Markers */}
                <div className="absolute inset-0 flex justify-between px-3 pointer-events-none opacity-40">
                  {['C3', 'D', 'E', 'F', 'G', 'A', 'B', 'C4', 'D', 'E', 'F', 'G', 'A', 'B', 'C5'].map((k, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-between py-1 text-[8px] font-mono text-[#8A94A6]">
                      <div className="w-[1px] h-3 bg-[#1F242D]" />
                      <span>{k}</span>
                    </div>
                  ))}
                </div>

                {/* Touch Indicator */}
                {mpePitchNote !== null && (
                  <div 
                    className="absolute top-0 bottom-0 w-3 bg-[#00E5FF]/40 border-x border-[#00E5FF] pointer-events-none"
                    style={{
                      left: `${((mpePitchNote - 48) / 24) * 100}%`,
                      transform: 'translateX(-50%)'
                    }}
                  />
                )}
              </div>
            </div>

            {/* 120Hz Inertial Kaoss XY Radar */}
            <div className="mt-auto">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#8A94A6] mb-1">
                <span>INERTIAL KAOSS XY RADAR (X: CUTOFF | Y: DRIVE)</span>
                <span className="text-[#FFB000] text-[10px] tabular-nums">
                  X: {Math.round(kaossPos.x * 100)}% · Y: {Math.round(kaossPos.y * 100)}%
                </span>
              </div>
              <div 
                ref={kaossRef}
                onMouseDown={(e) => {
                  isDraggingKaoss.current = true;
                  handleKaossMove(e.clientX, e.clientY);
                }}
                onMouseMove={(e) => {
                  if (isDraggingKaoss.current) {
                    handleKaossMove(e.clientX, e.clientY);
                  }
                }}
                onMouseUp={() => { isDraggingKaoss.current = false; }}
                onMouseLeave={() => { isDraggingKaoss.current = false; }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  isDraggingKaoss.current = true;
                  const t = e.touches[0];
                  handleKaossMove(t.clientX, t.clientY);
                }}
                onTouchMove={(e) => {
                  if (isDraggingKaoss.current) {
                    const t = e.touches[0];
                    handleKaossMove(t.clientX, t.clientY);
                  }
                }}
                onTouchEnd={() => { isDraggingKaoss.current = false; }}
                className="h-28 bg-[#08090B] border border-[#1F242D] rounded relative cursor-crosshair overflow-hidden select-none bg-dot-pattern"
              >
                {/* Center Lines */}
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[#1F242D] pointer-events-none" />
                <div className="absolute inset-y-0 left-1/2 w-[1px] bg-[#1F242D] pointer-events-none" />

                {/* Reticle Cursor */}
                <div 
                  className="absolute w-6 h-6 border-2 border-[#FFB000] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center shadow-[0_0_8px_rgba(255,176,0,0.5)]"
                  style={{
                    left: `${kaossPos.x * 100}%`,
                    top: `${(1 - kaossPos.y) * 100}%`
                  }}
                >
                  <div className="w-1.5 h-1.5 bg-[#FFB000] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
