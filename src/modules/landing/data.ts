// Data for landing page components
interface AgentData {
  id: string;
  name: string;
  category: string;
  role: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  capabilities: string[];
  description: string;
  longDescription: string;
  mockChat: Array<{ role: "user" | "assistant" | "agent"; content: string }>;
  slug: string;
  tags: string[];
  price: string;
  billingPeriod: "monthly" | "one-time";
}

export const agents: AgentData[] = [
  {
    id: "sales",
    name: "Sales Agent",
    category: "Sales",
    role: "Sales Development Representative",
    icon: "trending_up",
    color: "from-primary to-indigo-600",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
    capabilities: ["Lead qualification", "Follow-up automation", "Sales insights"],
    description: "Qualify leads, automate follow-ups, and get AI-driven sales recommendations.",
    longDescription:
      "Your autonomous sales partner that works 24/7 to qualify leads, schedule meetings, and follow up with prospects. It integrates seamlessly with your CRM to keep your pipeline moving.",
    mockChat: [
      { role: "user", content: "Can you help me qualify this new lead from Acme Corp?" },
      {
        role: "agent",
        content:
          "I've analyzed Acme Corp. They have 500+ employees and recently raised Series B. This matches your ICP.",
      },
      { role: "user", content: "Great! Draft an outreach email." },
      { role: "agent", content: "Drafting email now utilizing their recent news..." },
    ],
    slug: "sales-agent",
    tags: ["New", "Hot"],
    price: "$49",
    billingPeriod: "monthly",
  },
  {
    id: "support",
    name: "Call Agent",
    category: "Support",
    role: "Voice Support Specialist",
    icon: "call",
    color: "from-cyan-400 to-blue-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    capabilities: ["Voice AI calls", "Call transcription", "Intent detection"],
    description: "Handle inbound & outbound calls with AI voice, transcription, and smart routing.",
    longDescription:
      "An intelligent voice agent capable of handling complex customer service calls with human-like empathy and understanding. It handles triage, resolution, and escalation automatically.",
    mockChat: [
      { role: "user", content: "Incoming call from customer #1234." },
      {
        role: "agent",
        content: "Answering... Detected intent: 'billing inquiry'. Routing to finance flow.",
      },
      { role: "user", content: "What was the resolution?" },
      {
        role: "agent",
        content: "Issue resolved. Customer updated payment method. Transcript saved.",
      },
    ],
    slug: "call-agent",
    tags: ["Popular"],
    price: "$99",
    billingPeriod: "monthly",
  },
  {
    id: "crm",
    name: "CRM Agent",
    category: "Operations",
    role: "CRM Operations Manager",
    icon: "database",
    color: "from-violet-400 to-purple-500",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
    capabilities: ["Contact management", "Deal tracking", "Data sync"],
    description: "Central customer data hub that syncs across all your agents automatically.",
    longDescription:
      "Keeps your CRM perfectly synchronized and organized, ensuring no customer data ever falls through the cracks. It monitors data quality and updates records in real-time.",
    mockChat: [
      { role: "user", content: "Update deal status for 'Project X' to 'Negotiation'." },
      {
        role: "agent",
        content: "Updated. Probability increased to 75%. Triggered 'Contract Review' task.",
      },
    ],
    slug: "crm-agent",
    tags: ["Essential"],
    price: "$29",
    billingPeriod: "monthly",
  },
  {
    id: "marketing",
    name: "Marketing Agent",
    category: "Marketing",
    role: "Digital Marketing Strategist",
    icon: "campaign",
    color: "from-orange-400 to-amber-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    capabilities: ["Email campaigns", "Social planning", "Content AI"],
    description: "Plan and execute multi-channel marketing campaigns with AI assistance.",
    longDescription:
      "Plans, executes, and optimizes multi-channel marketing campaigns to maximize your reach and engagement. It learns from campaign performance to improve future strategies.",
    mockChat: [
      { role: "user", content: "Generate 5 tweet ideas for our new feature launch." },
      {
        role: "agent",
        content: "Here are 5 variations focusing on 'speed', 'ease of use', and 'ROI'...",
      },
    ],
    slug: "marketing-agent",
    tags: ["Growth"],
    price: "$59",
    billingPeriod: "monthly",
  },
  {
    id: "analytics",
    name: "Analytics Agent",
    category: "Analytics",
    role: "Business Intelligence Analyst",
    icon: "insights",
    color: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30",
    capabilities: ["KPI dashboards", "Predictions", "Performance tracking"],
    description: "Get AI-driven insights, predictions, and real-time performance metrics.",
    longDescription:
      "Monitors your business performance in real-time, providing actionable insights and predictive analytics to drive growth. It identifies trends before they become obvious.",
    mockChat: [
      { role: "user", content: "How did the Q1 campaign perform?" },
      {
        role: "agent",
        content: "Q1 Campaign exceeded targets by 15%. ROI was 3.5x. Detailed report generated.",
      },
    ],
    slug: "analytics-agent",
    tags: ["Advanced"],
    price: "$79",
    billingPeriod: "monthly",
  },
  {
    id: "email",
    name: "Email Agent",
    category: "Marketing",
    role: "Email Automation Specialist",
    icon: "email",
    color: "from-emerald-400 to-green-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    capabilities: ["Email outreach", "Auto replies", "Personalization"],
    description: "Automate email outreach, replies, and personalization at scale with AI.",
    longDescription:
      "Automates your email workflows including outreach campaigns, smart replies, and personalized messaging. It learns from your communication style to maintain authenticity while scaling your efforts.",
    mockChat: [
      { role: "user", content: "Send personalized follow-up emails to these 50 leads." },
      {
        role: "agent",
        content:
          "Sent 50 personalized emails. Each customized based on lead's industry and previous interactions.",
      },
    ],
    slug: "email-agent",
    tags: ["Popular"],
    price: "$69",
    billingPeriod: "monthly",
  },
  {
    id: "finance",
    name: "Finance Agent",
    category: "Finance",
    role: "Financial Operations Manager",
    icon: "account_balance",
    color: "from-yellow-400 to-amber-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    capabilities: ["Invoicing", "Expense tracking", "Financial reports"],
    description: "Automate invoicing, track expenses, and generate financial reports instantly.",
    longDescription:
      "Handles your financial operations including invoice generation, expense categorization, budget tracking, and financial reporting. It ensures accuracy and compliance while saving hours of manual work.",
    mockChat: [
      { role: "user", content: "Generate the monthly financial report." },
      {
        role: "agent",
        content:
          "Report generated. Revenue: $125K, Expenses: $78K, Net Profit: $47K. Sent to your email.",
      },
    ],
    slug: "finance-agent",
    tags: ["Essential"],
    price: "$89",
    billingPeriod: "monthly",
  },
  {
    id: "ecommerce",
    name: "E-commerce Agent",
    category: "Sales",
    role: "E-commerce Operations Manager",
    icon: "shopping_cart",
    color: "from-blue-400 to-indigo-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    capabilities: ["Product listings", "Pricing optimization", "Conversion boosting"],
    description: "Manage product listings, optimize pricing, and boost conversions with AI.",
    longDescription:
      "Manages your e-commerce operations including product listing optimization, dynamic pricing strategies, and conversion rate optimization. It analyzes market trends and customer behavior to maximize sales.",
    mockChat: [
      { role: "user", content: "Optimize pricing for our top 10 products." },
      {
        role: "agent",
        content:
          "Analyzed competitor pricing and demand. Recommended: 3 products increase by 5%, 2 decrease by 3%, 5 stay same. Projected revenue +12%.",
      },
    ],
    slug: "ecommerce-agent",
    tags: ["New"],
    price: "$59",
    billingPeriod: "monthly",
  },
];

