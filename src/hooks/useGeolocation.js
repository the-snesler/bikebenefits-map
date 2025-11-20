import { useState, useEffect } from 'react'

export function useGeolocation() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setLoading(false)
      return
    }

    const successHandler = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      })
      setLoading(false)
      setError(null)
    }

    const errorHandler = (error) => {
      let errorMessage
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location permission denied'
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information unavailable'
          break
        case error.TIMEOUT:
          errorMessage = 'Location request timed out'
          break
        default:
          errorMessage = 'An unknown error occurred'
      }
      setError(errorMessage)
      setLoading(false)
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, options)

    // Watch for position updates
    const watchId = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      options
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  return { location, error, loading }
}
