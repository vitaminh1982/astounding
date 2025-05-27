export interface AIAgent {
  id: string;
  name: string;
  color: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  assignedAgents: AIAgent[];
}