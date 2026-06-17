import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  NodeTypes,
  Position,
  Handle,
  NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, User } from 'lucide-react';
import { MIRANKI_TEAM, MIRANKI_AGENTS } from './mirankiMockData';

function HumanNode({ data }: NodeProps) {
  return (
    <div className={`px-3 py-2 rounded-lg border-2 ${data.borderColor} bg-slate-800 shadow-lg min-w-[120px]`}>
      <Handle type="source" position={Position.Right} className="!bg-slate-400 !w-2 !h-2" />
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded-full ${data.bgColor} flex items-center justify-center`}>
          <span className={`text-[9px] font-bold ${data.textColor}`}>{data.initials}</span>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-200">{data.label}</p>
          <p className="text-[8px] text-slate-500">Supervisor</p>
        </div>
      </div>
    </div>
  );
}

function AgentNode({ data }: NodeProps) {
  return (
    <div className={`px-3 py-2 rounded-lg border ${data.borderColor} bg-slate-800/90 shadow-lg min-w-[110px] cursor-pointer hover:shadow-xl transition-shadow`}>
      <Handle type="target" position={Position.Left} className="!bg-slate-400 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!bg-slate-400 !w-2 !h-2" />
      <div className="flex items-center gap-2">
        <Bot className={`w-4 h-4 ${data.iconColor}`} />
        <div>
          <p className="text-[10px] font-bold text-slate-200">{data.label}</p>
          <div className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${data.statusColor}`} />
            <span className="text-[8px] text-slate-500 capitalize">{data.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewNode({ data }: NodeProps) {
  return (
    <div className="px-3 py-2 rounded-lg border-2 border-slate-500 bg-slate-700 shadow-lg min-w-[130px]">
      <Handle type="target" position={Position.Left} className="!bg-slate-400 !w-2 !h-2" />
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-slate-300" />
        <p className="text-[10px] font-semibold text-slate-200">{data.label}</p>
      </div>
    </div>
  );
}

const nodeTypes: NodeTypes = {
  human: HumanNode,
  agent: AgentNode,
  review: ReviewNode,
};

export default function MirankiWorkflow() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const nodes: Node[] = useMemo(() => [
    { id: 'sarah', type: 'human', position: { x: 20, y: 30 }, data: { label: 'Sarah Chen', initials: 'SC', borderColor: 'border-indigo-500', bgColor: 'bg-indigo-100', textColor: 'text-indigo-600' } },
    { id: 'priya', type: 'human', position: { x: 20, y: 150 }, data: { label: 'Priya Nair', initials: 'PN', borderColor: 'border-violet-500', bgColor: 'bg-violet-100', textColor: 'text-violet-600' } },
    { id: 'marcus', type: 'human', position: { x: 20, y: 270 }, data: { label: 'Marcus Okafor', initials: 'MO', borderColor: 'border-emerald-500', bgColor: 'bg-emerald-100', textColor: 'text-emerald-600' } },
    { id: 'aria', type: 'agent', position: { x: 220, y: 20 }, data: { label: 'ARIA', status: 'active', borderColor: 'border-amber-600/50', iconColor: 'text-amber-400', statusColor: 'bg-green-500' } },
    { id: 'nexus', type: 'agent', position: { x: 220, y: 90 }, data: { label: 'NEXUS', status: 'active', borderColor: 'border-cyan-600/50', iconColor: 'text-cyan-400', statusColor: 'bg-green-500' } },
    { id: 'forge', type: 'agent', position: { x: 220, y: 160 }, data: { label: 'FORGE', status: 'processing', borderColor: 'border-orange-600/50', iconColor: 'text-orange-400', statusColor: 'bg-amber-500' } },
    { id: 'delta', type: 'agent', position: { x: 220, y: 250 }, data: { label: 'DELTA', status: 'active', borderColor: 'border-teal-600/50', iconColor: 'text-teal-400', statusColor: 'bg-green-500' } },
    { id: 'oracle', type: 'agent', position: { x: 430, y: 140 }, data: { label: 'ORACLE', status: 'standby', borderColor: 'border-rose-600/50', iconColor: 'text-rose-400', statusColor: 'bg-slate-500' } },
    { id: 'review', type: 'review', position: { x: 620, y: 140 }, data: { label: 'Team Review' } },
  ], []);

  const edges: Edge[] = useMemo(() => [
    { id: 'e-sarah-aria', source: 'sarah', target: 'aria', animated: true, style: { stroke: '#6366f1', strokeWidth: 1.5 }, label: 'triggers', labelStyle: { fill: '#94a3b8', fontSize: 8 } },
    { id: 'e-sarah-nexus', source: 'sarah', target: 'nexus', animated: true, style: { stroke: '#6366f1', strokeWidth: 1.5 } },
    { id: 'e-priya-forge', source: 'priya', target: 'forge', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 1.5 }, label: 'triggers', labelStyle: { fill: '#94a3b8', fontSize: 8 } },
    { id: 'e-marcus-delta', source: 'marcus', target: 'delta', animated: true, style: { stroke: '#10b981', strokeWidth: 1.5 }, label: 'triggers', labelStyle: { fill: '#94a3b8', fontSize: 8 } },
    { id: 'e-aria-nexus', source: 'aria', target: 'nexus', animated: true, style: { stroke: '#f59e0b', strokeWidth: 1 }, label: 'brief', labelStyle: { fill: '#94a3b8', fontSize: 8 } },
    { id: 'e-nexus-oracle', source: 'nexus', target: 'oracle', animated: true, style: { stroke: '#06b6d4', strokeWidth: 1 }, label: 'context', labelStyle: { fill: '#94a3b8', fontSize: 8 } },
    { id: 'e-forge-oracle', source: 'forge', target: 'oracle', animated: true, style: { stroke: '#f97316', strokeWidth: 1 }, label: 'frameworks', labelStyle: { fill: '#94a3b8', fontSize: 8 } },
    { id: 'e-delta-oracle', source: 'delta', target: 'oracle', animated: true, style: { stroke: '#14b8a6', strokeWidth: 1 }, label: 'data', labelStyle: { fill: '#94a3b8', fontSize: 8 } },
    { id: 'e-oracle-review', source: 'oracle', target: 'review', animated: true, style: { stroke: '#f43f5e', strokeWidth: 2 }, label: 'synthesis', labelStyle: { fill: '#94a3b8', fontSize: 8 } },
  ], []);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.type === 'agent') {
      setSelectedAgent(node.id);
    }
  }, []);

  const selectedAgentData = selectedAgent
    ? MIRANKI_AGENTS.find((a) => a.id === `agent-${selectedAgent}`)
    : null;

  return (
    <div className="relative h-[400px] bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        className="react-flow-dark"
      >
        <Background color="#334155" gap={20} size={1} />
        <Controls className="!bg-slate-800 !border-slate-700 !shadow-lg [&>button]:!bg-slate-700 [&>button]:!border-slate-600 [&>button]:!text-slate-300 [&>button:hover]:!bg-slate-600" />
      </ReactFlow>

      {/* Agent Detail Panel */}
      <AnimatePresence>
        {selectedAgentData && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-3 right-3 w-56 bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl z-10"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-white">{selectedAgentData.name}</h4>
              <button onClick={() => setSelectedAgent(null)} className="text-slate-500 hover:text-slate-300">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mb-2">{selectedAgentData.fullName}</p>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className={`font-medium capitalize ${
                  selectedAgentData.status === 'active' ? 'text-green-400' :
                  selectedAgentData.status === 'processing' ? 'text-amber-400' : 'text-slate-400'
                }`}>{selectedAgentData.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{selectedAgentData.metrics.primary.label}</span>
                <span className="text-white font-medium">{selectedAgentData.metrics.primary.value}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tasks</span>
                <span className="text-white font-medium">{selectedAgentData.metrics.tasksCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Avg Time</span>
                <span className="text-white font-medium">{selectedAgentData.metrics.avgTime}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-700">
                <p className="text-slate-400">{selectedAgentData.currentTask}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
