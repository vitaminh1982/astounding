// components/workflows/common/
interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

// Custom Nodes
const AgentNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="agent-node">
      <AgentIcon />
      <div className="agent-info">
        <h4>{data.name}</h4>
        <p>{data.role}</p>
      </div>
      <NodeControls />
    </div>
  );
};

// Custom Edge
const CustomEdge: React.FC<EdgeProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
}) => {
  return (
    <g>
      <path
        className="workflow-edge"
        d={`M${sourceX},${sourceY} C ${sourceX + 50},${sourceY} ${targetX - 50},${targetY} ${targetX},${targetY}`}
      />
    </g>
  );
};
