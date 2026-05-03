'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Partner, getPartnerRevenue } from '@/lib/partners'

interface PartnerMapProps {
  partners: Partner[]
  selectedId: number | null
  onSelect: (id: number) => void
}

function formatRevenue(amount: number): string {
  if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}억`
  return `${(amount / 10000).toFixed(0)}만원`
}

function getRadius(partner: Partner, partners: Partner[], isSelected: boolean): number {
  const revenues = partners.map(getPartnerRevenue)
  const min = Math.min(...revenues)
  const max = Math.max(...revenues)
  const revenue = getPartnerRevenue(partner)
  // sqrt 스케일로 면적 비례 (min 8 ~ max 22)
  const normalized = (Math.sqrt(revenue) - Math.sqrt(min)) / (Math.sqrt(max) - Math.sqrt(min))
  const base = 8 + normalized * 14
  return isSelected ? base + 4 : base
}

export default function PartnerMap({ partners, selectedId, onSelect }: PartnerMapProps) {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `.leaflet-popup-content-wrapper { background: #fff; color: #111827; border: 1px solid #e5e7eb; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.12); } .leaflet-popup-tip { background: #fff; } .leaflet-popup-close-button { color: #9ca3af !important; } .leaflet-control-zoom a { background: #fff !important; color: #374151 !important; border-color: #e5e7eb !important; } .leaflet-control-zoom a:hover { background: #f9fafb !important; }`
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])

  return (
    <MapContainer
      center={[37.5665, 126.9780]}
      zoom={11}
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />
      {partners.map((p) => {
        const isSelected = selectedId === p.id
        const isWarning = p.status === 'warning'
        const radius = getRadius(p, partners, isSelected)
        return (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={radius}
            pathOptions={{
              fillColor: isSelected ? '#3b82f6' : isWarning ? '#f59e0b' : '#10b981',
              fillOpacity: isSelected ? 0.95 : 0.75,
              color: isSelected ? '#2563eb' : isWarning ? '#d97706' : '#059669',
              weight: isSelected ? 2.5 : 1.5,
            }}
            eventHandlers={{ click: () => onSelect(p.id) }}
          >
            <Popup>
              <div className="text-sm space-y-1" style={{ minWidth: 160 }}>
                <p className="font-bold text-gray-900 text-base">{p.name}</p>
                <p className="text-gray-400 text-xs">{p.address}</p>
                <div className="border-t border-gray-100 pt-1 mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5">
                  <span className="text-gray-400 text-xs">담당자</span>
                  <span className="text-gray-700 text-xs">{p.manager_name}</span>
                  <span className="text-gray-400 text-xs">연락처</span>
                  <span className="text-gray-700 text-xs">{p.phone}</span>
                  <span className="text-gray-400 text-xs">월 매출</span>
                  <span className="text-blue-600 text-xs font-semibold">{formatRevenue(getPartnerRevenue(p))}</span>
                  <span className="text-gray-400 text-xs">상태</span>
                  <span className={`text-xs font-medium ${isWarning ? 'text-yellow-600' : 'text-emerald-600'}`}>
                    {isWarning ? '경고' : '정상'}
                  </span>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
