import { useState, useEffect, useMemo } from 'react'
import { calculateDistance } from '../utils/distance'

const API_URL = "https://bicyclebenefits.org/members";

export function useBusinesses(userLocation) {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        setLoading(true)
        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setBusinesses(data.members || [])
        setError(null)
      } catch (err) {
        setError(err.message)
        setBusinesses([])
      } finally {
        setLoading(false)
      }
    }

    fetchBusinesses()
  }, [])

  // Calculate distances and sort businesses
  const sortedBusinesses = useMemo(() => {
    if (!businesses.length) return []

    return businesses
      .map(business => {
        let distance = null

        if (userLocation && business.latitude && business.longitude) {
          distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            parseFloat(business.latitude),
            parseFloat(business.longitude)
          )
        }

        return {
          ...business,
          distance
        }
      })
      .sort((a, b) => {
        // Sort by distance if available, otherwise by name
        if (a.distance !== null && b.distance !== null) {
          return a.distance - b.distance
        }
        if (a.distance !== null) return -1
        if (b.distance !== null) return 1
        return a.name.localeCompare(b.name)
      })
  }, [businesses, userLocation])

  // Convert to GeoJSON for map rendering
  const businessesGeoJSON = useMemo(() => {
    if (!sortedBusinesses.length) {
      return {
        type: 'FeatureCollection',
        features: []
      }
    }

    return {
      type: 'FeatureCollection',
      features: sortedBusinesses
        .filter(b => b.latitude && b.longitude)
        .map(business => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [parseFloat(business.longitude), parseFloat(business.latitude)]
          },
          properties: {
            id: business.id,
            name: business.name,
            distance: business.distance,
            isSelected: false // Will be updated by map component
          }
        }))
    }
  }, [sortedBusinesses])

  return { businesses: sortedBusinesses, businessesGeoJSON, loading, error }
}
