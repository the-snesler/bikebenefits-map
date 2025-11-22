import { useRef, useCallback, useState, useEffect, useMemo } from 'react'
import ReactMap, {
  NavigationControl,
  Source,
  Layer,
} from "react-map-gl/mapbox";
import 'mapbox-gl/dist/mapbox-gl.css'
import UserMarker from "./UserMarker";
import { Locate } from "lucide-react";

// Madison, WI coordinates
const MADISON_CENTER = {
  latitude: 43.074761,
  longitude: -89.383761,
};

function useMapImage({ mapRef, url, name }) {
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();

      map.loadImage(url, (error, image) => {
        if (error) throw error;
        if (!map.hasImage(name)) map.addImage(name, image);
      });
    }
  }, [mapRef.current]);
}

export default function Map({
  userLocation,
  businesses,
  businessesGeoJSON,
  selectedBusiness,
  onBusinessSelect,
  mapboxToken,
}) {
  const mapRef = useRef(null);
  const [route, setRoute] = useState(null);
  const hasZoomedToUser = useRef(false);

  // Update GeoJSON to mark selected business
  const updatedGeoJSON = useMemo(() => {
    if (!businessesGeoJSON) return businessesGeoJSON;

    return {
      ...businessesGeoJSON,
      features: businessesGeoJSON.features.map((feature) => ({
        ...feature,
        properties: {
          ...feature.properties,
          isSelected: selectedBusiness?.id === feature.properties.id,
        },
      })),
    };
  }, [businessesGeoJSON, selectedBusiness]);
  useMapImage({ mapRef, url: "/bike-icon.png", name: "bike-icon" });

  // Zoom to user location when available
  useEffect(() => {
    if (userLocation && !hasZoomedToUser.current) {
      mapRef.current?.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 14,
        duration: 1500,
      });
      hasZoomedToUser.current = true;
    }
  }, [userLocation]);

  // Fetch bike route when a business is selected
  useEffect(() => {
    if (!selectedBusiness || !userLocation) {
      setRoute(null);
      return;
    }

    // Don't show route for businesses more than 10 miles away
    if (selectedBusiness.distance !== null && selectedBusiness.distance > 10) {
      setRoute(null);
      return;
    }

    const fetchRoute = async () => {
      try {
        const start = `${userLocation.longitude},${userLocation.latitude}`;
        const end = `${selectedBusiness.longitude},${selectedBusiness.latitude}`;

        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/cycling/${start};${end}?geometries=geojson&access_token=${mapboxToken}`
        );

        if (!response.ok) throw new Error("Failed to fetch route");

        const data = await response.json();

        if (data.routes && data.routes[0]) {
          setRoute(data.routes[0].geometry);
        }
      } catch (error) {
        console.error("Error fetching route:", error);
        setRoute(null);
      }
    };

    fetchRoute();
  }, [selectedBusiness, userLocation, mapboxToken]);

  const flyToLocation = useCallback((latitude, longitude) => {
    mapRef.current?.flyTo({
      center: [longitude, latitude],
      zoom: 15,
      duration: 1000,
    });
  }, []);

  const handleRecenter = useCallback(() => {
    if (userLocation) {
      mapRef.current?.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 14,
        duration: 1000,
      });
    }
  }, [userLocation]);

  // Handle click on business marker
  const handleMapClick = useCallback(
    (event) => {
      const features = event.features;
      if (!features || features.length === 0) return;

      const clickedFeature = features[0];
      const businessId = clickedFeature.properties.id;

      // Find the business in the array
      const business = businesses.find((b) => b.id === businessId);
      if (business) {
        onBusinessSelect(business);
        flyToLocation(
          parseFloat(business.latitude),
          parseFloat(business.longitude)
        );
      }
    },
    [businesses, onBusinessSelect, flyToLocation]
  );

  // Route line style
  const routeLayer = {
    id: "route",
    type: "line",
    paint: {
      "line-color": "#c5050c",
      "line-width": 4,
      "line-opacity": 0.8,
    },
  };

  // Business markers symbol layer
  const businessLayer = {
    id: "businesses",
    type: "symbol",
    layout: {
      "icon-image": "bike-icon",
      "icon-size": ["case", ["get", "isSelected"], 0.9, 0.6],
      "icon-anchor": "bottom",
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
    },
  };

  return (
    <ReactMap
      ref={mapRef}
      mapboxAccessToken={mapboxToken}
      initialViewState={{
        latitude: MADISON_CENTER.latitude,
        longitude: MADISON_CENTER.longitude,
        zoom: 11,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      interactiveLayerIds={["businesses"]}
      onClick={handleMapClick}
    >
      <NavigationControl position="top-right" />

      {/* Recenter button */}
      {userLocation && (
        <button
          onClick={handleRecenter}
          className="absolute top-[120px] right-2.5 w-[29px] h-[29px] bg-white rounded flex items-center justify-center shadow cursor-pointer hover:bg-gray-100"
          title="Center on my location"
          aria-label="Center on my location"
        >
          <Locate className="w-4 h-4 text-gray-700" strokeWidth={4} />
        </button>
      )}

      {/* Bike route */}
      {route && (
        <Source
          id="route"
          type="geojson"
          data={{
            type: "Feature",
            properties: {},
            geometry: route,
          }}
        >
          <Layer {...routeLayer} />
        </Source>
      )}

      {/* Business markers as symbol layer */}
      {updatedGeoJSON && (
        <Source id="businesses" type="geojson" data={updatedGeoJSON}>
          <Layer {...businessLayer} />
        </Source>
      )}

      {/* User location marker */}
      {userLocation && (
        <UserMarker
          latitude={userLocation.latitude}
          longitude={userLocation.longitude}
        />
      )}
    </ReactMap>
  );
}
