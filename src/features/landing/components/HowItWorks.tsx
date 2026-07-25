import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface StepNode {
  step: number;
  id: string;
  title: string;
  tech: string;
  latency: string;
  description: string;
  payloadExample: string;
  iconName: string;
}

const STEPS: StepNode[] = [
  {
    step: 1,
    id: 'step_ingest',
    title: 'Transaction Arrives',
    tech: 'API Gateway / SDK',
    latency: '< 2ms',
    description: 'Payment request arrives from checkout gateway via HTTPS TLS 1.3 or SDK wrapper with hardware device fingerprint.',
    payloadExample: '{\n  "card_hash": "tok_991823a",\n  "amount": 4200.00,\n  "ip": "102.89.23.11",\n  "device": "FP_iOS_Safari_Lagos"\n}',
    iconName: 'Zap'
  },
  {
    step: 2,
    id: 'step_kafka',
    title: 'Kafka Queue',
    tech: 'Apache Kafka Partition',
    latency: '< 12ms',
    description: 'Ingested into ordered, replicated Kafka event topics for non-blocking sub-millisecond distribution.',
    payloadExample: '// Kafka Topic: txns.raw.us-west-1\n// Partition: 4 | Offset: 10294821',
    iconName: 'Activity'
  },
  {
    step: 3,
    id: 'step_rules',
    title: 'Deterministic Rules',
    tech: 'Redis Hot Cache',
    latency: '< 5ms',
    description: 'Evaluates sliding window velocity counters, BIN blacklists, and haversine physics geo-velocity limits in Redis.',
    payloadExample: 'Redis GET "vel:tok_991823a:60s"\n-> Value: 14 (TRIGGER: HIGH_VELOCITY)',
    iconName: 'Cpu'
  },
  {
    step: 4,
    id: 'step_vector',
    title: 'AI Vector Search',
    tech: 'Ahnlich / pgvector',
    latency: '< 8ms',
    description: 'Generates 1536-D payload embedding and performs high-speed cosine similarity lookup across 10M+ fraud centroids.',
    payloadExample: 'CosineDistance(v_payload, v_cluster_botnet_401) = 0.0082\n-> MATCH: True',
    iconName: 'Share2'
  },
  {
    step: 5,
    id: 'step_score',
    title: 'Hybrid Risk Score',
    tech: 'FraudEngine Core',
    latency: '< 15ms',
    description: 'Combines rule weightings and neural vector distance into a unified 0-100 risk score and authorization decision.',
    payloadExample: 'RiskScore = (RuleWeight * 0.4) + (VectorWeight * 0.6)\n-> Final Score: 98 / 100 [BLOCKED]',
    iconName: 'AlertTriangle'
  },
  {
    step: 6,
    id: 'step_alert',
    title: 'Fraud Alert Trigger',
    tech: 'BullMQ Async Queue',
    latency: '< 10ms',
    description: 'Dispatches real-time webhooks to payment processor to reject authorization, preventing chargeback before card charge.',
    payloadExample: '{\n  "action": "BLOCK",\n  "reason": "FRAUD_VECTOR_CENTROID_MATCH",\n  "code": 403\n}',
    iconName: 'AlertTriangle'
  },
  {
    step: 7,
    id: 'step_gpt',
    title: 'GPT Explanation',
    tech: 'OpenAI GPT-4o Agent',
    latency: '2.5s (Async)',
    description: 'Synthesizes transaction payload, rule logs, and vector distance into plain-English audit reasoning for compliance.',
    payloadExample: '"Impossible travel velocity from SF to Lagos in 4 minutes combined with high value gift card sweep."',
    iconName: 'Bot'
  },
  {
    step: 8,
    id: 'step_dash',
    title: 'Dashboard Stream',
    tech: 'Socket.io WebSocket',
    latency: '< 50ms',
    description: 'Pushes live threat notification and vector map coordinates directly to active analyst browser consoles.',
    payloadExample: '// WebSocket Event: "threat.alert.high"\n// Broadcaster: Redis PubSub',
    iconName: 'Layout'
  }
];

export const HowItWorks: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<StepNode>(STEPS[0]);

  return (
    <section id="how-it-works" className="py-24 relative bg-[#05070f] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-3 block">
            End-to-End Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight mb-4">
            How FraudGuard AI Processes Every Request
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            From raw HTTPS payload to sub-100ms authorization decision and instant GPT audit brief.
          </p>
        </div>

        {/* Horizontal / Grid Animated Timeline Nodes */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-12">
          {STEPS.map((stepNode) => {
            const isSelected = selectedStep.id === stepNode.id;
            return (
              <button
                key={stepNode.id}
                onClick={() => setSelectedStep(stepNode)}
                className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? 'bg-purple-950/40 border-cyan-400 shadow-xl shadow-purple-950/50 scale-105 z-10'
                    : 'bg-slate-900/60 border-white/10 hover:border-white/20 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold flex items-center justify-center">
                    0{stepNode.step}
                  </span>
                  <span className="text-[9px] font-mono text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                    {stepNode.latency}
                  </span>
                </div>

                <h4 className="text-xs font-heading font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {stepNode.title}
                </h4>
                <span className="text-[10px] font-mono text-slate-400 block truncate">
                  {stepNode.tech}
                </span>

                {/* Connecting Animated Glowing Indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          })}
        </div>

        {/* Selected Step Payload & Inspector Drawer */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedStep.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="p-8 rounded-3xl glass-panel-glow border border-purple-500/40 relative max-w-5xl mx-auto shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold">
                    STEP 0{selectedStep.step} OF 08
                  </span>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                    SLA: {selectedStep.latency}
                  </span>
                </div>

                <h3 className="text-2xl font-heading font-bold text-white mb-2">
                  {selectedStep.title}
                </h3>
                <span className="text-sm font-mono text-purple-300 block mb-4">
                  Powered by {selectedStep.tech}
                </span>

                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {selectedStep.description}
                </p>

                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Guaranteed Zero Data Loss Event Processing</span>
                </div>
              </div>

              {/* Payload Inspector Terminal Box */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl bg-[#060813] border border-white/10 overflow-hidden font-mono text-xs shadow-2xl">
                  <div className="bg-[#0b0e1e] px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Payload Inspector // {selectedStep.id}
                    </span>
                    <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                      Live Trace
                    </span>
                  </div>
                  <div className="p-4 overflow-x-auto text-slate-300 bg-[#04060e] leading-relaxed font-mono">
                    <pre className="text-cyan-300 text-[11px]">{selectedStep.payloadExample}</pre>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
