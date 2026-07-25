import { useState } from 'react';
import { BackgroundEffects } from './components/BackgroundEffects';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TechStack } from './components/TechStack';
import { TraditionalVsAI } from './components/TraditionalVsAI';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Architecture } from './components/Architecture';
import { DashboardShowcase } from './components/DashboardShowcase';
import { AiIntelligence } from './components/AiIntelligence';
import { PerformanceMetrics } from './components/PerformanceMetrics';
import { EnterpriseSecurity } from './components/EnterpriseSecurity';
import { ComparisonTable } from './components/ComparisonTable';
import { FaqSection } from './components/FaqSection';
import { CtaSection } from './components/CtaSection';
import { DemoModal } from './components/DemoModal';
import { Footer } from './components/Footer';

export default function LandingPage() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#020203] text-slate-100 relative font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <BackgroundEffects />
      <Header onOpenDemoModal={() => setDemoModalOpen(true)} />
      <main>
        <Hero onOpenDemoModal={() => setDemoModalOpen(true)} />
        <TechStack />
        <TraditionalVsAI />
        <Features />
        <HowItWorks />
        <Architecture />
        <DashboardShowcase />
        <AiIntelligence />
        <PerformanceMetrics />
        <EnterpriseSecurity />
        <ComparisonTable />
        <FaqSection />
        <CtaSection onOpenDemoModal={() => setDemoModalOpen(true)} />
      </main>
      <Footer />
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </div>
  );
}
