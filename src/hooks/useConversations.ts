import { useState, useEffect } from 'react';

const mockConversations = [
  {
    id: 1,
    client: {
      name: 'Sophie Martin',
      email: 'sophie.m@email.com',
      initials: 'SM'
    },
    lastMessage: 'I cannot access my account',
    priority: 'high',
    needsAttention: true,
    status: 'active',
    agent: 'Technical Support',
    lastActivity: '5min ago',
        initiatedByAI: true, // Indicates if the conversation was initiated by an AI
    isAIConversation: false, // Indicates if it's a direct conversation between AI agents
    messages: [
      {
        id: 1,
        content: 'Hello, I cannot log into my account',
        sender: 'user',
        time: '10:30'
      },
      {
        id: 2,
        content: 'I will help you resolve this issue. Can you tell me what error message you see?',
        sender: 'agent',
        time: '10:31'
      },
      {
        id: 3,
        content: 'I see "Incorrect credentials"',
        sender: 'user',
        time: '10:32'
      },
      {
        id: 4,
        content: 'Have you tried resetting your password?',
        sender: 'agent',
        time: '10:33'
      },
      {
        id: 5,
        content: 'No, how do I do that?',
        sender: 'user',
        time: '10:34'
      },
      {
        id: 6,
        content: 'Click on "Forgot Password" on the login page',
        sender: 'agent',
        time: '10:35'
      },
      {
        id: 7,
        content: 'I did that but I\'m not receiving the email',
        sender: 'user',
        time: '10:36'
      },
      {
        id: 8,
        content: 'Check your spam folder. Otherwise, I can send you a new link',
        sender: 'agent',
        time: '10:37'
      },
      {
        id: 9,
        content: 'Yes please, send me a new link',
        sender: 'user',
        time: '10:38'
      },
      {
        id: 10,
        content: 'I\'ll send that right away. You should receive it in a few minutes',
        sender: 'agent',
        time: '10:39'
      }
    ]
  },
{
  "id": 2,
  "client": {
    "name": "International shipping to Belgium",
    "email": "operations@company.com",
    "initials": "AA"
  },
  "lastMessage": "Operator consultation on international shipping",
  "priority": "normal",
  "needsAttention": false,
  "status": "active",
  "agent": "E-commerce Assistant",
  "lastActivity": "15min ago",
  "initiatedByAI": false,
  "isAIConversation": true,
  "messages": [
    {
      "id": 1,
      "content": "Hello, I have a customer asking if we deliver to Belgium. Can you help me with the information?",
      "sender": "operator",
      "time": "14:20"
    },
    {
      "id": 2,
      "content": "ECommerceAssistant : Yes, we do deliver to Belgium! What product is the customer interested in?",
      "sender": "agent",
      "time": "14:21"
    },
    {
      "id": 3,
      "content": "They're interested in the XYZ model",
      "sender": "operator",
      "time": "14:22"
    },
    {
      "id": 4,
      "content": "ECommerceAssistant : Excellent. Please inform the customer that shipping costs to Belgium are €15",
      "sender": "agent",
      "time": "14:23"
    },
    {
      "id": 5,
      "content": "Customer wants to know about delivery time",
      "sender": "operator",
      "time": "14:24"
    },
    {
      "id": 6,
      "content": "ECommerceAssistant : It takes 3-5 business days to deliver to Belgium",
      "sender": "agent",
      "time": "14:25"
    },
    {
      "id": 7,
      "content": "They're also asking if we accept PayPal",
      "sender": "operator",
      "time": "14:26"
    },
    {
      "id": 8,
      "content": "ECommerceAssistant : Yes, please let them know we accept PayPal, credit card, and bank transfer",
      "sender": "agent",
      "time": "14:27"
    },
    {
      "id": 9,
      "content": "Great, customer says they'll place the order",
      "sender": "operator",
      "time": "14:28"
    },
    {
      "id": 10,
      "content": "ECommerceAssistant : Excellent! Let them know they can contact us if they have any other questions about their order or international shipping",
      "sender": "agent",
      "time": "14:29"
    },
    {
      "id": 11,
      "content": "Customer is now asking about possible customs fees",
      "sender": "operator",
      "time": "14:31"
    },
    {
      "id": 12,
      "content": "ECommerceAssistant : For orders under €150, there are no customs duties to Belgium. For orders above that value, there may be a VAT charge of 21% and potential customs fees. We can provide a detailed breakdown before they finalize their purchase.",
      "sender": "agent",
      "time": "14:33"
    },
    {
      "id": 13,
      "content": "They want to know if they'll receive tracking information",
      "sender": "operator",
      "time": "14:35"
    },
    {
      "id": 14,
      "content": "ECommerceAssistant : Yes, once the order ships, they'll receive an email with tracking information that allows them to monitor their package's journey to Belgium in real-time through our carrier's website or app.",
      "sender": "agent",
      "time": "14:36"
    }
  ],
  "analysisNotes": "Operator consulted AI assistant for details on international shipping to Belgium for customer John Smith. All relevant information was provided including shipping costs, timeframes, payment options, and customs details. Customer reportedly intends to place order.",
  "customerSatisfaction": "not directly measured",
  "resolutionStatus": "complete",
  "nextSteps": "Operator to confirm successful order placement"
},

  {
    id: 3,
    client: {
      name: 'Mary Bernard',
      email: 'mary.b@email.com',
      initials: 'MB'
    },
    lastMessage: 'Urgent refund request',
    priority: 'high',
    needsAttention: true,
    status: 'active',
    agent: 'Billing Service',
    lastActivity: '3min ago',
        initiatedByAI: true, // Indicates if the conversation was initiated by an AI
    isAIConversation: false, // Indicates if it's a direct conversation between AI agents
    messages: [
      {
        id: 1,
        content: 'I was charged twice for my order #12345',
        sender: 'user',
        time: '09:00'
      },
      {
        id: 2,
        content: 'I apologize for this inconvenience. I\'ll check right away',
        sender: 'agent',
        time: '09:01'
      },
      {
        id: 3,
        content: 'I can indeed see the double payment',
        sender: 'agent',
        time: '09:02'
      },
      {
        id: 4,
        content: 'When will I be refunded?',
        sender: 'user',
        time: '09:03'
      },
      {
        id: 5,
        content: 'I\'m initiating the refund right now',
        sender: 'agent',
        time: '09:04'
      },
      {
        id: 6,
        content: 'How long will it take?',
        sender: 'user',
        time: '09:05'
      },
      {
        id: 7,
        content: 'The refund will be processed within 3-5 business days',
        sender: 'agent',
        time: '09:06'
      },
      {
        id: 8,
        content: 'That\'s quite long...',
        sender: 'user',
        time: '09:07'
      },
      {
        id: 9,
        content: 'Unfortunately, this is the standard banking delay',
        sender: 'agent',
        time: '09:08'
      },
      {
        id: 10,
        content: 'I understand, thank you for your help',
        sender: 'user',
        time: '09:09'
      }
    ]
  },
  {
  "id": 4,
  "client": {
    "name": "Recurring Double Charge Issue",
    "email": "operations@company.com",
    "initials": "AA"
  },
  "lastMessage": "Let's reconvene tomorrow at 10 AM",
  "priority": "high",
  "needsAttention": false,
  "status": "active",
  "agent": "Multiple Agents",
  "lastActivity": "2min ago",
        "initiatedByAI": false, // Indicates if the conversation was initiated by an AI
    "isAIConversation": true, // Indicates if it's a direct conversation between AI agents
  "messages": [
    {
      "id": 1,
      "content": "@CustomerSupport @TechnicalAssistant We've had 5 cases of double charges this week alone, similar to Mary Bernard's case (#12345). This is becoming a pattern and causing customer frustration. Can you both investigate the root cause and propose a solution? The 3-5 day refund period is especially problematic.",
      "sender": "user",
      "time": "14:30"
    },
    {
      "id": 2,
      "content": "CustomerSupport : Thanks for bringing this to our attention. I've reviewed Mary's case and the other recent double-charge incidents. The common pattern appears to be customers clicking the \"Complete Purchase\" button twice when the confirmation page loads slowly. Our current payment gateway seems to be processing these duplicate requests as separate transactions instead of recognizing them as duplicates.",
      "sender": "agent",
      "time": "14:32"
    },
    {
      "id": 3,
      "content": "TechnicalAssistant : I've looked into the system logs for these transactions. You're right about the cause. The payment processor is receiving multiple API calls when customers double-click. The issue appears to be twofold: 1) our checkout page lacks proper button disabling after first click, and 2) our payment gateway isn't checking for duplicate transaction IDs within a short timeframe.",
      "sender": "agent",
      "time": "14:35"
    },
    {
      "id": 4,
      "content": "CustomerSupport : From the customer service perspective, this is creating significant frustration. Not only are customers being charged twice, but the lengthy refund process is damaging trust. Mary's response of \"That's quite long...\" is the typical reaction we're seeing. We're spending approximately 20 minutes per case handling these issues.",
      "sender": "agent",
      "time": "14:37"
    },
    {
      "id": 5,
      "content": "TechnicalAssistant : I can implement two immediate fixes: 1. Disable the \"Complete Purchase\" button after first click 2. Add a client-side check that prevents multiple form submissions. For a more robust long-term solution, we should: 3. Implement transaction idempotency keys in our payment API calls 4. Configure the payment gateway to automatically reject duplicate transactions",
      "sender": "agent",
      "time": "14:40"
    },
    {
      "id": 6,
      "content": "These technical solutions sound promising. What about improving the refund experience in the meantime?",
      "sender": "User",
      "time": "14:43"
    },
    {
      "id": 7,
      "content": "CustomerSupport : For immediate improvement, I suggest: 1. Creating a dedicated fast-track process for double-charge refunds 2. Offering affected customers a 10% discount code as goodwill while they wait 3. Setting up automatic email notifications that keep customers updated on refund status",
      "sender": "agent",
      "time": "14:45"
    },
    {
      "id": 8,
      "content": "TechnicalAssistant : I can also modify our refund process to prioritize these specific cases. Currently, all refunds go through the same queue. We could create a \"double-charge\" category that gets expedited processing. I estimate we could reduce the refund time to 1-2 business days with this approach.",
      "sender": "agent",
      "time": "14:47"
    },
    {
      "id": 9,
      "content": "CustomerSupport : That would be extremely helpful. Additionally, we should update our FAQs and add a warning on the checkout page about not clicking twice, at least until the technical fixes are implemented.",
      "sender": "agent",
      "time": "14:49"
    },
    {
      "id": 10,
      "content": "Great suggestions from both of you. Let's implement the following action plan: 1. Technical team to deploy the button disabling fix by tomorrow 2. Create the expedited refund process for double-charge cases 3. Start offering the goodwill discount to affected customers immediately 4. Implement the more robust idempotency solution within two weeks. Can you both provide a quick update on progress in our next team meeting?",
      "sender": "User",
      "time": "14:52"
    },
    {
      "id": 11,
      "content": "TechnicalAssistant : Absolutely. I'll start on the button fix today and will have a development timeline for the idempotency implementation by tomorrow's meeting.",
      "sender": "agent",
      "time": "14:54"
    },
    {
      "id": 12,
      "content": "CustomerSupport : I'll draft the new refund process documentation and prepare the discount code system today. I'll also start reaching out to recently affected customers to inform them of our improved process.",
      "sender": "agent",
      "time": "14:56"
    },
    {
      "id": 13,
      "content": "Excellent. Let's reconvene tomorrow at 10 AM to check on progress. Thanks for your quick response to this issue.",
      "sender": "User",
      "time": "14:58"
    },
        {
      "id": 14,
      "content": "CustomerSupport : Absolutely, see you tomorrow.",
      "sender": "agent",
      "time": "14:59"
    },
        {
      "id": 15,
      "content": "TechnicalAssistant : Happy to help. Let's check the progress tomorrow at 10 AM.",
      "sender": "agent",
      "time": "14:59"
    }
  ]
}

];

export function useConversations() {
  const [conversations, setConversations] = useState(mockConversations);

  useEffect(() => {
    // Here, you could load real conversations from an API
  }, []);

  return conversations;
}
