/**
 * Types for the workspace modal components
 */

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface OnboardingSettings {
  welcomeMessage: string;
  defaultRole: string;
  autoOnboarding: boolean;
  requiredTasks: string[];
}

export interface WorkspaceData {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  color: string;
  members: Member[];
  roles: Role[];
  onboarding: OnboardingSettings;
}