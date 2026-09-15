const { LOGISTICS_RATES, selectDefaultVehicle } = require("../config/logisticsRates");

/**
 * FarmOS Smart Freight Logistics Service
 * 
 * Provides geocoding, road routing via OpenRouteService, in-memory caching,
 * and freight transport cost estimation for agricultural harvests.
 */

// In-memory caches for routing and geocoding
const routeCache = new Map();
const geocodeCache = new Map();
const ROUTE_CACHE_TTL_MS = 60 * 60 * 1000; // 1 Hour TTL

// Known static coordinates lookup for major West Bengal APMCs & Districts
const KNOWN_COORDINATES = {
  // Districts / Cities
  "kolkata": { lat: 22.5726, lon: 88.3639 },
  "west bengal": { lat: 22.5726, lon: 88.3639 },
  "howrah": { lat: 22.5958, lon: 88.2636 },
  "birbhum": { lat: 23.8400, lon: 87.6200 },
  "suri": { lat: 23.9100, lon: 87.5300 },
  "nadia": { lat: 23.4700, lon: 88.5500 },
  "krishnanagar": { lat: 23.4000, lon: 88.5000 },
  "hooghly": { lat: 22.9000, lon: 88.3900 },
  "paschim bardhaman": { lat: 23.6800, lon: 86.9800 },
  "purba bardhaman": { lat: 23.2324, lon: 87.8615 },
  "bardhaman": { lat: 23.2324, lon: 87.8615 },
  "durgapur": { lat: 23.5204, lon: 87.3119 },
  "asansol": { lat: 23.6889, lon: 86.9661 },
  "bankura": { lat: 23.2313, lon: 87.0784 },
  "jalpaiguri": { lat: 26.5404, lon: 88.7194 },
  "siliguri": { lat: 26.7271, lon: 88.3953 },
  "darjeeling": { lat: 27.0410, lon: 88.2663 },
  "north 24 parganas": { lat: 22.7200, lon: 88.4800 },
  "barasat": { lat: 22.7200, lon: 88.4800 },
  "south 24 parganas": { lat: 22.4200, lon: 88.4000 },
  "malda": { lat: 25.0000, lon: 88.1400 },
  "murshidabad": { lat: 24.1800, lon: 88.2700 },

  // Mandis
  "birbhum apmc": { lat: 23.9100, lon: 87.5300 },
  "uluberia apmc": { lat: 22.4700, lon: 88.1100 },
  "ramkrishanpur(howrah) apmc": { lat: 22.5800, lon: 88.3400 },
  "karimpur apmc": { lat: 23.9700, lon: 88.6200 },
  "barasat apmc": { lat: 22.7200, lon: 88.4800 },
  "ranaghat apmc": { lat: 23.1800, lon: 88.5800 },
  "champadanga apmc": { lat: 22.8300, lon: 87.9600 },
  "durgapur apmc": { lat: 23.5204, lon: 87.3119 },
  "memari apmc": { lat: 23.1800, lon: 88.1100 },
  "bankura sadar apmc": { lat: 23.2313, lon: 87.0784 },
  "indus(bankura sadar) apmc": { lat: 23.0200, lon: 87.6300 },
  "bishnupur(bankura) apmc": { lat: 23.0700, lon: 87.3200 },
  "belacoba apmc": { lat: 26.6000, lon: 88.5800 },
  "moynaguri apmc": { lat: 26.5600, lon: 88.8200 },
  "kaliaganj apmc": { lat: 25.6300, lon: 88.3200 },
  "habra apmc": { lat: 22.8300, lon: 88.6300 },
  "karsiyang(matigara) apmc": { lat: 26.7100, lon: 88.3800 }
};

/**
 * Haversine formula to compute straight-line geographical distance between two lat/lon points
 */
const haversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Geocode location query string or coordinates object to { latitude, longitude }
 */
