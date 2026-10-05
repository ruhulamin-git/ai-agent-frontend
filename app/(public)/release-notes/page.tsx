"use client";

import Link from "next/link";
import Image from "next/image";
import { SectionContainer } from "@/shared/components/SectionContainer";

type ReleaseNoteSection = {
    title: string;
    desc?: string;
    items?: { label: string; text: string }[];
    imageSrc?: string;
    screenshotPlaceholder?: string;
};

const RELEASE_NOTES_DATA: { version: string; date: string; overview: string; sections: ReleaseNoteSection[] } = {
    version: "1.0.0",
    date: "10 August 2026",
    overview: "We built AI Agents to make it incredibly easy for anyone to create a custom AI chatbot. You don't need to be a developer or write a single line of code. Whether you want to answer customer FAQs or create an internal assistant for your team, you can simply upload your business documents, use our visual builder, and embed the chatbot straight into your website in just a few minutes.",
    sections: [
        {
            title: "New Features",
            items: [
                { label: "Simple Drag-and-Drop Builder (Visual Builder)", text: "Design your chatbot visually by linking ready-made blocks—no coding required." },
                { label: "Flexible AI Model Choice (Customizable Model Provider)", text: "Plug in your own API keys for OpenAI (GPT-4o), Google Gemini, or other AI models you like." },
                { label: "Free & Automated Hosting (Agent Hosting)", text: "We keep your chatbots online and running smoothly without any server setup." },
                { label: "Instant Document Training (Document Store)", text: "Upload PDFs or Word files so your chatbot can read and learn your content right away." },
                { label: "Smart Fact-Checking & Guardrails (Hallucination Control)", text: "Set clear rules so your chatbot only answers using your files and never makes up false details." },
                { label: "Ready-to-Use Component Library (Built-in Tools)", text: "Choose from a set of pre-built tools to add useful logic and smart features to your chatbot." },
                { label: "Live Side-by-Side Testing (Test Chatbot)", text: "Test and refine your chatbot in real time using the chat window right next to your canvas." },
                { label: "One-Click Website Embed (Chat Widget)", text: "Copy a short code snippet to instantly add the chatbot widget to any website." },
                { label: "All-in-One Workspace (Unified Dashboard)", text: "A simple single dashboard to track, edit, and organize all the chatbots you've created." },
            ]
        },
        {
            title: "Architecture & Setup (How it works)",
            desc: "Here’s a quick look at how the system actually works behind the scenes to give you accurate answers:",
            items: [
                { label: "Reading Your Files", text: "When you upload a document (like a company PDF), our system reads the text, breaks it down into smaller, searchable pieces, and saves it into a fast database." },
                { label: "Finding the Right Answers", text: "When a user types a question into the chat widget, the system instantly searches that database to pull out the exact paragraphs that match the user's question." },
                { label: "Writing the Final Reply", text: "We take those matching paragraphs and send them to the AI model along with the user's question. The AI is given a strict instruction: \"Only use this provided text to answer.\" Because of this, it delivers a natural, fast, and entirely accurate reply without making up false information." }
            ]
        },
        {
            title: "Add Nodes Sidebar & Frameworks",
            desc: "Screenshot 1 Breakdown:",
            items: [
                { label: "Node Selection Panel", text: "Expandable sidebar for adding components to the canvas using a simple search or category navigation." },
                { label: "Multi-Framework Support", text: "Tabs for LangChain, LlamaIndex, and Utilities to build diverse AI architectures." },
                { label: "Categorized Node Library", text: "Cleanly organized categories including Agents, Cache, Chains, Chat Models, Document Loaders, and Embeddings for quick drag-and-drop workflow assembly." }
            ],
            imageSrc: "/images/node.png"
        },
        {
            title: "Node Connection Flow",
            desc: "Screenshot 2 Breakdown: Here is the quick node-connection flow.",
            items: [
                { label: "Pdf File + Text Splitter ➔", text: "Splits Devxhub_Company_Profile.pdf into smaller text chunks." },
                { label: "Gemini Embedding ➔", text: "Converts document chunks into searchable vector data." },
                { label: "In-Memory Vector Store ➔", text: "Stores vectors and retrieves the top 6 relevant context chunks." },
                { label: "Google Gemini + Buffer Memory ➔", text: "Powers the chat engine (gemini-3-flash-preview) with conversation memory." },
                { label: "Conversational Retrieval QA Chain ➔", text: "Connects the LLM, Vector Retriever, and Memory into a complete RAG pipeline." }
            ],
            imageSrc: "/images/flow.png"
        },
        {
            title: "Real-time Playground Testing",
            desc: "Screenshot 3 Breakdown: Here is the quick breakdown for the test chatbot.",
            items: [
                { label: "Real-time Canvas Testing", text: "In-built test playground allowing instant verification of chatbot responses directly next to the node setup." },
                { label: "Accurate RAG Retrieval", text: "Demonstrates successful context search where the user asks \"where are office?\" and the bot retrieves exact office addresses (Bangladesh, USA, Finland) from the uploaded document." },
                { label: "Low-Latency Verification", text: "Confirms flow logic, vector search efficiency, and LLM output quality before publishing to the marketplace." }
            ],
            imageSrc: "/images/chatbot.png"
        },
        {
            title: "Chatbot Deployment & API Export",
            desc: "Screenshot 4 Breakdown: Here is the quick breakdown for the deployment popup.",
            items: [
                { label: "Instant Web Embedding", text: "Generates a ready-to-use <script> tag to paste directly into any website's HTML <body> for an immediate live chatbot widget." },
                { label: "Flexible Integration Options", text: "Provides multiple deployment methods including Embed, Python, JavaScript, cURL, and a Direct Share Link." },
                { label: "Configurable Security", text: "Includes authorization controls (No Authorization / API Key settings) to secure chatbot access." },
                { label: "Hosted Endpoint & Flow ID", text: "Automatically links the chatbot's unique ID (chatflow id) with the hosted API server (apiHost)." }
            ],
            imageSrc: "/images/embed.png"
        }
    ]
};

