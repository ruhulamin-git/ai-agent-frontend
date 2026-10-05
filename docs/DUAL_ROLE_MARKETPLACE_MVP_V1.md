# Dual-Role AI Agent Marketplace (Chatflow-Only) — MVP V1 Specification

## Executive Overview

The **Dual-Role AI Agent Marketplace** is a Next.js-powered workforce platform that enables users to operate seamlessly as both a **Normal User (Consumer)** and a **Developer (Creator)** using a single, unified account.

For the **V1 MVP**, the platform strictly supports **Chatflow Agents** (visual node-based conversation flows).

---

## 1. Authentication & User Onboarding

### 1.1 Authentication Methods
- **Google OAuth**: One-click social sign-in and token exchange.
- **Email/Password**: Secure credential authentication with email verification and password reset flows.

### 1.2 Unified Account Architecture
- Upon successful authentication, the backend and frontend automatically provision a single unified account with dual privileges.
- **Zero Onboarding Friction**: Users are immediately granted access to both the **Normal User Dashboard** (`/user-dashboard`) and the **Developer Dashboard** (`/developer-dashboard`) without needing separate registrations, multiple user profiles, or role selection during onboarding.

---

## 2. User Roles & Dashboard Architecture

Users can dynamically toggle between the two modes at any time via the **Sidebar Navigation Menu** mode switcher (e.g., "Developer Mode" / "User Mode").

```
                              ┌────────────────────────┐
                              │    Unified Account     │
                              │ (OAuth / Email+Pass)   │
                              └───────────┬────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
     ┌────────────────────────┐                      ┌────────────────────────┐
     │  Normal User Dashboard │ ◄── Sidebar Toggle ─►│  Developer Dashboard  │
     │      (User Mode)       │                      │    (Developer Mode)    │
     └────────────┬───────────┘                      └────────────┬───────────┘
                  │                                               │
    ┌─────────────┴─────────────┐                   ┌─────────────┴─────────────┐
    ▼                           ▼                   ▼                           ▼
[Marketplace View]     [My Agents Area]       [Chatflow Canvas]     [Agent Library]
• Card layout          • Active status        • Node builder        • Draft status
• View Details         • Live chat session    • Built-in Test Chat  • Settings / Mon.
• Stripe subscription  • Website embed        • Chatflow-only       • Admin Approval Q
```

### A. Normal User Dashboard (User Mode)
The primary objective of the Normal User is to discover, subscribe to, and deploy AI agents from the marketplace.

1. **Marketplace View (`/marketplace`)**:
   - Clean, responsive card grid displaying all **Live & Approved** published agents.
   - Filterable by categories (Sales, Support, Marketing, Operations, etc.).
   - Each agent card includes metadata, creator attribution, and a **"View Details"** button.

2. **Agent Details & Subscription (`/marketplace/[slug]`)**:
   - Dedicated agent overview page presenting full description, capabilities, system highlights, and use cases.
   - Transparent display of developer-defined subscription pricing structures (Monthly / Yearly).
   - Direct checkout integration with **Stripe Gateway**: Users initiate payment seamlessly within the platform.

3. **My Agents Section (`/user-dashboard/my-agent`)**:
   - Upon verified Stripe transaction completion, the subscribed agent is added to the user's **My Agents** library with an **Active** status.
   - **Interactive Chat Session**: The user can immediately open a live session and interact directly with the agent.
   - **Third-Party Website Embed**: Users can copy a JavaScript / React embed snippet to deploy the agent widget onto their HTML websites, Next.js apps, WordPress, or Shopify stores.

### B. Developer Dashboard (Developer Mode)
Every registered user automatically possesses creator privileges, enabling them to build, test, and monetize custom agents.

1. **Strict Agent Type Restriction**:
   - For MVP V1, creators are **strictly limited to building Chatflow Agents** via the visual, node-based conversation builder interface.

