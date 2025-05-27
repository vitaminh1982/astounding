// Utilities for the assistant
interface ContextualHelp {
  [key: string]: {
    title: string;
    description: string;
    suggestions: string[];
  };
}

const contextualHelpData: ContextualHelp = {
  '/': {
    title: 'Dashboard',
    description: 'Overview of your activities',
    suggestions: [
      'How to read the metrics?',
      'Where can I find my latest campaigns?',
      'How to customize my dashboard?'
    ]
  },
  '/templates': {
    title: 'Templates',
    description: 'Manage your message templates',
    suggestions: [
      'How to create a new template?',
      'How to use variables?',
      'How to duplicate a template?'
    ]
  },
  '/clients': {
    title: 'Clients',
    description: 'Manage your client database',
    suggestions: [
      'How to import contacts?',
      'How to segment my database?',
      'How to manage GDPR preferences?'
    ]
  }
};

export const getContextualHelp = async (path: string, query: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const context = contextualHelpData[path] || contextualHelpData['/'];
  
  // Simple response logic based on keywords
  if (query.toLowerCase().includes('create')) {
    return `To create a new ${context.title.toLowerCase()}, click on the "+" button at the top-right of the screen. I can guide you through the steps if you need.`;
  }

  if (query.toLowerCase().includes('how')) {
    return `I can help you with ${context.title}. Here are some common actions:\n\n${context.suggestions.join('\n')}`;
  }

  // Default response
  return `I'm here to help you with ${context.title}. ${context.description}. What would you like to know specifically?`;
};
