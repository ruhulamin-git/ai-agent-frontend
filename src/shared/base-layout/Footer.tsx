"use client";

import Link from "next/link";
import React from "react";

import { GitHubIcon, LinkedInIcon, XIcon } from "@/shared/icons";
import { AgentKitLogo } from "@/shared/ui";
import { NeonBlobCursor } from "@/shared/ui/neon-blob-cursor";

export const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden border-t border-white/10 bg-slate-950">
      <NeonBlobCursor blobColor="#60a5fa" blobSize={300} intensity={0.3}>
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-10 md:pt-12 lg:pt-16 pb-6">
          {/* Main Footer Content */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-5 flex flex-col items-center md:items-start">
              <Link href="/" className="mb-6 hover:opacity-80 transition-opacity">
                <AgentKitLogo size="lg" />
              </Link>
              <p className="text-base text-slate-600 dark:text-slate-300 font-light leading-relaxed mb-8 max-w-md">
                The marketplace for AI agents. Where agents generate value.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
                <SocialIcon href="https://twitter.com" icon="x" />
                <SocialIcon href="https://linkedin.com" icon="linkedin" />
                <SocialIcon href="https://github.com" icon="github" />
              </div>
            </div>

            {/* Links Section */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10 lg:gap-12">
              <div className="flex flex-col">
                <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em] mb-6">
                  Product
                </h3>
                <ul className="space-y-3">
                  <FooterLink href="/marketplace">Marketplace</FooterLink>
                  <FooterLink href="/start-building">Start Building</FooterLink>
                </ul>
              </div>

              <div className="flex flex-col">
                <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em] mb-6">
                  Support
                </h3>
                <ul className="space-y-3">
                  <FooterLink href="/docs">Documentation</FooterLink>
                  <FooterLink href="/release-notes">Release Notes</FooterLink>
                  <FooterLink href="/contact">Contact Us</FooterLink>
                </ul>
              </div>

              <div className="flex flex-col col-span-2 md:col-span-1">
                <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em] mb-6">
                  Legal
                </h3>
                <ul className="space-y-3">
                  <FooterLink href="/privacy">Privacy Policy</FooterLink>
                  <FooterLink href="/terms">Terms of Service</FooterLink>
                </ul>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-center items-center ">
            <p className="text-sm text-slate-300 font-light">
              © {new Date().getFullYear()} AgentKit. Building the future of intelligent systems.
            </p>

            {/* Status Badge */}
            {/* <div className="glass-panel-footer rounded-full px-4 py-2 flex items-center gap-2.5">
              <div className="relative flex size-2">
                <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <div className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                All Systems Operational
              </span>
            </div> */}
          </div>
        </div>
      </NeonBlobCursor>
    </footer>
  );
};

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <Link
      href={href}
      className="text-slate-300 hover:text-white transition-colors duration-200 text-sm block w-fit hover:underline underline-offset-3"
    >
      {children}
    </Link>
  </li>
);

interface SocialIconProps {
  href: string;
  icon: "x" | "linkedin" | "github";
}

const SocialIcon = ({ href, icon }: SocialIconProps) => {
  const IconComponent = {
    x: XIcon,
    linkedin: LinkedInIcon,
    github: GitHubIcon,
  }[icon];

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Follow us on ${icon}`}
      className="w-10 h-10 rounded-md bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-primary/20 hover:border-black/20 dark:hover:border-primary/40 transition-all duration-300 group"
    >
      <IconComponent className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
    </Link>
  );
};