export const integrations = [
  { name: "Slack", logo: "/logos/slack.png" },
  { name: "Notion", logo: "/logos/notion.svg" },
  { name: "Gmail", logo: "/logos/gmail.svg" },
  { name: "Google Meet", logo: "/logos/google-meet.svg" },
  { name: "Google Sheets", logo: "/logos/google-sheets.svg" },
  { name: "Facebook", logo: "/logos/facebook.svg" },
  { name: "Instagram", logo: "/logos/instagram.svg" },
  { name: "Messenger", logo: "/logos/messenger.svg" },
  { name: "Twitter", logo: "/logos/twitter.svg" },
  { name: "LinkedIn", logo: "/logos/linkedin.svg" },
];

export const workflowExamples = [
  {
    trigger: "Lead Created",
    from: "Sales Agent",
    to: "CRM Agent",
    icon: "person_add",
  },
  {
    trigger: "Call Completed",
    from: "Call Agent",
    to: "Analytics Agent",
    icon: "call_end",
  },
  {
    trigger: "Campaign Sent",
    from: "Marketing Agent",
    to: "Analytics Agent",
    icon: "send",
  },
  {
    trigger: "Deal Won",
    from: "CRM Agent",
    to: "Marketing Agent",
    icon: "celebration",
  },
];

export const stats = [
  { value: "60%", label: "Cost Reduction" },
  { value: "24/7", label: "Availability" },
  { value: "10x", label: "Faster Response" },
  { value: "5", label: "AI Agents" },
];

export const targetUsers = [
  {
    title: "Startups & SMEs",
    description: "Scale operations without scaling headcount. Deploy AI agents that grow with you.",
    icon: "rocket_launch",
    agents: ["Sales", "Support"],
  },
  {
    title: "Enterprise Teams",
    description: "Orchestrate multiple departments with AI agents that collaborate seamlessly.",
    icon: "corporate_fare",
    agents: ["All 5 Agents"],
  },
  {
    title: "SaaS Platforms",
    description: "Embed intelligent agents directly into your product for enhanced UX.",
    icon: "cloud",
    agents: ["Support", "Analytics"],
  },
];

export type Agent = (typeof agents)[number];
export type Integration = (typeof integrations)[number];
export type WorkflowExample = (typeof workflowExamples)[number];
export type Stat = (typeof stats)[number];
export type TargetUser = (typeof targetUsers)[number];
