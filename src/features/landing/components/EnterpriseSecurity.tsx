import React from 'react';
import { ShieldCheck, Lock, Key, FileText, Cpu, RefreshCw, CheckCircle2, Server } from 'lucide-react';
import { motion } from 'framer-motion';

export const EnterpriseSecurity: React.FC = () => {
  const SECURITY_CARDS = [
    { title: 'TLS 1.3 & mTLS', desc: 'End-to-end encrypted transport layer security with mutual authentication for every API request.', icon: Lock },
    { title: 'Secure API Gateway', desc: 'HMAC signature verification, IP rate limiting, and automated token bucket defense.', icon: Key },
    { title: 'Role-Based Access Control (RBAC)', desc: 'Fine-grained permissions for security analysts, compliance auditors, and system admins.', icon: ShieldCheck },
    { title: 'Structured JSON Logging', desc: 'Audit-ready JSON logs compatible with Datadog, Splunk, Elastic, and CloudWatch.', icon: FileText },
    { title: 'Circuit Breaker Fallbacks', desc: 'Automated isolation of degraded downstream dependencies to protect sub-100ms SLAs.', icon: Cpu },
    { title: 'Exponential Backoff Retries', desc: 'Resilient message queue re-processing with dead-letter queue (DLQ) routing.', icon: RefreshCw },
    { title: 'Environment Validation', desc: 'Strict runtime environment schema validation on service startup preventing misconfigurations.', icon: CheckCircle2 },
    { title: 'High Availability (99.99% SLA)', desc: 'Multi-region active-active cluster deployment with zero single points of failure.', icon: Server }
  ];

  return (
    <section id="security" className="py-24 relative bg-[#04060d] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-purple-400 mb-3 block">
            Zero Trust Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight mb-4">
            Enterprise Security & Compliance
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Built from the ground up to satisfy SOC2 Type II, PCI-DSS Level 1, and global GDPR compliance standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SECURITY_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-cyan-500/40 transition-colors group"
              >
                <div className="p-3 rounded-xl bg-purple-900/40 border border-purple-500/30 text-cyan-300 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-heading font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
