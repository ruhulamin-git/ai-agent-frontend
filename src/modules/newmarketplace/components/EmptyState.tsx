interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({ title, description, icon = "🔍", action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center mb-6">
        <span className="text-4xl">{icon}</span>
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-center max-w-md mb-6">{description}</p>

      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-primary/20 hover:bg-primary/30 border border-primary/30 hover:border-primary/50 rounded-lg text-white font-medium transition-all duration-300"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
