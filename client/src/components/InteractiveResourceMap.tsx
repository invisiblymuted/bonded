import { useState, useEffect } from 'react';
import { MapPin, X, Navigation, AlertCircle, ChevronDown } from 'lucide-react';
import { Card } from './ui/card';

interface Resource {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  type: 'legal' | 'support' | 'international';
  description: string;
  phone?: string;
  url?: string;
  distance?: number;
  country?: string;
  state?: string;
}

const COUNTRIES_AND_STATES: Record<string, { lat: number; lng: number; states?: Record<string, { lat: number; lng: number }> }> = {
  'United States': {
    lat: 37.0902,
    lng: -95.7129,
    states: {
      'Alabama': { lat: 32.806671, lng: -86.791130 },
      'Alaska': { lat: 61.370716, lng: -152.404419 },
      'Arizona': { lat: 33.729759, lng: -111.431221 },
      'Arkansas': { lat: 34.969704, lng: -92.373123 },
      'California': { lat: 36.116203, lng: -119.681564 },
      'Colorado': { lat: 39.059811, lng: -105.311104 },
      'Connecticut': { lat: 41.597782, lng: -72.755371 },
      'Delaware': { lat: 39.318523, lng: -75.507141 },
      'Florida': { lat: 27.766279, lng: -81.686783 },
      'Georgia': { lat: 33.040619, lng: -83.643074 },
      'Hawaii': { lat: 21.094318, lng: -157.498337 },
      'Idaho': { lat: 44.240459, lng: -114.478828 },
      'Illinois': { lat: 40.349457, lng: -88.986137 },
      'Indiana': { lat: 39.849426, lng: -86.258278 },
      'Iowa': { lat: 42.011539, lng: -93.210526 },
      'Kansas': { lat: 38.526600, lng: -96.726486 },
      'Kentucky': { lat: 37.668140, lng: -84.670067 },
      'Louisiana': { lat: 31.169546, lng: -91.867805 },
      'Maine': { lat: 44.693947, lng: -69.381927 },
      'Maryland': { lat: 39.063946, lng: -76.802101 },
      'Massachusetts': { lat: 42.230171, lng: -71.530106 },
      'Michigan': { lat: 43.326618, lng: -84.536095 },
      'Minnesota': { lat: 45.694454, lng: -93.900192 },
      'Mississippi': { lat: 32.741646, lng: -89.678696 },
      'Missouri': { lat: 38.456085, lng: -92.288368 },
      'Montana': { lat: 46.921925, lng: -110.454353 },
      'Nebraska': { lat: 41.125370, lng: -98.268082 },
      'Nevada': { lat: 38.313515, lng: -117.055374 },
      'New Hampshire': { lat: 43.452492, lng: -71.563896 },
      'New Jersey': { lat: 40.298904, lng: -74.521011 },
      'New Mexico': { lat: 34.840515, lng: -106.248482 },
      'New York': { lat: 42.165726, lng: -74.948051 },
      'North Carolina': { lat: 35.630066, lng: -79.806419 },
      'North Dakota': { lat: 47.528912, lng: -99.784012 },
      'Ohio': { lat: 40.388783, lng: -82.764915 },
      'Oklahoma': { lat: 35.565342, lng: -96.928917 },
      'Oregon': { lat: 44.572021, lng: -122.070938 },
      'Pennsylvania': { lat: 40.590752, lng: -77.209755 },
      'Rhode Island': { lat: 41.680893, lng: -71.511780 },
      'South Carolina': { lat: 33.856892, lng: -80.945007 },
      'South Dakota': { lat: 44.299782, lng: -99.438828 },
      'Tennessee': { lat: 35.747845, lng: -86.692345 },
      'Texas': { lat: 31.054487, lng: -97.563461 },
      'Utah': { lat: 40.150032, lng: -111.862434 },
      'Vermont': { lat: 44.045876, lng: -72.710686 },
      'Virginia': { lat: 37.769337, lng: -78.169968 },
      'Washington': { lat: 47.400902, lng: -121.490494 },
      'West Virginia': { lat: 38.491226, lng: -80.954456 },
      'Wisconsin': { lat: 44.268543, lng: -89.616508 },
      'Wyoming': { lat: 42.755966, lng: -107.302490 },
      'District of Columbia': { lat: 38.9072, lng: -77.0369 }
    }
  },
  'United Kingdom': { lat: 55.3781, lng: -3.4360 },
  'Canada': { lat: 56.1304, lng: -106.3468 },
  'Australia': { lat: -25.2744, lng: 133.7751 },
  'Germany': { lat: 51.1657, lng: 10.4515 },
  'France': { lat: 46.2276, lng: 2.2137 },
  'Netherlands': { lat: 52.1326, lng: 5.2913 },
  'Japan': { lat: 36.2048, lng: 138.2529 },
  'Brazil': { lat: -14.2350, lng: -51.9253 },
  'India': { lat: 20.5937, lng: 78.9629 },
  'Mexico': { lat: 23.6345, lng: -102.5528 },
};

