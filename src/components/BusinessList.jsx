import { useMemo, useEffect, useRef } from 'react'
import BusinessCard from './BusinessCard'
import CategoryFilter from './CategoryFilter'

export default function BusinessList({
  businesses,
  selectedBusiness,
  onBusinessSelect,
  selectedCategory,
  onCategoryChange,
  loading,
  error
}) {
  const cardRefs = useRef({})

  // Filter businesses by category
  const filteredBusinesses = useMemo(() => {
    if (!selectedCategory) return businesses
    return businesses.filter(b => b.category?.id === selectedCategory)
  }, [businesses, selectedCategory])

  // Scroll to selected business when it changes
  useEffect(() => {
    if (selectedBusiness && cardRefs.current[selectedBusiness.id]) {
      cardRefs.current[selectedBusiness.id].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }, [selectedBusiness])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-10 h-10 border-4 border-surface-700 border-t-primary-500 rounded-full animate-spin" />
        <p className="mt-4 text-sm text-gray-400">Loading businesses...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-primary-500 font-medium">Failed to load businesses</p>
        <p className="text-sm text-gray-400 mt-2">{error}</p>
      </div>
    )
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No businesses found</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">
        Nearby Businesses
        <span className="ml-2 text-sm font-normal text-gray-400">
          ({filteredBusinesses.length})
        </span>
      </h2>

      <CategoryFilter
        businesses={businesses}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />

      <div>
        {filteredBusinesses.map(business => (
          <div
            key={business.id}
            ref={el => cardRefs.current[business.id] = el}
          >
            <BusinessCard
              business={business}
              isSelected={selectedBusiness?.id === business.id}
              onClick={() => onBusinessSelect(business)}
            />
          </div>
        ))}

        {filteredBusinesses.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No businesses in this category</p>
          </div>
        )}
      </div>
    </div>
  )
}
