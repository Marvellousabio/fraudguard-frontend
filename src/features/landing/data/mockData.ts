import { Transaction, FeatureItem, MetricItem, FaqItem, ArchitectureNode } from '../types';

export const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_89201a4',
    timestamp: '2026-07-25 14:50:12.421',
    amount: 8450.00,
    currency: 'USD',
    merchant: 'Nexus Crypto Exchange',
    cardholder: 'Evelyn Reed (Acme Corp CEO)',
    ipLocation: 'Lagos, Nigeria (IP 102.89.23.11)',
    registeredLocation: 'San Francisco, CA, USA',
    riskScore: 98,
    status: 'BLOCKED',
    confidence: 99.4,
    vectorDistance: 0.021,
    threatCategory: 'Impossible Geo-Velocity & High Risk Merchant',
    rulesTriggered: ['GEO_VELOCITY_IMPOSSIBLE_TRAVEL', 'HIGH_VALUE_CRYPTO_PURCHASE', 'NEW_DEVICE_FINGERPRINT'],
    gptExplanation: 'Transaction flagged due to impossible physical travel speed (SF to Lagos in 4 minutes), combined with a high-value cryptocurrency purchase on an unrecognized mobile browser fingerprint.',
    velocityWindow: '3 high-value txns in 82 seconds',
    geoMismatch: true,
    deviceFingerprint: 'FP_90218_iOS_18.2_Safari_Lagos'
  },
  {
    id: 'tx_89201a5',
    timestamp: '2026-07-25 14:50:14.102',
    amount: 42.50,
    currency: 'USD',
    merchant: 'Blue Bottle Coffee',
    cardholder: 'Marcus Vance',
    ipLocation: 'San Francisco, CA, USA',
    registeredLocation: 'San Francisco, CA, USA',
    riskScore: 3,
    status: 'APPROVED',
    confidence: 99.9,
    vectorDistance: 0.890,
    threatCategory: 'Normal Daily Habitual Spending',
    rulesTriggered: [],
    gptExplanation: 'Consistently matches cardholder 90-day morning coffee purchasing baseline. Vector distance is near 0.90 against known fraud centroids.',
    velocityWindow: '1 txn in 24 hours',
    geoMismatch: false,
    deviceFingerprint: 'FP_10024_macOS_Sonoma_Chrome'
  },
  {
    id: 'tx_89201a6',
    timestamp: '2026-07-25 14:50:15.830',
    amount: 1290.00,
    currency: 'EUR',
    merchant: 'Luxuria Jewelers Paris',
    cardholder: 'Chloe Dupont',
    ipLocation: 'Kyiv, Ukraine (IP 91.200.12.5)',
    registeredLocation: 'Paris, France',
    riskScore: 84,
    status: 'FLAGGED',
    confidence: 96.2,
    vectorDistance: 0.087,
    threatCategory: 'Card Not Present Sudden Spike',
    rulesTriggered: ['CNP_HIGH_VELOCITY_SPIKE', 'PROXY_IP_DETECTED'],
    gptExplanation: 'Vector similarity matched known BIN-testing fraud syndicate pattern #4021. Transaction placed on hold for secondary OTP authorization.',
    velocityWindow: '8 micro-auth checks in 120 seconds',
    geoMismatch: true,
    deviceFingerprint: 'FP_44910_Linux_Ubuntu_TorProxy'
  },
  {
    id: 'tx_89201a7',
    timestamp: '2026-07-25 14:50:17.001',
    amount: 320.00,
    currency: 'USD',
    merchant: 'Uber Technologies',
    cardholder: 'David K. Chen',
    ipLocation: 'New York, NY, USA',
    registeredLocation: 'New York, NY, USA',
    riskScore: 12,
    status: 'APPROVED',
    confidence: 98.7,
    vectorDistance: 0.760,
    threatCategory: 'Routine Ride Share Usage',
    rulesTriggered: [],
    gptExplanation: 'Low risk score. Consistent with historic weekly commuting profile and valid hardware security token signature.',
    velocityWindow: '2 txns today',
    geoMismatch: false,
    deviceFingerprint: 'FP_77201_iPhone15Pro_iOS'
  },
  {
    id: 'tx_89201a8',
    timestamp: '2026-07-25 14:50:18.910',
    amount: 4999.00,
    currency: 'USD',
    merchant: 'Digital Gift Cards Express',
    cardholder: 'Aria Montgomery',
    ipLocation: 'Sao Paulo, Brazil',
    registeredLocation: 'Boston, MA, USA',
    riskScore: 94,
    status: 'BLOCKED',
    confidence: 99.1,
    vectorDistance: 0.035,
    threatCategory: 'High Velocity Gift Card Drain',
    rulesTriggered: ['GIFT_CARD_BULK_SWEEP', 'GEO_IP_ANOMALY', 'NEW_RECIPIENT_EMAIL'],
    gptExplanation: 'Attempts to liquidate card credit limit into instant e-gift cards via foreign residential proxy. Blocked in 18ms by vector similarity filter.',
    velocityWindow: '12 gift card requests in 45s',
    geoMismatch: true,
    deviceFingerprint: 'FP_88192_Windows_Edge_Proxy'
  }
];

