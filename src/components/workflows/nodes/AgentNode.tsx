import React from 'react';
import { Handle, Position } from 'reactflow';

const AgentNode: React.FC = () => {
  return (
    <div className="bg-blue-100 p-3 rounded-lg">
      <Handle type="target" position={Position.Top} />
      <div>Agent Node</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default AgentNode;