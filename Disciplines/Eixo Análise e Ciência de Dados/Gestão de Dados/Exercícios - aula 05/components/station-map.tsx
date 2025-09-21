"use client"

import { MapPin, Thermometer } from "lucide-react"

const stations = [
  { id: 1, name: "Lisboa", lat: 38.7223, lng: -9.1393, temp: 22.1, status: "active" },
  { id: 2, name: "Porto", lat: 41.1579, lng: -8.6291, temp: 19.8, status: "active" },
  { id: 3, name: "Faro", lat: 37.0194, lng: -7.9322, temp: 24.3, status: "active" },
  { id: 4, name: "Coimbra", lat: 40.2033, lng: -8.4103, temp: 20.5, status: "maintenance" },
  { id: 5, name: "Braga", lat: 41.5518, lng: -8.4229, temp: 18.7, status: "active" },
]

export function StationMap() {
  return (
    <div className="relative h-80 bg-muted rounded-lg overflow-hidden">
      {/* Simplified map representation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10">
        <div className="absolute inset-4">
          {stations.map((station) => (
            <div
              key={station.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${((station.lng + 10) / 4) * 100}%`,
                top: `${((42 - station.lat) / 5) * 100}%`,
              }}
            >
              <div className="relative group">
                <div
                  className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                    station.status === "active" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-card border border-border rounded-lg p-2 shadow-lg whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3" />
                      <span className="text-xs font-medium">{station.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Thermometer className="h-3 w-3" />
                      <span className="text-xs">{station.temp}°C</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-3">
        <div className="text-xs font-medium mb-2">Legenda</div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs">Ativo</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-xs">Manutenção</span>
          </div>
        </div>
      </div>
    </div>
  )
}