export const TECH_STACK = [
  { name: 'NestJS', role: 'Enterprise Gateway & Services', color: 'from-pink-500 to-rose-600', icon: 'Server' },
  { name: 'Redis', role: 'Sub-ms Hot Vector Cache & Queues', color: 'from-red-500 to-orange-600', icon: 'Zap' },
  { name: 'Kafka', role: 'Distributed Streaming Event Spine', color: 'from-purple-500 to-indigo-600', icon: 'Activity' },
  { name: 'PostgreSQL', role: 'Durable Relational Store & pgvector', color: 'from-blue-500 to-cyan-600', icon: 'Database' },
  { name: 'Socket.io', role: 'Sub-50ms WebSocket Broadcasts', color: 'from-emerald-500 to-teal-600', icon: 'Radio' },
  { name: 'OpenAI', role: 'GPT-4o Deep Fraud Intelligence', color: 'from-cyan-400 to-blue-600', icon: 'Cpu' },
  { name: 'Ahnlich DB', role: 'High-Throughput Vector DB', color: 'from-violet-500 to-purple-600', icon: 'Share2' },
  { name: 'TypeORM', role: 'Type-Safe Entity Data Layer', color: 'from-amber-500 to-orange-600', icon: 'Code' },
  { name: 'BullMQ', role: 'Resilient Distributed Job Queues', color: 'from-sky-500 to-blue-700', icon: 'Layers' },
  { name: 'Supabase', role: 'Auth & Realtime Infrastructure', color: 'from-emerald-400 to-green-600', icon: 'ShieldCheck' }
];

export const FEATURES_LIST: FeatureItem[] = [
  {
    id: 'f1',
    title: 'Real Time Detection',
    subtitle: 'Sub-100ms Decisions',
    description: 'Processes incoming transaction payloads through hybrid rule engines and vector neural networks in under 100 milliseconds.',
    icon: 'Zap',
    badge: '< 100ms Latency',
    details: ['Parallelized rule evaluation', 'In-memory Redis cache hits', 'Sub-8ms cosine distance lookup'],
    demoType: 'speed'
  },
  {
    id: 'f2',
    title: 'AI Vector Search',
    subtitle: 'Ahnlich & pgvector Engine',
    description: 'Translates high-dimensional payment attributes into 1536-D embeddings, matching against millions of known fraud centroids.',
    icon: 'Share2',
    badge: '1536-D Embeddings',
    details: ['Cosine & L2 similarity metrics', 'Dynamic cluster re-indexing', 'False positive reduction up to 40%'],
    demoType: 'vector'
  },
  {
    id: 'f3',
    title: 'GPT Fraud Analyst',
    subtitle: 'Natural Language Reasoning',
    description: 'Generates instant plain-English explanations for compliance teams, board reports, and chargeback dispute briefs.',
    icon: 'Bot',
    badge: 'GPT-4o Powered',
    details: ['Audit-ready plain English summaries', 'Automated dispute letter generation', 'Multi-factor threat classification'],
    demoType: 'gpt'
  },
  {
    id: 'f4',
    title: 'WebSocket Streaming',
    subtitle: 'Zero-Latency Dashboard',
    description: 'Pushes live threat streams, velocity spikes, and high-risk alerts directly to analyst browsers with zero polling delay.',
    icon: 'Radio',
    badge: 'Socket.io Core',
    details: ['Bi-directional alert synchronization', 'Low overhead WebSocket binary frames', 'Automatic client reconnects'],
    demoType: 'stream'
  },
  {
    id: 'f5',
    title: 'Kafka Pipeline',
    subtitle: 'Distributed Event Spine',
    description: 'Ingests over 100,000 transactions per second with partitioned topics, guaranteed ordering, and zero packet loss.',
    icon: 'Activity',
    badge: '100k+ TPS',
    details: ['Horizontally scalable consumer groups', 'Backpressure resistance', 'Dead-letter queue automated retries'],
    demoType: 'stream'
  },
  {
    id: 'f6',
    title: 'Geo Velocity Detection',
    subtitle: 'Impossible Travel Algorithm',
    description: 'Calculates physical distance over elapsed time across IP geolocations to instantly block physically impossible card taps.',
    icon: 'Globe',
    badge: 'Physics-Based Rule',
    details: ['Haversine velocity formula', 'Proxy & VPN exit node detection', 'Historical travel pattern baselining'],
    demoType: 'geo'
  },
  {
    id: 'f7',
    title: 'Daily Spending Analysis',
    subtitle: 'Behavioral Baseline Monitoring',
    description: 'Tracks rolling 30-day spending curves per cardholder, detecting subtle anomalies even when transaction values are small.',
    icon: 'TrendingUp',
    badge: 'Rolling Baselines',
    details: ['Z-score deviation metrics', 'Category-specific thresholding', 'Adaptive seasonal adjustment'],
    demoType: 'spent'
  },
  {
    id: 'f8',
    title: 'High Velocity Detection',
    subtitle: 'Burst Attack Defense',
    description: 'Identifies botnets attempting fast-card testing with sliding time windows down to 500 millisecond intervals.',
    icon: 'Flame',
    badge: '500ms Sliding Window',
    details: ['Distributed sliding window counters', 'Card testing bot mitigation', 'Automated IP rate throttling'],
    demoType: 'velocity'
  },
  {
    id: 'f9',
    title: 'Bulk Processing',
    subtitle: '10,000 Batch Ingestion',
    description: 'Scans massive asynchronous transaction batches through BullMQ workers without degrading real-time API SLA.',
    icon: 'Layers',
    badge: '10,000 Txn Batches',
    details: ['Parallel embedding batching', 'Chunked database writes', 'Comprehensive batch audit reports'],
    demoType: 'bulk'
  },
  {
    id: 'f10',
    title: 'Offline Mock Mode',
    subtitle: 'Sandbox & CI/CD Testing',
    description: 'Integrated synthetic fraud generator lets engineers run chaos tests, load simulations, and staging evaluations offline.',
    icon: 'Terminal',
    badge: 'Developer Sandbox',
    details: ['Realistic synthetic transaction generator', 'Custom risk profile seeding', 'Zero external API cost in mock mode'],
    demoType: 'mock'
  },
  {
    id: 'f11',
    title: 'Dynamic Vector Updates',
    subtitle: 'Real-Time Learning Feedback',
    description: 'When analysts confirm a new fraud pattern, vector spaces instantly update so all future incoming traffic is shielded.',
    icon: 'RefreshCw',
    badge: 'Self-Improving Loop',
    details: ['Instant centroid re-weighting', 'Zero downtime model tuning', 'Cross-merchant collaborative intelligence'],
    demoType: 'dynamic'
  }
];

