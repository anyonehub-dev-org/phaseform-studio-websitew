// Copyright (c) 2024-2026 anyone-Hub LLC. All rights reserved.
import React, { useState } from 'react';
import { Copy, Check, Terminal, Radio, Usb, Bluetooth, Network } from 'lucide-react';

export const DirectLinkProtocolSpec: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'binary' | 'json' | 'cpp_socket'>('binary');
  const [copied, setCopied] = useState(false);

  const cppSocketCode = `// Copyright (c) 2024-2026 anyone-Hub LLC. All rights reserved.
// PhaseForm Studio Native C++23 DirectLink Ingestion Daemon (Port 9088)

#include <iostream>
#include <vector>
#include <span>
#include <atomic>
#include <asio.hpp>

constexpr uint8_t kMagicByte = 0xBB;
constexpr uint16_t kDirectLinkPort = 9088;

struct alignas(8) UmpPacket64 {
    uint32_t word0;
    uint32_t word1;
};

class DirectLinkReceiver {
public:
    explicit DirectLinkReceiver(asio::io_context& ctx)
        : acceptor_(ctx, asio::ip::tcp::endpoint(asio::ip::tcp::v4(), kDirectLinkPort)),
          socket_(ctx) {
        acceptor_.set_option(asio::ip::tcp::no_delay(true));
        startAccept();
    }

private:
    void startAccept() {
        acceptor_.async_accept(socket_, [this](std::error_code ec) {
            if (!ec) {
                std::cout << "[DirectLink] Established low-latency connection from "
                          << socket_.remote_endpoint() << std::endl;
                readHeader();
            }
        });
    }

    void readHeader() {
        asio::async_read(socket_, asio::buffer(&magic_, 1),
            [this](std::error_code ec, size_t) {
                if (!ec && magic_ == kMagicByte) {
                    readUmpPayload();
                } else {
                    startAccept();
                }
            });
    }

    void readUmpPayload() {
        asio::async_read(socket_, asio::buffer(&currentPacket_, sizeof(UmpPacket64)),
            [this](std::error_code ec, size_t) {
                if (!ec) {
                    // Dispatch directly to lock-free Vyukov ring buffer
                    mpscQueue_.push(currentPacket_);
                    readHeader(); // Continue streaming loop
                }
            });
    }

    asio::ip::tcp::acceptor acceptor_;
    asio::ip::tcp::socket socket_;
    uint8_t magic_{0};
    UmpPacket64 currentPacket_{};
};`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cppSocketCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="directlink-spec" className="w-full py-16 bg-[#08090B] border-b border-[#1F242D]">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#00E5FF] mb-2">
            <span>[PROTOCOL-04] ZERO-JITTER WIRE INTEROPERABILITY</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#F3F4F6] tracking-tight mb-3">
            DirectLink Wire Protocol Specification
          </h2>
          <p className="text-sm text-[#8A94A6] leading-relaxed">
            The low-overhead communication backbone connecting Desktop and Android surfaces. DirectLink supports non-blocking 0xBB binary frames over USB-C, BLE MIDI GATT, and local Wi-Fi with zero driver overhead.
          </p>
        </div>

        {/* 3 Physical Transport Layers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 font-mono text-xs">
          <div className="p-4 bg-[#0D0F14] border border-[#1F242D] rounded-lg">
            <div className="flex items-center gap-2 text-[#00E5FF] mb-2 font-semibold">
              <Network className="w-4 h-4" />
              <span>WI-FI / LOCAL LAN (TCP &amp; UDP)</span>
            </div>
            <p className="text-[#8A94A6] text-[11px] leading-relaxed mb-3">
              Zero-configuration mDNS service discovery on <code className="text-[#00E5FF]">_phaseform._tcp</code> + Port 9188 UDP beaconing. High-throughput non-blocking TCP on Port 9088 with TCP_NODELAY.
            </p>
            <div className="text-[10px] text-[#10B981] pt-2 border-t border-[#1F242D]">
              Latency: 0.35–0.50 ms over 5GHz Wi-Fi 6
            </div>
          </div>

          <div className="p-4 bg-[#0D0F14] border border-[#1F242D] rounded-lg">
            <div className="flex items-center gap-2 text-[#10B981] mb-2 font-semibold">
              <Usb className="w-4 h-4" />
              <span>USB-C CABLE &amp; OTG</span>
            </div>
            <p className="text-[#8A94A6] text-[11px] leading-relaxed mb-3">
              Class-compliant USB MIDI 2.0 peripheral mode via <code className="text-[#10B981]">AndroidMidiDeviceService</code> or zero-config ADB Reverse TCP loopback (<code className="text-[#10B981]">127.0.0.1:9088</code>).
            </p>
            <div className="text-[10px] text-[#10B981] pt-2 border-t border-[#1F242D]">
              Latency: &lt; 0.20 ms Hardware Bound
            </div>
          </div>

          <div className="p-4 bg-[#0D0F14] border border-[#1F242D] rounded-lg">
            <div className="flex items-center gap-2 text-[#FFB000] mb-2 font-semibold">
              <Bluetooth className="w-4 h-4" />
              <span>BLUETOOTH LOW ENERGY MIDI</span>
            </div>
            <p className="text-[#8A94A6] text-[11px] leading-relaxed mb-3">
              Dual Central Scanner and Peripheral GATT Advertiser with custom Service UUID: <code className="text-[#FFB000]">03B80E5A-EDE8-4B33-A751-6CE34EC4C700</code> with connection interval locked to 7.5ms.
            </p>
            <div className="text-[10px] text-[#10B981] pt-2 border-t border-[#1F242D]">
              Latency: 7.5 ms Low-Power Wireless
            </div>
          </div>
        </div>

        {/* Interactive Packet Inspector Tabs */}
        <div className="bg-[#0D0F14] border border-[#1F242D] rounded-lg p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1F242D] mb-4">
            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                onClick={() => setActiveTab('binary')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  activeTab === 'binary'
                    ? 'bg-[#101217] text-[#00E5FF] border border-[#00E5FF]/40 font-semibold'
                    : 'text-[#8A94A6] hover:text-[#F3F4F6]'
                }`}
              >
                01. 0xBB Binary UMP Frame
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  activeTab === 'json'
                    ? 'bg-[#101217] text-[#00E5FF] border border-[#00E5FF]/40 font-semibold'
                    : 'text-[#8A94A6] hover:text-[#F3F4F6]'
                }`}
              >
                02. DirectLink JSON &amp; 120 FPS Telemetry
              </button>
              <button
                onClick={() => setActiveTab('cpp_socket')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  activeTab === 'cpp_socket'
                    ? 'bg-[#101217] text-[#00E5FF] border border-[#00E5FF]/40 font-semibold'
                    : 'text-[#8A94A6] hover:text-[#F3F4F6]'
                }`}
              >
                03. C++23 Socket Receiver Source
              </button>
            </div>

            {activeTab === 'cpp_socket' && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#101217] hover:bg-[#1A1E26] text-[#F3F4F6] border border-[#1F242D] rounded text-xs font-mono transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5 text-[#8A94A6]" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy C++23 Code'}</span>
              </button>
            )}
          </div>

          {/* Tab 1: Binary UMP Frame */}
          {activeTab === 'binary' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="text-xs text-[#8A94A6]">
                Each compact binary transmission starts with single magic byte <code className="text-[#00E5FF]">0xBB</code> followed immediately by an 8-byte 64-bit Universal MIDI Packet (UMP Type 4: MIDI 2.0 Channel Voice Message):
              </div>

              {/* Bit Breakdown Table */}
              <div className="border border-[#1F242D] rounded overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#101217] text-[#8A94A6] text-[10px] uppercase border-b border-[#1F242D]">
                    <tr>
                      <th className="p-2.5">Byte Offset</th>
                      <th className="p-2.5">Field Name</th>
                      <th className="p-2.5">Bit Width</th>
                      <th className="p-2.5">Example Value</th>
                      <th className="p-2.5">Functional Semantic</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F242D] text-[11px] text-[#F3F4F6]">
                    <tr className="bg-[#08090B]">
                      <td className="p-2.5 text-[#00E5FF]">Byte [0]</td>
                      <td className="p-2.5 font-bold">Magic Synchronization Byte</td>
                      <td className="p-2.5">8 bits</td>
                      <td className="p-2.5 text-[#00E5FF]">0xBB</td>
                      <td className="p-2.5 text-[#8A94A6]">DirectLink frame boundary delimiter</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-[#10B981]">Byte [1]</td>
                      <td className="p-2.5 font-bold">UMP Type &amp; Group</td>
                      <td className="p-2.5">4b + 4b</td>
                      <td className="p-2.5">0x40</td>
                      <td className="p-2.5 text-[#8A94A6]">Type 4 (MIDI 2.0 Voice), Group 0</td>
                    </tr>
                    <tr className="bg-[#08090B]">
                      <td className="p-2.5 text-[#FFB000]">Byte [2]</td>
                      <td className="p-2.5 font-bold">Status Opcode &amp; Channel</td>
                      <td className="p-2.5">4b + 4b</td>
                      <td className="p-2.5">0x90</td>
                      <td className="p-2.5 text-[#8A94A6]">Status 9 (Note-On), Channel 0</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-[#FF2A54]">Byte [3..4]</td>
                      <td className="p-2.5 font-bold">Note Number &amp; Attribute</td>
                      <td className="p-2.5">8b + 8b</td>
                      <td className="p-2.5">0x3C 0x00</td>
                      <td className="p-2.5 text-[#8A94A6]">Note 60 (Middle C), No Attribute</td>
                    </tr>
                    <tr className="bg-[#08090B]">
                      <td className="p-2.5 text-[#00E5FF]">Byte [5..8]</td>
                      <td className="p-2.5 font-bold">32-Bit Velocity / Value</td>
                      <td className="p-2.5">32 bits</td>
                      <td className="p-2.5">0xFFFF0000</td>
                      <td className="p-2.5 text-[#8A94A6]">Maximum 64-bit normalized velocity (1.0)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: JSON & 120 FPS Telemetry */}
          {activeTab === 'json' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="text-xs text-[#8A94A6]">
                For metadata and multi-channel telemetry, the Desktop DAW streams JSON packets at 120 Hz to update the mobile display without waking the Android garbage collector:
              </div>

              <div className="p-4 bg-[#08090B] border border-[#1F242D] rounded text-[11px] text-[#F3F4F6] overflow-x-auto">
                <pre>{`// 120 FPS Telemetry Packet (Broadcasted from Desktop DAW to Android)
{
  "type": "telemetry_frame",
  "seq": 149202,
  "timestamp_ns": 1730761234891,
  "master_bus": {
    "lufs_integrated": -14.20,
    "lufs_momentary": -13.85,
    "true_peak_left_db": -0.32,
    "true_peak_right_db": -0.48,
    "clipping_detected": false
  },
  "transport": {
    "state": "PLAYING",
    "bpm": 128.00,
    "bar": 4,
    "beat": 2,
    "tick": 16,
    "ppqn": 24
  },
  "active_voices": 8,
  "cpu_load_percent": 1.12
}`}</pre>
              </div>
            </div>
          )}

          {/* Tab 3: C++23 Socket Source */}
          {activeTab === 'cpp_socket' && (
            <div className="p-4 bg-[#08090B] border border-[#1F242D] rounded font-mono text-[11px] text-[#F3F4F6] overflow-x-auto max-h-[360px] overflow-y-auto">
              <pre>{cppSocketCode}</pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
