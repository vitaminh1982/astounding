import React from 'react';
import TemplateCard from './TemplateCard';
import { Template } from '../../types/template';

const templates: Template[] = [
  // 24/7 Customer Support
  {
    id: 1,
    name: 'Customer Welcome',
    description: 'Personalized welcome message',
    category: 'chat',
    status: 'published',
    tags: ['Support', 'Welcome'],
    lastModified: '2h ago',
    usage: 2456,
    favorite: true,
  },
  {
    id: 2,
    name: 'Problem Resolution',
    description: 'Step-by-step problem resolution guide',
    category: 'chat',
    status: 'published',
    tags: ['Support', 'Troubleshooting'],
    lastModified: '1d ago',
    usage: 1234,
    favorite: true,
  },

  // Sales Assistant
  {
    id: 3,
    name: 'Lead Qualification',
    description: 'Prospect qualification questions',
    category: 'chat',
    status: 'published',
    tags: ['Sales', 'Lead'],
    lastModified: '3h ago',
    usage: 845,
    favorite: true,
  },
  {
    id: 4,
    name: 'Automatic Quote',
    description: 'Generation of personalized quotes',
    category: 'email',
    status: 'published',
    tags: ['Sales', 'Quote'],
    lastModified: '5h ago',
    usage: 567,
    favorite: false,
  },

  // HR Assistant
  {
    id: 5,
    name: 'Leave Request',
    description: 'Leave request process',
    category: 'chat',
    status: 'published',
    tags: ['HR', 'Leave'],
    lastModified: '1d ago',
    usage: 156,
    favorite: false,
  },
  {
    id: 6,
    name: 'HR FAQ',
    description: 'Answers to common HR questions',
    category: 'chat',
    status: 'published',
    tags: ['HR', 'FAQ'],
    lastModified: '2d ago',
    usage: 789,
    favorite: true,
  },

  // E-commerce Assistant
  {
    id: 7,
    name: 'Order Tracking',
    description: 'Order status information',
    category: 'email',
    status: 'published',
    tags: ['E-commerce', 'Order'],
    lastModified: '4h ago',
    usage: 1234,
    favorite: true,
  },
  {
    id: 8,
    name: 'Product Recommendation',
    description: 'Personalized suggestions',
    category: 'chat',
    status: 'published',
    tags: ['E-commerce', 'Sales'],
    lastModified: '6h ago',
    usage: 987,
    favorite: false,
  },

  // Billing Service
  {
    id: 9,
    name: 'Payment Reminder',
    description: 'Follow-up on pending payment',
    category: 'email',
    status: 'published',
    tags: ['Billing', 'Reminder'],
    lastModified: '1d ago',
    usage: 567,
    favorite: false,
  },
  {
    id: 10,
    name: 'Refund Confirmation',
    description: 'Refund validation',
    category: 'email',
    status: 'published',
    tags: ['Billing', 'Refund'],
    lastModified: '2d ago',
    usage: 345,
    favorite: true,
  },

  // Technical Support
  {
    id: 11,
    name: 'Initial Diagnosis',
    description: 'Preliminary problem analysis',
    category: 'chat',
    status: 'published',
    tags: ['Technical', 'Diagnosis'],
    lastModified: '3h ago',
    usage: 890,
    favorite: true,
  },
  {
    id: 12,
    name: 'Installation Guide',
    description: 'Step-by-step instructions',
    category: 'email',
    status: 'published',
    tags: ['Technical', 'Installation'],
    lastModified: '1d ago',
    usage: 678,
    favorite: false,
  },

  // After-Sales Service
  {
    id: 13,
    name: 'Product Return',
    description: 'Return procedure',
    category: 'email',
    status: 'published',
    tags: ['After-Sales', 'Return'],
    lastModified: '5h ago',
    usage: 345,
    favorite: true,
  },
  {
    id: 14,
    name: 'Warranty Follow-Up',
    description: 'Product warranty information',
    category: 'chat',
    status: 'published',
    tags: ['After-Sales', 'Warranty'],
    lastModified: '2d ago',
    usage: 234,
    favorite: false,
  },

  // International Assistant
  {
    id: 15,
    name: 'Welcome International',
    description: 'Multi-language welcome message',
    category: 'chat',
    status: 'published',
    tags: ['International', 'Welcome'],
    lastModified: '6h ago',
    usage: 678,
    favorite: true,
  },
  {
    id: 16,
    name: 'Shipping Information',
    description: 'International shipping details',
    category: 'email',
    status: 'published',
    tags: ['International', 'Shipping'],
    lastModified: '1d ago',
    usage: 456,
    favorite: false,
  },

  // Customer Training
  {
    id: 17,
    name: 'Onboarding Program',
    description: 'Initial training plan',
    category: 'email',
    status: 'published',
    tags: ['Training', 'Onboarding'],
    lastModified: '4h ago',
    usage: 234,
    favorite: true,
  },
  {
    id: 18,
    name: 'Webinar Invitation',
    description: 'Invitation to training session',
    category: 'email',
    status: 'published',
    tags: ['Training', 'Webinar'],
    lastModified: '2d ago',
    usage: 123,
    favorite: false,
  },

  // Appointment Manager
  {
    id: 19,
    name: 'Appointment Confirmation',
    description: 'Appointment confirmation',
    category: 'email',
    status: 'published',
    tags: ['Appointment', 'Confirmation'],
    lastModified: '1h ago',
    usage: 789,
    favorite: true,
  },
  {
    id: 20,
    name: 'Appointment Reminder',
    description: '24h appointment reminder',
    category: 'notification',
    status: 'published',
    tags: ['Appointment', 'Reminder'],
    lastModified: '12h ago',
    usage: 567,
    favorite: true,
  },

  // Email Marketing
  {
    id: 21,
    name: 'Monthly Newsletter',
    description: 'Personalized newsletter template',
    category: 'email',
    status: 'published',
    tags: ['Marketing', 'Newsletter'],
    lastModified: '3d ago',
    usage: 5678,
    favorite: true,
  },
  {
    id: 22,
    name: 'Special Promotion',
    description: 'Limited-time offer',
    category: 'email',
    status: 'published',
    tags: ['Marketing', 'Promotion'],
    lastModified: '1d ago',
    usage: 3456,
    favorite: false,
  },

  // Proactive Chatbot
  {
    id: 23,
    name: 'Visitor Engagement',
    description: 'Proactive message for product page',
    category: 'chat',
    status: 'published',
    tags: ['Chatbot', 'Engagement'],
    lastModified: '5h ago',
    usage: 3456,
    favorite: true,
  },
  {
    id: 24,
    name: 'Lead Qualification',
    description: 'Automatic lead qualification questions',
    category: 'chat',
    status: 'published',
    tags: ['Chatbot', 'Lead'],
    lastModified: '2d ago',
    usage: 2345,
    favorite: false,
  }
];


export default function TemplatesList() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}