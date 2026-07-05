"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "../utils/supabase/client"

const DARK = "#19162e"
const NAV = "#221f3d"
const CARD = "#2a2650"
const BORDER = "#3a3660"
const PURPLE = "#8d82c4"
const PURPLE_LIGHT = "#a89dd9"
const MUTED = "#b8b4d1"

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{ color: "white", fontSize: 13, fontWeight: 700, textDecoration: "none", letterSpacing: 0.5, textTransform: "uppercase" }}>
      {children}
    </Link>
  )
}

function WhiteBtn({ href, children }: { href: string; children: React.ReactNode }) {
  const [h, setH] = useState(false)
  return (
    <Link href={href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: h ? "#f1f0f7" : "white", color: "#19162e", padding: "12px 24px", borderRadius: 8, fontWeight: 800, fontSize: 12, letterSpacing: 0.8, textTransform: "uppercase", textDecoration: "none", display: "inline-block", transition: "transform 0.2s, background 0.2s", transform: h ? "scale(1.03)" : "scale(1)" }}>
      {children}
    </Link>
  )
}

function PurpleBtn({ href, children }: { href: string; children: React.ReactNode }) {
  const [h, setH] = useState(false)
  return (
    <Link href={href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: h ? PURPLE_LIGHT : PURPLE, color: "white", padding: "14px 28px", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none", display: "inline-block", transition: "transform 0.2s, background 0.2s", transform: h ? "scale(1.04)" : "scale(1)", boxShadow: "0 4px 16px rgba(141,130,196,0.35)" }}>
      {children}
    </Link>
  )
}

function OutlineBtn({ href, children }: { href: string; children: React.ReactNode }) {
  const [h, setH] = useState(false)
  return (
    <Link href={href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: h ? "rgba(255,255,255,0.08)" : "transparent", border: "1.5px solid rgba(255,255,255,0.3)", color: "white", padding: "14px 28px", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none", display: "inline-block", transition: "transform 0.2s, background 0.2s", transform: h ? "scale(1.04)" : "scale(1)" }}>
      {children}
    </Link>
  )
}

function SectorCard({ name, emoji }: { name: string; emoji: string }) {
  const [h, setH] = useState(false)
  return (
    <Link href="/directory" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: h ? CARD : "#241f44", border: h ? `1.5px solid ${PURPLE}` : `1.5px solid ${BORDER}`, borderRadius: 16, padding: "20px 16px", textDecoration: "none", display: "block", transform: h ? "translateY(-3px)" : "translateY(0)", transition: "all 0.25s" }}>
      <div style={{ fontSize: 28, marginBottom: 10 }}>{emoji}</div>
      <p style={{ color: "white", fontSize: 14, fontWeight: 600 }}>{name}</p>
    </Link>
  )
}

