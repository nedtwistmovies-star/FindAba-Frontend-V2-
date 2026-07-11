import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface GoogleMapComponentProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: { position: { lat: number; lng: number }; title: string; color?: string }[];
  className?: string;
  height?: string;
}

export const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ 
  center = { lat: 5.1065, lng: 7.3697 }, // Aba Central
  zoom = 14, 
  markers = [],
  className = "",
  height = "400px"
}) => {
  if (!hasValidKey) {
    return (
      <div className={`bg-zinc-800 rounded-2xl flex items-center justify-center p-8 text-center ${className}`} style={{ height }}>
        <div className="max-w-xs">
          <h2 className="text-white font-bold mb-2">Google Maps Key Required</h2>
          <p className="text-zinc-400 text-xs mb-4">Please add GOOGLE_MAPS_PLATFORM_KEY to AI Studio Secrets to enable live city tracking.</p>
          <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-700 text-left text-[10px] text-zinc-500 font-mono">
            Settings → Secrets → GOOGLE_MAPS_PLATFORM_KEY
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl overflow-hidden shadow-xl border border-zinc-800 ${className}`} style={{ height }}>
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={center}
          defaultZoom={zoom}
          mapId="FINDABA_TRANSPORT_MAP"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {markers.map((marker, i) => (
            <AdvancedMarker key={i} position={marker.position} title={marker.title}>
              <Pin background={marker.color || "#0B7A3B"} glyphColor="#fff" />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
};
