export interface Transaction {
  id: string;
  timestamp: string;
  amount: number;
  currency: string;
  merchant: string;
  cardholder: string;
  ipLocation: string;
  registeredLocation: string;
  riskScore: number; // 0 - 100
  status: 'APPROVED' | 'FLAGGED' | 'BLOCKED';
  confidence: number; // percentage e.g. 98.4
  vectorDistance: number; // e.g. 0.042
  threatCategory: string;
  rulesTriggered: string[];
  gptExplanation: string;
  velocityWindow: string; // e.g. "4 txns in 45s"
  geoMismatch: boolean;
  deviceFingerprint: string;
}

export interface ArchitectureNode {
  id: string;
  name: string;
  category: 'Frontend' | 'Gateway' | 'Queue' | 'Cache' | 'Engine' | 'AI & Storage';
  tech: string;
  description: string;
  latency: string;
  status: 'healthy' | 'active' | 'synced';
  iconName: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  badge: string;
  details: string[];
  demoType: 'speed' | 'vector' | 'gpt' | 'stream' | 'geo' | 'spent' | 'velocity' | 'bulk' | 'mock' | 'dynamic';
}

export interface MetricItem {
  value: number;
  prefix?: string;
  suffix: string;
  decimals?: number;
  label: string;
  description: string;
  prdBenchmark: string;
  highlightColor: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: 'Latency & Performance' | 'AI & Vector Search' | 'Deployment & Infra' | 'Integration & API';
}
