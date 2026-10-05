"use client";

interface FooterProps {
  className?: string;
}

export const Footer = ({ className = "" }: FooterProps) => {
  return (
    <div className={`bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-3 px-3 ${className}`}>
      <div className="flex items-center justify-center">
        <div className="text-xs text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} AI Agents Platform. All rights reserved.</div>
      </div>
    </div>
  );
};
