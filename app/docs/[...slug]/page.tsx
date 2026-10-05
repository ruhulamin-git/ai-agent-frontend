import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getDocBySlug, getDocPagination, extractTOC, getAllDocs } from "@/modules/docs/data/docsData";
import { DocsContent } from "@/modules/docs/components/DocsContent";
import { DocsTOC } from "@/modules/docs/components/DocsTOC";
import { DocsPagination } from "@/modules/docs/components/DocsPagination";

interface DocPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  const docs = getAllDocs();
  return docs.map((doc) => ({
    slug: doc.slug.split("/"),
  }));
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug.join("/");
  const doc = getDocBySlug(slugPath);

  if (!doc) {
    return {
      title: "Document Not Found | Documentation",
    };
  }

  return {
    title: `${doc.title} - AI Agent Platform Docs`,
    description: doc.description,
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const slugPath = slug.join("/");
  const doc = getDocBySlug(slugPath);

  if (!doc) {
    notFound();
  }

  const toc = extractTOC(doc.content);
  const pagination = getDocPagination(doc.slug);

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 justify-between">
      {/* Article Content & Pagination */}
      <div className="flex-1 min-w-0">
        <DocsContent doc={doc} />
        <DocsPagination prev={pagination.prev} next={pagination.next} />
      </div>

      {/* Right Column: Sticky Table of Contents (Desktop) */}
      {toc.length > 0 && (
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pl-4 border-l border-gray-800/80">
            <DocsTOC toc={toc} />
          </div>
        </aside>
      )}
    </div>
  );
}