export const ARCHITECTURE_NODES: ArchitectureNode[] = [
  { id: 'n1', name: 'Frontend Dashboard', category: 'Frontend', tech: 'React 19 + Vite + TailWind', description: 'Real-time monitoring console with WebSocket live updates and interactive threat analysis.', latency: '<50ms DOM render', status: 'active', iconName: 'Layout' },
  { id: 'n2', name: 'API Gateway', category: 'Gateway', tech: 'NestJS + Fastify / TLS 1.3', description: 'Handles mTLS authentication, rate limiting, HMAC validation, and request routing.', latency: '3ms route overhead', status: 'healthy', iconName: 'Shield' },
  { id: 'n3', name: 'Kafka Event Spine', category: 'Queue', tech: 'Apache Kafka Cluster', description: 'High-throughput event streaming queue holding partitioned transaction topics.', latency: '12ms pub/sub', status: 'active', iconName: 'Activity' },
  { id: 'n4', name: 'BullMQ Job Processor', category: 'Queue', tech: 'BullMQ + Redis Streams', description: 'Manages batch scoring, async retry logic, and fallback transaction queues.', latency: '5ms queue dispatch', status: 'synced', iconName: 'Layers' },
  { id: 'n5', name: 'Redis Hot Cache', category: 'Cache', tech: 'Redis Enterprise Cluster', description: 'In-memory storage for sliding velocity counters, token buckets, and top vector centroids.', latency: '1.2ms lookup', status: 'active', iconName: 'Zap' },
  { id: 'n6', name: 'Hybrid Fraud Engine', category: 'Engine', tech: 'Rust + Node.js Core Rules', description: 'Evaluates deterministic rules (Geo Velocity, Spend Thresholds) alongside neural vector scores.', latency: '24ms calculation', status: 'healthy', iconName: 'Cpu' },
  { id: 'n7', name: 'Ahnlich / pgvector DB', category: 'AI & Storage', tech: 'Ahnlich DB + PostgreSQL 16', description: 'High-dimensional vector storage executing sub-8ms cosine distance similarity searches.', latency: '7.8ms vector search', status: 'active', iconName: 'Share2' },
  { id: 'n8', name: 'GPT Intelligence Service', category: 'AI & Storage', tech: 'OpenAI GPT-4o API', description: 'Synthesizes complex fraud signatures into natural language summaries and dispute briefs.', latency: '2.5s explanation gen', status: 'synced', iconName: 'Bot' },
  { id: 'n9', name: 'WebSocket Gateway', category: 'Frontend', tech: 'Socket.io + Redis PubSub', description: 'Streams live risk notifications and security triggers directly to active analyst clients.', latency: '15ms client push', status: 'active', iconName: 'Radio' }
];

