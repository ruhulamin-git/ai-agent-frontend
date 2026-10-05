import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DocPaginationItem } from "../types";

interface DocsPaginationProps {
  prev?: DocPaginationItem;
  next?: DocPaginationItem;
}

export const DocsPagination: React.FC<DocsPaginationProps> = ({ prev, next }) => {
  if (!prev && !next) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8 border-t border-gray-800">
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="group flex flex-col p-4 rounded-xl border border-gray-800/80 bg-gray-900/40 hover:bg-gray-900/80 hover:border-gray-700 transition-all"
        >
          <span className="flex items-center gap-1.5 text-xs text-gray-400 group-hover:text-teal-400 transition-colors mb-1">
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Previous</span>
          </span>
          <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="group flex flex-col items-end text-right p-4 rounded-xl border border-gray-800/80 bg-gray-900/40 hover:bg-gray-900/80 hover:border-gray-700 transition-all sm:col-start-2"
        >
          <span className="flex items-center gap-1.5 text-xs text-gray-400 group-hover:text-teal-400 transition-colors mb-1">
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
            {next.title}
          </span>
        </Link>
      ) : null}
    </div>
  );
};
