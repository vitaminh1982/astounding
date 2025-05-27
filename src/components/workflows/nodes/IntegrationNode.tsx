import React from 'react';
import { Handle, Position } from 'reactflow';

const IntegrationNode: React.FC = () => {
  return (
    <div className="bg-green-100 p-3 rounded-lg">
      <Handle type="target" position={Position.Top} />
      <div>Integration Node</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default IntegrationNode;
