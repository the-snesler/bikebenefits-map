import { Marker } from 'react-map-gl/mapbox'

export default function UserMarker({ latitude, longitude }) {
  return (
    <Marker latitude={latitude} longitude={longitude} anchor="center">
      <div className="relative">
        {/* Pulse animation */}
        <div className="absolute -inset-3 bg-blue-400 rounded-full opacity-30 animate-ping" />
        {/* Main dot */}
        <div className="relative w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
      </div>
    </Marker>
  )
}