function BusinessCard({ b }: { b: any }) {
  return (
    <div style={{ background: "#241f44", border: `1.5px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ width: 44, height: 44, background: "rgba(141,130,196,0.15)", border: `1px solid ${PURPLE}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: PURPLE_LIGHT, fontWeight: 800, fontSize: 18 }}>{b.name.charAt(0)}</span>
        </div>
        <span style={{ background: "rgba(141,130,196,0.15)", color: PURPLE_LIGHT, border: `1px solid ${PURPLE}`, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{b.sectors?.name}</span>
      </div>
      <h3 style={{ color: "white", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{b.name}</h3>
      <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{b.description?.slice(0, 100)}{b.description?.length > 100 ? "..." : ""}</p>
      <p style={{ color: MUTED, fontSize: 12 }}>📍 {b.city_town}</p>
    </div>
  )
}

export default function HomePage() {
  const [businesses, setBusinesses] = useState<any[]>([])
  const [sectors, setSectors] = useState<any[]>([])
  const [count, setCount] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    supabase.from("businesses").select("*, sectors(name)").eq("status", "approved").order("created_at", { ascending: false }).limit(6).then(({ data }) => { if (data) setBusinesses(data) })
    supabase.from("businesses").select("*", { count: "exact", head: true }).eq("status", "approved").then(({ count }) => { if (count) setCount(count) })
    supabase.from("sectors").select("*").eq("is_active", true).order("display_order").then(({ data }) => { if (data) setSectors(data) })
  }, [])

  const sectorEmojis = [
    { name: "Health & Wellbeing", emoji: "💚" },
    { name: "Creative Industries", emoji: "🎨" },
    { name: "Tech & Digital", emoji: "💻" },
    { name: "Food & Hospitality", emoji: "🍽️" },
    { name: "Professional Services", emoji: "💼" },
    { name: "Retail & E-commerce", emoji: "🛍️" },
    { name: "Education & Training", emoji: "📚" },
    { name: "Beauty & Personal Care", emoji: "✨" },
  ]

  return (
    <main style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: DARK }}>

      <nav style={{ background: NAV, padding: "0 2rem", height: 76, display: "flex", alignItems: "center", position: "sticky", top: 0, zIndex: 100, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <div style={{ background: "white", border: "2px solid #111", borderRadius: 4, padding: "6px 14px", textAlign: "center" }}>
              <p style={{ color: "#111", fontWeight: 800, fontSize: 13, letterSpacing: 0.5, margin: 0, lineHeight: 1.2 }}>BLACK<br/>BUSINESS</p>
              <p style={{ color: "#6b7280", fontWeight: 500, fontSize: 9, letterSpacing: 1, margin: "2px 0 0" }}>LINCOLNSHIRE</p>
            </div>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <NavLink href="/directory">Directory</NavLink>
            <NavLink href="/map">Map</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <NavLink href="/login">Log in</NavLink>
            <WhiteBtn href="/register">Add Your Business</WhiteBtn>
          </div>
        </div>
      </nav>

      <section style={{ background: `radial-gradient(circle at 70% 20%, rgba(141,130,196,0.25) 0%, transparent 50%), linear-gradient(135deg, #1d1a35 0%, #14111f 100%)`, padding: "100px 2rem 70px", textAlign: "center" }}>
        <p style={{ color: PURPLE_LIGHT, fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>For Black Entrepreneurs, Professionals and Creative Minds</p>
        <h1 style={{ color: "white", fontSize: 56, fontWeight: 800, lineHeight: 1.1, marginBottom: 40, letterSpacing: -1, maxWidth: 900, margin: "0 auto 40px" }}>
          Lincolnshire&#39;s Black<br />Business Directory
        </h1>

        <form method="GET" action="/directory" style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ background: "white", borderRadius: 100, padding: "10px 10px 10px 28px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 12px 40px rgba(0,0,0,0.3)" }}>
            <div style={{ flex: 1, textAlign: "left" }}>
              <p style={{ color: "#9ca3af", fontSize: 10, fontWeight: 700, letterSpacing: 1, margin: "0 0 2px" }}>KEYWORD</p>
              <input name="search" placeholder="Business or service..." style={{ border: "none", outline: "none", fontSize: 15, color: "#111827", width: "100%", background: "transparent" }} />
            </div>
            <div style={{ width: 1, height: 36, background: "#e5e7eb" }}></div>
            <div style={{ flex: 1, textAlign: "left", paddingLeft: 16 }}>
              <p style={{ color: "#9ca3af", fontSize: 10, fontWeight: 700, letterSpacing: 1, margin: "0 0 2px" }}>CATEGORY</p>
              <select name="sector" style={{ border: "none", outline: "none", fontSize: 15, color: "#111827", width: "100%", background: "transparent" }}>
                <option value="">All Categories</option>
                {sectors.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <button type="submit" style={{ background: PURPLE, color: "white", border: "none", borderRadius: 100, padding: "16px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>🔍 Search</button>
          </div>
        </form>

        {count > 0 && <p style={{ color: MUTED, fontSize: 13, marginTop: 28 }}>Trusted by {count}+ businesses</p>}
      </section>

      <section style={{ background: NAV, padding: "72px 2rem", textAlign: "center", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <h2 style={{ color: "white", fontSize: 30, fontWeight: 800, marginBottom: 16 }}>Black Business Lincolnshire</h2>
        <p style={{ color: MUTED, fontSize: 16, lineHeight: 1.8, maxWidth: 640, margin: "0 auto 28px" }}>A vibrant and supportive business community dedicated to empowering Black-owned businesses to thrive and achieve their maximum potential.</p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
          <a href="https://www.instagram.com/black_business_lincs/" target="_blank" rel="noopener noreferrer" style={{ width: 44, height: 44, borderRadius: "50%", border: `1.5px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 18, color: "white" }}>📸</a>
          <a href="https://www.linkedin.com/company/black-business-lincolnshire" target="_blank" rel="noopener noreferrer" style={{ width: 44, height: 44, borderRadius: "50%", border: `1.5px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 18, color: "white" }}>💼</a>
        </div>
      </section>

      <section style={{ background: DARK, padding: "80px 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40 }}>
            <div>
              <p style={{ color: PURPLE_LIGHT, fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Explore</p>
              <h2 style={{ color: "white", fontSize: 28, fontWeight: 800 }}>Browse by sector</h2>
            </div>
            <NavLink href="/map">🗺 View map</NavLink>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {sectorEmojis.map(s => <SectorCard key={s.name} name={s.name} emoji={s.emoji} />)}
          </div>
        </div>
      </section>

      {businesses.length > 0 && (
        <section style={{ background: NAV, padding: "80px 2rem", borderTop: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40 }}>
              <div>
                <p style={{ color: PURPLE_LIGHT, fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Latest</p>
                <h2 style={{ color: "white", fontSize: 28, fontWeight: 800 }}>Recently added</h2>
              </div>
              <NavLink href="/directory">See all →</NavLink>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {businesses.map((b: any) => <BusinessCard key={b.id} b={b} />)}
            </div>
          </div>
        </section>
      )}

      <section style={{ background: DARK, padding: "80px 2rem", textAlign: "center" }}>
        <h2 style={{ color: "white", fontSize: 32, fontWeight: 800, marginBottom: 20 }}>Ready to get discovered?</h2>
        <p style={{ color: MUTED, fontSize: 16, marginBottom: 36, maxWidth: 500, margin: "0 auto 36px" }}>Join the directory for free and put your business in front of people who want to support you.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <PurpleBtn href="/register">Add your business</PurpleBtn>
          <OutlineBtn href="/directory">Browse directory</OutlineBtn>
        </div>
      </section>

      <footer style={{ background: NAV, padding: "56px 2rem 28px", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, paddingBottom: 36, borderBottom: `1px solid ${BORDER}` }}>
            <div>
              <div style={{ background: "white", borderRadius: 4, padding: "6px 14px", display: "inline-block", marginBottom: 16 }}>
                <p style={{ color: "#111", fontWeight: 800, fontSize: 12, margin: 0, lineHeight: 1.2 }}>BLACK BUSINESS</p>
                <p style={{ color: "#6b7280", fontWeight: 500, fontSize: 8, letterSpacing: 1, margin: 0 }}>LINCOLNSHIRE</p>
              </div>
              <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.7, maxWidth: 280 }}>A vibrant and supportive business community dedicated to empowering Black-owned businesses to thrive.</p>
            </div>
            <div>
              <p style={{ color: "white", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Directory</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/directory" style={{ color: MUTED, fontSize: 13, textDecoration: "none" }}>Browse businesses</Link>
                <Link href="/map" style={{ color: MUTED, fontSize: 13, textDecoration: "none" }}>Business map</Link>
                <Link href="/register" style={{ color: MUTED, fontSize: 13, textDecoration: "none" }}>Add your business</Link>
              </div>
            </div>
            <div>
              <p style={{ color: "white", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Company</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/contact" style={{ color: MUTED, fontSize: 13, textDecoration: "none" }}>Contact us</Link>
                <Link href="/privacy" style={{ color: MUTED, fontSize: 13, textDecoration: "none" }}>Privacy Policy</Link>
              </div>
            </div>
            <div>
              <p style={{ color: "white", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Contact</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href="tel:+4402033998699" style={{ color: MUTED, fontSize: 13, textDecoration: "none" }}>+44 (0) 203 399 8699</a>
                <a href="mailto:Hello@blackbusinesslincs.com" style={{ color: MUTED, fontSize: 13, textDecoration: "none" }}>Hello@blackbusinesslincs.com</a>
                <p style={{ color: "#8b87a8", fontSize: 12, lineHeight: 1.6, margin: 0 }}>22 Claudius Road, North Hykeham, Lincoln LN6 9PH</p>
              </div>
            </div>
          </div>
          <p style={{ color: "#6b6788", fontSize: 12, textAlign: "center", marginTop: 24 }}>© 2025 Black Business Lincolnshire. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
