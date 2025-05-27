import { useState, useEffect } from 'react';
import { 
  Headphones, Globe, BookOpen, Calendar, Mail, 
  Shield, Scale, ClipboardCheck, Compass, Target, BarChart, Bell,
  UserCheck, Megaphone, MessageCircle, Edit, UserPlus, FileText, Briefcase, Clock, BarChart2, TrendingUp, Award, CheckSquare, Database, HelpCircle, DollarSign, MessageSquare, List, Search, AlertTriangle, Code, Eye, Bot, Headset, Rocket
} from 'lucide-react';

// Define the Agent type for the marketplace
export interface MarketplaceAgent {
  id: string;
  name: string;
  description: string;
  pricePerMonth: number;
  category?: string;
  icon: React.ElementType;
  skills: string[];
  metrics?: string; // Kept in the interface but won't display it
}

export const useAgents = () => {
  const [agents, setAgents] = useState<MarketplaceAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call to get agents
    setTimeout(() => {
      const predefinedAgents: MarketplaceAgent[] = [
       {
          id: "agent-7",
          name: "After-Sales Support",
          description: "Specialist in handling post-purchase customer needs like warranty claims, repairs, and satisfaction surveys.",
          pricePerMonth: 29,
          category: "Customer Support",
          icon: Headphones,
          skills: ["Warranty Management", "Repair Coordination", "Customer Satisfaction"],
          metrics: "1,523 cases resolved"
        },
        {
          id: "agent-8",
          name: "International Business Assistant",
          description: "Helps manage global business operations with multilingual support, currency conversion, and customs guidance.",
          pricePerMonth: 29,
          category: "Business",
          icon: Globe,
          skills: ["Multilingual Support", "Currency Conversion", "Customs Guidance"],
          metrics: "673 international inquiries handled"
        },
        {
          id: "agent-9",
          name: "Training & Development AI",
          description: "Facilitates employee onboarding, provides interactive tutorials, and organizes training webinars.",
          pricePerMonth: 19,
          category: "HR",
          icon: BookOpen,
          skills: ["Employee Onboarding", "Interactive Tutorials", "Training Webinars"],
          metrics: "892 training sessions conducted"
        },
        {
          id: "agent-10",
          name: "Appointment Scheduler",
          description: "Manages calendars, sends appointment reminders, and optimizes availability for maximum efficiency.",
          pricePerMonth: 19,
          category: "Productivity",
          icon: Calendar,
          skills: ["Schedule Planning", "Automated Reminders", "Availability Management"],
          metrics: "3,241 appointments scheduled"
        },
        {
          id: "agent-11",
          name: "Email Marketing Expert",
          description: "Creates targeted email campaigns, manages audience segmentation, and analyzes campaign performance.",
          pricePerMonth: 25,
          category: "Marketing",
          icon: Mail,
          skills: ["Campaign Creation", "Audience Segmentation", "Performance Analytics"],
          metrics: "456 campaigns delivered"
        },
        {
          id: "agent-12",
          name: "Proactive Chatbot",
          description: "Engages website visitors, generates leads, and improves conversion rates through timely interactions.",
          pricePerMonth: 15,
          category: "Sales",
          icon: Bot,
          skills: ["Visitor Engagement", "Lead Generation", "Conversion Optimization"],
          metrics: "5,678 conversations initiated"
        },
        {
          id: "agent-13",
          name: "GDPR Compliance Assistant",
          description: "Ensures adherence to GDPR regulations, processes data erasure requests, and maintains compliance documentation.",
          pricePerMonth: 25,
          category: "Legal",
          icon: Shield,
          skills: ["GDPR Rights Management", "Data Erasure Handling", "Compliance Documentation"],
          metrics: "342 compliance issues resolved"
        },
        {
          id: "agent-14",
          name: "Cybersecurity Advisor",
          description: "Performs security audits, recommends protection measures, and monitors for potential security threats.",
          pricePerMonth: 39,
          category: "IT Security",
          icon: Shield,
          skills: ["Security Audit", "Threat Protection", "Security Monitoring"],
          metrics: "189 vulnerabilities identified"
        },
        {
          id: "agent-15",
          name: "Legal Assistant",
          description: "Helps with contract reviews, ensures regulatory compliance, and provides preliminary legal guidance.",
          pricePerMonth: 19,
          category: "Legal",
          icon: Scale,
          skills: ["Contract Review", "Regulatory Compliance", "Legal Guidance"],
          metrics: "276 documents processed"
        },
        {
          id: "agent-16",
          name: "FormFlow Assistant",
          description: "Specialized AI that helps create, distribute, and analyze forms and surveys. Assists with question formulation, survey logic, data visualization, and actionable insights extraction.",
          pricePerMonth: 10,
          category: "Data Collection",
          icon: ClipboardCheck,
          skills: ["Form Design", "Data Collection", "Response Analysis"],
          metrics: "5,202 forms processed"
        },
        {
          id: "agent-17",
          name: "JourneyPlanner AI",
          description: "Your AI travel companion that crafts personalized itineraries based on preferences, budget, and timing constraints. Provides real-time pricing, destination recommendations, and local activity suggestions.",
          pricePerMonth: 10,
          category: "Travel",
          icon: Compass,
          skills: ["Itinerary Creation", "Budget Optimization", "Local Insights"],
          metrics: "381 trips planned"
        },
        {
          id: "agent-18",
          name: "ProspectFinder",
          description: "Advanced AI that identifies and qualifies potential customers based on your ideal customer profile. Analyzes market segments, discovers contact information, and evaluates lead quality.",
          pricePerMonth: 29,
          category: "Sales",
          icon: Target,
          skills: ["Market Research", "Prospect Identification", "Outreach Optimization"],
          metrics: "245 qualified leads generated"
        },
        {
          id: "agent-19",
          name: "VentureConnect AI",
          description: "Specialized assistant that helps startups connect with suitable investors. Identifies relevant VCs and angels based on industry, stage, and investment thesis.",
          pricePerMonth: 19,
          category: "Startup",
          icon: BarChart,
          skills: ["Investor Matching", "Pitch Refinement", "Relationship Building"],
          metrics: "213 investors contacted"
        },
        {
          id: "agent-20",
          name: "TalentFilter",
          description: "AI-powered resume screening tool that efficiently evaluates candidates against job requirements. Identifies top applicants based on skills, experience, and cultural fit indicators.",
          pricePerMonth: 29,
          category: "HR",
          icon: UserCheck,
          skills: ["Qualification Analysis", "Skill Matching", "Candidate Ranking"],
          metrics: "185 resumes processed"
        },
        {
          id: "agent-21",
          name: "CampaignStrategist",
          description: "Comprehensive marketing campaign assistant that helps plan, execute, and analyze promotional initiatives. Recommends optimal messaging, audience targeting, and content assets.",
          pricePerMonth: 35,
          category: "Marketing",
          icon: Megaphone,
          skills: ["Content Planning", "Channel Optimization", "Performance Analysis"],
          metrics: "322 campaigns optimized"
        },
        {
          id: "agent-22",
          name: "Regulatory Compliance Assistant",
          description: "Analyzes regulatory requirements to ensure compliance, reduce penalty risks, and simplify audit preparation processes.",
          pricePerMonth: 19,
          category: "Legal",
          icon: Shield,
          skills: ["Compliance Analysis", "Risk Management", "Audit Preparation"],
        },
        {
          id: "agent-23",
          name: "Customer Support Automation",
          description: "Automates customer support via chat, email, and voice, handling up to 90% of common requests to free human agents for more complex issues.",
          pricePerMonth: 15,
          category: "Customer Support",
          icon: Headphones,
          skills: ["Multi-channel Support", "Request Prioritization", "Knowledge Base Integration"],
        },
        {
          id: "agent-24",
          name: "Bank Teller Assistant",
          description: "Enhances in-branch banking services by providing real-time access to knowledge base articles, policies, and product details during customer interactions.",
          pricePerMonth: 19,
          category: "Financial Services",
          icon: BarChart,
          skills: ["Real-time Information", "Product Reference", "Policy Guidance"],
        },
        {
          id: "agent-25",
          name: "Appointment Request Qualifier",
          description: "Automatically qualifies appointment requests through forms and AI analysis to prioritize and route effectively.",
          pricePerMonth: 19,
          category: "Productivity",
          icon: Calendar,
          skills: ["Form Integration", "Lead Qualification", "Appointment Scheduling"],
        },
        {
          id: "agent-26",
          name: "Automated Lead Management",
          description: "Automatically manages and tracks leads and appointments using Twilio, Cal.com, and AI for improved conversion rates.",
          pricePerMonth: 29,
          category: "Sales",
          icon: Target,
          skills: ["Lead Tracking", "Appointment Scheduling", "Communication Automation"],
        },
        {
          id: "agent-27",
          name: "LinkedIn Prospecting Automator",
          description: "Automates LinkedIn prospecting with personalized AI-generated messages to increase engagement and connection rates.",
          pricePerMonth: 35,
          category: "Sales",
          icon: UserCheck,
          skills: ["Message Personalization", "Connection Automation", "Profile Analysis"],
        },
        {
          id: "agent-28",
          name: "Sales Meeting Preparation Assistant",
          description: "Automatically prepares for sales meetings with AI-generated research and sends reminders via WhatsApp to boost meeting effectiveness.",
          pricePerMonth: 19,
          category: "Sales",
          icon: Calendar,
          skills: ["Meeting Preparation", "Prospect Research", "Automated Reminders"],
        },
        {
          id: "agent-29",
          name: "Prospect Qualification Engine",
          description: "Automatically qualifies prospects in Google Sheets using GPT-4 to prioritize high-potential leads for your sales team.",
          pricePerMonth: 45,
          category: "Sales",
          icon: Target,
          skills: ["Lead Scoring", "Data Analysis", "Spreadsheet Integration"],
        },
        {
          id: "agent-30",
          name: "Web Research Sales Agent",
          description: "Performs automated web research for sales prospecting, gathering crucial information to enhance your outreach effectiveness.",
          pricePerMonth: 29,
          category: "Sales",
          icon: Globe,
          skills: ["Web Research", "Data Extraction", "Lead Enrichment"],
        },
        {
          id: "agent-31",
          name: "LinkedIn Profile Finder",
          description: "Finds relevant LinkedIn profiles using natural language queries and saves results to Google Sheets for streamlined prospecting.",
          pricePerMonth: 19,
          category: "Sales",
          icon: Compass,
          skills: ["Profile Discovery", "Data Export", "Target Matching"],
        },
        {
          id: "agent-32",
          name: "Domain-Targeted Lead Generator",
          description: "Automates lead generation, email extraction, and targeted prospecting by domain for effective domain sales and outreach.",
          pricePerMonth: 49,
          category: "Sales",
          icon: Target,
          skills: ["Email Extraction", "Domain Analysis", "Outreach Automation"],
        },
        {
          id: "agent-33",
          name: "RFP & Security Questionnaire Filter",
          description: "Simplifies the process of responding to security questionnaires and RFPs by auto-filling with current company data for faster submissions.",
          pricePerMonth: 39,
          category: "Business",
          icon: ClipboardCheck,
          skills: ["Auto-completion", "Data Mapping", "Compliance Verification"],
        },
        {
          id: "agent-34",
          name: "Autonomous SDR Representative",
          description: "Manages prospecting, follow-up, and lead nurturing end-to-end without human intervention to maximize pipeline efficiency.",
          pricePerMonth: 49,
          category: "Sales",
          icon: Bot,
          skills: ["Autonomous Outreach", "Follow-up Sequencing", "Conversation Management"],
        },
        {
          id: "agent-35",
          name: "Purchase Signal Detector",
          description: "Identifies buying intent signals in real-time to prioritize high-potential leads for immediate sales follow-up.",
          pricePerMonth: 25,
          category: "Sales",
          icon: Bell,
          skills: ["Intent Recognition", "Priority Scoring", "Opportunity Alerting"],
        },
        {
          id: "agent-36",
          name: "Cold Email Generator",
          description: "Instantly creates personalized cold emails for effective prospecting and higher response rates based on recipient profiles.",
          pricePerMonth: 25,
          category: "Sales",
          icon: Mail,
          skills: ["Email Personalization", "Template Generation", "A/B Testing"],
        },
        {
          id: "agent-37",
          name: "Email Response Generator",
          description: "Drafts follow-up responses based on the tone and context of the email for more natural and effective communication.",
          pricePerMonth: 19,
          category: "Sales",
          icon: Mail,
          skills: ["Context Analysis", "Tone Matching", "Response Generation"],
        },
        {
          id: "agent-38",
          name: "Prospect List Builder",
          description: "Builds targeted prospect lists based on specific criteria to improve lead generation efforts and campaign precision.",
          pricePerMonth: 29,
          category: "Sales",
          icon: List,
          skills: ["List Generation", "Criteria Filtering", "Data Enrichment"],
        },
        {
          id: "agent-39",
          name: "Incident Response Assistant",
          description: "Helps with incident management by providing data on similar past incidents and their remediation steps for faster resolution.",
          pricePerMonth: 29,
          category: "IT Support",
          icon: AlertTriangle,
          skills: ["Incident Comparison", "Solution Recommendation", "Process Automation"],
        },
        {
          id: "agent-40",
          name: "Intelligent Email Router",
          description: "Automatically classifies and routes incoming emails for efficient handling of eCommerce inquiries and requests.",
          pricePerMonth: 19,
          category: "Customer Support",
          icon: Mail,
          skills: ["Email Classification", "Request Routing", "Priority Assignment"],
        },
        {
          id: "agent-41",
          name: "Pitch Deck Analyzer",
          description: "Automatically analyzes and filters pitch decks to extract key information and investment potential for venture capitalists.",
          pricePerMonth: 39,
          category: "Startup",
          icon: BarChart,
          skills: ["Document Analysis", "Key Metrics Extraction", "Investment Scoring"],
        },
        {
          id: "agent-42",
          name: "AI Web Scraping Assistant",
          description: "Automatically extracts and organizes web data in Google Sheets with AI for market research and competitive analysis.",
          pricePerMonth: 29,
          category: "Research",
          icon: Database,
          skills: ["Web Extraction", "Data Organization", "Automated Analysis"],
        },
        {
          id: "agent-43",
          name: "Ultimate Web Scraping Workflow",
          description: "Automatically extracts web data using Selenium and AI for comprehensive data analysis and research projects.",
          pricePerMonth: 49,
          category: "Research",
          icon: Code,
          skills: ["Advanced Extraction", "Data Processing", "Dynamic Content Handling"],
        },
        {
          id: "agent-44",
          name: "Autonomous Web Crawler",
          description: "Automatically extracts specific web data with an autonomous AI crawler for content aggregation and monitoring.",
          pricePerMonth: 39,
          category: "Research",
          icon: Globe,
          skills: ["Autonomous Navigation", "Target Data Extraction", "Scheduled Monitoring"],
        },
        {
          id: "agent-45",
          name: "Web Page Scraping & Analysis Agent",
          description: "Performs automated web page scraping and analysis with AI to extract actionable business intelligence.",
          pricePerMonth: 25,
          category: "Research",
          icon: Search,
          skills: ["Content Extraction", "Pattern Recognition", "Insight Generation"],
        },
        {
          id: "agent-46",
          name: "Web Page Summarizer",
          description: "Automatically extracts and summarizes web page content with AI for efficient information consumption and research.",
          pricePerMonth: 19,
          category: "Productivity",
          icon: FileText,
          skills: ["Content Extraction", "Summarization", "Key Point Identification"],
        },
        {
          id: "agent-47",
          name: "Competitive Intelligence Monitor",
          description: "Monitors competitive strategies in real-time to help refine market positioning and product development.",
          pricePerMonth: 39,
          category: "Strategy",
          icon: Eye,
          skills: ["Competitor Tracking", "Strategy Analysis", "Market Positioning"],
        },
        {
          id: "agent-48",
          name: "Press Release Generator",
          description: "Drafts and formats professional press releases efficiently, ensuring consistent and impactful communication.",
          pricePerMonth: 29,
          category: "Marketing",
          icon: FileText,
          skills: ["Content Creation", "Brand Voice Consistency", "Format Optimization"],
        },
        {
          id: "agent-49",
          name: "Social Listening Assistant",
          description: "Monitors brand mentions, customer sentiment, and industry trends across social media and online platforms.",
          pricePerMonth: 29,
          category: "Marketing",
          icon: MessageCircle,
          skills: ["Brand Monitoring", "Sentiment Analysis", "Trend Identification"],
        },
        {
          id: "agent-50",
          name: "Social Media Analyzer & Email Generator",
          description: "Analyzes social media profiles and generates personalized emails for leads based on their online presence.",
          pricePerMonth: 35,
          category: "Marketing",
          icon: Mail,
          skills: ["Profile Analysis", "Email Personalization", "Engagement Strategy"],
        },
        {
          id: "agent-51",
          name: "Email Marketing Campaign Automator",
          description: "Automatically generates and sends personalized email marketing campaigns to improve engagement and conversion.",
          pricePerMonth: 29,
          category: "Marketing",
          icon: Mail,
          skills: ["Campaign Creation", "Audience Segmentation", "Performance Tracking"],
        },
        {
          id: "agent-52",
          name: "AI-Powered Writing & Recruitment Assistant",
          description: "Drafts job descriptions and social media posts using company templates for consistent and effective recruitment.",
          pricePerMonth: 25,
          category: "HR",
          icon: Edit,
          skills: ["Content Creation", "Template Utilization", "Brand Consistency"],
        },
        {
          id: "agent-53",
          name: "Candidate Research Assistant",
          description: "Instantly finds potential talent by searching multiple databases and matching profiles to job requirements.",
          pricePerMonth: 39,
          category: "HR",
          icon: Search,
          skills: ["Database Searching", "Profile Matching", "Candidate Discovery"],
        },
        {
          id: "agent-54",
          name: "Employee Onboarding Assistant",
          description: "Simplifies new employee onboarding, ensuring a smooth transition and efficient completion of formalities.",
          pricePerMonth: 19,
          category: "HR",
          icon: UserPlus,
          skills: ["Process Automation", "Document Management", "Training Coordination"],
        },
        {
          id: "agent-55",
          name: "CV Filtering Assistant",
          description: "Automates candidate screening by identifying relevant skills, ranking resumes, and reducing manual efforts.",
          pricePerMonth: 19,
          category: "HR",
          icon: FileText,
          skills: ["Skill Identification", "Candidate Ranking", "Screening Automation"],
        },
        {
          id: "agent-56",
          name: "AI HR Workflow: Resume Analysis & Candidate Evaluation",
          description: "Automatically analyzes and evaluates candidate resumes for recruitment processes to identify top talent.",
          pricePerMonth: 19,
          category: "HR",
          icon: FileText,
          skills: ["Resume Parsing", "Qualification Assessment", "Candidate Ranking"],
        },
        {
          id: "agent-57",
          name: "Job Application Manager",
          description: "Manages job application submissions with CV extraction and analysis via AI for streamlined recruitment.",
          pricePerMonth: 15,
          category: "HR",
          icon: Briefcase,
          skills: ["Application Processing", "CV Analysis", "Candidate Management"],
        },
        {
          id: "agent-58",
          name: "Resume Analysis & Filtering Engine",
          description: "Automatically analyzes and filters resumes to identify the most qualified candidates for open positions.",
          pricePerMonth: 19,
          category: "HR",
          icon: FileText,
          skills: ["Resume Parsing", "Qualification Matching", "Candidate Scoring"],
        },
        {
          id: "agent-59",
          name: "24/7 Support Assistant",
          description: "Provides instant customer support 24/7 without human intervention for continuous service availability.",
          pricePerMonth: 19,
          category: "Customer Support",
          icon: Clock,
          skills: ["Continuous Coverage", "Instant Response", "Issue Resolution"],
        },
        {
          id: "agent-60",
          name: "Live Chat Assistant",
          description: "Enhances chatbot interactions with real-time, AI-powered solutions for customer queries and support needs.",
          pricePerMonth: 15,
          category: "Customer Support",
          icon: MessageCircle,
          skills: ["Real-time Assistance", "Query Resolution", "Conversation Flow Management"],
        },
        {
          id: "agent-61",
          name: "Customer Feedback Insights Engine",
          description: "Identifies trends in customer feedback to help teams proactively improve service and satisfaction levels.",
          pricePerMonth: 15,
          category: "Customer Support",
          icon: BarChart2,
          skills: ["Feedback Analysis", "Trend Identification", "Improvement Recommendations"],
        },
        {
          id: "agent-62",
          name: "Customer Sentiment Analyzer",
          description: "Analyzes customer feedback to assess sentiment trends and improve service quality across touchpoints.",
          pricePerMonth: 19,
          category: "Customer Support",
          icon: TrendingUp,
          skills: ["Sentiment Analysis", "Trend Tracking", "Service Improvement"],
        },
        {
          id: "agent-63",
          name: "Support Quality Analyzer",
          description: "Provides feedback to support agents using real-time best practices and ticket insights for consistent quality service.",
          pricePerMonth: 15,
          category: "Customer Support",
          icon: Award,
          skills: ["Performance Analysis", "Best Practice Guidance", "Quality Assurance"],
        },
        {
          id: "agent-64",
          name: "Ticket Resolution Assistant",
          description: "Accelerates resolution by suggesting personalized responses based on your knowledge base and past solutions.",
          pricePerMonth: 19,
          category: "Customer Support",
          icon: CheckSquare,
          skills: ["Response Suggestion", "Knowledge Base Integration", "Resolution Acceleration"],
        },
        {
          id: "agent-65",
          name: "AI Chatbot with MySQL Integration",
          description: "Enables natural language querying of a MySQL database via an AI-powered chatbot for intuitive data access.",
          pricePerMonth: 29,
          category: "Data",
          icon: Database,
          skills: ["Database Querying", "Natural Language Processing", "Data Retrieval"],
        },
        {
          id: "agent-66",
          name: "All-in-One AI Assistant for Telegram & Baserow",
          description: "Transforms Telegram into a personal assistant with long-term memory and note-taking in Baserow for productivity.",
          pricePerMonth: 39,
          category: "Productivity",
          icon: MessageSquare,
          skills: ["Message Management", "Note Taking", "Task Tracking"],
        },
        {
          id: "agent-67",
          name: "Email Response System with Human Oversight",
          description: "Automates email responses with human supervision to ensure professional and accurate communication.",
          pricePerMonth: 29,
          category: "Customer Support",
          icon: Mail,
          skills: ["Response Automation", "Human Verification", "Communication Management"],
        },
        {
          id: "agent-68",
          name: "AI Email Response with Human Validation",
          description: "Automates email responses with human validation to ensure accurate and appropriate communication.",
          pricePerMonth: 25,
          category: "Customer Support",
          icon: Mail,
          skills: ["Draft Generation", "Approval Workflow", "Consistent Communication"],
        },
        {
          id: "agent-69",
          name: "Automatic Website FAQ Enrichment",
          description: "Automatically generates detailed FAQs for web pages with AI to improve information accessibility and SEO.",
          pricePerMonth: 25,
          category: "Content",
          icon: HelpCircle,
          skills: ["FAQ Generation", "Content Enrichment", "SEO Enhancement"],
        },
        {
          id: "agent-70",
          name: "Customer Feedback Sentiment Analyzer",
          description: "Automatically analyzes customer feedback and classifies sentiment with AI for actionable insights.",
          pricePerMonth: 29,
          category: "Customer Support",
          icon: BarChart,
          skills: ["Sentiment Classification", "Feedback Analysis", "Trend Identification"],
        },
        {
          id: "agent-71",
          name: "Intelligent Email Assistant for Customer Support",
          description: "Automates customer support via email with AI and a vector database for contextual, knowledge-based responses.",
          pricePerMonth: 19,
          category: "Customer Support",
          icon: Mail,
          skills: ["Contextual Responses", "Knowledge Integration", "Email Automation"],
        },
        {
          id: "agent-72",
          name: "Proactive Customer Engagement",
          description: "Sends timely notifications, updates, and reminders to maintain customer engagement and satisfaction.",
          pricePerMonth: 29,
          category: "Customer Support",
          icon: Bell,
          skills: ["Automated Notifications", "Engagement Tracking", "Customer Retention"],
        },
        {
          id: "agent-73",
          name: "Automated Invoice Collection",
          description: "Tracks and automates payment reminders to improve collection efficiency and reduce outstanding invoices.",
          pricePerMonth: 29,
          category: "Finance",
          icon: DollarSign,
          skills: ["Payment Tracking", "Reminder Automation", "Collection Optimization"],
        },
        {
  id: "agent-74",
  name: "Enterprise Customer Support Suite",
  description: "Advanced 24/7 AI customer support system with multi-channel integration, sentiment analysis, and automated escalation protocols for enterprise-level support operations.",
  pricePerMonth: 316,
  category: "Customer Support",
  icon: Headset, // Assuming you have this icon imported
  skills: [
    "Omnichannel Support Integration",
    "Real-time Sentiment Analysis",
    "Intelligent Ticket Prioritization",
    "Automated Escalation Protocols",
    "Multi-language Support (30+ languages)",
    "Custom Knowledge Base Integration"
  ],
  /*features: [
    "Handles up to 10,000 support interactions monthly",
    "Integrates with major CRM platforms",
    "Custom API connections",
    "Dedicated AI training for your product knowledge",
    "Weekly analytics and performance reports",
    "SLA monitoring and compliance"
  ],
  integrations: [
    "Zendesk", "Salesforce", "Intercom", "Slack", "Microsoft Teams", "WhatsApp Business"
  ]*/
},
        {
  id: "agent-75",
  name: "AutonomousPro SDR Engine",
  description: "Fully autonomous AI Sales Development Representative that handles your entire prospecting pipeline - from lead generation to qualification, outreach, follow-up sequences, and meeting scheduling without human intervention.",
  pricePerMonth: 849,
  category: "Sales",
  icon: Rocket, // Assuming you have this icon imported
  skills: [
    "Autonomous Lead Generation",
    "Multi-channel Outreach Orchestration",
    "Intelligent Lead Qualification",
    "Personalized Messaging at Scale",
    "Conversion-optimized Follow-up Sequences",
    "Meeting Scheduling & Management",
    "Competitor Intelligence Gathering"
  ],
  /*features: [
    "Identifies 500+ qualified prospects monthly using proprietary algorithms",
    "Creates personalized outreach campaigns across email, LinkedIn, and other channels",
    "Automatically enriches prospect data from 20+ sources",
    "Generates dynamic messaging based on prospect digital footprint",
    "Executes multi-touch, multi-channel sequences with timing optimization",
    "Handles objections and qualification conversations autonomously",
    "Books meetings directly into your calendar with prep materials",
    "Provides predictive lead scoring with 94% accuracy",
    "Weekly pipeline analytics and optimization recommendations"
  ],
  integrations: [
    "Salesforce", "HubSpot", "LinkedIn Sales Navigator", "ZoomInfo", "Apollo.io", 
    "Outreach", "SalesLoft", "Calendly", "Gmail", "Outlook", "Slack", "Teams",
    "Zapier", "Clearbit", "6sense", "Cognism", "Hunter.io"
  ],
  automations: [
    "24/7 prospect monitoring for buying signals",
    "Automatic lead nurturing when prospects aren't ready",
    "Smart reminders for critical follow-ups with suggested actions",
    "Automated meeting preparation with prospect research",
    "Post-meeting summary and next-steps generation",
    "Customer conversion tracking and celebration messaging"
  ],
  results: {
    averageLeadsGenerated: "500+ per month",
    averageMeetingsBooked: "45+ per month",
    averageConversionRate: "9% prospect-to-meeting",
    timeReduction: "97% reduction in SDR time investment",
    roi: "723% average return on investment"
  }*/
}


        // You can add more agents here as needed
      ];
      
      setAgents(predefinedAgents);
      setIsLoading(false);
    }, 500);
  }, []);

  // Helper function for UI
  const getCategoryColor = (category) => {
    const categoryColors = {
      "Customer Support": "indigo",
      "Business": "blue",
      "HR": "purple",
      "Productivity": "teal",
      "Marketing": "pink",
      "Sales": "green",
      "Legal": "orange",
      "IT Security": "red",
      "Data Collection": "blue",
      "Travel": "indigo",
      "Startup": "purple"
    };
    return categoryColors[category] || "gray";
  };

  return {
    agents,
    isLoading,
    getCategoryColor
  };
};