/**
 * Location Map Component
 * 
 * Displays a Google Maps iframe for the property location.
 * 
 * @component
 */

"use client";

interface LocationMapProps {
  latitude?: number;
  longitude?: number;
  address: string;
}

export function LocationMap({ address, latitude, longitude }: LocationMapProps) {
  // Filter out null/undefined values from address
  const cleanAddress = address
    .split(',')
    .map(part => part.trim())
    .filter(part => part && part !== 'null' && part !== 'undefined')
    .join(', ');

  // Construct Google Maps embed URL (basic embed without API key)
  const mapQuery = latitude && longitude
    ? `${latitude},${longitude}`
    : encodeURIComponent(cleanAddress);
  
  const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Where you'll be
      </h2>
      <p className="text-gray-600 mb-4">{cleanAddress}</p>
      
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
        <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map of ${cleanAddress}`}
        />
      </div>
      
      <a
        href={latitude && longitude 
          ? `https://www.google.com/maps?q=${latitude},${longitude}`
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanAddress)}`
        }
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-4 text-[#FFB400] hover:text-[#e5a200] font-medium transition-colors"
      >
        View larger map →
      </a>
    </div>
  );
}