const ReleaseNotesPage = () => {
    return (
        <section className="relative min-h-screen overflow-hidden">
            <div className="relative z-10 py-20">
                <SectionContainer>
                    <div className="text-center">
                        <h1 className="section-title mb-4">
                            <span>Release</span> Notes
                        </h1>
                        <p className="section-subtitle mb-4">Version: {RELEASE_NOTES_DATA.version} | Released: {RELEASE_NOTES_DATA.date}</p>
                        <p className="w-full text-slate-300 text-lg mb-16 text-left">
                            {RELEASE_NOTES_DATA.overview}
                        </p>
                    </div>

                    <div className="space-y-24 text-slate-400">
                        {RELEASE_NOTES_DATA.sections.map((section) => (
                            <section key={section.title}>
                                <h2 className="text-3xl font-bold mb-6 text-white">{section.title}</h2>

                                {section.desc && <p className="mb-6">{section.desc}</p>}

                                {section.imageSrc ? (
                                    <div className="w-full relative h-[400px] md:h-[600px] mb-6 rounded-xl overflow-hidden border border-white/10 bg-white/5 py-8">
                                        <Image
                                            src={section.imageSrc}
                                            alt={section.title}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                ) : section.screenshotPlaceholder ? (
                                    <div className="w-full h-64 md:h-96 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6 border-dashed">
                                        <p className="text-slate-500 italic">
                                            [ Image Placeholder — {section.screenshotPlaceholder} ]
                                        </p>
                                    </div>
                                ) : null}

                                {section.items && (
                                    <ul className="space-y-4">
                                        {section.items.map((item) => (
                                            <li key={item.label}>
                                                <strong className="text-white">{item.label}:</strong> {item.text}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                            </section>
                        ))}

                        <section className="border-t border-white/10 pt-12">
                            <p>
                                Website:{" "}
                                <Link href="https://agents.devxhub.com/" target="_blank" className="text-primary underline">
                                    agents.devxhub.com
                                </Link>
                            </p>
                        </section>
                    </div>
                </SectionContainer>
            </div>
        </section>
    );
};

export default ReleaseNotesPage;
