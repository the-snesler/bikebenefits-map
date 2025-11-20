import { useState } from 'react'
import Map from './components/ReactMap'
import BottomSheet from './components/BottomSheet'
import BusinessList from './components/BusinessList'
import { useGeolocation } from './hooks/useGeolocation'
import { useBusinesses } from './hooks/useBusinesses'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

function App() {
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const { location: userLocation, error: locationError, loading: locationLoading } = useGeolocation()
  const { businesses, loading: businessesLoading, error: businessesError } = useBusinesses(userLocation)

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-full flex items-center justify-center bg-surface-950 p-6">
        <div className="bg-surface-900 rounded-xl shadow-lg p-8 max-w-md text-center border border-surface-700">
          <h1 className="text-xl font-bold text-primary-500 mb-3">Missing Mapbox Token</h1>
          <p className="text-gray-300 mb-5">
            Please add your Mapbox access token to the environment variables.
          </p>
          <code className="block bg-surface-800 p-4 rounded-lg text-sm text-left text-gray-300 font-mono">
            VITE_MAPBOX_TOKEN=your_token_here
          </code>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full relative bg-surface-950">
      {/* Location warning banner */}
      {locationError && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-surface-800 border-b border-surface-700 px-5 py-3">
          <p className="text-sm text-gray-300">
            {locationError}. Showing default location.
          </p>
        </div>
      )}

      {/* Map */}
      <Map
        userLocation={userLocation}
        businesses={businesses}
        selectedBusiness={selectedBusiness}
        onBusinessSelect={setSelectedBusiness}
        mapboxToken={MAPBOX_TOKEN}
      />

      {/* Bottom Sheet with Business List */}
      <BottomSheet>
        <BusinessList
          businesses={businesses}
          selectedBusiness={selectedBusiness}
          onBusinessSelect={setSelectedBusiness}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          loading={businessesLoading}
          error={businessesError}
        />
      </BottomSheet>
    </div>
  )
}

export default App
