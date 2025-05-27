import React from 'react';

export const DraggableAgent: React.FC = () => {
  return (
    <div className="p-2 bg-blue-50 rounded cursor-move">
      Agent
    </div>
  );
};

export const DraggableDecision: React.FC = () => {
  return (
    <div className="p-2 bg-yellow-50 rounded cursor-move">
      Decision
    </div>
  );
};

export const DraggableIntegration: React.FC = () => {
  return (
    <div className="p-2 bg-green-50 rounded cursor-move">
      Integration
    </div>
  );
};