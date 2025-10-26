// src/components/prompts/PromptsList.tsx

import React from 'react';
import { SearchX } from 'lucide-react';
import { Prompt } from '../../types/prompt';
import PromptCard from './PromptCard';
import { LanguageContext } from '../../context/LanguageContext';
import { useContext } from 'react';

// Mock data for prompts
export const mockPrompts: Prompt[] = [
  // Marketing Category
  {
    id: "1",
    title: 'Email Campaign Creator',
    description: 'Generate compelling email marketing campaigns with high conversion rates',
    category: 'marketing',
    status: 'published',
    content: `I want you to act as an Email Marketing Specialist. Create a compelling email campaign for the following details:
- Target audience: {audience}
- Product/Service: {product}
- Key benefits: {benefits}
- Call to action: {CTA}
- Tone: Professional but friendly
Include a catchy subject line, engaging opening, 3 main selling points, and strong closing with clear CTA.`,
    tags: ['Email', 'Marketing'],
    role: 'Marketing',
    lastModified: '2h ago',
    usageCount: 32,
    isFavorite: true,
    author: 'Marketing Team'
  },
  {
    id: "2",
    title: 'Social Media Post Generator',
    description: 'Create engaging social media content for multiple platforms',
    category: 'marketing',
    status: 'published',
    content: `Act as a Social Media Content Creator. Create a post for {platform} that promotes {product/service} with these key points:
- Main benefit: {benefit}
- Target audience: {audience}
- Key hashtags: {hashtags}
- Include: One attention-grabbing hook, key information in accessible language, and a clear call-to-action.
Post should be engaging, concise, and match {platform}'s best practices.`,
    tags: ['Social Media', 'Content'],
    role: 'Marketing',
    lastModified: '1d ago',
    usageCount: 28,
    isFavorite: true,
    author: 'Marketing Team'
  },

  // Content Creation Category
  {
    id: "3",
    title: 'Blog Post Outline',
    description: 'Structured outline for SEO-optimized blog articles',
    category: 'content_creation',
    status: 'published',
    content: `Act as a Content Strategist. Create a detailed blog post outline for the topic: {topic}
Target audience: {audience}
SEO keywords: {keywords}
Word count: {count}

Include:
1. 3-5 catchy title options
2. Introduction with hook and thesis
3. 5-7 main sections with subheadings
4. Key points for each section
5. Conclusion structure
6. CTA recommendation
7. Metadata description (150 characters)`,
    tags: ['Blog', 'SEO', 'Content'],
    role: 'Content Creation',
    lastModified: '5h ago',
    usageCount: 19,
    isFavorite: false,
    author: 'Content Team'
  },
  {
    id: "4",
    title: 'Product Description Writer',
    description: 'Compelling product descriptions that drive sales',
    category: 'content_creation',
    status: 'published',
    content: `Act as an E-commerce Copywriter. Write a compelling product description for:
Product: {product name}
Category: {category}
Key features: {list features}
Target audience: {audience}
Price point: {price range}
USP: {unique selling proposition}

Format: 250-300 words with:
- Attention-grabbing headline
- Benefit-focused intro paragraph
- Scannable bullet points highlighting features and benefits
- Sensory language that helps customers imagine using the product
- Clear call-to-action`,
    tags: ['E-commerce', 'Copy'],
    role: 'Content Creation',
    lastModified: '1d ago',
    usageCount: 16,
    isFavorite: true,
    author: 'Sales Team'
  },

  // Development Category
  {
    id: "5",
    title: 'Code Refactoring Helper',
    description: 'Get suggestions to improve and optimize your code',
    category: 'development',
    status: 'published',
    content: `Act as a Senior Software Engineer. Review the following code and provide refactoring recommendations:

\`\`\`
{paste code here}
\`\`\`

Language: {language}
Current issues: {issues if known}
Goals: {e.g., improve performance, readability, maintainability}

Please provide:
1. A code analysis identifying potential issues
2. Refactored code with improvements
3. Explanation of changes and their benefits
4. Any design pattern recommendations
5. Performance considerations`,
    tags: ['Code', 'Refactoring'],
    role: 'Development',
    lastModified: '3h ago',
    usageCount: 9,
    isFavorite: true,
    author: 'Dev Team'
  },
  {
    id: "6",
    title: 'API Documentation Generator',
    description: 'Create clear and comprehensive API documentation',
    category: 'development',
    status: 'published',
    content: `Act as a Technical Documentation Specialist. Create comprehensive API documentation for the following endpoint:

Endpoint: {endpoint}
Method: {GET/POST/PUT/DELETE}
Description: {brief description}
Authentication: {auth method}
Request parameters: {parameters}
Response format: {format}

Please include:
1. Endpoint overview
2. Request format with all parameters explained
3. Example request in curl and one programming language
4. Response structure with all fields explained
5. Status codes and error handling
6. Rate limiting information
7. Any important notes or warnings`,
    tags: ['API', 'Documentation'],
    role: 'Development',
    lastModified: '2d ago',
    usageCount: 7,
    isFavorite: false,
    author: 'Dev Team'
  },

  // Support Category
  {
    id: "7",
    title: 'Troubleshooting Guide',
    description: 'Step-by-step problem resolution for common issues',
    category: 'support',
    status: 'published',
    content: `Act as a Technical Support Specialist. Create a step-by-step troubleshooting guide for the following issue:

Product: {product}
Issue: {issue description}
Customer technical level: {beginner/intermediate/advanced}

Include:
1. Initial verification steps to confirm the issue
2. Common causes of this problem
3. Step-by-step resolution process with clear instructions
4. Screenshots or diagrams where helpful
5. Warning for steps that might cause data loss
6. Alternative solutions if the main approach doesn't work
7. Prevention tips for the future`,
    tags: ['Support', 'Troubleshooting'],
    role: 'Support',
    lastModified: '12h ago',
    usageCount: 2,
    isFavorite: true,
    author: 'Support Team'
  },
  {
    id: "8",
    title: 'Customer Satisfaction Survey',
    description: 'Post-interaction survey to measure service quality',
    category: 'support',
    status: 'published',
    content: `Act as a Customer Experience Manager. Create a post-service satisfaction survey for:

Service type: {support/implementation/training}
Interaction duration: {timeframe}
Touchpoints: {phone/email/chat/in-person}

The survey should:
1. Be concise (5-7 questions max)
2. Include a mix of rating scales and open-ended questions
3. Measure both agent performance and overall experience
4. Have clear, unbiased question wording
5. Include a Net Promoter Score question
6. Provide opportunity for improvement suggestions
7. End with appropriate thank you message`,
    tags: ['Support', 'Survey'],
    role: 'Support',
    lastModified: '2d ago',
    usageCount: 5,
    isFavorite: false,
    author: 'Support Team'
  },

  // HR Category
  {
    id: "9",
    title: 'Job Description Creator',
    description: 'Professional and compelling job postings',
    category: 'hr',
    status: 'published',
    content: `Act as an HR Recruitment Specialist. Draft a compelling job description for the following position:

Position title: {title}
Department: {department}
Reports to: {reporting manager}
Key responsibilities: {list key duties}
Required qualifications: {requirements}
Preferred qualifications: {nice-to-haves}
Salary range: {range if applicable}
Location/remote options: {location details}

Include:
1. Engaging company introduction (2-3 sentences)
2. Role overview and impact
3. Key responsibilities in bullet form
4. Required and preferred qualifications
5. Benefits and perks
6. DEI statement
7. Application instructions`,
    tags: ['HR', 'Recruiting'],
    role: 'HR',
    lastModified: '1d ago',
    usageCount: 7,
    isFavorite: true,
    author: 'HR Team'
  },
  {
    id: "10",
    title: 'Performance Review Template',
    description: 'Structured framework for objective employee evaluations',
    category: 'hr',
    status: 'published',
    content: `Act as an HR Performance Management Specialist. Create a comprehensive performance review template with the following components:

Employee role type: {role type}
Review period: {timeframe}
Review type: {annual/quarterly/probation}

Include these sections:
1. Performance metrics evaluation (with 1-5 scale and definitions)
2. Goal achievement assessment (comparing results to set objectives)
3. Core competencies evaluation (teamwork, communication, initiative, etc.)
4. Strengths acknowledgment (with specific examples prompts)
5. Development areas (with improvement suggestions prompts)
6. Future goals and objectives setting
7. Employee self-assessment questions
8. Manager comments section
9. Action plan framework`,
    tags: ['HR', 'Performance'],
    role: 'HR',
    lastModified: '3d ago',
    usageCount: 4,
    isFavorite: false,
    author: 'HR Team'
  },

  // Custom Category
  {
    id: "11",
    title: 'Meeting Minutes Template',
    description: 'Structured template for effective meeting documentation',
    category: 'custom',
    status: 'published',
    content: `Act as a Professional Executive Assistant. Create a comprehensive meeting minutes template for:

Meeting type: {type}
Participants: {roles of attendees}
Duration: {expected length}
Frequency: {how often this meeting occurs}

The template should include:
1. Meeting header with date, time, location/platform, attendees, and absentees
2. Agenda items review structure
3. Decision log format
4. Action items tracking with responsible parties and deadlines
5. Discussion summary framework
6. Next meeting details
7. Approval mechanism

Format the template for easy completion during a live meeting.`,
    tags: ['Meetings', 'Documentation'],
    role: 'Custom',
    lastModified: '6h ago',
    usageCount: 8,
    isFavorite: true,
    author: 'Admin Team'
  },
  {
    id: "12",
    title: 'SWOT Analysis Framework',
    description: 'Comprehensive strategic business analysis template',
    category: 'custom',
    status: 'published',
    content: `Act as a Strategic Business Consultant. Create a SWOT analysis framework for:

Business/Product: {name}
Industry: {industry}
Analysis scope: {organization-wide/department/product/market}
Current focus: {growth/stabilization/pivot/etc.}

The template should include:
1. Introduction explaining the purpose and methodology
2. Strengths section with internal positive factor prompts
3. Weaknesses section with internal negative factor prompts
4. Opportunities section with external positive factor prompts
5. Threats section with external negative factor prompts
6. Cross-analysis matrix (how S can help capture O, how S can counter T, etc.)
7. Prioritization framework for identified factors
8. Strategic recommendations outline`,
    tags: ['Strategy', 'Analysis'],
    role: 'Custom',
    lastModified: '2d ago',
    usageCount: 6,
    isFavorite: false,
    author: 'Strategy Team'
  }
];

