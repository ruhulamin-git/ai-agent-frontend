"use client";

interface FilterTabsProps {
  activeFilter: "all" | "active" | "pending" | "cancelled";
  onFilterChange: (filter: "all" | "active" | "pending" | "cancelled") => void;
  agents: any[];
}

export const FilterTabs = ({ activeFilter, onFilterChange, agents }: FilterTabsProps) => {
  const filters = [
    { key: "all", label: "All Agents", count: agents.length },
    {
      key: "active",
      label: "Active",
      count: agents.filter((a) => a.status === "active").length,
    },
    {
      key: "pending",
      label: "Pending",
      count: agents.filter((a) => a.status === "pending").length,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      count: agents.filter((a) => a.status === "cancelled").length,
    },
  ];

  return (
    <div className="flex gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key as any)}
          className={`px-4 py-2 cursor-pointer rounded text-sm font-medium transition-colors ${
            activeFilter === filter.key
              ? "text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800/90"
              : "border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/20"
          }`}
        >
          {filter.label} ({filter.count})
        </button>
      ))}
    </div>
  );
};
