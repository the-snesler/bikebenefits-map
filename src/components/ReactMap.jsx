import { useRef, useCallback, useState, useEffect } from 'react'
import Map, { NavigationControl, Source, Layer } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import UserMarker from './UserMarker'
import BusinessMarker from './BusinessMarker'

// Madison, WI coordinates
const MADISON_CENTER = {
  latitude: 43.074761,
  longitude: -89.383761
}

export default function ReactMap({
  userLocation,
  businesses,
  selectedBusiness,
  onBusinessSelect,
  mapboxToken
}) {
  const mapRef = useRef(null)
  const [route, setRoute] = useState(null)

  // Fetch bike route when a business is selected
  useEffect(() => {
    if (!selectedBusiness || !userLocation) {
      setRoute(null)
      return
    }

    const fetchRoute = async () => {
      try {
        const start = `${userLocation.longitude},${userLocation.latitude}`
        const end = `${selectedBusiness.longitude},${selectedBusiness.latitude}`

        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/cycling/${start};${end}?geometries=geojson&access_token=${mapboxToken}`
        )

        if (!response.ok) throw new Error('Failed to fetch route')

        const data = await response.json()

        if (data.routes && data.routes[0]) {
          setRoute(data.routes[0].geometry)
        }
      } catch (error) {
        console.error('Error fetching route:', error)
        setRoute(null)
      }
    }

    fetchRoute()
  }, [selectedBusiness, userLocation, mapboxToken])

  const flyToLocation = useCallback((latitude, longitude) => {
    mapRef.current?.flyTo({
      center: [longitude, latitude],
      zoom: 15,
      duration: 1000
    })
  }, [])

  const handleBusinessClick = useCallback((business) => {
    onBusinessSelect(business)
    flyToLocation(parseFloat(business.latitude), parseFloat(business.longitude))
  }, [onBusinessSelect, flyToLocation])

  // Route line style
  const routeLayer = {
    id: 'route',
    type: 'line',
    paint: {
      'line-color': '#c5050c',
      'line-width': 4,
      'line-opacity': 0.8
    }
  }

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={mapboxToken}
      initialViewState={{
        latitude: userLocation?.latitude || MADISON_CENTER.latitude,
        longitude: userLocation?.longitude || MADISON_CENTER.longitude,
        zoom: 13
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
    >
      <NavigationControl position="top-right" />

      {/* Bike route */}
      {route && (
        <Source id="route" type="geojson" data={{
          type: 'Feature',
          properties: {},
          geometry: route
        }}>
          <Layer {...routeLayer} />
        </Source>
      )}

      {/* User location marker */}
      {userLocation && (
        <UserMarker
          latitude={userLocation.latitude}
          longitude={userLocation.longitude}
        />
      )}

      {/* Business markers */}
      {businesses.map(business => (
        <BusinessMarker
          key={business.id}
          business={business}
          isSelected={selectedBusiness?.id === business.id}
          onClick={() => handleBusinessClick(business)}
        />
      ))}
    </Map>
  )
}
