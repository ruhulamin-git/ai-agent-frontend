import type { Category } from "../service/type";

// Define types inline for design-only version
type FilterState = {
  tab: "all" | "official" | "community" | "external";
  pricing: "all" | "free" | "freemium" | "premium";
  category: string;
  search: string;
};

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  categories: Category[];
}

export const FilterSidebar = ({ filters, onFiltersChange, categories }: FilterSidebarProps) => {
  return (
    <div className="border rounded-xl p-6 space-y-6 bg-gray-900/50 border-white/10 ">
      {/* Pricing Filter */}
      <div>
        <h3 className="text-white font-semibold mb-4">Pricing</h3>
        <div className="space-y-3">
          {[
            { value: "all", label: "All pricing" },
            { value: "free", label: "Free" },
            { value: "freemium", label: "Freemium" },
            { value: "premium", label: "Premium" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 text-gray-300 cursor-pointer hover:text-white transition-colors"
            >
              <input
                type="radio"
                name="pricing"
                value={option.value}
                checked={filters.pricing === option.value}
                onChange={(e) =>
                  onFiltersChange({ pricing: e.target.value as FilterState["pricing"] })
                }
                className="w-4 h-4 text-primary bg-gray-700 border-gray-600 focus:outline-none"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories Filter */}
      <div>
        <h3 className="text-white font-semibold mb-4 ">Categories</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-gray-300 cursor-pointer hover:text-white transition-colors">
            <input
              type="radio"
              name="category"
              value=""
              checked={filters.category === ""}
              onChange={() => onFiltersChange({ category: "" })}
              className="w-4 h-4 text-primary bg-gray-700 border-gray-600 focus:outline-none"
            />
            <span className="text-sm">All categories</span>
          </label>
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 text-gray-300 cursor-pointer hover:text-white transition-colors"
            >
              <input
                type="radio"
                name="category"
                value={category.slug}
                checked={filters.category === category.slug}
                onChange={(e) => onFiltersChange({ category: e.target.value })}
                className="w-4 h-4 text-primary bg-gray-700 border-gray-600 focus:outline-none"
              />
              <div className="flex items-center gap-2">
                {category.icon && <span className="text-sm">{category.icon}</span>}
                <span className="text-sm">{category.name}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
