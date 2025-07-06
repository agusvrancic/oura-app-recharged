import { Category, FilterType } from '@/types/task';

interface CategoryTabsProps {
  categories: Category[];
  activeFilter: FilterType;
  activeCategory: string | null;
  onFilterChange: (filter: FilterType) => void;
  onCategoryChange: (categoryId: string | null) => void;
  onAddCategory: () => void;
}

export function CategoryTabs({
  categories,
  activeFilter,
  activeCategory,
  onFilterChange,
  onCategoryChange,
  onAddCategory
}: CategoryTabsProps) {
  const filterTabs: { key: FilterType; label: string }[] = [
    { key: 'All', label: 'All' },
    { key: 'Pending', label: 'Pending' },
    { key: 'Completed', label: 'Completed' }
  ];

  return (
    <div className="inline-flex justify-start items-start gap-4 mb-8">
      {/* Filter Tabs Group */}
      <div className="flex justify-start items-center gap-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              onFilterChange(tab.key);
              onCategoryChange(null);
            }}
            className={`px-4 py-1.5 rounded-[40px] flex justify-start items-center gap-2.5 transition-colors ${
              activeFilter === tab.key && !activeCategory
                ? 'bg-neutral-200'
                : ''
            }`}
          >
            <div className={`justify-start text-sm leading-tight font-['DM_Sans'] ${
              activeFilter === tab.key && !activeCategory
                ? 'text-black font-medium'
                : 'text-neutral-500 font-normal hover:text-black'
            }`}>
              {tab.label}
            </div>
          </button>
        ))}
      </div>

      {/* Vertical Divider */}
      <div className="h-6 w-px bg-neutral-200 self-center"></div>

      {/* Category Tabs */}
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => {
            onCategoryChange(category.id);
            onFilterChange('All');
          }}
          className={`px-4 py-1.5 rounded-[40px] flex justify-start items-center gap-1.5 transition-colors ${
            activeCategory === category.id
              ? 'bg-neutral-200'
              : ''
          }`}
        >
          {category.icon && (
            <span className="text-sm">{category.icon}</span>
          )}
          <div className={`justify-start text-sm leading-tight font-['DM_Sans'] ${
            activeCategory === category.id
              ? 'text-black font-medium'
              : 'text-neutral-500 font-normal hover:text-black'
          }`}>
            {category.name}
          </div>
        </button>
      ))}

      {/* Add Category Button */}
      <button
        onClick={onAddCategory}
        className="w-8 p-1.5 bg-zinc-100 rounded-xl flex justify-center items-center gap-2.5 hover:bg-zinc-200 transition-colors"
      >
        <div className="justify-start text-neutral-400 text-base font-normal font-['DM_Sans'] leading-tight hover:text-black">+</div>
      </button>
    </div>
  );
} 