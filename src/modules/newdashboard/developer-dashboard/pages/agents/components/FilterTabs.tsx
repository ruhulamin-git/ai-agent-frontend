interface FilterTabsProps {
  activeFilter: "all" | "published" | "draft";
  setActiveFilter: (filter: "all" | "published" | "draft") => void;
  stats: {
    total: number;
    published: number;
    draft: number;
  };
}

export const FilterTabs = ({ activeFilter, setActiveFilter, stats }: FilterTabsProps) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setActiveFilter("all")}
        className={`px-4 py-2 cursor-pointer rounded text-sm font-medium transition-colors ${
          activeFilter === "all"
            ? "text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800/90"
            : "border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/20"
        }`}
      >
        All Agents ({stats.total})
      </button>
      <button
        onClick={() => setActiveFilter("published")}
        className={`px-4 py-2 cursor-pointer rounded text-sm font-medium transition-colors ${
          activeFilter === "published"
            ? "text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800/90"
            : "border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/20"
        }`}
      >
        Published ({stats.published})
      </button>
      <button
        onClick={() => setActiveFilter("draft")}
        className={`px-4 py-2 cursor-pointer rounded text-sm font-medium transition-colors ${
          activeFilter === "draft"
            ? "text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800/90"
            : "border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/20"
        }`}
      >
        Draft ({stats.draft})
      </button>
    </div>
  );
};