export const METRICS_PRD: MetricItem[] = [
  { value: 100, prefix: '< ', suffix: 'ms', label: 'Detection Latency', description: 'Sub-100ms complete decision loop from HTTP request to fraud response.', prdBenchmark: 'PRD Mandate: < 100ms', highlightColor: 'from-cyan-400 to-blue-500' },
  { value: 10000, suffix: ' txns', label: 'Batch Processing', description: 'Asynchronous bulk ingestion capacity scanned concurrently per worker.', prdBenchmark: 'PRD Spec: 10,000 Batch Txns', highlightColor: 'from-purple-400 to-indigo-500' },
  { value: 8, prefix: '< ', suffix: 'ms', label: 'Vector Cosine Search', description: 'High-dimensional nearest-neighbor lookup across 10M+ transaction embeddings.', prdBenchmark: 'Ahnlich Engine: < 8ms Search', highlightColor: 'from-violet-400 to-purple-600' },
  { value: 500, prefix: '< ', suffix: 'ms', label: 'Live WebSocket Stream', description: 'Real-time alert dispatch from server backend to security dashboard.', prdBenchmark: 'Socket.io SLA: < 500ms', highlightColor: 'from-emerald-400 to-teal-500' },
  { value: 20, suffix: '%', label: 'Chargeback Reduction', description: 'Verified drop in fraudulent dispute disputes within 30 days of implementation.', prdBenchmark: 'Proven ROI: 20% Reduction', highlightColor: 'from-rose-400 to-pink-500' },
  { value: 2.5, suffix: 's', decimals: 1, label: 'GPT Explanation', description: 'Natural language threat reasoning generated by fine-tuned GPT intelligence.', prdBenchmark: 'Natural Language Synthesis: 2.5s', highlightColor: 'from-amber-400 to-orange-500' }
];

export const FAQ_LIST: FaqItem[] = [
  {
    category: 'Latency & Performance',
    question: 'How does FraudGuard AI maintain sub-100ms decision latency during high peak traffic?',
    answer: 'FraudGuard AI utilizes a multi-tiered architecture: fast-path deterministic rules run on in-memory Redis state, while 1536-D vector similarity queries execute against Ahnlich/pgvector indexes pre-cached in memory. The entire scoring pipeline is asynchronous and non-blocking, ensuring sub-100ms SLA even at 100k+ transactions per second.'
  },
  {
    category: 'AI & Vector Search',
    question: 'How does Vector Similarity Search differ from traditional machine learning models?',
    answer: 'Legacy ML models rely on rigid tabular features and re-training cycles that lag behind new fraud techniques. Vector Search converts raw transaction payloads (IPs, devices, amounts, merchant signatures, timing curves) into semantic vector embeddings. When fraudsters adapt their tactics, their transactions still land in the same geometrical cluster in 1536-D vector space, catching novel zero-day fraud instantly without model re-training.'
  },
  {
    category: 'AI & Vector Search',
    question: 'How does the GPT Fraud Analyst work without slowing down transaction approval?',
    answer: 'GPT intelligence runs asynchronously after the immediate sub-100ms pass/block decision is returned to your payment gateway. The fast engine blocks or approves instantly, while GPT processes the threat context in background to generate detailed audit summaries, compliance flags, and chargeback dispute briefs.'
  },
  {
    category: 'Deployment & Infra',
    question: 'Can FraudGuard AI run in hybrid cloud or on-premise security environments?',
    answer: 'Yes! FraudGuard AI is packaged as containerized microservices (Docker/Kubernetes) powered by NestJS, Kafka, and Redis. It can be deployed in AWS, GCP, Azure, or on-premise bare metal with air-gapped support using local vector databases.'
  },
  {
    category: 'Integration & API',
    question: 'How easy is it to integrate FraudGuard AI with existing payment gateways (Stripe, Adyen, Plaid)?',
    answer: 'Integration takes under 15 minutes. We provide Node.js, Python, Go, and Java SDKs, along with REST & gRPC API endpoints. You simply wrap your transaction authorization endpoint with a single asynchronous SDK call, or ingest event streams directly via Kafka.'
  },
  {
    category: 'Deployment & Infra',
    question: 'What is Offline Mock Mode and how do we test before going live?',
    answer: 'Offline Mock Mode allows your engineering team to simulate thousands of transactions with customizable fraud probability distributions directly in staging or CI/CD pipelines. It generates realistic card numbers, IPs, and merchant signatures with zero external API fees.'
  }
];