const geocodeLocation = async (locationQuery) => {
  if (!locationQuery) return null;

  // If already an object with lat/lon
  if (typeof locationQuery === "object") {
    const lat = parseFloat(locationQuery.latitude || locationQuery.lat);
    const lon = parseFloat(locationQuery.longitude || locationQuery.lon);
    if (!isNaN(lat) && !isNaN(lon)) {
      return { latitude: lat, longitude: lon };
    }
  }

  const queryStr = String(locationQuery).trim().toLowerCase();
  if (!queryStr) return null;

  // 1. Check known coordinates dictionary
  if (KNOWN_COORDINATES[queryStr]) {
    return {
      latitude: KNOWN_COORDINATES[queryStr].lat,
      longitude: KNOWN_COORDINATES[queryStr].lon
    };
  }

  // Check substring matches in known dictionary
  for (const [key, coords] of Object.entries(KNOWN_COORDINATES)) {
    if (queryStr.includes(key) || key.includes(queryStr)) {
      return { latitude: coords.lat, longitude: coords.lon };
    }
  }

  // 2. Check in-memory geocode cache
  if (geocodeCache.has(queryStr)) {
    return geocodeCache.get(queryStr);
  }

  // 3. Optional OpenRouteService / Nominatim Geocoding API fetch
  const apiKey = process.env.OPENROUTESERVICE_API_KEY;
  if (apiKey) {
    try {
      const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(queryStr)}&size=1`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.features && json.features.length > 0) {
          const coords = json.features[0].geometry.coordinates; // [lon, lat]
          const result = { latitude: coords[1], longitude: coords[0] };
          geocodeCache.set(queryStr, result);
          return result;
        }
      }
    } catch (err) {
      console.warn("OpenRouteService geocoding failed, using fallback:", err.message);
    }
  }

  return null;
};

/**
 * Compute road distance & duration between origin and destination coordinates
 */
const getRoadRoute = async (originCoords, destCoords) => {
  if (!originCoords || !destCoords) return null;

  const originLat = parseFloat(originCoords.latitude || originCoords.lat);
  const originLon = parseFloat(originCoords.longitude || originCoords.lon);
  const destLat = parseFloat(destCoords.latitude || destCoords.lat);
  const destLon = parseFloat(destCoords.longitude || destCoords.lon);

  if (isNaN(originLat) || isNaN(originLon) || isNaN(destLat) || isNaN(destLon)) {
    return null;
  }

  const cacheKey = `${originLat.toFixed(2)}_${originLon.toFixed(2)}_${destLat.toFixed(2)}_${destLon.toFixed(2)}`;
  const now = Date.now();

  // Check in-memory route cache
  if (routeCache.has(cacheKey)) {
    const cached = routeCache.get(cacheKey);
    if (now - cached.timestamp < ROUTE_CACHE_TTL_MS) {
      return cached.data;
    }
  }

  const apiKey = process.env.OPENROUTESERVICE_API_KEY;

  // Attempt OpenRouteService Directions API call if API key is present
  if (apiKey) {
    try {
      const url = "https://api.openrouteservice.org/v2/directions/driving-car";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": apiKey
        },
        body: JSON.stringify({
          coordinates: [
            [originLon, originLat],
            [destLon, destLat]
          ]
        })
      });

      if (response.ok) {
        const json = await response.json();
        if (json.routes && json.routes.length > 0) {
          const summary = json.routes[0].summary;
          const distanceKm = parseFloat((summary.distance / 1000).toFixed(1));
          const durationMins = Math.round(summary.duration / 60);

          const routeResult = {
            distance_km: distanceKm,
            duration_minutes: durationMins,
            source: "OpenRouteService Road Routing",
            is_fallback: false
          };

          routeCache.set(cacheKey, { timestamp: now, data: routeResult });
          return routeResult;
        }
      }
    } catch (err) {
      console.warn("OpenRouteService routing failed, falling back to Haversine estimation:", err.message);
    }
  }

  // Fallback: Haversine geographical road distance estimation (1.35x road factor)
  const straightLineKm = haversineDistanceKm(originLat, originLon, destLat, destLon);
  const estimatedRoadKm = parseFloat((straightLineKm * 1.35).toFixed(1));
  const estimatedDurationMins = Math.max(15, Math.round((estimatedRoadKm / 40) * 60)); // 40 km/h avg truck speed

  const fallbackResult = {
    distance_km: estimatedRoadKm,
    duration_minutes: estimatedDurationMins,
    source: "Geographical Road Estimation Model",
    is_fallback: true
  };

  routeCache.set(cacheKey, { timestamp: now, data: fallbackResult });
  return fallbackResult;
};

/**
 * Calculate Freight Estimation metrics based on distance, weight, and vehicle category
 */
const calculateFreight = (distanceKm, durationMinutes, quantityKg, requestedVehicleType = "") => {
  const qty = Math.max(1, Number(quantityKg) || 500);
  const dist = Math.max(1, Number(distanceKm) || 1);

  // Auto-select vehicle if not specified or invalid
  const vehicleKey = (requestedVehicleType && LOGISTICS_RATES[requestedVehicleType])
    ? requestedVehicleType
    : selectDefaultVehicle(qty);

  const vehicleConfig = LOGISTICS_RATES[vehicleKey];

  // Calculate required number of vehicles
  const vehiclesRequired = Math.ceil(qty / vehicleConfig.capacity_kg);

  // Single vehicle freight cost = max(min_charge, distance * base_rate)
  const singleTripCost = Math.max(vehicleConfig.min_charge, dist * vehicleConfig.base_rate_per_km);
  const totalFreightCost = Math.round(singleTripCost * vehiclesRequired);
  const costPerKg = parseFloat((totalFreightCost / qty).toFixed(2));

  return {
    distance_km: dist,
    duration_minutes: durationMinutes,
    quantity_kg: qty,
    vehicle_type: vehicleKey,
    vehicle_name: vehicleConfig.name,
    vehicle_capacity_kg: vehicleConfig.capacity_kg,
    vehicles_required: vehiclesRequired,
    base_rate_per_km: vehicleConfig.base_rate_per_km,
    estimated_freight_cost: totalFreightCost,
    cost_per_kg: costPerKg,
    is_estimate: true
  };
};

/**
 * Main Freight Estimation Endpoint Handler / Service Method
 */
const estimateFreightLogistics = async (params = {}) => {
  const originInput = params.origin || params.origin_location || params.location || "Kolkata";
  const destInput = params.destination || params.destination_location || params.market || "Birbhum APMC";
  const quantityKg = params.quantity_kg || params.quantity || 500;
  const vehicleType = params.vehicle_type || "";

  const originCoords = await geocodeLocation(originInput);
  const destCoords = await geocodeLocation(destInput);

  if (!originCoords || !destCoords) {
    return {
      success: false,
      message: "Location coordinates unavailable for routing.",
      is_fallback: true
    };
  }

  const routeInfo = await getRoadRoute(originCoords, destCoords);
  if (!routeInfo) {
    return {
      success: false,
      message: "Unable to calculate road route between specified origin and destination.",
      is_fallback: true
    };
  }

  const freightCalculation = calculateFreight(
    routeInfo.distance_km,
    routeInfo.duration_minutes,
    quantityKg,
    vehicleType
  );

  return {
    success: true,
    data: {
      origin: originInput,
      destination: destInput,
      origin_coordinates: originCoords,
      destination_coordinates: destCoords,
      routing_source: routeInfo.source,
      is_fallback: routeInfo.is_fallback || false,
      ...freightCalculation
    }
  };
};

module.exports = {
  LOGISTICS_RATES,
  selectDefaultVehicle,
  geocodeLocation,
  getRoadRoute,
  calculateFreight,
  estimateFreightLogistics
};
