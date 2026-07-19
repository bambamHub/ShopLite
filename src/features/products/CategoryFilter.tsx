interface CategoryFilterProps {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
}

export function CategoryFilter({ categories, value, onChange }: CategoryFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Filter by category"
      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none
        focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
    >
      <option value="all">All categories</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category.replace(/-/g, " ")}
        </option>
      ))}
    </select>
  );
}
