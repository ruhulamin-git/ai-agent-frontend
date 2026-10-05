type TabType = "all" | "official" | "community" | "external";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  const tabs = [
    { id: "all" as const, label: "All Agents", count: null },
  ];

  return (
    <div className="flex gap-1 bg-gray-800/50 p-1 rounded-md backdrop-blur-sm border border-gray-700">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className="flex items-center gap-2 lg:px-4 px-3 py-1 rounded text-sm font-medium text-gray-300 cursor-default select-none"
        >
          <span>{tab.label}</span>
          {tab.count && (
            <span className=" px-2 py-0.5 bg-gray-600 text-xs rounded">{tab.count}</span>
          )}
        </div>
      ))}
    </div>
  );
};
