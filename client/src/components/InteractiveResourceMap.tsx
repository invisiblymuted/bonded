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
      'California': { lat: 36.1163, lng: -119.6674 },
      'Texas': { lat: 31.9686, lng: -99.9018 },
      'New York': { lat: 42.1657, lng: -74.9481 },
      'Florida': { lat: 27.6648, lng: -81.5158 },
      'Illinois': { lat: 40.3495, lng: -88.9861 },
      'Pennsylvania': { lat: 40.5908, lng: -77.2098 },
      'Ohio': { lat: 40.3888, lng: -82.7649 },
      'Georgia': { lat: 33.0406, lng: -83.6431 },
      'Washington': { lat: 47.7511, lng: -120.7401 },
      'Massachusetts': { lat: 42.2352, lng: -71.0275 },
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
    const countryData = COUNTRIES_AND_STATES[country];
    setMapCenter({ lat: countryData.lat, lng: countryData.lng });
    setZoomLevel(4);
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    const countryData = COUNTRIES_AND_STATES[selectedCountry!];
    if (countryData.states && countryData.states[state]) {
      const stateCoords = countryData.states[state];
      setUserLocation({ lat: stateCoords.lat, lng: stateCoords.lng });
      setMapCenter({ lat: stateCoords.lat, lng: stateCoords.lng });
      setZoomLevel(5);
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

  // Project coordinates to SVG
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
      <div className="mb-6 space-y-4">
        <div className="flex gap-4 flex-wrap items-center">
          <button
            onClick={getLocation}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2458a0] to-[#f26522] text-white rounded-full font-black text-sm uppercase tracking-widest hover:shadow-lg transition-shadow"
          >
            <Navigation className="h-5 w-5" />
            Use My Location
          </button>
          <div className="text-[#4a453e] font-bold text-sm">or select:</div>
        </div>

        <div className="flex gap-4 flex-wrap items-end">
          <div className="relative">
            <label className="block text-xs font-black text-[#4a453e] uppercase tracking-wide mb-2">Country</label>
            <div className="relative">
              <select
                value={selectedCountry || ''}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 bg-white border-2 border-[#dcd7ca] rounded-lg font-bold text-[#4a453e] focus:border-[#2458a0] outline-none transition-all"
              >
                <option value="">Select a country...</option>
                {Object.keys(COUNTRIES_AND_STATES).map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2458a0] pointer-events-none" />
            </div>
          </div>

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
        <div className="mb-4 p-3 bg-[#f5f1e8] border-2 border-[#2458a0] rounded-lg font-black text-[#2458a0] text-sm">
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
      <div className="bg-white border-2 border-[#dcd7ca] rounded-3xl overflow-hidden mb-8 shadow-sm">
        <div className="relative w-full h-96 bg-blue-50">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 600"
            preserveAspectRatio="xMidYMid meet"
            style={{ backgroundColor: '#b3d9ff' }}
          >
            {/* Simplified continents */}
            <g fill="#90ee90" stroke="#2d5016" strokeWidth="1.5">
              <ellipse cx="200" cy="180" rx="80" ry="110" />
              <ellipse cx="250" cy="420" rx="45" ry="90" />
              <ellipse cx="550" cy="140" rx="60" ry="50" />
              <ellipse cx="600" cy="350" rx="80" ry="130" />
              <ellipse cx="800" cy="200" rx="150" ry="100" />
              <ellipse cx="950" cy="450" rx="55" ry="65" />
              <ellipse cx="480" cy="80" rx="40" ry="60" />
            </g>

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
              const markerColor = res.type === 'legal' ? '#2458a0' : res.type === 'international' ? '#8b5cf6' : '#f26522';

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
          </svg>

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
              <div className="w-3 h-3 rounded-full bg-[#2458a0]" />
              <span className="text-[#4a453e]">Legal Authority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
              <span className="text-[#4a453e]">International Org</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f26522]" />
              <span className="text-[#4a453e]">Support Service</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff6b35]" />
              <span className="text-[#4a453e]">Your Location</span>
            </div>
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
                      <p className="text-xs text-[#f26522] font-black mt-1">
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
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#f26522] text-white rounded-full font-black text-xs uppercase tracking-wide hover:shadow-lg transition-shadow"
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
          <h3 className="text-xl font-black text-[#4a453e] uppercase mb-4">
            {userLocation ? 'Resources Near You' : 'All Available Resources'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resourcesWithDistance.slice(0, 8).map((res) => (
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
                          res.type === 'legal' ? '#2458a0' : res.type === 'international' ? '#8b5cf6' : '#f26522'
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-[#4a453e] text-sm uppercase">{res.name}</h4>
                    <p className="text-xs text-[#2458a0] font-bold mt-1">{res.location}</p>
                    {res.distance && (
                      <p className="text-xs text-[#f26522] font-black mt-1">📍 {res.distance.toFixed(0)} miles</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
