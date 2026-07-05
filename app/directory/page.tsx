import { createClient } from "../../utils/supabase/server"
import Link from "next/link"

const DARK = "#19162e"
const NAV = "#221f3d"
const BORDER = "#3a3660"
const PURPLE = "#8d82c4"
const PURPLE_LIGHT = "#a89dd9"
const MUTED = "#b8b4d1"

export default async function DirectoryPage({ searchParams }: { searchParams: any }) {
  const supabase = await createClient()
  const params = await searchParams
  const search = params.search || ""
  const sector = params.sector || ""
  const size = params.size || ""
  const rural = params.rural || ""
  const sort = params.sort || "newest"
  const { data: sectors } = await supabase.from("sectors").select("*").eq("is_active", true).order("display_order")
  let query = supabase.from("businesses").select("*, sectors(name)").eq("status", "approved")
  if (search) query = query.ilike("name", "%" + search + "%")
  if (sector) query = query.eq("sector_id", sector)
  if (size) query = query.eq("business_size", size)
  if (rural) query = query.eq("is_rural", true)
  if (sort === "az") { query = query.order("name", { ascending: true }) } else { query = query.order("created_at", { ascending: false }) }
  const { data: businesses } = await query

  return (
    <main style={{ minHeight: "100vh", background: "white", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <nav style={{ background: NAV, padding: "0 2rem", height: 76, display: "flex", alignItems: "center", position: "sticky", top: 0, zIndex: 100, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ background: "white", borderRadius: 4, padding: "6px 14px" }}>
              <p style={{ color: "#111", fontWeight: 800, fontSize: 13, margin: 0, lineHeight: 1.2 }}>BLACK<br/>BUSINESS</p>
              <p style={{ color: "#6b7280", fontWeight: 500, fontSize: 9, letterSpacing: 1, margin: "2px 0 0" }}>LINCOLNSHIRE</p>
            </div>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <Link href="/map" style={{ color: "white", fontSize: 13, fontWeight: 700, textTransform: "uppercase", textDecoration: "none" }}>Map</Link>
            <Link href="/contact" style={{ color: "white", fontSize: 13, fontWeight: 700, textTransform: "uppercase", textDecoration: "none" }}>Contact</Link>
            <Link href="/login" style={{ color: "white", fontSize: 13, fontWeight: 700, textTransform: "uppercase", textDecoration: "none" }}>Log in</Link>
            <Link href="/register" style={{ background: "white", color: "#19162e", padding: "12px 22px", borderRadius: 8, fontSize: 12, fontWeight: 800, textTransform: "uppercase", textDecoration: "none" }}>Add Your Business</Link>
          </div>
        </div>
      </nav>

      <div style={{ background: `radial-gradient(circle at 70% 20%, rgba(141,130,196,0.25) 0%, transparent 50%), linear-gradient(135deg, #1d1a35 0%, #14111f 100%)`, padding: "64px 2rem 60px", textAlign: "center" }}>
        <p style={{ color: PURPLE_LIGHT, fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Explore</p>
        <h1 style={{ color: "white", fontSize: 36, fontWeight: 800, marginBottom: 32 }}>Business Directory</h1>

        <form method="GET" style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ background: "white", borderRadius: 100, padding: "10px 10px 10px 28px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 12px 40px rgba(0,0,0,0.3)" }}>
            <div style={{ flex: 1, textAlign: "left" }}>
              <p style={{ color: "#9ca3af", fontSize: 10, fontWeight: 700, letterSpacing: 1, margin: "0 0 2px" }}>KEYWORD</p>
              <input name="search" defaultValue={search} placeholder="Business or service..." style={{ border: "none", outline: "none", fontSize: 15, color: "#111827", width: "100%", background: "transparent" }} />
            </div>
            <div style={{ width: 1, height: 36, background: "#e5e7eb" }}></div>
            <div style={{ flex: 1, textAlign: "left", paddingLeft: 16 }}>
              <p style={{ color: "#9ca3af", fontSize: 10, fontWeight: 700, letterSpacing: 1, margin: "0 0 2px" }}>CATEGORY</p>
              <select name="sector" defaultValue={sector} style={{ border: "none", outline: "none", fontSize: 15, color: "#111827", width: "100%", background: "transparent" }}>
                <option value="">All Categories</option>
                {sectors?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <button type="submit" style={{ background: PURPLE, color: "white", border: "none", borderRadius: 100, padding: "16px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>🔍 Search</button>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
            <select name="size" defaultValue={size} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 10, padding: "9px 14px", color: "white", fontSize: 13, outline: "none" }}>
              <option value="">All sizes</option>
              <option value="sole_trader">Sole trader</option>
              <option value="micro">Micro (2-9)</option>
              <option value="sme">SME (10-249)</option>
            </select>
            <select name="sort" defaultValue={sort} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 10, padding: "9px 14px", color: "white", fontSize: 13, outline: "none" }}>
              <option value="newest">Newest first</option>
              <option value="az">A to Z</option>
            </select>
            <label style={{ display: "flex", alignItems: "center", gap: 8, color: "white", fontSize: 13, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 10, padding: "9px 14px", cursor: "pointer" }}>
              <input type="checkbox" name="rural" value="true" defaultChecked={rural === "true"} />
              Rural only
            </label>
            <button type="submit" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 10, padding: "9px 14px", color: "white", fontSize: 13, cursor: "pointer" }}>Apply</button>
            <Link href="/directory" style={{ color: MUTED, fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", padding: "9px 14px" }}>Clear filters</Link>
          </div>
        </form>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 2rem", background: "white" }}>
        <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 24, fontWeight: 500 }}>{businesses?.length || 0} {businesses?.length === 1 ? "business" : "businesses"} found</p>
        {businesses && businesses.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {businesses.map((b: any) => (
              <Link key={b.id} href={`/directory/${b.id}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ background: "white", border: "1.5px solid #e5e7eb", borderRadius: 20, padding: 24, height: "100%", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 44, height: 44, background: "#f3f1fa", border: "1.5px solid #8d82c4", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ color: "#6f64a8", fontWeight: 800, fontSize: 18 }}>{b.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h2 style={{ color: "#111827", fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{b.name}</h2>
                        <p style={{ color: "#9ca3af", fontSize: 12 }}>📍 {b.city_town}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                      <span style={{ background: "#f3f1fa", color: "#6f64a8", border: "1px solid #8d82c4", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>{b.sectors?.name}</span>
                      {b.is_rural && <span style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20 }}>Rural</span>}
                    </div>
                  </div>
                  <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>{b.description?.slice(0, 120)}{b.description?.length > 120 ? "..." : ""}</p>
                  <p style={{ color: "#9ca3af", fontSize: 12, marginBottom: 16 }}>{b.business_size === "sole_trader" ? "Sole trader" : b.business_size === "micro" ? "Micro business" : "SME"}{b.years_in_operation ? " · " + b.years_in_operation + " yrs" : ""}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", gap: 10 }}>
                      {b.website_url && <span style={{ color: "#6f64a8", fontSize: 12, fontWeight: 600 }}>Website</span>}
                      {b.instagram_url && <span style={{ color: "#6f64a8", fontSize: 12, fontWeight: 600 }}>Instagram</span>}
                    </div>
                    <span style={{ color: "#6f64a8", fontSize: 13, fontWeight: 700 }}>View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ background: "#fafafa", border: "1.5px solid #e5e7eb", borderRadius: 20, padding: 60, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ color: "#111827", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No businesses found</p>
            <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>Try adjusting your search or filters</p>
            <Link href="/register" style={{ background: PURPLE, color: "white", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Add your business</Link>
          </div>
        )}
        <div style={{ background: "#fafafa", border: "1.5px solid #e5e7eb", borderRadius: 20, padding: 40, textAlign: "center", marginTop: 40 }}>
          <p style={{ color: "#111827", fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Is your business listed?</p>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>Join the Black Business Lincolnshire directory today — it is completely free</p>
          <Link href="/register" style={{ background: PURPLE, color: "white", padding: "13px 28px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>Add your business</Link>
        </div>
      </div>

      <footer style={{ background: NAV, padding: "32px 2rem", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 4, padding: "4px 10px" }}>
            <p style={{ color: "#111", fontWeight: 800, fontSize: 10, margin: 0 }}>BLACK BUSINESS LINCS</p>
          </div>
          <p style={{ color: "#8b87a8", fontSize: 11, margin: 0, textAlign: "center" }}>22 Claudius Road, North Hykeham, Lincoln LN6 9PH · +44 (0) 203 399 8699</p>
          <p style={{ color: "#8b87a8", fontSize: 12, margin: 0 }}>© 2025 Black Business Lincolnshire</p>
        </div>
      </footer>
    </main>
  )
}
