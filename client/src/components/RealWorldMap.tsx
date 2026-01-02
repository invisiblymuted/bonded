import { useState } from 'react';
import { MapPin, X } from 'lucide-react';

export function RealWorldMap() {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  const locations = [
    {
      id: '1',
      name: 'Hague Convention Central Authority',
      location: 'The Hague, Netherlands',
      lat: 52.07,
      lng: 4.3,
      type: 'legal',
      description: 'International parental child abduction cases'
    },
    {
      id: '2',
      name: 'ICMEC',
      location: 'Washington DC, USA',
      lat: 38.89,
      lng: -77.04,
      type: 'support',
      description: 'International Centre for Missing & Exploited Children'
    },
    {
      id: '3',
      name: 'Reunite International',
      location: 'London, UK',
      lat: 51.51,
      lng: -0.13,
      type: 'support',
      description: 'UK Charity for Abducted Children'
    },
    {
      id: '4',
      name: 'NCMEC',
      location: 'Alexandria, USA',
      lat: 38.81,
      lng: -77.04,
      type: 'support',
      description: 'National Center for Missing & Exploited Children'
    },
    {
      id: '5',
      name: 'Regional Family Reunification Center',
      location: 'Bangkok, Thailand',
      lat: 13.73,
      lng: 100.55,
      type: 'support',
      description: 'Southeast Asian Family Reunion Support'
    }
  ];

  // Simple mercator projection for converting lat/lng to x/y
  const projectCoord = (lat: number, lng: number) => {
    // Map lng from -180 to 180 to 0 to 1000
    const x = ((lng + 180) / 360) * 1000;
    // Map lat from -90 to 90 to 600 to 0 (inverted)
    const y = ((90 - lat) / 180) * 600;
    return { x, y };
  };

  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden border border-[#dcd7ca] shadow-sm">
      {/* Map Background */}
      <div className="relative w-full h-96 bg-blue-50">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" style={{ backgroundColor: '#b3d9ff' }}>
          {/* Simplified continents */}
          <g fill="#90ee90" stroke="#2d5016" strokeWidth="1.5">
            {/* North America */}
            <ellipse cx="150" cy="180" rx="60" ry="90" />
            
            {/* South America */}
            <ellipse cx="200" cy="380" rx="35" ry="70" />
            
            {/* Europe */}
            <ellipse cx="450" cy="140" rx="50" ry="40" />
            
            {/* Africa */}
            <ellipse cx="500" cy="340" rx="60" ry="100" />
            
            {/* Asia */}
            <ellipse cx="650" cy="200" rx="120" ry="80" />
            
            {/* Australia */}
            <ellipse cx="800" cy="420" rx="45" ry="50" />
            
            {/* Greenland */}
            <ellipse cx="400" cy="80" rx="30" ry="45" />
          </g>
          
          {/* Location markers for key organizations */}
          {locations.map((loc) => {
            const { x, y } = projectCoord(loc.lat, loc.lng);
            const isSelected = selectedMarker === loc.id;
            const markerColor = loc.type === 'legal' ? '#2458a0' : '#f26522';
            
            return (
              <g key={loc.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedMarker(isSelected ? null : loc.id)}>
                {/* Outer glow ring for emphasis */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={isSelected ? "18" : "12"} 
                  fill="none"
                  stroke={markerColor}
                  strokeWidth="2"
                  opacity={isSelected ? "0.4" : "0.2"}
                />
                {/* Main marker circle */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={isSelected ? "10" : "6"} 
                  fill={markerColor}
                  stroke="white"
                  strokeWidth="2"
                  opacity="1"
                />
                {/* Marker pin icon for legal authorities */}
                {loc.type === 'legal' && (
                  <g>
                    <path
                      d={`M ${x} ${y + 8} L ${x - 5} ${y + 18} Q ${x} ${y + 20} ${x + 5} ${y + 18} Z`}
                      fill={markerColor}
                      opacity="0.8"
                    />
                  </g>
                )}
              </g>
            );
          })}
        </svg>
        
        {/* Popup info box - HTML overlay for better readability */}
        {selectedMarker && (
          <div className="absolute inset-0 flex items-center justify-center p-4 z-20">
            <div className="bg-white rounded-lg shadow-2xl p-6 border-2 border-[#2458a0] max-w-sm w-full">
              {(() => {
                const loc = locations.find(l => l.id === selectedMarker);
                return (
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-black text-[#4a453e] text-lg uppercase">{loc?.name}</h4>
                        <p className="text-sm text-[#2458a0] font-bold">{loc?.location}</p>
                      </div>
                      <button onClick={() => setSelectedMarker(null)} className="text-[#4a453e] hover:text-[#2458a0] transition-colors p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-[#4a453e] mb-2">{loc?.description}</p>
                    <p className="text-xs text-[#4a453e] opacity-70 leading-relaxed">{
                      loc?.type === 'legal' 
                        ? 'Primary legal authority for international child abduction cases under the Hague Convention.'
                        : 'Supporting organizations providing resources and assistance for family reunification.'
                    }</p>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white px-6 py-4 border-t border-[#dcd7ca] flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#2458a0]" />
          <span className="text-xs font-bold text-[#4a453e]">Legal Authority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#f26522]" />
          <span className="text-xs font-bold text-[#4a453e]">Support Organization</span>
        </div>
      </div>
    </div>
  );
}
