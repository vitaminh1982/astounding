import { v4 as uuidv4 } from 'uuid';
import {
  IntakeData,
  ComplexityLevel,
  DeliveryTrack,
  ProjectPhase,
  ProjectAgent,
  ProjectTask,
  ProjectDocument,
  CreatedProject,
  IntakeChatMessage,
} from '../types/project-creation';

const INTAKE_QUESTIONS = [
  {
    key: 'projectName',
    question: "Let's get started! What would you like to name this project? A good name helps everyone align on the vision.",
  },
  {
    key: 'goal',
    question: "Great name! Now, what's the high-level goal of this project? What problem are you solving or what outcome do you want to achieve?",
  },
  {
    key: 'targetAudience',
    question: "Who are the primary users or target audience for this project? Understanding your audience helps us tailor the approach.",
  },
  {
    key: 'deliverables',
    question: "What are the key deliverables or success criteria? What does 'done' look like for this project?",
  },
  {
    key: 'timeline',
    question: "What's your timeline expectation? Are we talking weeks, months, or quarters? Any hard deadlines I should know about?",
  },
  {
    key: 'teamSize',
    question: "How large is your team, and what existing constraints should I consider? (e.g., available skills, tools already in use, regulatory requirements)",
  },
  {
    key: 'budget',
    question: "Finally, what's the budget range or resource limit for this project? This helps me calibrate the delivery approach and team composition.",
  },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getNextIntakeQuestion(
  answeredCount: number
): Promise<{ question: string; key: string; isLast: boolean } | null> {
  await delay(800 + Math.random() * 600);

  if (answeredCount >= INTAKE_QUESTIONS.length) return null;

  const q = INTAKE_QUESTIONS[answeredCount];
  return {
    question: q.question,
    key: q.key,
    isLast: answeredCount === INTAKE_QUESTIONS.length - 1,
  };
}

export function computeComplexity(intake: IntakeData): ComplexityLevel {
  let score = 0;

  if (intake.timeline.toLowerCase().includes('quarter') || intake.timeline.toLowerCase().includes('year')) score += 2;
  else if (intake.timeline.toLowerCase().includes('month')) score += 1;

  if (intake.teamSize.match(/\d+/)) {
    const size = parseInt(intake.teamSize.match(/\d+/)![0]);
    if (size > 15) score += 3;
    else if (size > 8) score += 2;
    else if (size > 3) score += 1;
  }

  if (intake.budget.toLowerCase().includes('million') || intake.budget.match(/\d{6,}/)) score += 3;
  else if (intake.budget.match(/\d{5}/)) score += 2;

  const deliverableCount = intake.deliverables.split(',').length + intake.deliverables.split('and').length - 1;
  if (deliverableCount > 5) score += 2;
  else if (deliverableCount > 2) score += 1;

  if (score >= 8) return 'enterprise';
  if (score >= 5) return 'high';
  if (score >= 3) return 'medium';
  return 'low';
}

export function selectDeliveryTrack(
  complexity: ComplexityLevel,
  intake: IntakeData
): { track: DeliveryTrack; label: string; rationale: string } {
  const text = `${intake.goal} ${intake.deliverables} ${intake.constraints}`.toLowerCase();

  if (complexity === 'enterprise' || text.includes('compliance') || text.includes('regulatory')) {
    return {
      track: 'prince2-agile-hybrid',
      label: 'Prince2-Agile Hybrid',
      rationale: 'Enterprise complexity with governance needs requires a structured yet adaptive framework combining Prince2 stage gates with agile delivery.',
    };
  }

  if (text.includes('mvp') || text.includes('rapid') || text.includes('startup') || complexity === 'low') {
    return {
      track: 'lean-sprint',
      label: 'Lean Sprint',
      rationale: 'Fast-paced delivery with iterative validation cycles. Ideal for projects that need quick results with room to adapt.',
    };
  }

  if (text.includes('waterfall') || text.includes('sequential') || text.includes('fixed')) {
    return {
      track: 'waterfall-classic',
      label: 'Waterfall Classic',
      rationale: 'Sequential delivery with clear phase gates. Best for projects with well-defined requirements and minimal expected changes.',
    };
  }

  return {
    track: 'kanban-flow',
    label: 'Kanban Flow',
    rationale: 'Continuous delivery with work-in-progress limits. Optimal for teams that need flexibility while maintaining steady throughput.',
  };
}

export function generateAgents(intake: IntakeData): ProjectAgent[] {
  const text = `${intake.goal} ${intake.deliverables}`.toLowerCase();

  const baseAgents: ProjectAgent[] = [
    {
      id: uuidv4(),
      name: 'Aria',
      role: 'Requirements Analyst',
      icon: 'clipboard-list',
      currentTask: 'Analyzing project requirements',
      status: 'working',
      progress: 15,
      color: 'blue',
    },
    {
      id: uuidv4(),
      name: 'Max',
      role: 'Risk Manager',
      icon: 'shield-alert',
      currentTask: 'Identifying initial risk factors',
      status: 'working',
      progress: 10,
      color: 'amber',
    },
  ];

  if (text.includes('app') || text.includes('mobile') || text.includes('ui') || text.includes('design')) {
    baseAgents.push({
      id: uuidv4(),
      name: 'Luna',
      role: 'UX/UI Specialist',
      icon: 'palette',
      currentTask: 'Preparing design system foundations',
      status: 'idle',
      progress: 0,
      color: 'pink',
    });
  } else if (text.includes('data') || text.includes('analytics') || text.includes('ml')) {
    baseAgents.push({
      id: uuidv4(),
      name: 'Nova',
      role: 'Data Architect',
      icon: 'database',
      currentTask: 'Mapping data pipeline requirements',
      status: 'idle',
      progress: 0,
      color: 'cyan',
    });
  } else {
    baseAgents.push({
      id: uuidv4(),
      name: 'Felix',
      role: 'Solutions Architect',
      icon: 'cpu',
      currentTask: 'Evaluating technical architecture',
      status: 'idle',
      progress: 0,
      color: 'emerald',
    });
  }

  baseAgents.push({
    id: uuidv4(),
    name: 'Oscar',
    role: 'Project Coordinator',
    icon: 'calendar',
    currentTask: 'Building project timeline',
    status: 'working',
    progress: 20,
    color: 'violet',
  });

  baseAgents.push({
    id: uuidv4(),
    name: 'Zara',
    role: 'Quality Assurance Lead',
    icon: 'check-circle',
    currentTask: 'Defining quality criteria',
    status: 'idle',
    progress: 0,
    color: 'green',
  });

  return baseAgents;
}

export function generatePhases(): ProjectPhase[] {
  return [
    {
      id: uuidv4(),
      name: 'Initiation',
      description: 'Define scope, objectives, and stakeholders',
      status: 'active',
      estimatedDuration: '1-2 weeks',
      order: 0,
      deliverables: [
        { id: uuidv4(), name: 'Project Charter', completed: false, assignedAgentId: '' },
        { id: uuidv4(), name: 'Stakeholder Register', completed: false, assignedAgentId: '' },
        { id: uuidv4(), name: 'Initial Risk Assessment', completed: false, assignedAgentId: '' },
      ],
    },
    {
      id: uuidv4(),
      name: 'Planning',
      description: 'Detail requirements, schedule, and resources',
      status: 'locked',
      estimatedDuration: '2-3 weeks',
      order: 1,
      deliverables: [
        { id: uuidv4(), name: 'Requirements Specification', completed: false, assignedAgentId: '' },
        { id: uuidv4(), name: 'Project Schedule', completed: false, assignedAgentId: '' },
        { id: uuidv4(), name: 'Resource Plan', completed: false, assignedAgentId: '' },
        { id: uuidv4(), name: 'Communication Plan', completed: false, assignedAgentId: '' },
      ],
    },
    {
      id: uuidv4(),
      name: 'Execution',
      description: 'Build deliverables and manage work packages',
      status: 'locked',
      estimatedDuration: '4-8 weeks',
      order: 2,
      deliverables: [
        { id: uuidv4(), name: 'Architecture Document', completed: false, assignedAgentId: '' },
        { id: uuidv4(), name: 'Development Sprints', completed: false, assignedAgentId: '' },
        { id: uuidv4(), name: 'Integration Testing', completed: false, assignedAgentId: '' },
      ],
    },
    {
      id: uuidv4(),
      name: 'Monitoring',
      description: 'Track progress, manage changes, control quality',
      status: 'locked',
      estimatedDuration: '2-3 weeks',
      order: 3,
      deliverables: [
        { id: uuidv4(), name: 'Performance Reports', completed: false, assignedAgentId: '' },
        { id: uuidv4(), name: 'Quality Audit', completed: false, assignedAgentId: '' },
        { id: uuidv4(), name: 'Change Log', completed: false, assignedAgentId: '' },
      ],
    },
    {
      id: uuidv4(),
      name: 'Closure',
      description: 'Finalize deliverables, conduct retrospective',
      status: 'locked',
      estimatedDuration: '1-2 weeks',
      order: 4,
      deliverables: [
        { id: uuidv4(), name: 'Final Deliverable Package', completed: false, assignedAgentId: '' },
        { id: uuidv4(), name: 'Lessons Learned', completed: false, assignedAgentId: '' },
        { id: uuidv4(), name: 'Project Closure Report', completed: false, assignedAgentId: '' },
      ],
    },
  ];
}

export function generateDocuments(phases: ProjectPhase[]): ProjectDocument[] {
  const docs: ProjectDocument[] = [];

  const docTemplates: { name: string; description: string; phaseIndex: number; category: string }[] = [
    { name: 'Project Charter', description: 'Formal authorization of the project, including objectives, scope, and stakeholders.', phaseIndex: 0, category: 'Governance' },
    { name: 'Stakeholder Analysis', description: 'Identification and analysis of project stakeholders and their interests.', phaseIndex: 0, category: 'Governance' },
    { name: 'Risk Register', description: 'Comprehensive list of identified risks with impact and mitigation strategies.', phaseIndex: 0, category: 'Risk' },
    { name: 'Requirements Specification', description: 'Detailed functional and non-functional requirements for the project.', phaseIndex: 1, category: 'Technical' },
    { name: 'Project Schedule', description: 'Timeline with milestones, dependencies, and resource allocation.', phaseIndex: 1, category: 'Planning' },
    { name: 'Architecture Document', description: 'Technical architecture decisions and system design overview.', phaseIndex: 2, category: 'Technical' },
    { name: 'Test Plan', description: 'Testing strategy, test cases, and acceptance criteria.', phaseIndex: 2, category: 'Quality' },
    { name: 'Progress Report', description: 'Current status, KPIs, and variance analysis.', phaseIndex: 3, category: 'Reporting' },
    { name: 'Quality Audit Report', description: 'Quality metrics, compliance status, and improvement recommendations.', phaseIndex: 3, category: 'Quality' },
    { name: 'Project Closure Report', description: 'Final summary, lessons learned, and handover documentation.', phaseIndex: 4, category: 'Governance' },
  ];

  for (const template of docTemplates) {
    const phase = phases[template.phaseIndex];
    docs.push({
      id: uuidv4(),
      name: template.name,
      description: template.description,
      phaseId: phase.id,
      generatedBy: '',
      status: template.phaseIndex === 0 ? 'unlocked' : 'locked',
      content: `# ${template.name}\n\n${template.description}\n\n*This document will be generated progressively as the project advances.*`,
      category: template.category,
      createdAt: new Date(),
    });
  }

  return docs;
}

export function generateInitialTasks(agents: ProjectAgent[]): ProjectTask[] {
  const tasks: ProjectTask[] = [
    {
      id: uuidv4(),
      title: 'Draft Project Charter',
      description: 'Create initial project charter with objectives and scope',
      assignedAgentId: agents[0]?.id || '',
      status: 'in-progress',
      priority: 'high',
      phaseTag: 'Initiation',
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      title: 'Identify Key Risks',
      description: 'Perform initial risk identification and assessment',
      assignedAgentId: agents[1]?.id || '',
      status: 'in-progress',
      priority: 'high',
      phaseTag: 'Initiation',
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      title: 'Map Stakeholders',
      description: 'Identify and categorize project stakeholders',
      assignedAgentId: agents[0]?.id || '',
      status: 'backlog',
      priority: 'medium',
      phaseTag: 'Initiation',
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      title: 'Define Success Criteria',
      description: 'Establish measurable success criteria and KPIs',
      assignedAgentId: agents[3]?.id || '',
      status: 'backlog',
      priority: 'medium',
      phaseTag: 'Initiation',
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      title: 'Establish Quality Baseline',
      description: 'Define quality standards and testing approach',
      assignedAgentId: agents[4]?.id || '',
      status: 'backlog',
      priority: 'low',
      phaseTag: 'Planning',
      createdAt: new Date(),
    },
  ];

  return tasks;
}

export async function generateProjectFromIntake(intake: IntakeData): Promise<CreatedProject> {
  await delay(1500);

  const complexity = computeComplexity(intake);
  const { track, label, rationale } = selectDeliveryTrack(complexity, intake);
  const agents = generateAgents(intake);
  const phases = generatePhases();
  const documents = generateDocuments(phases);
  const tasks = generateInitialTasks(agents);

  return {
    id: uuidv4(),
    name: intake.projectName,
    goal: intake.goal,
    complexity,
    deliveryTrack: track,
    deliveryTrackLabel: label,
    deliveryTrackRationale: rationale,
    phases,
    agents,
    tasks,
    documents,
    collaborators: [
      {
        id: uuidv4(),
        name: 'You',
        email: 'you@company.com',
        role: 'admin',
        isOnline: true,
        lastActivity: 'Now',
      },
    ],
    currentPhaseIndex: 0,
    overallProgress: 5,
    createdAt: new Date(),
    daysElapsed: 0,
  };
}

export async function getChatAssistantResponse(
  message: string,
  project: CreatedProject
): Promise<string> {
  await delay(1000 + Math.random() * 800);

  const lowerMsg = message.toLowerCase();
  const currentPhase = project.phases[project.currentPhaseIndex];

  if (lowerMsg.includes('status') || lowerMsg.includes('progress')) {
    return `The project "${project.name}" is currently in the **${currentPhase.name}** phase with ${project.overallProgress}% overall progress.\n\n**Active agents:** ${project.agents.filter(a => a.status === 'working').length} of ${project.agents.length}\n**Tasks in progress:** ${project.tasks.filter(t => t.status === 'in-progress').length}\n**Deliverables completed:** ${currentPhase.deliverables.filter(d => d.completed).length}/${currentPhase.deliverables.length}`;
  }

  if (lowerMsg.includes('risk') || lowerMsg.includes('blocker')) {
    return `Based on the current project state, here are the key risk areas:\n\n1. **Timeline Risk** - The ${currentPhase.name} phase is ${project.daysElapsed} days in. Monitor velocity closely.\n2. **Scope Risk** - Ensure deliverable requirements don't expand beyond the initial charter.\n3. **Resource Risk** - ${project.agents.filter(a => a.status === 'blocked').length} agent(s) currently blocked.\n\nWould you like me to generate a detailed risk mitigation plan?`;
  }

  if (lowerMsg.includes('next') || lowerMsg.includes('what should')) {
    const incompleteTasks = project.tasks.filter(t => t.status !== 'done');
    return `Here's what I recommend focusing on next:\n\n1. Complete the remaining ${incompleteTasks.length} task(s) in the current phase\n2. Review the deliverable checklist for "${currentPhase.name}"\n3. Prepare for phase transition once all deliverables are validated\n\nThe agents are actively working on their assigned tasks. Would you like to see more details on any specific area?`;
  }

  return `I understand you're asking about "${message}". Based on the current state of "${project.name}":\n\n- **Current Phase:** ${currentPhase.name}\n- **Delivery Track:** ${project.deliveryTrackLabel}\n- **Complexity:** ${project.complexity}\n\nI can help you with task management, phase transitions, risk assessment, or document generation. What would you like to explore?`;
}
