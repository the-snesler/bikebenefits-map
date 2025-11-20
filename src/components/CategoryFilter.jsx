import { useMemo } from 'react'

export default function CategoryFilter({ businesses, selectedCategory, onCategoryChange }) {
  // Extract unique categories from businesses
  const categories = useMemo(() => {
    const categoryMap = new Map()

    businesses.forEach(business => {
      if (business.category) {
        categoryMap.set(business.category.id, business.category.name)
      }
    })

    return Array.from(categoryMap.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [businesses])

  return (
    <div className="mb-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => onCategoryChange(null)}
          className={`
            flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium
            transition-all duration-200
            ${selectedCategory === null
              ? 'bg-primary-500 text-white'
              : 'bg-surface-800 text-gray-300 hover:bg-surface-700'
            }
          `}
        >
          All
        </button>

        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-200
              ${selectedCategory === category.id
                ? 'bg-primary-500 text-white'
                : 'bg-surface-800 text-gray-300 hover:bg-surface-700'
              }
            `}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}