interface PromptsListProps {
  prompts?: Prompt[];
  onUsePrompt?: (promptId: string) => void;
  onEditPrompt?: (promptId: string) => void;
  onDeletePrompt?: (promptId: string) => void;
  onToggleFavorite?: (promptId: string, isFavorite: boolean) => void;
  className?: string;
  onSelect?: (promptId: string) => void;
  selectedPromptId?: string | null;
}

export default function PromptsList({
  prompts = mockPrompts,
  onUsePrompt,
  onEditPrompt,
  onDeletePrompt,
  onToggleFavorite,
  className = '',
  onSelect,
  selectedPromptId
}: PromptsListProps) {
  const { t } = useContext(LanguageContext);

  // If there are no prompts, display a message
  if (!prompts || prompts.length === 0) {
    return (
      <div className={`text-center py-16 px-6 ${className}`}>
        <div className="mx-auto flex flex-col items-center">
          <SearchX className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4 transition-colors" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 transition-colors">
            {t('prompts.list.noResultsTitle', 'No Prompts Found')}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors">
            {t('prompts.list.noResultsDescription', 'Try adjusting your search query or filters to find what you\'re looking for.')}
          </p>
        </div>
      </div>
    );
  }

  // Responsive grid layout with consistent spacing
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ${className}`}
    >
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onUsePrompt={onUsePrompt}
          onEditPrompt={onEditPrompt}
          onDeletePrompt={onDeletePrompt}
          onToggleFavorite={onToggleFavorite}
          className="h-full" // Make cards fill their container height
          isSelected={selectedPromptId === prompt.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
