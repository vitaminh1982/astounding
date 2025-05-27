import { LucideIcon } from 'lucide-react';

export interface AgentType {
  id: number;
  name: string;
  status: 'active' | 'inactive' | 'suspended' ;
  icon: LucideIcon;
  metrics: string;
  skills: string[];
}