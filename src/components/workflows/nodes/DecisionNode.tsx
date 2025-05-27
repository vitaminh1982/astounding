import React from 'react';
import { Handle, Position } from 'reactflow';

const DecisionNode: React.FC = () => {
  return (
    <div className="bg-yellow-100 p-3 rounded-lg">
      <Handle type="target" position={Position.Top} />
      <div>Decision Node</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default DecisionNode;