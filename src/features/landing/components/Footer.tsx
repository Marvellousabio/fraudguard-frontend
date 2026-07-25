import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#020203] border-t border-white/5 text-slate-400 font-mono text-xs py-16 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust & Stats Header Bar */}
        <div className="pb-12 mb-12 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-wrap gap-10">
            <div>
              <div className="text-2xl font-bold text-white font-heading">10k+</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Batch Processing</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-400 font-heading">&lt;100ms</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Response Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-heading">99.99%</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Uptime SLA</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 opacity-60 text-slate-400 font-bold text-xs uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-400"></span>KAFKA</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400"></span>POSTGRES</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-400"></span>REDIS</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400"></span>GPT-4O</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="FraudGuard AI" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-heading font-extrabold text-lg text-white">
                FraudGuard<span className="text-cyan-400">.AI</span>
              </span>
            </a>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Real-time enterprise AI fraud detection platform powered by hybrid vector neural search, Kafka event streaming, and sub-100ms authorization SLAs.
            </p>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>All Systems 100% Operational</span>
            </div>
          </div>

          {/* Column 1: Resources */}
          <div>
            <h4 className="font-heading font-bold text-white uppercase tracking-wider mb-3 text-xs">
              Resources
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">Platform Features</a></li>
              <li><a href="#architecture" className="hover:text-cyan-400 transition-colors">Architecture Specs</a></li>
              <li><a href="#how-it-works" className="hover:text-cyan-400 transition-colors">Pipeline Trace</a></li>
              <li><a href="#metrics" className="hover:text-cyan-400 transition-colors">PRD SLAs</a></li>
            </ul>
          </div>

          {/* Column 2: Developers */}
          <div>
            <h4 className="font-heading font-bold text-white uppercase tracking-wider mb-3 text-xs">
              Developers
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Node.js / Go SDKs</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Ahnlich Vector Docs</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Kafka Streaming Topics</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">OpenAPI / gRPC Spec</a></li>
            </ul>
          </div>

          {/* Column 3: Legal & Security */}
          <div>
            <h4 className="font-heading font-bold text-white uppercase tracking-wider mb-3 text-xs">
              Enterprise
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#security" className="hover:text-cyan-400 transition-colors">SOC2 & PCI-DSS</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
              <li><a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ & Support</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} FraudGuard AI Inc. All rights reserved. Sub-100ms Fraud Defense Engine.
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="GitHub">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
