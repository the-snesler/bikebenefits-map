import { useMemo, useEffect, useRef, useState } from 'react'
import BusinessCard from './BusinessCard'
import CategoryFilter from './CategoryFilter'

export default function BusinessList({
  businesses,
  selectedBusiness,
  onBusinessSelect,
  selectedCategory,
  onCategoryChange,
  loading,
  error,
  onShowInfo
}) {
  const cardRefs = useRef({})
  const [searchQuery, setSearchQuery] = useState('')

  // Filter businesses by category, distance, and search query
  const filteredBusinesses = useMemo(() => {
    let filtered = businesses

    // Filter by distance (within 10 miles, or selected business)
    filtered = filtered.filter(b => {
      // Always include selected business
      if (selectedBusiness && b.id === selectedBusiness.id) return true
      // Include if within 10 miles (or no distance calculated yet)
      return b.distance === null || b.distance <= 10
    })

    // Filter by category if selected
    if (selectedCategory) {
      filtered = filtered.filter(b => b.category?.id === selectedCategory)
    }

    // Filter by search query (case-insensitive, matches name, address, category, discount)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      filtered = filtered.filter(b =>
        b.name?.toLowerCase().includes(q) ||
        b.address?.toLowerCase().includes(q) ||
        b.category?.name?.toLowerCase().includes(q) ||
        b.discount?.toLowerCase().includes(q)
      )
    }

    return filtered
  }, [businesses, selectedCategory, selectedBusiness, searchQuery])

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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">
          Nearby Businesses
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({filteredBusinesses.length})
          </span>
        </h2>
        <button
          onClick={onShowInfo}
          className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
        >
          What is this?
        </button>
      </div>

      <div className="relative mb-3">
        <input
          type="search"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search businesses..."
          className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-2 pr-9 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

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
            <p className="text-gray-400">
              {searchQuery.trim()
                ? `No businesses match "${searchQuery.trim()}"`
                : 'No businesses in this category'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
