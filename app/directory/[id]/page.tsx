import { createClient } from "../../../utils/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"

const NAV = "#221f3d"
const BORDER = "#3a3660"
const PURPLE = "#8d82c4"

export default async function BusinessProfilePage({ params }: { params: any }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: b } = await supabase.from("businesses").select("*, sectors(name)").eq("id", id).eq("status", "approved").single()
  if (!b) notFound()

  const socialLinks = [
    { url: b.website_url, label: "Website", emoji: "🌐" },
    { url: b.instagram_url, label: "Instagram", emoji: "📸" },
    { url: b.linkedin_url, label: "LinkedIn", emoji: "💼" },
    { url: b.facebook_url, label: "Facebook", emoji: "📘" },
    { url: b.tiktok_url, label: "TikTok", emoji: "🎵" },
  ].filter(s => s.url)

  const address = [b.address_line1, b.address_line2, b.city_town, b.postcode].filter(Boolean).join(", ")
  const hasContact = b.contact_email || b.contact_phone

  return (
    <main style={{ minHeight: "100vh", background: "white", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{`
        .bbl-link-card { display: flex; align-items: center; gap: 14px; background: #fafafa; border: 1.5px solid #e5e7eb; border-radius: 14px; padding: 14px 18px; text-decoration: none; transition: border-color 0.2s; }
        .bbl-link-card:hover { border-color: ${PURPLE}; }
        .bbl-social-card { display: flex; align-items: center; gap: 10px; background: #fafafa; border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 14px; text-decoration: none; transition: border-color 0.2s; }
        .bbl-social-card:hover { border-color: ${PURPLE}; }
      `}</style>

      <nav style={{ background: NAV, padding: "0 2rem", height: 76, display: "flex", alignItems: "center", position: "sticky", top: 0, zIndex: 100, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ background: "white", borderRadius: 4, padding: "6px 14px" }}>
              <p style={{ color: "#111", fontWeight: 800, fontSize: 13, margin: 0, lineHeight: 1.2 }}>BLACK<br/>BUSINESS</p>
              <p style={{ color: "#6b7280", fontWeight: 500, fontSize: 9, letterSpacing: 1, margin: "2px 0 0" }}>LINCOLNSHIRE</p>
            </div>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Link href="/directory" style={{ color: "white", fontSize: 14, textDecoration: "none" }}>← Back to directory</Link>
            <Link href="/register" style={{ background: "white", color: "#19162e", padding: "11px 20px", borderRadius: 8, fontSize: 12, fontWeight: 800, textTransform: "uppercase", textDecoration: "none" }}>Add Your Business</Link>
          </div>
        </div>
      </nav>

      <div style={{ background: "#fafafa", borderBottom: "1px solid #e5e7eb", padding: "48px 2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
            <div style={{ width: 80, height: 80, background: "#f3f1fa", border: "2px solid #8d82c4", borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#6f64a8", fontWeight: 800, fontSize: 32 }}>{b.name.charAt(0)}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{ background: "#f3f1fa", color: "#6f64a8", border: "1px solid #8d82c4", fontSize: 12, fontWeight: 600, padding: "3px 12px", borderRadius: 20 }}>{b.sectors?.name}</span>
                {b.is_rural && <span style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", fontSize: 12, fontWeight: 600, padding: "3px 12px", borderRadius: 20 }}>Rural</span>}
                <span style={{ background: "white", color: "#6b7280", border: "1px solid #e5e7eb", fontSize: 12, fontWeight: 500, padding: "3px 12px", borderRadius: 20 }}>{b.business_size === "sole_trader" ? "Sole trader" : b.business_size === "micro" ? "Micro business" : "SME"}</span>
              </div>
              <h1 style={{ color: "#111827", fontSize: 32, fontWeight: 800, marginBottom: 8 }}>{b.name}</h1>
              <p style={{ color: "#6b7280", fontSize: 15 }}>📍 {b.city_town}{b.is_rural ? " (Rural Lincolnshire)" : ""}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "white", border: "1.5px solid #e5e7eb", borderRadius: 20, padding: 28, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              <h2 style={{ color: "#111827", fontSize: 16, fontWeight: 700, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #f3f4f6" }}>About this business</h2>
              <p style={{ color: "#374151", fontSize: 15, lineHeight: 1.8 }}>{b.description}</p>
            </div>
            {b.services && (
              <div style={{ background: "white", border: "1.5px solid #e5e7eb", borderRadius: 20, padding: 28, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <h2 style={{ color: "#111827", fontSize: 16, fontWeight: 700, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #f3f4f6" }}>Services and products</h2>
                <p style={{ color: "#374151", fontSize: 15, lineHeight: 1.8 }}>{b.services}</p>
              </div>
            )}
            {b.target_audience && (
              <div style={{ background: "white", border: "1.5px solid #e5e7eb", borderRadius: 20, padding: 28, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <h2 style={{ color: "#111827", fontSize: 16, fontWeight: 700, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #f3f4f6" }}>Who they serve</h2>
                <p style={{ color: "#374151", fontSize: 15, lineHeight: 1.8 }}>{b.target_audience}</p>
              </div>
            )}
            {hasContact && (
              <div style={{ background: "white", border: "1.5px solid #e5e7eb", borderRadius: 20, padding: 28, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <h2 style={{ color: "#111827", fontSize: 16, fontWeight: 700, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #f3f4f6" }}>Get in touch</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {b.contact_email && (
                    <a href={`mailto:${b.contact_email}`} className="bbl-link-card">
                      <div style={{ width: 40, height: 40, background: "#f3f1fa", border: "1.5px solid #8d82c4", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 18 }}>📧</span>
                      </div>
                      <div>
                        <p style={{ color: "#9ca3af", fontSize: 11, fontWeight: 600, textTransform: "uppercase", margin: "0 0 2px" }}>Email</p>
                        <p style={{ color: "#6f64a8", fontSize: 14, fontWeight: 600, margin: 0 }}>{b.contact_email}</p>
                      </div>
                      <span style={{ color: "#9ca3af", fontSize: 14, marginLeft: "auto" }}>→</span>
                    </a>
                  )}
                  {b.contact_phone && (
                    <a href={`tel:${b.contact_phone}`} className="bbl-link-card">
                      <div style={{ width: 40, height: 40, background: "#f3f1fa", border: "1.5px solid #8d82c4", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 18 }}>📞</span>
                      </div>
                      <div>
                        <p style={{ color: "#9ca3af", fontSize: 11, fontWeight: 600, textTransform: "uppercase", margin: "0 0 2px" }}>Phone</p>
                        <p style={{ color: "#6f64a8", fontSize: 14, fontWeight: 600, margin: 0 }}>{b.contact_phone}</p>
                      </div>
                      <span style={{ color: "#9ca3af", fontSize: 14, marginLeft: "auto" }}>→</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "white", border: "1.5px solid #e5e7eb", borderRadius: 20, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              <h2 style={{ color: "#111827", fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Business details</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <p style={{ color: "#9ca3af", fontSize: 11, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Sector</p>
                  <p style={{ color: "#374151", fontSize: 14, fontWeight: 500 }}>{b.sectors?.name}</p>
                </div>
                <div>
                  <p style={{ color: "#9ca3af", fontSize: 11, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Location</p>
                  <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.6 }}>{address || b.city_town}</p>
                </div>
                <div>
                  <p style={{ color: "#9ca3af", fontSize: 11, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Business size</p>
                  <p style={{ color: "#374151", fontSize: 14 }}>{b.business_size === "sole_trader" ? "Sole trader" : b.business_size === "micro" ? "Micro (2-9 employees)" : "SME (10-249 employees)"}</p>
                </div>
                {b.years_in_operation && (
                  <div>
                    <p style={{ color: "#9ca3af", fontSize: 11, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Years in operation</p>
                    <p style={{ color: "#374151", fontSize: 14 }}>{b.years_in_operation} {b.years_in_operation === 1 ? "year" : "years"}</p>
                  </div>
                )}
              </div>
            </div>
            {socialLinks.length > 0 && (
              <div style={{ background: "white", border: "1.5px solid #e5e7eb", borderRadius: 20, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <h2 style={{ color: "#111827", fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Find them online</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {socialLinks.map(s => (
                    <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer" className="bbl-social-card">
                      <span style={{ fontSize: 18 }}>{s.emoji}</span>
                      <span style={{ color: "#6f64a8", fontSize: 14, fontWeight: 600 }}>{s.label}</span>
                      <span style={{ color: "#9ca3af", fontSize: 12, marginLeft: "auto" }}>→</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
            <div style={{ background: "#f3f1fa", border: "1.5px solid #8d82c4", borderRadius: 20, padding: 24, textAlign: "center" }}>
              <p style={{ color: "#111827", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Is your business listed?</p>
              <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 16 }}>Join the BBL directory for free</p>
              <Link href="/register" style={{ background: "#8d82c4", color: "white", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>Add your business</Link>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <Link href="/directory" style={{ color: "#6b7280", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>← Back to all businesses</Link>
        </div>
      </div>

      <footer style={{ background: NAV, padding: "32px 2rem", marginTop: 40, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 4, padding: "4px 10px" }}>
            <p style={{ color: "#111", fontWeight: 800, fontSize: 10, margin: 0 }}>BLACK BUSINESS LINCS</p>
          </div>
          <p style={{ color: "#8b87a8", fontSize: 11, margin: 0 }}>© 2025 Black Business Lincolnshire</p>
        </div>
      </footer>
    </main>
  )
}