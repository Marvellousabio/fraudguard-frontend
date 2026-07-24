import React, { useMemo, useCallback } from 'react';
import { ReactFlow, Node, Edge, Background, Controls, useNodesState, useEdgesState, ConnectionMode, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import { Transaction } from '@/shared/types/fraud';
import { Network, User, ShoppingCart, Globe } from 'lucide-react';

interface FraudNetworkGraphProps {
  transactions: Transaction[];
  onSelectNode: (entityId: string) => void;
}

export const FraudNetworkGraph: React.FC<FraudNetworkGraphProps> = ({ transactions, onSelectNode }) => {
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodeSet = new Set<string>();

    const addNode = (id: string, label: string, type: 'account' | 'merchant' | 'ip', data: Record<string, unknown>) => {
      if (nodeSet.has(id)) return;
      nodeSet.add(id);

      let color = '#64748b';
      let icon = User;
      if (type === 'merchant') { color = '#6366f1'; icon = ShoppingCart; }
      if (type === 'ip') { color = '#f43f5e'; icon = Globe; }

      nodes.push({
        id,
        type: 'default',
        position: { x: Math.random() * 600, y: Math.random() * 400 },
        data: { label, color, icon, type, ...data },
        style: {
          background: '#0f172a',
          color: '#fff',
          border: `2px solid ${color}`,
          borderRadius: 12,
          padding: 10,
          width: 180,
          fontSize: 12,
          fontWeight: 600,
        },
      });
    };

    transactions.forEach((tx) => {
      const accountId = `account:${tx.accountId}`;
      const merchantId = `merchant:${tx.merchant}`;
      const ipId = `ip:${tx.ipAddress}`;

      addNode(accountId, `${tx.accountName}\n${tx.accountId}`, 'account', { riskScore: tx.riskScore });
      addNode(merchantId, tx.merchant, 'merchant', { category: tx.merchantCategory });
      addNode(ipId, tx.ipAddress, 'ip', { location: tx.location.city });

      edges.push({
        id: `e-${tx.id}-account-merchant`,
        source: accountId,
        target: merchantId,
        animated: tx.riskScore >= 60,
        style: { stroke: '#f59e0b', strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.Arrow, color: '#f59e0b' },
      });

      edges.push({
        id: `e-${tx.id}-account-ip`,
        source: accountId,
        target: ipId,
        animated: tx.riskScore >= 60,
        style: { stroke: '#f59e0b', strokeWidth: 1.5, strokeDasharray: '5 5' },
        markerEnd: { type: MarkerType.Arrow, color: '#f59e0b' },
      });
    });

    const cols = Math.ceil(Math.sqrt(nodes.length));
    nodes.forEach((node, i) => {
      node.position = {
        x: 150 + (i % cols) * 220,
        y: 100 + Math.floor(i / cols) * 140,
      };
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [transactions]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onSelectNode(node.id);
    },
    [onSelectNode]
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-4 lg:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Network className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-sans">
              Fraud Ring Network Graph
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Accounts → Merchants → IPs. Click a node to filter the table.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-slate-500 inline-block" /> Account</span>
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-indigo-500 inline-block" /> Merchant</span>
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-rose-500 inline-block" /> IP</span>
        </div>
      </div>

      <div className="h-[500px] bg-slate-950">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          connectionMode={ConnectionMode.Loose}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#1e293b" gap={20} />
          <Controls className="!bg-slate-900 !border-slate-700 !text-white" />
        </ReactFlow>
      </div>
    </div>
  );
};
