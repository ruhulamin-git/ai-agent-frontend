"use client";

import Link from "next/link";

import { SectionContainer } from "@/shared/components/SectionContainer";

const PRIVACY_DATA = {
  lastUpdated: "April 30, 2026",
  sections: [
    {
      title: "1. Information We Collect",
      desc: "We collect information necessary to operate, maintain, and improve the AgentKit platform, including:",
      items: [
        {
          label: "Account Information",
          text: "Name, email address, company details, and billing information",
        },
        {
          label: "Usage Data",
          text: "Agent interactions, prompts, outputs, API usage, and performance metrics",
        },
        {
          label: "Technical Data",
          text: "IP address, browser type, device identifiers, and cookies",
        },
        {
          label: "Integration Data",
          text: "Data from third-party integrations you authorize (e.g., Slack, CRM tools)",
        },
      ],
    },
    {
      title: "2. How We Use Your Information",
      desc: "We use your information to:",
      items: [
        {
          label: "Provide Services",
          text: "Operate and deliver the AgentKit platform and its features",
        },
        {
          label: "Improve the Platform",
          text: "Analyze usage trends and improve system performance and reliability",
        },
        {
          label: "Support & Communication",
          text: "Respond to inquiries, send service updates, and provide customer support",
        },
        {
          label: "Security & Compliance",
          text: "Detect fraud, prevent abuse, and comply with legal obligations",
        },
      ],
    },
    {
      title: "3. Data Security",
      desc: "We take reasonable and appropriate measures to protect your data, including:",
      items: [
        { label: "Encryption", text: "Encryption in transit and at rest using industry standards" },
        { label: "Access Control", text: "Restricted access based on roles and business need" },
        { label: "Monitoring", text: "Ongoing monitoring for unauthorized access or misuse" },
      ],
    },
    {
      title: "4. Data Sharing",
      desc: "We may share your information with:",
      items: [
        {
          label: "Service Providers",
          text: "Infrastructure, payment, analytics, and support vendors",
        },
        {
          label: "AI Providers",
          text: "Third-party AI model providers required to deliver agent functionality",
        },
        { label: "Legal Authorities", text: "When required by law or to protect our legal rights" },
      ],
      footerText: "We do not sell your personal information.",
    },
    {
      title: "5. Your Rights",
      desc: "Depending on your location, you may have the right to access, correct, delete, or export your personal data, and to object to certain processing activities.",
    },
    {
      title: "6. Data Retention",
      desc: "We retain personal data only for as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce agreements.",
    },
    {
      title: "7. International Transfers",
      desc: "Your data may be processed in countries other than your own. We apply appropriate safeguards to protect your information during international transfers.",
    },
    {
      title: "8. Changes to This Policy",
      desc: "We may update this Privacy Policy from time to time. Material changes will be communicated through the platform or by email.",
    },
  ],
};

const PrivacyPage = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 py-20">
        <SectionContainer>
          <div className="text-center">
            <h1 className="section-title mb-4">
              <span>Privacy</span> Policy
            </h1>

            <p className="section-subtitle mb-16">Last updated: {PRIVACY_DATA.lastUpdated}</p>
          </div>

          <div className="space-y-24 text-slate-400">
            {PRIVACY_DATA.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-3xl font-bold mb-6 text-white">{section.title}</h2>

                {section.desc && <p className="mb-6">{section.desc}</p>}

                {section.items && (
                  <ul className="space-y-4">
                    {section.items.map((item) => (
                      <li key={item.label}>
                        <strong className="text-white">{item.label}:</strong> {item.text}
                      </li>
                    ))}
                  </ul>
                )}

                {section.footerText && <p className="mt-6 text-slate-500">{section.footerText}</p>}
              </section>
            ))}

            <section className="border-t border-white/10 pt-12">
              <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
              <p>
                For privacy-related questions, contact{" "}
                <Link href="mailto:hello@devxhub.com" className="text-primary underline">
                  hello@devxhub.com
                </Link>
              </p>
            </section>
          </div>
        </SectionContainer>
      </div>
    </section>
  );
};

export default PrivacyPage;
