/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in miles
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959 // Earth's radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return Math.round(distance * 10) / 10 // Round to 1 decimal place
}

function toRad(deg) {
  return deg * (Math.PI / 180)
}

/**
 * Format distance for display
 * @param {number} distance - Distance in miles
 * @returns {string} Formatted distance string
 */
export function formatDistance(distance) {
  if (distance < 0.1) {
    return '< 0.1 mi'
  }
  return `${distance} mi`
}

/**
 * Calculate bike time based on distance
 * @param {number} distance - Distance in miles
 * @returns {number} Time in minutes (5 min/mile)
 */
export function calculateBikeTime(distance) {
  return Math.round(distance * 7)
}

/**
 * Format bike time for display
 * @param {number} distance - Distance in miles
 * @returns {string} Formatted bike time string
 */
export function formatBikeTime(distance) {
  const minutes = calculateBikeTime(distance)
  if (minutes < 1) {
    return '< 1 min'
  }
  return `${minutes} min`
}
