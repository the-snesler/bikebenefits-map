import { useState } from 'react'
import Map from "./components/Map";
import BottomSheet from './components/BottomSheet'
import BusinessList from './components/BusinessList'
import { useGeolocation } from './hooks/useGeolocation'
import { useBusinesses } from './hooks/useBusinesses'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

function App() {
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showInfo, setShowInfo] = useState(false);
  const {
    location: userLocation,
    error: locationError,
    loading: locationLoading,
  } = useGeolocation();
  const {
    businesses,
    businessesGeoJSON,
    loading: businessesLoading,
    error: businessesError,
  } = useBusinesses(userLocation);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-full flex items-center justify-center bg-surface-950 p-6">
        <div className="bg-surface-900 rounded-xl shadow-lg p-8 max-w-md text-center border border-surface-700">
          <h1 className="text-xl font-bold text-primary-500 mb-3">
            Missing Mapbox Token
          </h1>
          <p className="text-gray-300 mb-5">
            Please add your Mapbox access token to the environment variables.
          </p>
          <code className="block bg-surface-800 p-4 rounded-lg text-sm text-left text-gray-300 font-mono">
            VITE_MAPBOX_TOKEN=your_token_here
          </code>
        </div>
      </div>
    );
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
        businessesGeoJSON={businessesGeoJSON}
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
          onShowInfo={() => setShowInfo(true)}
        />
      </BottomSheet>

      {/* Info Modal */}
      {showInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setShowInfo(false)}
        >
          <div
            className="bg-surface-900 rounded-xl shadow-xl max-w-sm w-full p-6 border border-surface-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-white mb-4">
              What is Bike Benefits?
            </h2>
            <p className="text-gray-300 mb-4">
              Discounts for riding your bike at businesses throughout the U.S.
            </p>
            <p className="text-gray-400 text-sm mb-6">
              To participate, get a Bike Benefits sticker for your helmet from
              any participating business. Then show your stickered helmet when
              you ride to get discounts!
            </p>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-lg transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App
