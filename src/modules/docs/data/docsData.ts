import { DocCategory, DocItem, DocPaginationItem } from "../types";

export const DOCS_CATEGORIES: DocCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: "Rocket",
    order: 1,
    items: [
      {
        id: "overview",
        slug: "getting-started/overview",
        title: "Dual-Role Platform Overview (MVP V1)",
        description: "Explore the Dual-Role AI Agent Marketplace: Unified Account, Chatflow-Only builder, and Marketplace monetization.",
        category: "Getting Started",
        order: 1,
        readingTime: "4 min read",
        lastUpdated: "March 2026",
        badge: "Essential",
        content: `
# Dual-Role AI Agent Marketplace (Chatflow-Only) — MVP V1

The **AI Agent Marketplace** empowers users to seamlessly operate as both a **Normal User (Consumer)** and a **Developer (Creator)** using a single, unified account.

For the **V1 MVP**, the platform strictly supports **Chatflow Agents** (visual node-based conversation flows).

---

## 🌟 Core Architectural Pillars

\`\`\`
                          ┌─────────────────────────────────────┐
                          │       Single Unified Account        │
                          │   (Google OAuth / Email+Password)   │
                          └──────────────────┬──────────────────┘
                                             │
                      ┌──────────────────────┴──────────────────────┐
                      ▼                                             ▼
       ┌──────────────────────────────┐              ┌──────────────────────────────┐
       │     NORMAL USER DASHBOARD    │◄─ Sidebar ──►│     DEVELOPER DASHBOARD      │
       │         (User Mode)          │   Switcher   │       (Developer Mode)       │
       ├──────────────────────────────┤              ├──────────────────────────────┤
       │ • Browse Published Agents    │              │ • Build Visual Chatflows     │
       │ • View Details & Pricing     │              │ • Built-in "Test Chat"       │
       │ • Stripe Subscription Flow   │              │ • Draft Library Management   │
       │ • "My Agents" Active Access  │              │ • Set Monetization Plans     │
       │ • Live Session & Web Embed   │              │ • Admin Approval Queue       │
       └──────────────────────────────┘              └──────────────────────────────┘
\`\`\`

---

## 🔑 Key Features of MVP V1

### 1. Unified Authentication & Zero-Friction Onboarding
- **Sign In Methods**: Google OAuth and Email/Password.
- **Instant Dual Privileges**: Upon registration or login, the system automatically provisions an account with dual access. No role selection or dual registrations required.
- **Dynamic Mode Switching**: Switch between **User Mode** and **Developer Mode** at any moment via the bottom toggle in the sidebar.

### 2. Normal User Experience (Consumer Mode)
- **Marketplace Browsing**: Explore live, approved, and published Chatflow agents in a clean card grid.
- **Agent Details & Stripe Checkout**: View detailed agent descriptions, use cases, and developer-configured subscription pricing tiers. Initiate payments via the integrated Stripe gateway.
- **"My Agents" Management**: Subscribed agents activate instantly upon payment verification, allowing users to start live conversation sessions or generate copy-paste website embed snippets.

### 3. Developer Experience (Creator Mode)
- **Chatflow-Only Scope**: For MVP V1, creation is focused strictly on Chatflow Agents via the visual node-based canvas.
- **Draft Lifecycle**: Test conversations live with the built-in "Test Chat" interface and store agents as drafts in the Agent Library.
- **Monetization & Publication**: Configure subscription pricing under Agent Settings ("Monetization") and submit to the **Backend/Admin Authority Approval Queue** for review before going "Live & Published".

### 4. Developer SaaS Tiers (Backend Enforced)
- **Free Plan**: Maximum **1 Agent** (Manual-Active / Admin Approval Required).
- **Basic Plan**: Maximum **3 Agents** (Manual-Active / Admin Approval Required).
- **Pro Plan**: Maximum **10 Agents** (Manual-Active / Admin Approval Required).

---

## 🧭 Where to Go Next

- **[Dual-Role Architecture & User Modes](/docs/getting-started/dual-role-architecture)**: Understand account dual-access and mode switching.
- **[5-Minute Chatflow Quickstart](/docs/getting-started/quickstart)**: Build your first Chatflow agent, test it, and save it as a draft.
- **[Normal User: Marketplace & Subscriptions](/docs/marketplace/user-subscriptions)**: Browse, view details, subscribe via Stripe, and interact with agents.
- **[Website Chat Widget Embed](/docs/deployment/embed-chat-widget)**: Embed subscribed agents onto third-party websites.
- **[Monetization & Publishing Workflow](/docs/marketplace/publishing-agents)**: Submit agents to the Admin Approval Queue for marketplace listing.
- **[Developer SaaS Tiers & Limits](/docs/marketplace/developer-tiers)**: View agent creation limits and tier requirements.
        `,
      },
      {
        id: "dual-role-architecture",
        slug: "getting-started/dual-role-architecture",
        title: "Dual-Role Architecture & User Modes",
        description: "How unified accounts, sidebar mode switching, and consumer vs creator roles work.",
        category: "Getting Started",
        order: 2,
        readingTime: "5 min read",
        lastUpdated: "March 2026",
        badge: "Architecture",
        content: `
# Dual-Role Architecture & User Modes

A defining feature of the platform is the **Dual-Role Unified Account System**. Users never need to maintain separate accounts to use agents and build agents.

---

## 1. Authentication & Unified Provisioning

1. **Authentication Options**:
   - **Google OAuth**: Fast single-sign-on.
   - **Email/Password**: Standard email registration with secure password hashing.
2. **Unified Account Provisioning**:
   - Every registered user automatically receives dual permissions.
   - The user is immediately granted access to both the **Normal User Dashboard** (\`/user-dashboard\`) and the **Developer Dashboard** (\`/developer-dashboard\`).
   - There is no requirement to pick a persona (consumer vs creator) during registration.

---

## 2. Dynamic Sidebar Mode Switching

The left sidebar navigation includes a dedicated mode toggle at the bottom:
- When in **User Mode**, the bottom card displays:
  > *"Build & earn with AI tools"* -> **[Developer Mode]** button (navigates to \`/developer-dashboard\`).
- When in **Developer Mode**, the bottom card displays:
  > *"Switch back to user dashboard"* -> **[User Mode]** button (navigates to \`/user-dashboard\`).

This allows seamless switching between purchasing/deploying agents and designing/monetizing agents in a single click.

---

## 3. Comparison: Normal User vs Developer Mode

| Feature Area | Normal User (User Mode) | Developer (Developer Mode) |
| :--- | :--- | :--- |
| **Primary Goal** | Discover, subscribe to, and interact with agents | Build, test, and monetize Chatflow agents |
| **Primary Route** | \`/user-dashboard\` | \`/developer-dashboard\` |
| **Catalog Access** | Browse public \`/marketplace\` with live cards | Manage custom \`/developer-dashboard/agents\` library |
| **Agent Creation** | N/A (consumes existing agents) | Visual node canvas (\`/developer-dashboard/create-agent\`) |
| **Payments** | Pays subscriptions via Stripe Gateway | Manages SaaS tier (\`/developer-dashboard/billing\`) |
| **Active Agents** | "My Agents" with live session chat & embed snippets | Agent Library with "Draft", "Pending Review", & "Published" |

---

## 4. Normal User Journey

1. **Browse Marketplace**: Visit \`/marketplace\` to see published agents with active approval.
2. **View Details**: Click **"View Details"** on any card to examine description, use case, and subscription pricing.
3. **Stripe Checkout**: Click subscribe to initiate payment via the Stripe checkout gateway.
4. **My Agents Activation**: Upon verified transaction, the agent status becomes **Active** in \`/user-dashboard/my-agent\`.
5. **Session & Embed**: Launch immediate interactive chat sessions or generate third-party website embed tags.

---

## 5. Developer Journey

1. **Build Chatflow**: Open visual canvas to assemble nodes (Chat Models, Memory, Tools, Document Loaders).
2. **Test Chat**: Run real-time test dialogues inside the built-in test chat panel.
3. **Draft Storage**: Save flow to the Agent Library with **"Draft"** status.
4. **Configure Monetization**: Open Agent Settings, navigate to **"Monetization"**, and add subscription pricing plans.
5. **Admin Approval**: Click **"Publish"** to submit the agent to the **Backend/Admin Authority Approval Queue**.
6. **Live & Published**: Once reviewed and approved by administrators, status shifts to **"Live & Published"** on the public marketplace.
        `,
      },
      {
        id: "quickstart",
        slug: "getting-started/quickstart",
        title: "5-Minute Chatflow Quickstart",
        description: "From blank canvas to tested Chatflow agent saved in your Agent Library.",
        category: "Getting Started",
        order: 3,
        readingTime: "5 min read",
        lastUpdated: "March 2026",
        badge: "Must Read",
        content: `
# 5-Minute Chatflow Quickstart

In this quickstart, you will create a **Chatflow Agent** on the visual canvas, test it live in the built-in test chat interface, save it as a **Draft** in your Developer Agent Library, and prepare it for monetization.

---

## Step 1: Switch to Developer Mode
1. Ensure you are signed in.
2. Open the sidebar and click **Developer Mode** (or navigate to \`/developer-dashboard\`).
3. Click **Create Agent** (or navigate to **Agent Library > + Create Agent**).

---

## Step 2: Assemble the Chatflow on the Node Canvas
For MVP V1, creation is **strictly Chatflow Agents**. Connect the following components:

1. **Chat Model**:
   - Add \`ChatGoogleGenerativeAI\` (Gemini 1.5 Flash) or \`ChatOpenAI\` (GPT-4o-mini).
2. **Document Loader & Splitter (RAG)**:
   - Add \`Pdf File\` loader and attach your document.
   - Connect a \`Recursive Character Text Splitter\` (Chunk Size: \`1000\`, Overlap: \`200\`).
3. **Embeddings & Vector Store**:
   - Add \`Google Gemini Embeddings\` and attach to an \`In-Memory Vector Store\`.
4. **Conversational Retrieval QA Chain**:
   - Connect the Chat Model and Vector Store Retriever outputs into the Conversational Chain.

---

## Step 3: Run Live Interactions in "Test Chat"
1. Before publishing, click the **Chat Bubble Icon** on the canvas header.
2. The built-in **Test Chat** interface slides open.
3. Query the agent with sample user inputs to verify response speed and factual accuracy.

---

## Step 4: Save as Draft in Agent Library
1. Click **Save** in the top navigation bar.
2. Assign your agent a name (e.g., \`Acme Support Chatflow\`) and description.
3. Navigate to **Developer Dashboard > Agent Library** (\`/developer-dashboard/agents\`).
4. Notice your agent is securely stored with a **"Draft"** badge.

---

## Step 5: Monetize & Submit for Admin Approval
1. Open your agent's **Settings** from the Agent Library.
2. Select the **Monetization** tab and configure your subscription plans (e.g. $29/month).
3. Click **Publish**. Your agent is sent to the **Backend/Admin Authority Approval Queue** (status: *Pending Approval*).
4. Once platform administrators approve your submission, the status transitions to **"Live & Published"** on the Marketplace!
        `,
      },
    ],
  },
  {
    id: "normal-user",
    title: "Normal User (User Mode)",
    icon: "Users",
    order: 2,
    items: [
      {
        id: "user-subscriptions",
        slug: "marketplace/user-subscriptions",
        title: "Marketplace Browsing & Stripe Subscriptions",
        description: "Browse marketplace cards, view agent details, subscribe via Stripe, and manage active agents.",
        category: "Normal User (User Mode)",
        order: 1,
        readingTime: "5 min read",
        lastUpdated: "March 2026",
        badge: "Consumer Guide",
        content: `
# Marketplace Browsing & Stripe Subscriptions

The **Marketplace** is the central destination where Normal Users (consumers, teams, and businesses) discover, subscribe to, and deploy verified Chatflow AI agents.

---

## 🛍️ 1. Browsing the Marketplace

- **Marketplace View (\`/marketplace\`)**: Displays all **Live, Approved, and Published** agents in a clean card layout.
- **Card Preview**: Each card showcases the agent avatar, title, description snippet, and a **"View Details"** button.

---

## 📄 2. Agent Details & Subscription (Stripe Integration)

Clicking **"View Details"** on an agent card opens its dedicated profile page:
1. **Agent Overview**: Detailed description of capabilities, system prompt constraints, and business use cases.
2. **Pricing Structures**: Clear display of subscription pricing structures defined by the developer.
3. **Stripe Payment Gateway**:
   - Clicking **Subscribe** initiates the secure Stripe Checkout flow.
   - Direct payment verification through integrated Stripe customer sessions.

---

## ⚡ 3. "My Agents" Section (User Dashboard)

Once your Stripe payment is verified and completed:
1. The subscribed agent is automatically added to your **"My Agents"** dashboard (\`/user-dashboard/my-agent\`).
2. The agent's status displays as **Active**.
3. **Immediate Interactive Session**: You can launch an immediate chat session directly in the dashboard to interact with the agent.
4. **Third-Party Website Embed**: You can copy the generated embed snippet and place it on any third-party website.
        `,
      },
      {
        id: "embed-chat-widget",
        slug: "deployment/embed-chat-widget",
        title: "Subscribed Agents: Website Embed",
        description: "Deploy active agents from your My Agents dashboard to HTML, React, Next.js, WordPress, and Shopify.",
        category: "Normal User (User Mode)",
        order: 2,
        readingTime: "5 min read",
        lastUpdated: "March 2026",
        badge: "Embed Widget",
        content: `
# Subscribed Agents: Website Chat Widget Embed

Once you have subscribed to an agent and it is active in your **My Agents** dashboard, you can embed it onto any client or company website using a single script tag.

---

## 1. HTML / Vanilla JavaScript Embed

Add this snippet directly before the closing \`</body>\` tag of your website:

\`\`\`html
<script type="module">
  import Chatbot from "https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js";
  Chatbot.init({
    chatflowid: "YOUR_SUBSCRIBED_AGENT_CHATFLOW_ID",
    apiHost: "https://agents-app.devxhub.com",
    theme: {
      button: {
        backgroundColor: "#0d9488",
        right: 24,
        bottom: 24,
        size: 48,
        iconColor: "white"
      },
      chatWindow: {
        welcomeMessage: "Hello! How can I assist you today?",
        backgroundColor: "#030712",
        height: 650,
        width: 400,
        fontSize: 14,
        userMessage: {
          backgroundColor: "#0d9488",
          textColor: "#ffffff"
        },
        textInput: {
          placeholder: "Type your message...",
          backgroundColor: "#111827",
          textColor: "#f9fafb",
          sendButtonColor: "#0d9488"
        }
      }
    }
  });
</script>
\`\`\`

---




## 🔒 MVP V1 Scope: Chatflow Agents Only

To ensure high performance, stability, and predictable behavior:
- Creators build **Chatflow Agents** composed of Chat Models, Document Loaders, Vector Stores, Memory, and Tools.
- Visual node connections determine the flow of dialogue execution.

---

## 🧩 How Nodes Work

Every block on the canvas has defined connection sockets:
- **Left Input Handles**: Inject dependencies (e.g., Chat Models, Vector Store Retrievers, Prompt Templates, Tools).
- **Right Output Handles**: Transmit runnable instances or outputs to downstream chain nodes.
- **Node Configuration Fields**: Customize parameters such as Temperature, System Instructions, Chunk Overlap, and API Credentials.

---

## 🔄 The Developer Creation & Draft Lifecycle

\`\`\`
1. Design Chatflow Canvas  ──► 2. Built-in "Test Chat"  ──► 3. Saved as "Draft" in Library
                                                                  │
4. Live & Published ◄── 5. Admin Authority Approval Queue ◄───────┘
   (Marketplace)           (Manual-Active Status)
\`\`\`

1. **Design Canvas**: Assemble your flow on the visual canvas.
2. **Built-in "Test Chat"**: Click the chat bubble to launch real-time test dialogues without deploying external widgets.
3. **Draft Storage in Agent Library**: Click **Save**. The agent is automatically stored in your Developer **Agent Library** (\`/developer-dashboard/agents\`) with a **"Draft"** status badge.
4. **Monetization & Settings**: Open the agent settings, navigate to **"Monetization"**, and define subscription pricing plans.
5. **Admin Approval Queue**: Click **Publish** to send the agent to the platform administrators for review. Once approved, its status shifts to **"Live & Published"** on the public marketplace.
        `,
      },
      {
        id: "publishing-agents",
        slug: "marketplace/publishing-agents",
        title: "Developer Monetization & Publication Workflow",
        description: "Configure subscription pricing, submit to the Admin Approval Queue, and launch live on the marketplace.",
        category: "Developer (Developer Mode)",
        order: 2,
        readingTime: "5 min read",
        lastUpdated: "March 2026",
        badge: "Creators",
        content: `
# Developer Monetization & Publication Workflow

Every registered user automatically has creator privileges, allowing them to build and monetize their own agents.

---

## 🔄 The End-to-End Publication Lifecycle

\`\`\`
  ┌────────────────────────────────────────────────────────┐
  │ 1. BUILD & TEST CHATFLOW                               │
  │    • Visual node canvas (/developer-dashboard/create)  │
  │    • Test live in built-in "Test Chat" interface       │
  └───────────────────────────┬────────────────────────────┘
                              │
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │ 2. SAVED AS DRAFT                                      │
  │    • Automatically stored in Agent Library with "Draft"│
  └───────────────────────────┬────────────────────────────┘
                              │
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │ 3. CONFIGURE MONETIZATION (Agent Settings)             │
  │    • Set subscription pricing structures               │
  └───────────────────────────┬────────────────────────────┘
                              │
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │ 4. SUBMIT TO ADMIN APPROVAL QUEUE                      │
  │    • Click "Publish" -> Status: Manual-Active / Pending│
  └───────────────────────────┬────────────────────────────┘
                              │
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │ 5. PLATFORM ADMIN REVIEW & APPROVAL                    │
  │    • Platform administrators review and approve        │
  └───────────────────────────┬────────────────────────────┘
                              │
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │ 6. LIVE & PUBLISHED ON MARKETPLACE                     │
  │    • Visible to all Normal Users to view & subscribe   │
  └────────────────────────────────────────────────────────┘
\`\`\`

---

## 📝 Step-by-Step Instructions

### Step 1: Design on the Node Canvas
In Developer Mode, navigate to **Create Agent**. Design your chatflow structure by connecting LLMs, memory buffers, tools, and vector stores.

### Step 2: Test in the Built-in "Test Chat"
Click the chat icon on the canvas. Run test prompts to ensure the agent follows your instructions accurately.

### Step 3: Saved as Draft
Save your agent. It is now registered in your **Agent Library** (\`/developer-dashboard/agents\`) marked with a **Draft** status badge.

### Step 4: Configure Monetization in Settings
1. From the Agent Library, open **Agent Settings**.
2. Navigate to the **"Monetization"** section.
3. Configure and add your desired subscription pricing plans.

### Step 5: Submit to Admin Approval Queue
Click **Publish**. The agent is sent to the **Backend/Admin Authority Approval Queue** with a status of **Manual-Active (Pending Review)**.

### Step 6: Live & Published
Once the platform administrators review and approve the request:
- The status updates to **"Live & Published"**.
- The agent becomes visible on the marketplace, allowing consumer users to view details, see pricing options, and subscribe.
        `,
      },
      {
        id: "developer-tiers",
        slug: "marketplace/developer-tiers",
        title: "Developer SaaS Tiers & Creation Limits",
        description: "Agent creation limits and approval rules governed by backend middleware.",
        category: "Developer (Developer Mode)",
        order: 3,
        readingTime: "4 min read",
        lastUpdated: "March 2026",
        badge: "SaaS Model",
        content: `
# Developer SaaS Tiers & Creation Limits

Agent creation and scaling capabilities for developers are governed by a multi-tier SaaS structure managed via backend middleware:

---

## 📊 Developer Tier Matrix

| Plan Name | Agent Creation Limit | Listing Status |
| :--- | :--- | :--- |
| **Free Plan** | **Maximum 1 Agent** | **Manual-Active (Requires Admin Approval)** |
| **Basic Plan** | **Maximum 3 Agents** | **Manual-Active (Requires Admin Approval)** |
| **Pro Plan** | **Maximum 10 Agents** | **Manual-Active (Requires Admin Approval)** |

---

## 🛡️ Backend Middleware Enforcement

1. **Creation Limit Checks**:
   - When a developer attempts to create a new Chatflow agent, backend middleware validates the developer's active subscription tier against their current agent count in the Agent Library.
   - If the limit has been reached (1 agent on Free, 3 on Basic, 10 on Pro), creation is restricted until upgrading.

2. **Listing Status (Manual-Active)**:
   - For all developer tiers in V1, every agent submission enters the **Manual-Active** state and requires Backend / Admin Authority approval before appearing publicly on the Marketplace.
        `,
      },
      {
        id: "whatsapp-automation",
        slug: "ai-builder/whatsapp-automation",
        title: "WhatsApp Automation: Start, Execute Flow & WhatsApp Send Nodes",
        description: "Build complete automated WhatsApp bots by connecting Start Node, Execute Flow Node, and WhatsApp Send Node.",
        category: "Developer (Developer Mode)",
        order: 4,
        readingTime: "6 min read",
        lastUpdated: "March 2026",
        badge: "Automation",
        content: `
# WhatsApp Automation: Start, Execute Flow & WhatsApp Send Nodes

Learn how to build a full **WhatsApp AI Automation** workflow on the visual canvas by chaining three fundamental nodes: **Start Node**, **Execute Flow Node**, and **WhatsApp Send Node**.

---

## 🌟 Architecture Overview

This automation listens for incoming messages from WhatsApp, routes them through a pre-built Chatflow or Knowledgebase flow to produce an intelligent AI answer, and immediately replies back to the user via the WhatsApp Cloud API.

\`\`\`
┌─────────────────────────────────┐
│           START NODE            │
│  • Input Type (Webhook / Event) │
│  • Flow State Management        │
│  • Captures Inbound Message     │
└────────────────┬────────────────┘
                 │
                 ▼ (Pass Inbound Query / Context)
┌─────────────────────────────────┐
│        EXECUTE FLOW NODE        │
│  • Connect Credential (API Key) │
│    OR                           │
│  • Custom Select Flow Dropdown  │
│    (Knowledgebase Flow Library) │
│  • Input Type & Arguments       │
└────────────────┬────────────────┘
                 │
                 ▼ (AI Generated Response Text)
┌─────────────────────────────────┐
│       WHATSAPP SEND NODE        │
│  • WhatsApp Cloud API Credential│
│    (Name, Access Token, Phone)  │
│  • Recipient Phone Number:      │
│    {{ $webhook.body...from }}   │
│  • Message Text: {{question}}   │
└─────────────────────────────────┘
\`\`\`

---

## 1. Start Node (Workflow Entry Point)

The **Start Node** is the designated entry point for the automation. It serves as the listener receiving inbound WhatsApp webhook triggers sent by Meta.

### Key Node Configurations

- **Input Type**:
  - Specifies the schema and format of incoming requests (e.g., \`Webhook\`, \`JSON\`, or \`Text\`).
  - For WhatsApp automations, set the input type to process incoming webhook events from the Meta WhatsApp Cloud API.
- **Flow State**:
  - Holds state variables, user context, and session data throughout the lifecycle of the execution.
  - Retains dynamic variables across sequential nodes, allowing you to pass metadata (such as sender name, timestamp, or conversation turn).
- **Trigger Endpoint**:
  - Exposes the unique webhook URL where Meta sends \`POST\` payloads whenever a WhatsApp user messages your WhatsApp Business Account.

---

## 2. Execute Flow Node (Chatflow & Knowledgebase Execution)

The **Execute Flow Node** takes the inbound question or message from the Start Node and executes a target Chatflow or Knowledgebase sub-flow to retrieve facts, query vector stores, or generate LLM responses.

### Credential & Flow Selection Options

You can configure the target execution flow using one of two methods:

#### Method A: Connect Credential (Chatflow API Key)
- Ideal when executing external flows or communicating securely across environments.
- Provide the **Chatflow API Credential** (including your \`Chatflow API Key\` and base API host).
- Authenticates securely via bearer token to invoke the remote flow endpoint.

#### Method B: Knowledgebase / Custom Select Flow Dropdown (Direct Selection)
- If you do not configure a **Connect Credential** node, use the **Knowledgebase Custom Select Flow Dropdown**.
- This dropdown dynamically populates with the list of all flows created within your Chatflow workspace.
- Simply pick the specific flow you want to execute (e.g., *"Customer Support RAG Agent"* or *"Lead Qualification Bot"*).

### Additional Configurations
- **Input Type**: Defines how parameters are handed off to the child flow (e.g., query string or JSON payload).
- **Question / Prompt Input**: Maps the text extracted from the WhatsApp message into the target flow's input prompt.

---

## 3. WhatsApp Send Node (Outbound Dispatcher)

The **WhatsApp Send Node** transmits the generated response back to the user via Meta's WhatsApp Cloud API.

### 3.1 WhatsApp Cloud API Credential Setup

To allow the node to dispatch messages via your WhatsApp Business Account:

1. Click **Connect Credential** (or select an existing one).
2. Configure the following parameters from your **Meta for Developers** portal:
   - **Credential Name**: A descriptive title for your credentials (e.g., \`WhatsApp Cloud API - Production\`).
   - **Access Token**: Your permanent or system user access token with \`whatsapp_business_messaging\` permissions.
   - **Phone Number ID**: The unique Phone Number ID assigned to your WhatsApp Business number under the WhatsApp API Setup dashboard.
3. Select this saved credential from the **Connect Credential** dropdown inside the node.

### 3.2 Recipient Phone Number (\`To\`)

In the **Recipient Phone Number** input field, configure the dynamic webhook extraction expression:

\`\`\`text
{{ $webhook.body.entry[0].changes[0].value.messages[0].from }}
\`\`\`

#### How It Works:
Meta's incoming WhatsApp webhook sends the user's phone number inside the nested path:
\`entry[0].changes[0].value.messages[0].from\` (e.g., \`15551234567\`).
This expression dynamically reads the sender's phone number from the trigger payload so every reply is automatically delivered back to the correct customer.

### 3.3 Message Text (\`Body\`)

In the **Message Text** input field, enter the dynamic placeholder representing the output of your flow or question response:

\`\`\`text
{{question}}
\`\`\`

*(or \`{{ $executeFlow.text }}\` depending on your node output mapping)*.

The node replaces this placeholder with the computed AI response text and sends it to the recipient's WhatsApp chat.

---

## 4. Step-by-Step: Connecting the Full Automation

Follow these steps on the visual canvas to build the full WhatsApp automation:

1. **Add the Start Node**:
   - Place the **Start Node** on the canvas.
   - Set **Input Type** to receive webhook events.
   - Configure any initial **Flow State** variables.

2. **Add the Execute Flow Node**:
   - Drag the **Execute Flow Node** to the canvas.
   - Connect the output handle of **Start Node** to the input handle of **Execute Flow Node**.
   - Under credentials, either bind your **Chatflow API Credential** (API Key) or choose an existing flow from the **Knowledgebase / Custom Select Flow dropdown**.
   - Configure **Input Type** to pass the incoming user query.

3. **Add the WhatsApp Send Node**:
   - Drag the **WhatsApp Send Node** to the canvas.
   - Connect the output handle of **Execute Flow Node** to the input handle of **WhatsApp Send Node**.
   - Select your saved WhatsApp Cloud API credential from the **Connect Credential** dropdown.
   - In **Recipient Phone Number**, enter:
     \`{{ $webhook.body.entry[0].changes[0].value.messages[0].from }}\`
   - In **Message Text**, enter:
     \`{{question}}\`

4. **Save and Activate**:
   - Click **Save** in the top navigation bar to persist the workflow in your **Agent Library**.
   - Configure your Meta App webhook callback URL to point to the Start Node's webhook endpoint.
   - Send a test message to your WhatsApp number to verify real-time, automated AI responses!

---

## 5. Webhook Variables Reference Table

| Dynamic Variable | Description | Example Payload Value |
| :--- | :--- | :--- |
| \`{{ $webhook.body.entry[0].changes[0].value.messages[0].from }}\` | Sender's WhatsApp phone number (Target recipient) | \`15550192834\` |
| \`{{ $webhook.body.entry[0].changes[0].value.messages[0].text.body }}\` | Inbound message text from the user | \`"What are your business hours?"\` |
| \`{{ $webhook.body.entry[0].changes[0].value.contacts[0].profile.name }}\` | Sender's WhatsApp contact name | \`"Sarah Jenkins"\` |
| \`{{question}}\` / \`{{ $executeFlow.text }}\` | AI answer generated by the Execute Flow node | \`"We are open Monday through Friday 9am-5pm."\` |

---

## 6. Summary

By chaining **Start Node** ➔ **Execute Flow Node** ➔ **WhatsApp Send Node**, you achieve a completely automated WhatsApp assistant that captures inbound questions, runs advanced reasoning or RAG queries via Chatflow, and responds immediately to users on WhatsApp.
        `,
      },
      {
        id: "linkedin-comment-automation",
        slug: "ai-builder/linkedin-comment-automation",
        title: "LinkedIn Comment Automation: Start, Execute Flow & LinkedIn Comment Nodes",
        description: "Automate LinkedIn comments and replies by chaining Start Node, Execute Flow Node, and LinkedIn Comment Node.",
        category: "Developer (Developer Mode)",
        order: 5,
        readingTime: "6 min read",
        lastUpdated: "March 2026",
        badge: "LinkedIn Tool",
        content: `
# LinkedIn Comment Automation: Start, Execute Flow & LinkedIn Comment Nodes

Learn how to build an automated **LinkedIn Comment & Reply** workflow on the visual canvas by chaining three fundamental nodes: **Start Node**, **Execute Flow Node**, and **LinkedIn Comment Node**.

---

## 🌟 Architecture Overview

This automation listens for incoming LinkedIn webhook events (such as mentions or new post comments), routes the post context through an intelligent Chatflow or Knowledgebase flow to produce an AI-generated reply, and automatically posts the comment back to LinkedIn.

\`\`\`
┌──────────────────────────────────────────────┐
│                  START NODE                  │
│  • Input Type (Webhook / Event)              │
│  • Flow State Management                     │
│  • Captures Inbound LinkedIn Notification    │
└──────────────────────┬───────────────────────┘
                       │
                       ▼ (Inbound Payload & Post Context)
┌──────────────────────────────────────────────┐
│              EXECUTE FLOW NODE               │
│  • Connect Credential (Chatflow API Key)     │
│    OR                                        │
│  • Custom Select Flow Dropdown               │
│    (Knowledgebase Flow Library)              │
│  • Input Type & Prompt Mapping               │
└──────────────────────┬───────────────────────┘
                       │
                       ▼ (AI Generated Comment Response)
┌──────────────────────────────────────────────┐
│            LINKEDIN COMMENT NODE             │
│  • Connect Credential (LinkedIn OAuth)       │
│  • Author / Actor Type: Organization / Person│
│  • Organization ID: 12345678 / urn...        │
│  • Person URN: urn... or leave blank         │
│  • Target Post URN: {{ $webhook.body.entity }}│
│  • Comment Type: Reply to an Existing Comment│
│  • Parent Comment URN:                       │
│    {{ $webhook.body.comment }}               │
│  • Comment Text *: {{question}}              │
└──────────────────────────────────────────────┘
\`\`\`

---

## 1. Start Node (Workflow Entry Point)

The **Start Node** serves as the inbound listener for LinkedIn webhooks or event triggers.

### Key Node Configurations

- **Input Type**:
  - Set to \`Webhook\` to receive incoming HTTP POST payloads from LinkedIn event subscriptions or social listening webhooks.
- **Flow State**:
  - Preserves session variables, author handles, and state keys across downstream nodes.
- **Trigger Endpoint**:
  - The public HTTPS URL where external systems deliver the incoming LinkedIn event payload.

---

## 2. Execute Flow Node (Chatflow & Knowledgebase Execution)

The **Execute Flow Node** takes the inbound post text, question, or user comment and runs it through a target Chatflow or Knowledgebase sub-flow.

### Credential & Flow Selection Options

You can configure the target chatflow in one of two ways:

#### Method A: Connect Credential (Chatflow API Key)
- Designed for modular or remote Chatflow execution.
- Connect using your **Chatflow API Credential** (\`Chatflow API Key\` and base API host).
- Authenticates securely via token headers to execute the specified flow over HTTPS.

#### Method B: Knowledgebase / Custom Select Flow Dropdown (Direct Selection)
- If you do not configure a **Connect Credential** node, use the **Knowledgebase Custom Select Flow dropdown**.
- The dropdown automatically lists all flows created in your Chatflow workspace.
- Simply choose the desired flow from the dropdown list to link it directly without needing API keys.

### Additional Configurations
- **Input Type**: Defines how parameters are passed to the child flow (e.g. query string or structured JSON).
- **Question / Prompt Input**: Maps the text from the incoming post or comment into the target flow's input prompt.

---

## 3. LinkedIn Comment Node (Publishing Comments & Threaded Replies)

The **LinkedIn Comment Node** publishes comments or threaded replies to specific posts using the LinkedIn Community Management API.

### 3.1 Credential Setup

- **Connect Credential**:
  - Select or create your LinkedIn OAuth 2.0 credential.
  - Requires \`w_member_social\` (for personal profiles) or \`w_organization_social\` (for company pages) scopes.

### 3.2 Actor & Author Type Configuration

| Configuration Field | Type | Options | Description |
| :--- | :--- | :--- | :--- |
| **Author Type / Actor Type \*** | Dropdown | \`Company / Organization Page\`<br/>\`Person / Member Profile\` | Controls whether comments are published from an official organization page or a personal member profile. |
| **Organization ID** | Text Input | \`12345678\` or<br/>\`urn:li:organization:12345678\` | Required when Author Type is **Company / Organization Page**. Specifies your LinkedIn company page ID or URN. |
| **Person URN / Member ID** | Text Input | \`urn:li:person:abcdef1234\` | Used when Author Type is **Person / Member Profile**. Enter a specific member URN, or leave blank to automatically detect from the connected OAuth account. |

### 3.3 Target Post & Comment Hierarchy

| Configuration Field | Type | Recommended Value | Description |
| :--- | :--- | :--- | :--- |
| **Target Post URN / URL \*** | Text / Template | \`{{ $webhook.body.entity }}\` | The target LinkedIn post or share URN (e.g. \`urn:li:share:71234567890\` or \`urn:li:ugcPost:71234567890\`). |
| **Comment Type** | Dropdown | \`Reply to an Existing Comment\` | Choose between a top-level post comment or a threaded reply to an existing comment. |
| **Parent Comment URN** | Text / Template | \`{{ $webhook.body.comment }}\` | Required when Comment Type is \`Reply to an Existing Comment\`. Resolves to the specific comment URN being replied to. |

### 3.4 Comment Text Configuration

In the **Comment Text \*** field, provide the dynamic variable representing the output of the Execute Flow Node:

\`\`\`text
{{question}}
\`\`\`

*(or \`{{ $executeFlow.text }}\` depending on your flow output mapping)*.

The node replaces this placeholder with the computed AI response text and submits it to LinkedIn.

---

## 4. Step-by-Step: Connecting the Full Automation

Follow these steps on the visual canvas to build the LinkedIn comment automation:

1. **Add the Start Node**:
   - Place the **Start Node** on the canvas.
   - Set **Input Type** to \`Webhook\`.
   - Copy the generated Webhook URL for your webhook provider.

2. **Add the Execute Flow Node**:
   - Drag the **Execute Flow Node** to the canvas.
   - Connect the output handle of **Start Node** to the input handle of **Execute Flow Node**.
   - Under credentials, either provide your **Chatflow API Credential** (API Key) OR select an existing flow from the **Knowledgebase / Custom Select Flow dropdown**.
   - Map the incoming post content into the input prompt.

3. **Add the LinkedIn Comment Node**:
   - Drag the **LinkedIn Comment Node** to the canvas.
   - Connect the output handle of **Execute Flow Node** to the input handle of **LinkedIn Comment Node**.
   - In **Connect Credential**, select your authenticated LinkedIn OAuth credential.
   - Set **Author Type / Actor Type \*** to \`Company / Organization Page\` (or \`Person / Member Profile\`).
   - If commenting as an organization, enter your **Organization ID** (\`12345678\` or \`urn:li:organization:12345678\`).
   - If commenting as a person, configure **Person URN / Member ID** (\`urn:li:person:abcdef1234\` or leave blank to auto-detect).
   - In **Target Post URN / URL \***, enter:
     \`{{ $webhook.body.entity }}\`
   - In **Comment Type**, select:
     \`Reply to an Existing Comment\`
   - In **Parent Comment URN**, enter:
     \`{{ $webhook.body.comment }}\`
   - In **Comment Text \***, enter:
     \`{{question}}\`

4. **Save and Activate**:
   - Click **Save** in the top navigation bar to persist the workflow in your **Agent Library**.
   - Trigger a test event or comment on your LinkedIn post to verify automated AI replies!

---

## 5. Webhook Variables Reference Table

| Dynamic Variable | Resolved Field | Example Value |
| :--- | :--- | :--- |
| \`{{ $webhook.body.entity }}\` | Target Post / Activity URN | \`urn:li:share:7245678910234567890\` |
| \`{{ $webhook.body.comment }}\` | Parent Comment URN (Thread Target) | \`urn:li:comment:(urn:li:share:724...,724987654321)\` |
| \`{{ $webhook.body.actor }}\` | Inbound Commenter Member URN | \`urn:li:person:XyZ12345\` |
| \`{{ $webhook.body.text }}\` | Inbound Comment Text Content | \`"Great insight! How can I implement this in my team?"\` |
| \`{{question}}\` / \`{{ $executeFlow.text }}\` | AI Answer from Execute Flow Node | \`"Thanks for reading! You can start by connecting the Start and Execute Flow nodes..."\` |

---

## 6. Summary

By chaining **Start Node** ➔ **Execute Flow Node** ➔ **LinkedIn Comment Node**, businesses and creators can automatically engage audience comments on LinkedIn with intelligent, context-aware AI replies acting on behalf of either a Company Page or an Individual Profile.
        `,
      },
      {
        id: "linkedin-post-automation",
        slug: "ai-builder/linkedin-post-automation",
        title: "LinkedIn Post Automation: Start, LLM 1, LinkedIn Post & Direct Reply Nodes",
        description: "Generate and publish LinkedIn posts automatically by connecting Start Node, LLM 1, LinkedIn Post Node, and Direct Reply Node.",
        category: "Developer (Developer Mode)",
        order: 6,
        readingTime: "6 min read",
        lastUpdated: "March 2026",
        badge: "Publishing Tool",
        content: `
# LinkedIn Post Automation: Start, LLM 1, LinkedIn Post & Direct Reply Nodes

Learn how to build an automated **LinkedIn Post Publishing** workflow on the visual canvas by chaining four core nodes: **Start Node**, **LLM 1 Node**, **LinkedIn Post Node**, and **Direct Reply Node**.

---

## 🌟 Architecture Overview

This automation accepts user post ideas or automated prompts, utilizes an LLM to craft professional LinkedIn copy, publishes the post directly to a Personal Profile or Company Page, and immediately returns a formatted confirmation message with live post details.

\`\`\`
┌──────────────────────────────────────────────┐
│                  START NODE                  │
│  • Input Type: Text / Webhook                │
│  • Flow State Management                     │
│  • Ingests Post Request or Topic Prompt      │
└──────────────────────┬───────────────────────┘
                       │
                       ▼ (Prompt & Context)
┌──────────────────────────────────────────────┐
│                  LLM 1 NODE                  │
│  • Model *: GPT-4o / Gemini / Claude         │
│  • Messages & Tone Guidelines                │
│  • Enable Memory: Toggle                     │
│  • Memory Type: All Messages                 │
│  • Input Message: {{question}}               │
│  • Return Response As *: User Message / JSON │
│  • Output: {{ llmAgentflow_0.output.content }}│
└──────────────────────┬───────────────────────┘
                       │
                       ▼ (Generated Post Content)
┌──────────────────────────────────────────────┐
│              LINKEDIN POST NODE              │
│  • Credential: LinkedIn API (OAuth 2.0)      │
│  • Target / Author Type *: Personal Profile  │
│    OR Company / Organization Page            │
│  • Organization ID: 12345678 / urn...        │
│  • Person URN: urn... or leave blank         │
│  • Post Content *:                           │
│    {{ llmAgentflow_0.output.content }}       │
│  • Article / Link URL: (Optional URL)        │
│  • Visibility *: Public (Anyone on LinkedIn) │
└──────────────────────┬───────────────────────┘
                       │
                       ▼ (Post Publication Metadata)
┌──────────────────────────────────────────────┐
│              DIRECT REPLY NODE               │
│  • Immediate conversational confirmation     │
│  • Dynamic Variables:                        │
│    👤 Author:                                │
│       {{linkedInPostAgentflow_0.input.author}}│
│    📝 Content:                               │
│       {{linkedInPostAgentflow_0.input...}}   │
│    🆔 Post ID:                               │
│       {{linkedInPostAgentflow_0.output.postId}}
└──────────────────────────────────────────────┘
\`\`\`

---

## 1. Start Node (Workflow Entry Point)

The **Start Node** serves as the initial trigger for the posting workflow.

### Key Node Configurations

- **Input Type**:
  - \`Text\`: Use when users trigger post creation conversationally via the chat interface.
  - \`Webhook\`: Use for automated external triggers (e.g. Zapier, Make, RSS feed update, blog CMS publish event).
- **Flow State**:
  - Preserves runtime session data, topics, tone preferences, or author flags.

---

## 2. LLM 1 Node (Content Generation Engine)

The **LLM 1 Node** generates the LinkedIn post text based on your system persona, tone instructions, and conversational context.

### Core Configuration Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| **Model \*** | Dropdown | Yes | Choose the foundation LLM (e.g., \`gpt-4o\`, \`gemini-1.5-pro\`, \`claude-3-5-sonnet\`). |
| **Messages** | Message List | Optional | Define system persona, post structure (Hook, Body, Call to Action), and hashtag guidelines. |
| **Enable Memory** | Toggle Switch | Optional | Enables context retention across conversational turns. |
| **Memory Type** | Dropdown | Optional | Set to \`All Messages\` for full conversational buffer memory. |
| **Input Message** | Text / Variable | Yes | The incoming topic or prompt passed from the Start Node (\`{{question}}\`). |
| **Return Response As \*** | Dropdown | Yes | Choose \`User Message\` (standard text output) or \`JSON Structured Output\`. |

### Downstream Output Variable
The post content generated by LLM 1 is exposed to downstream nodes as:
\`\`\`text
{{ llmAgentflow_0.output.content }}
\`\`\`

---

## 3. LinkedIn Post Node (Publishing Engine)

The **LinkedIn Post Node** connects to the official LinkedIn Community Management API to publish organic text, articles, or links.

### 3.1 Credential Setup: LinkedIn API
- **Credential Name \***: \`LinkedIn API\`
- **Access Token \***: LinkedIn OAuth 2.0 Bearer Access Token with \`w_member_social\` (for personal profiles) or \`w_organization_social\` (for company pages).

### 3.2 Target & Author Configuration

| Configuration Field | Type | Options | Description |
| :--- | :--- | :--- | :--- |
| **Target Type / Author Type \*** | Dropdown | \`Personal Profile\`<br/>\`Company / Organization Page\` | Determines whether the post is published to an individual member feed or an official company page. |
| **Organization ID** | Text Input | \`12345678\` or<br/>\`urn:li:organization:12345678\` | Required when Target Type is **Company / Organization Page**. Specifies the numerical ID or URN of your LinkedIn Company Page. |
| **Person URN / Member ID** | Text Input | \`urn:li:person:abcdef1234\` | Used when Target Type is **Personal Profile**. Leave blank to auto-detect from the connected OAuth token. |

### 3.3 Post Content & Visibility

| Configuration Field | Type | Recommended Value | Description |
| :--- | :--- | :--- | :--- |
| **Post Content \*** | Textarea / Expression | \`{{ llmAgentflow_0.output.content }}\` | Dynamically pulls the AI-written post copy from the LLM 1 node. |
| **Article / Link URL** | Text Input | *(Optional)* | Link attachment URL to be previewed on the LinkedIn post. |
| **Visibility \*** | Dropdown | \`Public (Anyone on LinkedIn)\` | Post visibility setting (\`Public\` or \`Connections Only\`). |

---

## 4. Direct Reply Node (User Confirmation & Feedback)

The **Direct Reply Node** halts further processing and outputs an immediate, formatted markdown confirmation message back to the user or chat interface.

### Message Template Configuration

In the **Message \*** field, configure the following response template:

\`\`\`text
🚀 Post published to your LinkedIn Profile!

👤 Author: {{linkedInPostAgentflow_0.input.author}}

📝 Content:
{{linkedInPostAgentflow_0.input.payload.commentary}}

🆔 Post ID: {{linkedInPostAgentflow_0.output.postId}}
\`\`\`

### Resolved Variable Breakdown

| Expression | Resolved Data | Description |
| :--- | :--- | :--- |
| \`{{linkedInPostAgentflow_0.input.author}}\` | Author URN | The member or organization identity that published the post. |
| \`{{linkedInPostAgentflow_0.input.payload.commentary}}\` | Commentary Text | The actual text content published to the LinkedIn post. |
| \`{{linkedInPostAgentflow_0.output.postId}}\` | LinkedIn Post ID | The unique LinkedIn Activity / Share URN generated on publication. |

---

## 5. Step-by-Step: Connecting the Full Automation

Follow these steps on the visual canvas to build the LinkedIn post automation:

1. **Add Start Node**:
   - Place the **Start Node** on the canvas.
   - Set **Input Type** to \`Text\` (or \`Webhook\`).

2. **Add LLM 1 Node**:
   - Drag **LLM 1** onto the canvas and connect the output of **Start Node** to the input of **LLM 1**.
   - Select your **Model \*** (e.g. GPT-4o).
   - Under **Messages**, configure prompt instructions for high-engagement LinkedIn posts.
   - Set **Enable Memory** to true, with **Memory Type** as \`All Messages\`.
   - Set **Return Response As \*** to \`User Message\`.

3. **Add LinkedIn Post Node**:
   - Drag **LinkedIn Post Node** onto the canvas and connect the output of **LLM 1** to its input.
   - In **Connect Credential**, select your authenticated **LinkedIn API** credential.
   - Select **Target Type / Author Type \*** as \`Personal Profile\` (or \`Company / Organization Page\`).
   - In **Post Content \***, enter:
     \`{{ llmAgentflow_0.output.content }}\`
   - Set **Visibility \*** to \`Public (Anyone on LinkedIn)\`.

4. **Add Direct Reply Node**:
   - Drag **Direct Reply Node** onto the canvas and connect the output of **LinkedIn Post Node** to its input.
   - In the **Message \*** field, paste:
     \`\`\`text
     🚀 Post published to your LinkedIn Profile!

     👤 Author: {{linkedInPostAgentflow_0.input.author}}

     📝 Content:
     {{linkedInPostAgentflow_0.input.payload.commentary}}

     🆔 Post ID: {{linkedInPostAgentflow_0.output.postId}}
     \`\`\`

5. **Test in Canvas**:
   - Open **Test Chat** and send a prompt (e.g. *"Write a post about AI agent orchestration with visual nodes"*).
   - Watch LLM 1 generate the post, LinkedIn Post Node publish it to your profile, and Direct Reply confirm publication with your live Post ID!

---

## 6. Summary

By chaining **Start Node** ➔ **LLM 1 Node** ➔ **LinkedIn Post Node** ➔ **Direct Reply Node**, you achieve an automated publishing pipeline that takes raw user ideas and publishes them directly to LinkedIn with instant conversational feedback.
        `,
      },
      {
        id: "facebook-page-post-automation",
        slug: "ai-builder/facebook-page-post-automation",
        title: "Facebook Page Post Automation: Start, Execute Flow, Page Post & Direct Reply Nodes",
        description: "Automate Facebook Page publishing by connecting Start Node, Execute Flow Node, Facebook Page Post Node, and Direct Reply Node.",
        category: "Developer (Developer Mode)",
        order: 7,
        readingTime: "6 min read",
        lastUpdated: "March 2026",
        badge: "Meta Tool",
        content: `
# Facebook Page Post Automation: Start, Execute Flow, Page Post & Direct Reply Nodes

Learn how to build an automated **Facebook Page Post Publishing** workflow on the visual canvas by chaining four core nodes: **Start Node**, **Execute Flow Node**, **Facebook Page Post Node**, and **Direct Reply Node**.

---

## 🌟 Architecture Overview

This automation takes a post prompt or trigger, routes it through an AI Chatflow or Knowledgebase flow to create polished social media copy, automatically posts it to a designated Facebook Page feed via the Meta Graph API, and outputs an immediate confirmation back to the chat interface.

\`\`\`
┌──────────────────────────────────────────────┐
│                  START NODE                  │
│  • Input Type: Text / Webhook                │
│  • Flow State Management                     │
│  • Ingests Post Request or Topic Prompt      │
└──────────────────────┬───────────────────────┘
                       │
                       ▼ (Prompt & Context)
┌──────────────────────────────────────────────┐
│              EXECUTE FLOW NODE               │
│  • Connect Credential (Chatflow API Key)     │
│    OR Knowledgebase Custom Select Dropdown   │
│  • Input Type & Arguments                    │
│  • Generates AI Social Copy / Announcement   │
└──────────────────────┬───────────────────────┘
                       │
                       ▼ (Computed Post Content)
┌──────────────────────────────────────────────┐
│          FACEBOOK PAGE POST NODE             │
│  • Credential: Facebook Page API             │
│    (Name, Page Access Token, Page ID, Secret)│
│  • Page ID: 109876543210987                  │
│  • Post Content *: {{ $executeFlow.text }}   │
│  • Link URL: (Optional URL)                  │
│  • Continue on Fail: Toggle (True/False)     │
└──────────────────────┬───────────────────────┘
                       │
                       ▼ (Post Publication Metadata)
┌──────────────────────────────────────────────┐
│              DIRECT REPLY NODE               │
│  • Immediate conversational confirmation     │
│  • Confirms Page ID, Content, & Live Post ID │
└──────────────────────────────────────────────┘
\`\`\`

---

## 1. Start Node (Workflow Entry Point)

The **Start Node** serves as the initial trigger for the posting workflow.

### Key Node Configurations

- **Input Type**:
  - \`Text\`: When users trigger post creation conversationally via the chat interface.
  - \`Webhook\`: For automated external triggers (e.g. blog published, RSS feed update, or marketing schedule).
- **Flow State**:
  - Preserves runtime session data, topics, tone preferences, or author flags.

---

## 2. Execute Flow Node (AI Reasoning & Copy Generation)

The **Execute Flow Node** takes the inbound prompt or topic and processes it through a dedicated Chatflow or Knowledgebase sub-flow.

### Credential & Flow Selection Options

You can configure the target flow using one of two methods:

#### Method A: Connect Credential (Chatflow API Key)
- Connect using your **Chatflow API Credential** (\`Chatflow API Key\` and base API host URL).
- Authenticates external, modular, or cross-workspace flows over HTTPS.

#### Method B: Knowledgebase / Custom Select Flow Dropdown (Direct Selection)
- If you do not configure a **Connect Credential** node, use the **Knowledgebase Custom Select Flow dropdown**.
- The dropdown automatically lists all flows created in your Chatflow workspace.
- Simply select the target flow directly from the list without needing API keys.

### Additional Configurations
- **Input Type**: Specifies how incoming arguments are mapped to the child flow.
- **Input Query / Prompt**: Injects the topic or request into the child flow to produce the post text.
- **Output**: Generates the final post text (referenced downstream via \`{{ $executeFlow.text }}\`).

---

## 3. Facebook Page Post Node (Publishing Engine)

The **Facebook Page Post Node** integrates with the official **Meta Graph API** to publish organic status updates, announcements, articles, and links to your Facebook Page feed.

### 3.1 Credential Setup: Facebook Page API

To authorize posting, configure the **Facebook Page API** credential with your Meta Developer credentials:

| Field Name | Required | Description |
| :--- | :--- | :--- |
| **Credential Name \*** | Yes | e.g. \`Facebook Page API\` |
| **Page Access Token \*** | Yes | Meta Facebook Page Access Token with \`pages_manage_posts\` and \`pages_read_engagement\` permissions. |
| **Page ID** | Optional | The numerical ID of your Facebook Page (e.g. \`109876543210987\`). |
| **App Secret** | Optional | Your Meta App Secret from the Meta Developer App Dashboard (used for appsecret_proof security). |

> **Credential Description**: *Meta Facebook Page Access Token and Page ID for Messenger replies and Page timeline posts.*

### 3.2 Node Configuration Properties

| Configuration Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| **Page ID** | Text Input | Optional | Target Facebook Page ID. If left blank, defaults to the Page ID specified in the connected credential. Allows overriding for multi-page deployments. |
| **Post Content \*** | Textarea / Variable | Yes | The text content to publish to the Facebook Page feed (e.g. \`{{ $executeFlow.text }}\` or \`{{question}}\`). |
| **Link URL** | Text Input | Optional | An optional website or article link URL to attach as a preview card on the post. |
| **Continue on Fail** | Toggle (Boolean) | Optional | When enabled, prevents the workflow from halting if the Facebook API returns an error, allowing downstream nodes to execute. |

---

## 4. Direct Reply Node (User Feedback & Confirmation)

The **Direct Reply Node** halts further processing and outputs a formatted markdown confirmation directly to the user's active session.

### Message Template Configuration

In the **Message \*** field, configure the following confirmation message:

\`\`\`text
🚀 Post successfully published to your Facebook Page!

📄 Page ID: {{facebookPagePostAgentflow_0.input.pageId}}

📝 Content:
{{facebookPagePostAgentflow_0.input.message}}

🆔 Post ID: {{facebookPagePostAgentflow_0.output.id}}
\`\`\`

### Resolved Variable Breakdown

| Expression | Resolved Data | Description |
| :--- | :--- | :--- |
| \`{{facebookPagePostAgentflow_0.input.pageId}}\` | Facebook Page ID | The numerical ID of the Facebook Page where the post was published. |
| \`{{facebookPagePostAgentflow_0.input.message}}\` | Post Content | The commentary / text content that was published. |
| \`{{facebookPagePostAgentflow_0.output.id}}\` | Facebook Post ID | The unique post ID returned by the Meta Graph API upon successful publishing (e.g. \`109876543210987_123456789012345\`). |

---

## 5. Step-by-Step: Connecting the Full Automation

Follow these steps on the visual canvas to build the automation:

1. **Add the Start Node**:
   - Place the **Start Node** on the canvas.
   - Set **Input Type** to \`Text\` (or \`Webhook\`).

2. **Add the Execute Flow Node**:
   - Drag **Execute Flow Node** onto the canvas and connect the output of **Start Node** to its input.
   - Under credentials, either provide your **Chatflow API Key** OR choose an existing flow from the **Knowledgebase / Custom Select Flow dropdown**.
   - Map the user topic into the flow query.

3. **Add the Facebook Page Post Node**:
   - Drag **Facebook Page Post Node** onto the canvas and connect the output of **Execute Flow Node** to its input.
   - In **Connect Credential**, select your \`Facebook Page API\` credential (\`Credential Name\`, \`Page Access Token\`, \`Page ID\`, \`App Secret\`).
   - In **Post Content \***, enter:
     \`{{ $executeFlow.text }}\`
   - Optionally supply a **Link URL** and toggle **Continue on Fail** as needed.

4. **Add the Direct Reply Node**:
   - Drag **Direct Reply Node** onto the canvas and connect the output of **Facebook Page Post Node** to its input.
   - In the **Message \*** field, paste:
     \`\`\`text
     🚀 Post successfully published to your Facebook Page!

     📄 Page ID: {{facebookPagePostAgentflow_0.input.pageId}}

     📝 Content:
     {{facebookPagePostAgentflow_0.input.message}}

     🆔 Post ID: {{facebookPagePostAgentflow_0.output.id}}
     \`\`\`

5. **Test in Canvas**:
   - Open **Test Chat** and send a topic prompt (e.g. *"Announce our new product feature launch with an engaging tone and emojis"*).
   - The flow generates the copy, publishes it to your Facebook Page, and confirms publication with the live Post ID!

---

## 6. Summary

By chaining **Start Node** ➔ **Execute Flow Node** ➔ **Facebook Page Post Node** ➔ **Direct Reply Node**, brands and creators can completely automate social media announcements, publishing AI-curated posts directly to Facebook Pages with zero manual effort.
        `,
      },
      {
        id: "facebook-messenger-automation",
        slug: "ai-builder/facebook-messenger-automation",
        title: "Facebook Messenger Automation: Start, Execute Flow, Messenger Send & Direct Reply",
        description: "Build automated Facebook Messenger support agents by connecting Start Node, Execute Flow Node, Facebook Messenger Send Node, and Direct Reply Node.",
        category: "Developer (Developer Mode)",
        order: 8,
        readingTime: "6 min read",
        lastUpdated: "March 2026",
        badge: "Messenger Tool",
        content: `
# Facebook Messenger Automation: Start, Execute Flow, Messenger Send & Direct Reply

Learn how to build an automated **Facebook Messenger AI Support & Reply** workflow on the visual canvas by chaining four core nodes: **Start Node**, **Execute Flow Node**, **Facebook Messenger Send Node**, and **Direct Reply Node**.

---

## 🌟 Architecture Overview

This automation listens for incoming messages sent to your Facebook Page, routes customer inquiries through an intelligent Chatflow or Knowledgebase sub-flow, sends AI answers directly to the user's Messenger thread via Meta's Send API (with optional typing simulation), and returns an execution summary.

\`\`\`
┌──────────────────────────────────────────────┐
│                  START NODE                  │
│  • Input Type: Webhook                       │
│  • Flow State Management                     │
│  • Ingests Inbound Messenger Webhook Event   │
└──────────────────────┬───────────────────────┘
                       │
                       ▼ (Inbound PSID & Message)
┌──────────────────────────────────────────────┐
│              EXECUTE FLOW NODE               │
│  • Connect Credential (Chatflow API Key)     │
│    OR Knowledgebase Custom Select Dropdown   │
│  • Input Type & Prompt Mapping               │
│  • Generates AI Reasoning / Answer           │
└──────────────────────┬───────────────────────┘
                       │
                       ▼ (Generated Response Text)
┌──────────────────────────────────────────────┐
│        FACEBOOK MESSENGER SEND NODE          │
│  • Credential: Facebook Page API             │
│  • Action Type *: Send Text Message          │
│  • Recipient PSID *:                         │
│    {{ $webhook.body.entry[0]...sender.id }}  │
│  • Message Text *: {{ $executeFlow.text }}   │
│  • Simulate Typing Before Sending: Toggle    │
└──────────────────────┬───────────────────────┘
                       │
                       ▼ (Message Delivery Metadata)
┌──────────────────────────────────────────────┐
│              DIRECT REPLY NODE               │
│  • Immediate conversational confirmation     │
│  • Confirms Delivery & Message Recipient PSID│
└──────────────────────────────────────────────┘
\`\`\`

---

## 1. Start Node (Workflow Entry Point)

The **Start Node** serves as the inbound listener for Meta's Messenger Webhook events.

### Key Node Configurations

- **Input Type**:
  - Set to \`Webhook\` to receive incoming HTTP POST payloads from Meta Messenger webhook notifications.
- **Flow State**:
  - Retains conversational context, user PSID, session counters, and state across nodes.
- **Webhook Endpoint**:
  - The public HTTPS URL where Meta delivers \`messages\` and \`messaging_postbacks\` webhook payloads.

---

## 2. Execute Flow Node (Logic & Knowledge Processing)

The **Execute Flow Node** takes the customer's incoming message and queries a specialized Chatflow or Knowledgebase sub-flow (handling conversational memory, RAG documents, or business logic).

### Credential & Flow Selection Options

You can configure the target flow using one of two methods:

#### Method A: Connect Credential (Chatflow API Key)
- Connect using your **Chatflow API Credential** (\`Chatflow API Key\` and base API host URL).
- Authenticates external, modular, or cross-workspace flows over HTTPS.

#### Method B: Knowledgebase / Custom Select Flow Dropdown (Direct Selection)
- If you do not configure a **Connect Credential** node, use the **Knowledgebase Custom Select Flow dropdown**.
- The dropdown automatically lists all flows created in your Chatflow workspace.
- Simply select the target flow directly from the list without needing API keys.

### Additional Configurations
- **Input Type**: Defines how parameters are formatted for the child flow.
- **Input Query / Prompt**: Injects the customer's question into the child flow:
  \`\`\`text
  {{ $webhook.body.entry[0].messaging[0].message.text }}
  \`\`\`
- **Output**: Generates the final AI answer (referenced downstream via \`{{ $executeFlow.text }}\`).

---

## 3. Facebook Messenger Send Node (Messaging Engine)

The **Facebook Messenger Send Node** transmits replies directly into the user's active Messenger chat with your Facebook Page using the Meta Send API.

### 3.1 Credential Setup: Facebook Page API

To authorize sending messages as your Page, configure the **Facebook Page API** credential:

- **Credential Name \***: \`Facebook Page API\`
- **Description**: *Meta Facebook Page Access Token and Page ID for Messenger replies and Page timeline posts.*
- **Page Access Token \***: Permanent or long-lived Facebook Page Access Token with \`pages_messaging\` and \`pages_manage_metadata\` permissions.
- **Page ID**: Numerical identifier of your Facebook Page (e.g. \`109876543210987\`).
- **App Secret**: Meta App Secret from your App Dashboard.

### 3.2 Node Configuration Properties

| Configuration Field | Type | Required | Recommended Value / Description |
| :--- | :--- | :--- | :--- |
| **Connect Credential** | Dropdown | Yes | Select your authenticated \`Facebook Page API\` credential. |
| **Action Type \*** | Dropdown | Yes | Select \`Send Text Message\`. |
| **Recipient PSID \*** | Text / Template | Yes | \`{{ $webhook.body.entry[0].messaging[0].sender.id }}\`<br/>Dynamically extracts the Page-Scoped ID (PSID) of the customer who sent the message. |
| **Message Text \*** | Textarea / Variable | Yes | \`{{ $executeFlow.text }}\` *(or \`{{question}}\`)*<br/>The AI-generated answer to be delivered to the customer. |
| **Simulate Typing Before Sending** | Toggle (Boolean) | Optional | When enabled, sends a \`typing_on\` sender action to display the native Messenger typing animation before dispatching the response. |

---

## 4. Deep-Dive: How Recipient PSID Extraction Works

In Meta's Messenger Webhook payload, incoming messages arrive in a nested hierarchy:

\`\`\`json
{
  "object": "page",
  "entry": [
    {
      "id": "109876543210987",
      "messaging": [
        {
          "sender": {
            "id": "876543210987654"
          },
          "recipient": {
            "id": "109876543210987"
          },
          "message": {
            "mid": "m_mid.$cAA...",
            "text": "Hello, what are your opening hours?"
          }
        }
      ]
    }
  ]
}
\`\`\`

By referencing \`{{ $webhook.body.entry[0].messaging[0].sender.id }}\`, the node extracts the user's unique **Page-Scoped ID (PSID)** and routes the reply directly back to them.

---

## 5. Direct Reply Node (User Feedback & Confirmation)

The **Direct Reply Node** returns an execution summary to the workflow monitor or admin session.

### Message Template Configuration

\`\`\`text
💬 Messenger reply sent successfully!

👤 Recipient PSID: {{facebookMessengerAgentflow_0.input.recipientId}}

📝 Message:
{{facebookMessengerAgentflow_0.input.message}}

🆔 Message ID: {{facebookMessengerAgentflow_0.output.messageId}}
\`\`\`

---

## 6. Step-by-Step: Connecting the Full Automation

Follow these steps on the visual canvas to build the Messenger automation:

1. **Add the Start Node**:
   - Drag **Start Node** onto the canvas.
   - Set **Input Type** to \`Webhook\`.
   - Copy the generated Webhook URL.

2. **Add the Execute Flow Node**:
   - Drag **Execute Flow Node** onto the canvas and connect the output of **Start Node** to its input.
   - Select your **Chatflow API Key** credential OR choose a flow from the **Knowledgebase / Custom Select Flow dropdown**.
   - In **Input Query**, map:
     \`\`\`text
     {{ $webhook.body.entry[0].messaging[0].message.text }}
     \`\`\`

3. **Add the Facebook Messenger Send Node**:
   - Drag **Facebook Messenger Send Node** onto the canvas and connect the output of **Execute Flow Node** to its input.
   - In **Connect Credential**, select your \`Facebook Page API\` credential.
   - Set **Action Type \*** to \`Send Text Message\`.
   - In **Recipient PSID \***, enter:
     \`\`\`text
     {{ $webhook.body.entry[0].messaging[0].sender.id }}
     \`\`\`
   - In **Message Text \***, enter:
     \`\`\`text
     {{ $executeFlow.text }}
     \`\`\`
   - Enable **Simulate Typing Before Sending** for a human-like response delay and typing indicator.

4. **Add the Direct Reply Node**:
   - Drag **Direct Reply Node** onto the canvas and connect the output of **Facebook Messenger Send Node** to its input.
   - Configure the confirmation summary template.

5. **Meta Webhook Setup & Live Verification**:
   - In Meta Developer Dashboard > Messenger > Webhooks, set Callback URL to your Start Node Webhook URL.
   - Verify the webhook challenge token.
   - Subscribe to the \`messages\` and \`messaging_postbacks\` events.
   - Send a direct message to your Facebook Page on Messenger to verify instant automated AI responses!

---

## 7. Webhook Variables Reference Table

| Dynamic Variable | Resolved Data | Example Value |
| :--- | :--- | :--- |
| \`{{ $webhook.body.entry[0].messaging[0].sender.id }}\` | Customer's Page-Scoped ID (PSID) | \`876543210987654\` |
| \`{{ $webhook.body.entry[0].messaging[0].message.text }}\` | Customer's inbound message text | \`"Can I book an appointment tomorrow?"\` |
| \`{{ $webhook.body.entry[0].id }}\` | Your Facebook Page ID | \`109876543210987\` |
| \`{{ $executeFlow.text }}\` | AI Answer from Execute Flow Node | \`"Yes! We have available slots at 2:00 PM and 4:00 PM."\` |

---

## 8. Summary

By chaining **Start Node** ➔ **Execute Flow Node** ➔ **Facebook Messenger Send Node** ➔ **Direct Reply Node**, you deploy a fully automated 24/7 Facebook Messenger AI support agent that handles incoming customer queries, consults your knowledgebase, and responds with a natural typing simulation.
        `,
      },
      {
        id: "telegram-automation",
        slug: "ai-builder/telegram-automation",
        title: "Telegram Bot Automation: Start, Execute Flow & Telegram Send Nodes",
        description: "Build automated Telegram AI bots by connecting Start Node, Execute Flow Node, and Telegram Send Node.",
        category: "Developer (Developer Mode)",
        order: 9,
        readingTime: "6 min read",
        lastUpdated: "March 2026",
        badge: "Telegram Tool",
        content: `
# Telegram Bot Automation: Start, Execute Flow & Telegram Send Nodes

Learn how to build an automated **Telegram AI Bot** workflow on the visual canvas by chaining three core nodes: **Start Node**, **Execute Flow Node**, and **Telegram Send Node**.

---

## 🌟 Architecture Overview

This automation listens for incoming updates from Telegram, routes inquiries through an intelligent Chatflow or Knowledgebase sub-flow, and sends AI answers directly back to the user or group chat using the official Telegram Bot API.

\`\`\`
┌──────────────────────────────────────────────┐
│                  START NODE                  │
│  • Input Type: Webhook                       │
│  • Flow State Management                     │
│  • Ingests Inbound Telegram Update Payload   │
└──────────────────────┬───────────────────────┘
                       │
                       ▼ (Inbound Chat ID & User Message)
┌──────────────────────────────────────────────┐
│              EXECUTE FLOW NODE               │
│  • Connect Credential (Chatflow API Key)     │
│    OR Knowledgebase Custom Select Dropdown   │
│  • Input: {{ $webhook.body.message.text }}   │
│  • Generates AI Reasoning / Answer           │
└──────────────────────┬───────────────────────┘
                       │
                       ▼ (AI Output: {{ llmAgentflow_0 }})
┌──────────────────────────────────────────────┐
│             TELEGRAM SEND NODE               │
│  • Credential: Telegram Bot API (@BotFather) │
│  • Chat ID *:                                │
│    {{ $webhook.body.message.chat.id }}       │
│  • Message Text *: {{ llmAgentflow_0 }}      │
│  • Parse Mode: None (Plain Text) / HTML / MD │
│  • Reply To Message ID: (Optional)           │
│  • Disable Link Preview: Toggle              │
└──────────────────────────────────────────────┘
\`\`\`

---

## 1. Start Node (Workflow Entry Point)

The **Start Node** serves as the inbound listener for Telegram Bot API updates.

### Key Node Configurations

- **Input Type**:
  - Set to \`Webhook\` to receive incoming HTTP POST payloads from Telegram's webhook system.
- **Flow State**:
  - Retains chat identifiers, user metadata, and conversation history across downstream nodes.
- **Webhook Endpoint**:
  - The public HTTPS URL where Telegram delivers new user updates.

---

## 2. Execute Flow Node (Logic & Knowledge Processing)

The **Execute Flow Node** takes the customer's incoming message and queries a specialized Chatflow or Knowledgebase sub-flow.

### Credential & Flow Selection Options

You can configure the target flow using one of two methods:

#### Method A: Connect Credential (Chatflow API Key)
- Connect using your **Chatflow API Credential** (\`Chatflow API Key\` and base API host URL).
- Authenticates external, modular, or cross-workspace flows over HTTPS.

#### Method B: Knowledgebase / Custom Select Flow Dropdown (Direct Selection)
- If you do not configure a **Connect Credential** node, use the **Knowledgebase Custom Select Flow dropdown**.
- The dropdown automatically lists all flows created in your Chatflow workspace.
- Simply select the target flow directly from the list without needing API keys.

### Additional Configurations
- **Input Type**: Defines how parameters are formatted for the child flow.
- **Input Query / Prompt**: Injects the customer's question into the child flow:
  \`\`\`text
  {{ $webhook.body.message.text }}
  \`\`\`
- **Output**: Generates the final AI answer (referenced downstream via \`{{ llmAgentflow_0 }}\` or \`{{ $executeFlow.text }}\`).

---

## 3. Telegram Send Node (Messaging Engine)

The **Telegram Send Node** delivers outbound text messages and notifications directly to Telegram chats, groups, and channels using the **Telegram Bot API**.

### 3.1 Credential Setup: Telegram Bot API

To authorize your bot to send messages, configure the **Telegram Bot API** credential:

- **Credential Name \***: \`teletgram\` *(or \`Telegram Bot API\`)*
- **Description**: *Telegram Bot API token obtained from @BotFather*
- **Bot Token \***: Token obtained from \`@BotFather\` on Telegram (format: \`123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ\`).
- **API Base URL**: Optional custom or proxy API base URL (defaults to \`https://api.telegram.org\` if left blank).

### 3.2 Node Configuration Properties

| Configuration Field | Type | Required | Recommended Value / Description |
| :--- | :--- | :--- | :--- |
| **Connect Credential** | Dropdown | Yes | Select your authenticated \`teletgram\` credential. |
| **Chat ID \*** | Text / Template | Yes | \`{{ $webhook.body.message.chat.id }}\`<br/>Dynamically targets the exact Telegram chat, group, or channel where the inbound message originated. |
| **Message Text \*** | Textarea / Variable | Yes | \`{{ llmAgentflow_0 }}\` *(or \`{{ $executeFlow.text }}\` / \`{{question}}\`)*<br/>The AI-crafted text response to be delivered. |
| **Parse Mode** | Dropdown | Optional | Formatting engine for the message: \`None (Plain Text)\`, \`MarkdownV2\`, \`HTML\`, or \`Markdown\`. |
| **Reply To Message ID** | Text / Variable | Optional | e.g. \`{{ $webhook.body.message.message_id }}\` to thread the bot's response directly under the user's question. |
| **Disable Link Preview** | Toggle (Boolean) | Optional | When enabled, prevents Telegram from rendering rich URL preview thumbnails in the message. |

---

## 4. Deep-Dive: Telegram Inbound Webhook Payload

When a user messages your Telegram bot, the update payload arrives in this format:

\`\`\`json
{
  "update_id": 10000,
  "message": {
    "message_id": 1365,
    "from": {
      "id": 1111111,
      "is_bot": false,
      "first_name": "Rahim",
      "username": "rahim_dev"
    },
    "chat": {
      "id": 1111111,
      "first_name": "Rahim",
      "type": "private"
    },
    "date": 1441645532,
    "text": "What are your support hours?"
  }
}
\`\`\`

### Expression Resolution Table

| Dynamic Variable | Resolved Data | Example Value |
| :--- | :--- | :--- |
| \`{{ $webhook.body.message.chat.id }}\` | Target Chat ID | \`1111111\` |
| \`{{ $webhook.body.message.text }}\` | Inbound Question | \`"What are your support hours?"\` |
| \`{{ $webhook.body.message.message_id }}\` | Original Message ID | \`1365\` |
| \`{{ $webhook.body.message.from.first_name }}\` | Sender's First Name | \`"Rahim"\` |
| \`{{ llmAgentflow_0 }}\` / \`{{ $executeFlow.text }}\` | AI Answer Output | \`"We are available 24/7 to assist you!"\` |

---

## 5. Step-by-Step: Connecting the Full Automation

Follow these steps on the visual canvas to build the Telegram bot automation:

1. **Step 1: Obtain a Bot Token from @BotFather**
   - Open Telegram and search for \`@BotFather\`.
   - Send \`/newbot\`, name your bot, and copy the HTTP API token generated.

2. **Step 2: Add the Start Node**
   - Drag **Start Node** onto the canvas.
   - Set **Input Type** to \`Webhook\`.
   - Copy the generated Webhook URL.

3. **Step 3: Connect the Execute Flow Node**
   - Drag **Execute Flow Node** onto the canvas and connect the output of **Start Node** to its input.
   - Select your **Chatflow API Key** credential OR choose a flow from the **Knowledgebase / Custom Select Flow dropdown**.
   - In **Input Query**, map:
     \`\`\`text
     {{ $webhook.body.message.text }}
     \`\`\`

4. **Step 4: Connect the Telegram Send Node**
   - Drag **Telegram Send Node** onto the canvas and connect the output of **Execute Flow Node** to its input.
   - In **Connect Credential**, select your \`teletgram\` credential.
   - In **Chat ID \***, enter:
     \`\`\`text
     {{ $webhook.body.message.chat.id }}
     \`\`\`
   - In **Message Text \***, enter:
     \`\`\`text
     {{ llmAgentflow_0 }}
     \`\`\`
     *(or \`{{ $executeFlow.text }}\`)*.
   - Set **Parse Mode** to \`None (Plain Text)\` (or \`HTML\` / \`MarkdownV2\`).
   - Optionally supply \`{{ $webhook.body.message.message_id }}\` in **Reply To Message ID**.

5. **Step 5: Register Telegram Webhook & Test Live**
   - Set the webhook URL by visiting in your browser:
     \`\`\`text
     https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<START_NODE_WEBHOOK_URL>
     \`\`\`
   - Open Telegram, search for your bot, click \`/start\`, and send a test message.
   - The bot will execute the Chatflow and deliver an instant AI response!

---

## 6. Summary

By chaining **Start Node** ➔ **Execute Flow Node** ➔ **Telegram Send Node**, you establish a 24/7 high-speed Telegram assistant capable of answering user inquiries, consulting company knowledgebases, and threading replies with zero server maintenance.
        `,
      },
    ],
  },
];

// Helper Functions
export function getAllDocs(): DocItem[] {
  return DOCS_CATEGORIES.flatMap((category) => category.items);
}

export function getDocBySlug(slug: string): DocItem | undefined {
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, "");
  return getAllDocs().find((doc) => doc.slug === normalizedSlug);
}

export function getDocPagination(currentSlug: string): {
  prev?: DocPaginationItem;
  next?: DocPaginationItem;
} {
  const allDocs = getAllDocs();
  const index = allDocs.findIndex((doc) => doc.slug === currentSlug);

  if (index === -1) return {};

  return {
    prev:
      index > 0
        ? {
          title: allDocs[index - 1].title,
          slug: allDocs[index - 1].slug,
          category: allDocs[index - 1].category,
        }
        : undefined,
    next:
      index < allDocs.length - 1
        ? {
          title: allDocs[index + 1].title,
          slug: allDocs[index + 1].slug,
          category: allDocs[index + 1].category,
        }
        : undefined,
  };
}

export function extractTOC(content: string): Array<{ id: string; title: string; level: number }> {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const toc: Array<{ id: string; title: string; level: number }> = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    toc.push({ id, title, level });
  }

  return toc;
}
