// Copyright (c) 2024-2026 anyone-Hub LLC. All rights reserved.

export type TopologyMode = 'unified_local_off' | 'standalone_mobile' | 'hybrid_split_stage';

export interface UmpPacket {
  id: string;
  timestamp: string;
  direction: 'mobile_to_daw' | 'daw_to_mobile';
  messageType: 'UMP_64' | 'UMP_MIDI1' | 'DIRECTLINK_JSON' | 'SYS_REALTIME';
  rawHex: string;
  decoded: string;
  latencyMs: number;
}

export interface DspStage {
  id: string;
  index: string;
  name: string;
  subsystem: string;
  description: string;
  cppFormula: string;
  parameters: {
    name: string;
    key: string;
    value: number;
    min: number;
    max: number;
    unit: string;
    step: number;
  }[];
  features: string[];
}

export interface SampleSlot {
  slotId: number;
  type: 'keygroup' | 'pad';
  noteOrPad: string;
  name: string;
  category: 'kick' | 'snare' | 'hihat' | 'perc' | 'bass' | 'lead' | 'pad' | 'fx';
  assignedFile: string;
  tuningSemitones: number;
  velocityCurve: 'Linear' | 'Exponential' | 'Compressed';
  triggerMode: 'One-Shot' | 'Gate' | 'Loop';
  rootKey: number;
}

export interface DirectLinkTelemetry {
  lufsIntegrated: number;
  lufsMomentary: number;
  truePeakL: number;
  truePeakR: number;
  activeVoices: number;
  cpuLoadPercent: number;
  packetRateHz: number;
  roundTripLatencyMs: number;
  jitterMicroseconds: number;
  transportState: 'PLAYING' | 'STOPPED' | 'RECORDING';
  bpm: number;
  currentBarBeat: string;
}
