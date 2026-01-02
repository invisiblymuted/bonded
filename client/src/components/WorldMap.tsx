import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, X } from 'lucide-react';

interface Hotspot {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  type: 'case' | 'legal' | 'support';
  title: string;
  description: string;
  status: 'active' | 'resolved' | 'pending';
}

const hotspots: Hotspot[] = [
  {
    id: '1',
    name: 'International Child Abduction Hub',
    country: 'Netherlands',
    lat: 52.1326,
    lng: 5.2913,
    type: 'legal',
    title: 'Hague Convention Central Authority',
    description: 'The Hague Conference handles international parental child abduction cases.',
    status: 'active'
  },
  {
    id: '2',
    name: 'ICMEC Regional Office',
    country: 'United States',
    lat: 38.8951,
    lng: -77.0369,
    type: 'support',
    title: 'International Centre for Missing & Exploited Children',
    description: 'Global resources for missing and abducted children.',
    status: 'active'
  },
  {
    id: '3',
    name: 'Reunite International',
    country: 'United Kingdom',
    lat: 52.2053,
    lng: -0.1218,
    type: 'support',
    title: 'UK Charity for Abducted Children',
    description: 'Emotional support and practical advice for families.',
    status: 'active'
  },
  {
    id: '4',
    name: 'Legal Reform Initiative',
    country: 'Canada',
    lat: 45.4215,
    lng: -75.6972,
    type: 'legal',
    title: 'Family Law Reform',
    description: 'Advancing international family law protections.',
    status: 'active'
  },
  {
    id: '5',
    name: 'Cross-Border Family Network',
    country: 'Australia',
    lat: -33.8688,
    lng: 151.2093,
    type: 'support',
    title: 'Asia-Pacific Support Services',
    description: 'Regional coordination for family reunification.',
    status: 'active'
  },
];

const typeColors: Record<string, { bg: string; dot: string; text: string }> = {
  case: { bg: 'bg-red-100', dot: 'bg-red-500', text: 'text-red-700' },
  legal: { bg: 'bg-blue-100', dot: 'bg-blue-500', text: 'text-blue-700' },
  support: { bg: 'bg-green-100', dot: 'bg-green-500', text: 'text-green-700' },
};

const statusColors: Record<string, string> = {
  active: 'text-green-600',
  resolved: 'text-blue-600',
  pending: 'text-yellow-600',
};

export function WorldMap() {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'case' | 'legal' | 'support'>('all');

  const filteredHotspots = activeFilter === 'all' 
    ? hotspots 
    : hotspots.filter(h => h.type === activeFilter);

  // Simple mercator projection
  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  return (
    <div className="w-full space-y-4">
      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'legal', 'support', 'case'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              activeFilter === filter
                ? 'bg-[#4a453e] text-white'
                : 'bg-[#f5f1e8] text-[#4a453e] border border-[#dcd7ca] hover:border-[#2458a0]'
            }`}
          >
            {filter === 'all' ? 'All Hotspots' : filter === 'legal' ? 'Legal' : filter === 'support' ? 'Support' : 'Cases'}
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div className="relative w-full bg-gradient-to-b from-blue-50 to-blue-100 rounded-3xl border border-[#dcd7ca] overflow-hidden h-64 shadow-sm">
        {/* SVG Background Map */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Simplified world map outline - major continents */}
          <g fill="none" stroke="#2458a0" strokeWidth="2">
            {/* North America */}
            <path d="M 150 100 L 200 120 L 200 300 L 150 280 Z" />
            {/* South America */}
            <path d="M 200 300 L 230 320 L 220 500 L 180 480 Z" />
            {/* Europe */}
            <path d="M 400 80 L 500 90 L 510 180 L 400 170 Z" />
            {/* Africa */}
            <path d="M 450 180 L 550 170 L 560 450 L 450 460 Z" />
            {/* Asia */}
            <path d="M 500 90 L 800 100 L 820 300 L 500 280 Z" />
            {/* Australia */}
            <path d="M 750 350 L 800 360 L 800 450 L 750 440 Z" />
          </g>
        </svg>

        {/* Hotspot Markers */}
        <div className="absolute inset-0">
          {filteredHotspots.map((hotspot) => {
            const { x, y } = projectCoords(hotspot.lat, hotspot.lng);
            return (
              <motion.button
                key={hotspot.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.2 }}
                onClick={() => setSelectedHotspot(hotspot)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer transition-all ${typeColors[hotspot.type].dot}`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
                title={hotspot.title}
              >
                <MapPin className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </motion.button>
            );
          })}
        </div>

        {/* Center message if no hotspots shown */}
        {filteredHotspots.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[#4a453e] font-black text-center opacity-40">
              No {activeFilter} hotspots to display
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-4">
        {(['legal', 'support', 'case'] as const).map((type) => (
          <div key={type} className={`p-3 rounded-lg ${typeColors[type].bg}`}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-3 h-3 rounded-full ${typeColors[type].dot}`}></div>
              <p className={`text-xs font-black uppercase tracking-widest ${typeColors[type].text}`}>
                {type === 'legal' ? 'Legal' : type === 'support' ? 'Support' : 'Cases'}
              </p>
            </div>
            <p className="text-[10px] font-bold opacity-70">
              {type === 'legal' && 'Legal resources & authorities'}
              {type === 'support' && 'Support organizations'}
              {type === 'case' && 'Active cases & situations'}
            </p>
          </div>
        ))}
      </div>

      {/* Selected Hotspot Details */}
      {selectedHotspot && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-3xl border-2 ${typeColors[selectedHotspot.type].bg} ${typeColors[selectedHotspot.type].text}`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight">{selectedHotspot.title}</h3>
              <p className="text-sm font-bold opacity-70 mt-1">{selectedHotspot.country}</p>
            </div>
            <button
              onClick={() => setSelectedHotspot(null)}
              className="p-2 hover:bg-white/30 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm font-bold leading-relaxed mb-4">{selectedHotspot.description}</p>
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${statusColors[selectedHotspot.status]}`}></span>
            <p className={`text-xs font-black uppercase tracking-widest ${statusColors[selectedHotspot.status]}`}>
              {selectedHotspot.status}
            </p>
          </div>
        </motion.div>
      )}

      {/* Hotspot List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredHotspots.map((hotspot) => (
          <motion.button
            key={hotspot.id}
            onClick={() => setSelectedHotspot(hotspot)}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              selectedHotspot?.id === hotspot.id
                ? `${typeColors[hotspot.type].bg} border-current`
                : 'bg-white border-[#dcd7ca] hover:border-[#2458a0]'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-3 h-3 rounded-full ${typeColors[hotspot.type].dot} mt-1 flex-shrink-0`}></div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm uppercase tracking-tight truncate">{hotspot.title}</p>
                <p className="text-xs font-bold opacity-60 mt-1">{hotspot.country}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