2. **Agent Creation, Testing & Draft Lifecycle**:
   - **Visual Node Canvas (`/developer-dashboard/create-agent` or `/ai-builder/canvas`)**: Developers construct conversation flows by linking LLMs, prompt templates, vector memory, tools, and document stores.
   - **Built-in "Test Chat" Interface**: Before publishing, developers test real-time conversations directly in an interactive playground panel.
   - **Agent Library Draft State (`/developer-dashboard/agents`)**: Saved agents are automatically stored in the Developer Agent Library marked with a **"Draft"** status badge.

3. **Monetization & Publication Workflow**:
   - **Step 1 - Agent Settings**: Developer navigates to the individual Agent Settings modal/page.
   - **Step 2 - Monetization Configuration**: Under the **"Monetization"** section, the developer configures subscription pricing plans (e.g., $29/mo, $99/mo).
   - **Step 3 - Submit for Approval**: Developer clicks **"Publish"**, which automatically dispatches the agent to the **Backend/Admin Authority Approval Queue** (status: *Pending Approval / Manual-Active*).
   - **Step 4 - Admin Review & Live Marketplace**: Once platform administrators review and approve the agent, the status transitions to **"Live & Published"**. The agent becomes immediately visible to all consumers on the public marketplace.

---

## 3. Developer Tier Subscription & Limits (SaaS Model)

Developer agent creation capacity and marketplace scaling are governed by a multi-tiered SaaS subscription structure managed via backend middleware:

| Plan Name | Agent Creation Limit | Listing Status | Key Features |
| :--- | :--- | :--- | :--- |
| **Free Plan** | Maximum **1 Agent** | **Manual-Active** (Requires Admin Approval) | Basic node canvas, test chat, community support |
| **Basic Plan** | Maximum **3 Agents** | **Manual-Active** (Requires Admin Approval) | 3 Chatflow agents, standard execution, email support |
| **Pro Plan** | Maximum **10 Agents** | **Manual-Active** (Requires Admin Approval) | 10 Chatflow agents, priority approval queue, advanced tools |

> **Listing Status Note**: For all developer tiers in V1, every agent submission enters the **Manual-Active** state and requires Backend / Admin Authority approval before appearing publicly on the Marketplace.

---

## 4. Frontend Route Architecture

| Route | Role Mode | Purpose |
| :--- | :--- | :--- |
| `/auth/login`, `/auth/register` | Public / Auth | Unified Google OAuth & Email/Password authentication |
| `/marketplace` | Public / User | Live approved Chatflow agents catalog |
| `/marketplace/[slug]` | Public / User | Agent details, use cases, and Stripe subscription checkout |
| `/user-dashboard` | User Mode | Consumer dashboard overview |
| `/user-dashboard/my-agent` | User Mode | Active subscribed agents, interactive chat sessions, widget embed code |
| `/user-dashboard/payment-history` | User Mode | Stripe subscription and billing receipt history |
| `/developer-dashboard` | Developer Mode | Creator analytics, agent statistics, and quick actions |
| `/developer-dashboard/agents` | Developer Mode | Agent Library (Drafts, Pending Review, Published agents) |
| `/developer-dashboard/create-agent` | Developer Mode | Node-based visual Chatflow builder |
| `/developer-dashboard/billing` | Developer Mode | Developer SaaS subscription management (Free / Basic / Pro) |
| `/docs` | Public | Developer & User Documentation portal |

---

## 5. Security, Middleware & Data Governance

1. **Authentication State**: Managed via Next.js middleware and token storage.
2. **Tier Enforcement**: Backend middleware validates the developer's active tier before allowing new agent instantiation (1, 3, or 10 agents max).
3. **Admin Queue Moderation**: Public marketplace listings are locked until approved by platform administrators to ensure system safety and quality assurance.
4. **Stripe Webhooks**: Listens for `checkout.session.completed` and `customer.subscription.deleted` to grant and revoke active agent access in the Normal User's "My Agents" dashboard.