export function InteractiveResourceMap() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [resourcesWithDistance, setResourcesWithDistance] = useState<Resource[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 20, lng: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);

  const resources: Resource[] = [
    {
      id: '1',
      name: 'Hague Convention Central Authority',
      location: 'The Hague, Netherlands',
      lat: 52.07,
      lng: 4.3,
      type: 'legal',
      description: 'International parental child abduction cases',
      url: 'https://www.hcch.net/'
    },
    {
      id: '2',
      name: 'ICMEC - Washington DC',
      location: 'Washington DC, USA',
      lat: 38.89,
      lng: -77.04,
      type: 'international',
      description: 'International Centre for Missing & Exploited Children',
      phone: '+1-202-944-1200',
      url: 'https://www.icmec.org/'
    },
    {
      id: '3',
      name: 'Reunite International',
      location: 'London, UK',
      lat: 51.51,
      lng: -0.13,
      type: 'support',
      description: 'UK Charity for Abducted Children',
      url: 'https://www.reunite.org/'
    },
    {
      id: '4',
      name: 'NCMEC - Alexandria',
      location: 'Alexandria, USA',
      lat: 38.81,
      lng: -77.04,
      type: 'support',
      description: 'National Center for Missing & Exploited Children',
      phone: '1-800-THE-LOST',
      url: 'https://www.missingkids.org/'
    },
    {
      id: '5',
      name: 'Southeast Asia Family Reunification Center',
      location: 'Bangkok, Thailand',
      lat: 13.73,
      lng: 100.55,
      type: 'support',
      description: 'Regional Family Reunion Support',
      url: 'https://www.icmec.org/'
    },
    {
      id: '6',
      name: 'Brazilian Family Protection Office',
      location: 'São Paulo, Brazil',
      lat: -23.55,
      lng: -46.63,
      type: 'legal',
      description: 'Coordinated assistance for international abduction cases',
      url: 'https://www.hcch.net/'
    },
    {
      id: '7',
      name: 'Australian Federal Police - Family Law',
      location: 'Canberra, Australia',
      lat: -35.28,
      lng: 149.13,
      type: 'legal',
      description: 'Family law enforcement and abduction services',
      url: 'https://www.hcch.net/'
    },
    {
      id: '8',
      name: 'Canadian Federal Mediation and Conciliation Service',
      location: 'Toronto, Canada',
      lat: 43.65,
      lng: -79.38,
      type: 'support',
      description: 'Mediation services for family abduction cases',
      url: 'https://www.hcch.net/'
    }
  ];

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Request user location
  const getLocation = () => {
    setLocationError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter({ lat: latitude, lng: longitude });
          setZoomLevel(5);
          setSelectedCountry(null);
          setSelectedState(null);
        },
        () => {
          setLocationError('Unable to access your location. Use the dropdown to select your country/state.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  };

  // Handle country/state selection
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedState(null);
    setUserLocation(null);
    setSelectedResource(null);
    const countryData = COUNTRIES_AND_STATES[country];
    if (!countryData) return;
    setMapCenter({ lat: countryData.lat, lng: countryData.lng });
    setZoomLevel(3);
  };

  const handleStateChange = (state: string, country?: string) => {
    setSelectedState(state);
    setSelectedResource(null);
    const countryKey = country || selectedCountry;
    if (!countryKey) return;
    const countryData = COUNTRIES_AND_STATES[countryKey];
    if (countryData?.states && countryData.states[state]) {
      const stateCoords = countryData.states[state];
      setUserLocation({ lat: stateCoords.lat, lng: stateCoords.lng });
      setMapCenter({ lat: stateCoords.lat, lng: stateCoords.lng });
      setZoomLevel(6);
    }
  };

  // Calculate distances when user location changes
  useEffect(() => {
    if (userLocation) {
      const updated = resources.map((res) => ({
        ...res,
        distance: calculateDistance(userLocation.lat, userLocation.lng, res.lat, res.lng)
      }));
      setResourcesWithDistance(updated.sort((a, b) => (a.distance || 0) - (b.distance || 0)));
    } else {
      setResourcesWithDistance(resources);
    }
  }, [userLocation]);

  // Project coordinates to SVG using equirectangular (plate carrée) projection
  // This matches the embedded world SVG which is an equirectangular image.
  const projectCoord = (lat: number, lng: number) => {
    const width = 1200;
    const height = 600;
    const x = ((lng + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return { x, y };
  };

  return (
    <div className="w-full">
      {/* Location Control Buttons and Dropdowns */}
      <div className="mb-6 space-y-4 text-center">
        <div className="flex gap-4 flex-wrap items-center justify-center">
          <button
            onClick={getLocation}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2458a0] to-[#6b7280] text-white rounded-full font-black text-sm uppercase tracking-widest hover:shadow-lg transition-shadow"
          >
            <Navigation className="h-5 w-5" />
            Use My Location
          </button>
            <div className="flex items-center gap-3">
            <div className="text-[#2458a0] font-bold text-sm">OR</div>
            <div className="relative">
              <label htmlFor="country-select" className="sr-only">Country</label>
              <select
                id="country-select"
                value={selectedCountry || ''}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="appearance-none px-4 py-3 pr-8 bg-white border-2 border-[#f0ede4] rounded-lg font-bold text-[#2458a0] focus:border-[#2458a0] outline-none transition-all"
              >
                <option value="">Select a country...</option>
                {Object.keys(COUNTRIES_AND_STATES).map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2458a0] pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap items-end justify-center">
          {selectedCountry && COUNTRIES_AND_STATES[selectedCountry]?.states && (
            <div className="relative">
              <label className="block text-xs font-black text-[#4a453e] uppercase tracking-wide mb-2">State/Region</label>
              <div className="relative">
                <select
                  value={selectedState || ''}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="appearance-none px-4 py-3 pr-10 bg-white border-2 border-[#dcd7ca] rounded-lg font-bold text-[#4a453e] focus:border-[#2458a0] outline-none transition-all"
                >
                  <option value="">Select a state...</option>
                  {Object.keys(COUNTRIES_AND_STATES[selectedCountry]?.states || {}).map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2458a0] pointer-events-none" />
              </div>
            </div>
          )}
        </div>
      </div>

      {(userLocation || selectedCountry) && (
        <div className="mb-4 p-3 bg-[#f0ede4] border-2 border-[#2458a0] rounded-lg font-black text-[#2458a0] text-sm">
          📍 {userLocation ? `Located at ${userLocation.lat.toFixed(2)}°, ${userLocation.lng.toFixed(2)}°` : `Viewing resources near ${selectedState || selectedCountry}`}
        </div>
      )}

      {locationError && (
        <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg flex gap-3 text-sm">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-amber-800 font-bold">{locationError}</p>
        </div>
      )}

      {/* Interactive Map */}
      <div className="bg-white border-2 border-[#f0ede4] rounded-3xl overflow-hidden mb-8 shadow-sm">
        <div className="relative w-full h-96 bg-blue-50">
          {
            (() => {
              const WIDTH = 1200;
              const HEIGHT = 600;
              const scale = Math.max(1, zoomLevel);
              const center = projectCoord(mapCenter.lat, mapCenter.lng);
              const viewW = WIDTH / scale;
              const viewH = HEIGHT / scale;
              let viewX = center.x - viewW / 2;
              let viewY = center.y - viewH / 2;
              // clamp
              viewX = Math.max(0, Math.min(viewX, WIDTH - viewW));
              viewY = Math.max(0, Math.min(viewY, HEIGHT - viewH));
              const viewBox = `${viewX} ${viewY} ${viewW} ${viewH}`;

              return (
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox={viewBox}
                  preserveAspectRatio="xMidYMid meet"
                  style={{ backgroundColor: '#b3d9ff', transition: 'viewBox 400ms ease' }}
                >
                  {/* World map image (public domain SVG) - improves continent shapes */}
                  <image
                    href="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
                    x="0"
                    y="0"
                    width="1200"
                    height="600"
                    preserveAspectRatio="xMidYMid meet"
                    opacity="0.95"
                  />

                  {/* User location indicator */}
                  {userLocation && (
                    <g>
                      <circle
                        cx={projectCoord(userLocation.lat, userLocation.lng).x}
                        cy={projectCoord(userLocation.lat, userLocation.lng).y}
                        r="12"
                        fill="#ff6b35"
                        stroke="white"
                        strokeWidth="3"
                      />
                      <circle
                        cx={projectCoord(userLocation.lat, userLocation.lng).x}
                        cy={projectCoord(userLocation.lat, userLocation.lng).y}
                        r="12"
                        fill="none"
                        stroke="#ff6b35"
                        strokeWidth="2"
                        opacity="0.4"
                        style={{ animation: 'pulse 2s infinite' }}
                      />
                    </g>
                  )}

                  {/* Resource markers */}
                  {resourcesWithDistance.map((res) => {
                    const { x, y } = projectCoord(res.lat, res.lng);
                    const isSelected = selectedResource === res.id;
                    const markerColor = res.type === 'legal' ? '#2458a0' : res.type === 'international' ? '#8b5cf6' : '#6b7280';

                    return (
                      <g key={res.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedResource(isSelected ? null : res.id)}>
                        {/* Glow ring */}
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? '16' : '12'}
                          fill="none"
                          stroke={markerColor}
                          strokeWidth="2"
                          opacity={isSelected ? '0.4' : '0.2'}
                        />
                        {/* Main marker */}
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? '9' : '6'}
                          fill={markerColor}
                          stroke="white"
                          strokeWidth="2"
                        />
                      </g>
                    );
                  })}
                  {/* Debug overlay removed */}
                </svg>
              );
            })()
          }

          {/* Pulse animation */}
          <style>{`
            @keyframes pulse {
              0%, 100% {
                stroke-width: 2;
                opacity: 0.4;
              }
              50% {
                stroke-width: 1;
                opacity: 0.2;
              }
            }
          `}</style>

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-[#dcd7ca] text-xs font-bold space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#2458a0] inline-block" />
                <span className="text-[#4a453e]">Legal Authority</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#8b5cf6] inline-block" />
                <span className="text-[#4a453e]">International Org</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#6b7280] inline-block" />
                <span className="text-[#4a453e]">Support Service</span>
              </div>
            {/* 'Your Location' legend removed */}
          </div>
        </div>
      </div>

      {/* Selected Resource Details or List */}
      {selectedResource ? (
        <Card className="bg-white border-2 border-[#2458a0] rounded-2xl overflow-hidden">
          {(() => {
            const res = resourcesWithDistance.find((r) => r.id === selectedResource);
            if (!res) return null;
            return (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-black text-[#4a453e] uppercase mb-1">{res.name}</h3>
                    <p className="text-sm text-[#2458a0] font-bold">{res.location}</p>
                    {res.distance && (
                      <p className="text-xs text-[#14532d] font-black mt-1">
                        📍 {res.distance.toFixed(0)} miles away
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedResource(null)}
                    className="text-[#4a453e] hover:text-[#2458a0] transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <p className="text-sm text-[#4a453e] mb-4 leading-relaxed">{res.description}</p>
                <div className="flex gap-3 flex-wrap">
                  {res.phone && (
                    <a
                      href={`tel:${res.phone}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#2458a0] text-white rounded-full font-black text-xs uppercase tracking-wide hover:shadow-lg transition-shadow"
                    >
                      📞 Call
                    </a>
                  )}
                  {res.url && (
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#14532d] text-white rounded-full font-black text-xs uppercase tracking-wide hover:shadow-lg transition-shadow"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            );
          })()}
        </Card>
      ) : (
          <div>
            <h3 className="text-xl font-black uppercase mb-4 bg-gradient-to-r from-[#2458a0] to-[#14532d] bg-clip-text text-transparent">
            {selectedState ? `Resources in ${selectedState}` : selectedCountry ? `Resources in ${selectedCountry}` : userLocation ? 'Resources Near You' : 'Available Resources'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(() => {
              const lc = (s?: string) => (s || '').toLowerCase();
              let displayed = resourcesWithDistance;
              if (selectedState) {
                const name = lc(selectedState);
                displayed = resourcesWithDistance.filter(r => (r.state && lc(r.state) === name) || (r.location && lc(r.location).includes(name)) || (r.country && lc(r.country) === name));
              } else if (selectedCountry) {
                const name = lc(selectedCountry);
                displayed = resourcesWithDistance.filter(r => (r.country && lc(r.country) === name) || (r.location && lc(r.location).includes(name)));
              } else if (userLocation) {
                displayed = resourcesWithDistance;
              }

              if (displayed.length === 0) {
                return (
                  <div className="col-span-1 md:col-span-2 p-6 bg-white border-[#dcd7ca] rounded-2xl text-sm text-[#4a453e] font-bold">
                    No resources found for the selected location.
                  </div>
                );
              }

              return displayed.slice(0, 8).map((res) => (
              <Card
                key={res.id}
                onClick={() => setSelectedResource(res.id)}
                className="bg-white border-[#dcd7ca] p-4 cursor-pointer hover:border-[#2458a0] hover:shadow-lg transition-all rounded-2xl"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div
                      className="w-4 h-4 rounded-full mt-1"
                      style={{
                        backgroundColor:
                          res.type === 'legal' ? '#2458a0' : res.type === 'international' ? '#8b5cf6' : '#14532d'
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-[#4a453e] text-sm uppercase">{res.name}</h4>
                    <p className="text-xs text-[#2458a0] font-bold mt-1">{res.location}</p>
                    {res.distance && (
                      <p className="text-xs text-[#14532d] font-black mt-1">📍 {res.distance.toFixed(0)} miles</p>
                    )}
                  </div>
                </div>
              </Card>
              ));
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
