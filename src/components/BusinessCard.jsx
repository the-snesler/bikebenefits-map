import { formatBikeTime } from '../utils/distance'

export default function BusinessCard({ business, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-5 rounded-xl mb-4
        transition-all duration-200
        ${isSelected
          ? 'bg-surface-700 border-2 border-primary-500 shadow-lg'
          : 'bg-surface-800 border-2 border-transparent hover:bg-surface-700'
        }
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0 pr-3">
          <h3 className="font-semibold text-white text-lg truncate">
            {business.name}
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {business.category?.name || 'Business'}
          </p>
        </div>
        {business.distance !== null && (
          <span className="text-sm font-medium text-primary-500 whitespace-nowrap flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.3zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"/>
            </svg>
            {formatBikeTime(business.distance)}
          </span>
        )}
      </div>

      {/* Discount */}
      <div className="bg-primary-500/20 text-primary-400 rounded-lg px-4 py-3 mb-4">
        <p className="text-sm font-medium">{business.discount}</p>
      </div>

      {/* Details */}
      <div className="text-sm text-gray-300">
        <p className="truncate">{business.address}</p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mt-4">
        {business.stickers_available === 1 && (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
            Stickers
          </span>
        )}
        {business.air_pump === 1 && (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300">
            Air Pump
          </span>
        )}
        {business.web && (
          <a
            href={business.web}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-surface-700 text-gray-300 hover:bg-surface-600"
            onClick={(e) => e.stopPropagation()}
          >
            Website
          </a>
        )}
      </div>
    </button>
  )
}
