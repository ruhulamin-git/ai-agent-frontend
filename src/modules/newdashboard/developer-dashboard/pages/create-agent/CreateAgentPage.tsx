"use client";

import Link from "next/link";

import { Breadcrumb } from "@/shared/ui/breadcrumb";

export const CreateAgentPage = () => {
  const breadcrumbItems = [{ label: "Create Agent", isActive: true }];

  const agentTypes = [
    {
      id: "manual",
      title: "Create Agent",
      icon: "✨",
      href: "/ai-builder/chatflows",
    },
  ];

  return (
    <div className="flex-1 p-4 lg:p-6 overflow-y-auto scrollbar-thin">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Choose how you want to create your AI agent</p>
      </div>

      {/* Agent Type Buttons */}
      <div className="w-72 mx-auto mt-20">
        {agentTypes.map((type) => (
          <Link key={type.id} href={type.href}>
            <button className="my-3 w-full text-left p-3 rounded-xl border border-gray-300 dark:border-white/10 hover:border-purple-500/30 bg-gray-100 dark:bg-gray-900/50 backdrop-blur-sm transition-all duration-300 group cursor-pointer">
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="w-14 h-14 rounded-lg border border-purple-500/20 shadow-lg flex items-center justify-center bg-gray-200 dark:bg-gray-800/50 group-hover:border-purple-500/40 transition-colors flex-shrink-0">
                  <span className="text-xl">{type.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {type.title}
                  </h3>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 dark:text-purple-400 text-xl group-hover:translate-x-2 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};
