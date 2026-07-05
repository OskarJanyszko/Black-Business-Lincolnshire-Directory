"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { createClient } from "../../utils/supabase/client"
import Link from "next/link"

const DARK = "#19162e"
const NAV = "#221f3d"
const BORDER = "#3a3660"
const PURPLE = "#8d82c4"
const MUTED = "#b8b4d1"

async function geocodePostcode(postcode: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(postcode + ", UK")}&format=json&limit=1`, { headers: { "User-Agent": "BlackBusinessLincolnshire/1.0" } })
    const data = await res.json()
    if (data[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {}
  return null
}

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [businesses, setBusinesses] = useState<any[]>([])
  const [sectors, setSectors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [geocoding, setGeocoding] = useState(false)
  const [geocodedCount, setGeocodedCount] = useState(0)
  const [totalToGeocode, setTotalToGeocode] = useState(0)
  const [filter, setFilter] = useState({ sector: "", size: "", rural: false })
  const [activeCount, setActiveCount] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from("businesses").select("*, sectors(name)").eq("status", "approved"),
      supabase.from("sectors").select("*").order("display_order")
    ]).then(([{ data: biz }, { data: sec }]) => {
      setBusinesses(biz || [])
      setSectors(sec || [])
      setLoading(false)
    })
  }, [])

  const renderMarkers = useCallback((biz: any[], mapInstance: any, sectorFilter: string, sizeFilter: string, ruralFilter: boolean) => {
    markersRef.current.forEach(m => { m.marker.remove(); m.popup.remove() })
    markersRef.current = []
    const L = (window as any).L
    const filtered = biz.filter(b => {
      if (!b.lat || !b.lng) return false
      if (sectorFilter && b.sector_id !== sectorFilter) return false
      if (sizeFilter && b.business_size !== sizeFilter) return false
      if (ruralFilter && !b.is_rural) return false
      return true
    })
    setActiveCount(filtered.length)
    filtered.forEach(b => {
      const icon = L.divIcon({
        html: `<div style="width:28px;height:28px;background:linear-gradient(135deg,#8d82c4,#6f64a8);border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(141,130,196,0.5);cursor:pointer;font-family:system-ui,sans-serif;font-weight:800;font-size:13px;color:white">${b.name.charAt(0)}</div>`,
        className: "", iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -16]
      })
      const marker = L.marker([b.lat, b.lng], { icon }).addTo(mapInstance)
      const popup = L.popup({ closeButton: false, maxWidth: 240, className: "bbl-popup" }).setContent(`
        <div style="font-family:system-ui,sans-serif;padding:4px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
            <div style="width:36px;height:36px;background:#f3f1fa;border:1.5px solid #8d82c4;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <span style="color:#6f64a8;font-weight:800;font-size:16px">${b.name.charAt(0)}</span>
            </div>
            <div>
              <p style="color:#111827;font-size:14px;font-weight:700;margin:0 0 2px">${b.name}</p>
              <p style="color:#9ca3af;font-size:11px;margin:0">📍 ${b.city_town}</p>
            </div>
          </div>
          <span style="background:#f3f1fa;color:#6f64a8;border:1px solid #8d82c4;font-size:11px;font-weight:600;padding:2px 8px;border-radius:20px;display:inline-block;margin-bottom:8px">${b.sectors?.name || ""}</span>
          <p style="color:#6b7280;font-size:12px;line-height:1.5;margin:0 0 10px">${(b.description || "").slice(0, 90)}${(b.description || "").length > 90 ? "..." : ""}</p>
          <a href="/directory/${b.id}" style="background:#8d82c4;color:white;padding:7px 14px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:700;display:inline-block">View full profile →</a>
        </div>
      `)
      marker.on("mouseover", () => marker.bindPopup(popup).openPopup())
      marker.on("click", () => { window.location.href = `/directory/${b.id}` })
      markersRef.current.push({ marker, popup })
    })
  }, [])

  useEffect(() => {
    if (loading || businesses.length === 0) return
    let cancelled = false

    async function initMap() {
      if (!(window as any).L) {
        await new Promise<void>(resolve => {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          document.head.appendChild(link)
          const script = document.createElement("script")
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          script.onload = () => resolve()
          document.head.appendChild(script)
        })
      }
      if (!mapInstanceRef.current && mapRef.current) {
        const L = (window as any).L
        const map = L.map(mapRef.current, { center: [53.2307, -0.5406], zoom: 9, zoomControl: true })
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors', maxZoom: 18 }).addTo(map)
        mapInstanceRef.current = map
      }
      const needsGeocoding = businesses.filter(b => !b.lat || !b.lng)
      if (needsGeocoding.length > 0) {
        setGeocoding(true)
        setTotalToGeocode(needsGeocoding.length)
        const supabase = createClient()
        const updated = [...businesses]
        for (let i = 0; i < needsGeocoding.length; i++) {
          if (cancelled) break
          const b = needsGeocoding[i]
          const coords = await geocodePostcode(b.postcode)
          if (coords) {
            await supabase.from("businesses").update({ lat: coords.lat, lng: coords.lng }).eq("id", b.id)
            const idx = updated.findIndex(x => x.id === b.id)
            if (idx !== -1) updated[idx] = { ...updated[idx], ...coords }
          }
          setGeocodedCount(i + 1)
          await new Promise(r => setTimeout(r, 1100))
        }
        if (!cancelled) {
          setBusinesses(updated)
          setGeocoding(false)
          renderMarkers(updated, mapInstanceRef.current, filter.sector, filter.size, filter.rural)
        }
      } else {
        renderMarkers(businesses, mapInstanceRef.current, filter.sector, filter.size, filter.rural)
      }
    }
    initMap()
    return () => { cancelled = true }
  }, [loading, businesses.length])

  useEffect(() => {
    if (mapInstanceRef.current && !loading) renderMarkers(businesses, mapInstanceRef.current, filter.sector, filter.size, filter.rural)
  }, [filter])

  const inputStyle: React.CSSProperties = { background: NAV, border: `1.5px solid ${BORDER}`, borderRadius: 10, padding: "9px 14px", color: "white", fontSize: 13, outline: "none", fontWeight: 500, cursor: "pointer" }

  return (
    <main style={{ minHeight: "100vh", background: DARK, fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", flexDirection: "column" }}>
      <nav style={{ background: NAV, padding: "0 2rem", height: 76, display: "flex", alignItems: "center", position: "sticky", top: 0, zIndex: 1000, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ background: "white", borderRadius: 4, padding: "6px 14px" }}>
              <p style={{ color: "#111", fontWeight: 800, fontSize: 13, margin: 0, lineHeight: 1.2 }}>BLACK<br/>BUSINESS</p>
              <p style={{ color: "#6b7280", fontWeight: 500, fontSize: 9, letterSpacing: 1, margin: "2px 0 0" }}>LINCOLNSHIRE</p>
            </div>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Link href="/directory" style={{ color: "white", fontSize: 13, fontWeight: 700, textTransform: "uppercase", textDecoration: "none" }}>Directory</Link>
            <Link href="/contact" style={{ color: "white", fontSize: 13, fontWeight: 700, textTransform: "uppercase", textDecoration: "none" }}>Contact</Link>
            <Link href="/register" style={{ background: "white", color: "#19162e", padding: "11px 20px", borderRadius: 8, fontSize: 12, fontWeight: 800, textTransform: "uppercase", textDecoration: "none" }}>Add Your Business</Link>
          </div>
        </div>
      </nav>

      <div style={{ background: NAV, borderBottom: `1px solid ${BORDER}`, padding: "24px 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ color: "#a89dd9", fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Explore</p>
            <h1 style={{ color: "white", fontSize: 24, fontWeight: 800, marginBottom: 2 }}>Business Map</h1>
            <p style={{ color: MUTED, fontSize: 13 }}>Black-owned businesses across Lincolnshire{!loading && <> · <strong style={{ color: "#a89dd9" }}>{activeCount}</strong> shown</>}</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <select value={filter.sector} onChange={e => setFilter(f => ({ ...f, sector: e.target.value }))} style={inputStyle}>
              <option value="">All sectors</option>
              {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={filter.size} onChange={e => setFilter(f => ({ ...f, size: e.target.value }))} style={inputStyle}>
              <option value="">All sizes</option>
              <option value="sole_trader">Sole trader</option>
              <option value="micro">Micro (2-9)</option>
              <option value="sme">SME (10-249)</option>
            </select>
            <label style={{ ...inputStyle, display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={filter.rural} onChange={e => setFilter(f => ({ ...f, rural: e.target.checked }))} />
              Rural only
            </label>
            <button onClick={() => setFilter({ sector: "", size: "", rural: false })} style={inputStyle}>Clear</button>
            <Link href="/directory" style={{ ...inputStyle, textDecoration: "none", color: PURPLE, border: `1.5px solid ${PURPLE}` }}>List view →</Link>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        {(loading || geocoding) && (
          <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", background: "white", borderRadius: 12, padding: "12px 20px", boxShadow: "0 4px 16px rgba(0,0,0,0.3)", zIndex: 500, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 16, height: 16, border: `2px solid ${BORDER}`, borderTop: `2px solid ${PURPLE}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
            <p style={{ color: "#111827", fontSize: 13, fontWeight: 500, margin: 0 }}>{loading ? "Loading businesses..." : `Mapping locations... ${geocodedCount} of ${totalToGeocode}`}</p>
          </div>
        )}
        <div ref={mapRef} style={{ width: "100%", height: "calc(100vh - 210px)", minHeight: 500 }} />
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        .bbl-popup .leaflet-popup-content-wrapper { border-radius: 16px; border: 1.5px solid #e5e7eb; box-shadow: 0 8px 32px rgba(0,0,0,0.2); padding: 0; }
        .bbl-popup .leaflet-popup-content { margin: 16px; }
        .leaflet-container { font-family: system-ui, -apple-system, sans-serif; }
      `}</style>

      <footer style={{ background: NAV, padding: "24px 2rem", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ background: "white", borderRadius: 4, padding: "4px 10px" }}>
            <p style={{ color: "#111", fontWeight: 800, fontSize: 10, margin: 0 }}>BLACK BUSINESS LINCS</p>
          </div>
          <p style={{ color: "#8b87a8", fontSize: 11, margin: 0 }}>© 2025 Black Business Lincolnshire</p>
        </div>
      </footer>
    </main>
  )
}
