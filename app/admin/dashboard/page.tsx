"use client"
import { useState, useEffect } from "react"
import { createClient } from "../../../utils/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

const DARK = "#19162e"
const NAV = "#221f3d"
const CARD = "#241f44"
const BORDER = "#3a3660"
const PURPLE = "#8d82c4"
const PURPLE_LIGHT = "#a89dd9"
const MUTED = "#b8b4d1"

type Tab = "pending" | "all" | "reports" | "sectors" | "audit" | "add"

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("pending")
  const [pending, setPending] = useState<any[]>([])
  const [allBusinesses, setAllBusinesses] = useState<any[]>([])
  const [sectors, setSectors] = useState<any[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({})
  const [adminEmail, setAdminEmail] = useState("")
  const [newSectorName, setNewSectorName] = useState("")
  const [sectorMsg, setSectorMsg] = useState("")

  const blankForm = { name: "", description: "", services: "", city_town: "", postcode: "", address_line1: "", address_line2: "", contact_email: "", contact_phone: "", website_url: "", instagram_url: "", linkedin_url: "", facebook_url: "", tiktok_url: "", years_in_operation: "", business_size: "", sector_id: "", target_audience: "", support_needs: "", is_rural: false, status: "approved", admin_consent: false }
  const [addForm, setAddForm] = useState(blankForm)
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState("")
  const [addSuccess, setAddSuccess] = useState("")

  async function loadData() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/admin/login"); return }
    setAdminEmail(user.email || "")
    const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", user.email).eq("is_active", true).single()
    if (!adminUser) { router.push("/admin/login"); return }
    const [p, a, s, al] = await Promise.all([
      supabase.from("businesses").select("*, sectors(name), owner_accounts(full_name, email)").eq("status", "pending").order("created_at", { ascending: true }),
      supabase.from("businesses").select("*, sectors(name)").order("created_at", { ascending: false }),
      supabase.from("sectors").select("*").order("display_order"),
      supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(50)
    ])
    setPending(p.data || [])
    setAllBusinesses(a.data || [])
    setSectors(s.data || [])
    setAuditLogs(al.data || [])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  async function approve(id: string) {
    const supabase = createClient()
    await supabase.from("businesses").update({ status: "approved", approved_at: new Date().toISOString() }).eq("id", id)
    loadData()
  }

  async function reject(id: string) {
    const reason = rejectReasons[id]
    if (!reason) { alert("Please enter a rejection reason"); return }
    const supabase = createClient()
    await supabase.from("businesses").update({ status: "rejected", rejection_reason: reason }).eq("id", id)
    loadData()
  }

  async function addSector() {
    if (!newSectorName.trim()) return
    const supabase = createClient()
    const slug = newSectorName.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    const { error } = await supabase.from("sectors").insert({ name: newSectorName.trim(), slug, display_order: sectors.length + 1 })
    if (error) { setSectorMsg("Error: " + error.message) } else { setSectorMsg("Sector added!"); setNewSectorName(""); loadData() }
    setTimeout(() => setSectorMsg(""), 3000)
  }

  async function toggleSector(id: string, is_active: boolean) {
    const supabase = createClient()
    await supabase.from("sectors").update({ is_active: !is_active }).eq("id", id)
    loadData()
  }

  function exportCSV() {
    const headers = ["Name", "Sector", "Location", "Size", "Status", "Rural", "Website", "Years"]
    const rows = allBusinesses.map(b => [b.name, b.sectors?.name || "", b.city_town, b.business_size, b.status, b.is_rural ? "Yes" : "No", b.website_url || "", b.years_in_operation || ""])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = "bbl-businesses.csv"; a.click()
  }

  function handleAddChange(e: any) {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
    setAddForm(prev => ({ ...prev, [e.target.name]: value }))
  }

  async function submitAddBusiness(e: any) {
    e.preventDefault()
    setAddError("")
    setAddSuccess("")
    if (!addForm.name || !addForm.sector_id || !addForm.description || !addForm.city_town || !addForm.postcode || !addForm.business_size) {
      setAddError("Please fill in all required fields.")
      return
    }
    if (!addForm.admin_consent) { setAddError("Please confirm you have the owner's permission."); return }
    setAddLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { name, description, services, city_town, postcode, address_line1, address_line2, contact_email, contact_phone, website_url, instagram_url, linkedin_url, facebook_url, tiktok_url, years_in_operation, business_size, sector_id, target_audience, support_needs, is_rural, status } = addForm
    const { data: inserted, error } = await supabase.from("businesses").insert({
      name, description, services, city_town, postcode, address_line1, address_line2, contact_email, contact_phone, website_url, instagram_url, linkedin_url, facebook_url, tiktok_url,
      years_in_operation: years_in_operation ? parseInt(years_in_operation) : null,
      business_size, sector_id, target_audience, support_needs, is_rural, status,
      owner_account_id: null, gdpr_consent: true, gdpr_consent_date: new Date().toISOString(),
      approved_at: status === "approved" ? new Date().toISOString() : null,
    }).select().single()

    if (error) { setAddError(error.message) } else {
      if (user && inserted) {
        await supabase.from("audit_logs").insert({ actor_id: user.id, actor_type: "admin", actor_email: user.email, action: "admin_add_business", target_table: "businesses", target_id: inserted.id })
      }
      setAddSuccess(`"${name}" was added and is now ${status}.`)
      setAddForm(blankForm)
      loadData()
    }
    setAddLoading(false)
  }

  const approved = allBusinesses.filter(b => b.status === "approved").length
  const rejected = allBusinesses.filter(b => b.status === "rejected").length
  const sectorBreakdown = sectors.map(s => ({ name: s.name, count: allBusinesses.filter(b => b.sector_id === s.id).length })).filter(s => s.count > 0).sort((a, b) => b.count - a.count)
  const locationBreakdown = Object.entries(allBusinesses.reduce((acc: any, b) => { acc[b.city_town] = (acc[b.city_town] || 0) + 1; return acc }, {})).sort((a: any, b: any) => b[1] - a[1]).slice(0, 10)
  const sizeBreakdown = [
    { name: "Sole trader", count: allBusinesses.filter(b => b.business_size === "sole_trader").length },
    { name: "Micro (2-9)", count: allBusinesses.filter(b => b.business_size === "micro").length },
    { name: "SME (10-249)", count: allBusinesses.filter(b => b.business_size === "sme").length },
  ]

  const tabStyle = (active: boolean): React.CSSProperties => ({ background: active ? PURPLE : "none", border: "none", color: "white", fontSize: 13, padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: active ? 700 : 500 })
  const inp: React.CSSProperties = { width: "100%", background: "#1d1a35", border: `1.5px solid ${BORDER}`, borderRadius: 10, padding: "11px 14px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }
  const lbl: React.CSSProperties = { color: MUTED, fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }
  const hint: React.CSSProperties = { color: "#8b87a8", fontWeight: 400 }
  const sec: React.CSSProperties = { background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 20, padding: 24, display: "flex", flexDirection: "column", gap: 16 }

  if (loading) return (
    <main style={{ minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <p style={{ color: MUTED, fontSize: 14 }}>Loading dashboard...</p>
    </main>
  )

  return (
    <main style={{ minHeight: "100vh", background: DARK, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <nav style={{ background: NAV, padding: "0 2rem", height: 76, display: "flex", alignItems: "center", position: "sticky", top: 0, zIndex: 100, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ background: "white", borderRadius: 4, padding: "6px 14px" }}>
              <p style={{ color: "#111", fontWeight: 800, fontSize: 13, margin: 0, lineHeight: 1.2 }}>BLACK<br/>BUSINESS</p>
              <p style={{ color: "#6b7280", fontWeight: 500, fontSize: 9, letterSpacing: 1, margin: "2px 0 0" }}>LINCOLNSHIRE</p>
            </div>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ color: MUTED, fontSize: 13 }}>{adminEmail}</span>
            <button onClick={async () => { const s = createClient(); await s.auth.signOut(); router.push("/admin/login") }} style={{ background: "none", border: `1.5px solid ${BORDER}`, color: "white", fontSize: 13, fontWeight: 600, padding: "7px 16px", borderRadius: 8, cursor: "pointer" }}>Log out</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 2rem" }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ color: PURPLE_LIGHT, fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Admin</p>
          <h1 style={{ color: "white", fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Dashboard</h1>
          <p style={{ color: MUTED, fontSize: 14 }}>Manage business submissions and listings</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Total submissions", value: allBusinesses.length, color: "white" },
            { label: "Pending review", value: pending.length, color: "#fde047" },
            { label: "Approved", value: approved, color: "#86efac" },
            { label: "Rejected", value: rejected, color: "#fca5a5" },
          ].map(s => (
            <div key={s.label} style={{ background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 16, padding: "20px 24px" }}>
              <p style={{ color: s.color, fontSize: 32, fontWeight: 800, marginBottom: 4 }}>{s.value}</p>
              <p style={{ color: MUTED, fontSize: 13, fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 32, background: NAV, padding: 4, borderRadius: 12, width: "fit-content", flexWrap: "wrap" }}>
          {(["pending", "all", "add", "reports", "sectors", "audit"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={tabStyle(tab === t)}>
              {t === "pending" ? `Pending (${pending.length})` : t === "all" ? "All businesses" : t === "add" ? "+ Add business" : t === "reports" ? "Reports" : t === "sectors" ? "Sectors" : "Audit log"}
            </button>
          ))}
        </div>

        {tab === "pending" && (
          <div>
            <h2 style={{ color: "white", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Pending review ({pending.length})</h2>
            {pending.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {pending.map((b: any) => (
                  <div key={b.id} style={{ background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 20, padding: 28 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 48, height: 48, background: "rgba(141,130,196,0.15)", border: `1.5px solid ${PURPLE}`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ color: PURPLE_LIGHT, fontWeight: 800, fontSize: 20 }}>{b.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 style={{ color: "white", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{b.name}</h3>
                          <p style={{ color: MUTED, fontSize: 13 }}>{b.sectors?.name} · {b.city_town} · {b.owner_accounts?.full_name || "Added by admin"} {b.owner_accounts?.email ? `(${b.owner_accounts.email})` : ""}</p>
                        </div>
                      </div>
                      <span style={{ background: "rgba(234,179,8,0.15)", color: "#fde047", border: "1px solid #eab308", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>pending</span>
                    </div>
                    <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{b.description}</p>
                    {b.services && <p style={{ color: MUTED, fontSize: 13, marginBottom: 8 }}><span style={{ color: "white", fontWeight: 600 }}>Services: </span>{b.services}</p>}
                    {b.support_needs && <p style={{ color: MUTED, fontSize: 13, marginBottom: 8 }}><span style={{ color: "white", fontWeight: 600 }}>Support needs: </span>{b.support_needs}</p>}
                    <p style={{ color: "#8b87a8", fontSize: 13, marginBottom: 16 }}>{b.city_town}, {b.postcode} · {b.business_size} · {b.years_in_operation ? b.years_in_operation + " years" : "years not specified"}{b.is_rural ? " · Rural" : ""}</p>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
                      {b.website_url && <a href={b.website_url} target="_blank" rel="noopener noreferrer" style={{ color: PURPLE_LIGHT, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Website →</a>}
                      {b.instagram_url && <a href={b.instagram_url} target="_blank" rel="noopener noreferrer" style={{ color: PURPLE_LIGHT, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Instagram →</a>}
                      {b.linkedin_url && <a href={b.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: PURPLE_LIGHT, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>LinkedIn →</a>}
                    </div>
                    <div style={{ display: "flex", gap: 12, paddingTop: 20, borderTop: `1px solid ${BORDER}` }}>
                      <button onClick={() => approve(b.id)} style={{ background: PURPLE, color: "white", border: "none", borderRadius: 10, padding: "11px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Approve</button>
                      <input type="text" placeholder="Rejection reason (required)" value={rejectReasons[b.id] || ""} onChange={e => setRejectReasons(prev => ({ ...prev, [b.id]: e.target.value }))} style={{ flex: 1, background: "#1d1a35", border: `1.5px solid ${BORDER}`, borderRadius: 10, padding: "10px 14px", color: "white", fontSize: 14, outline: "none" }} />
                      <button onClick={() => reject(b.id)} style={{ background: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "1.5px solid #ef4444", borderRadius: 10, padding: "11px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 20, padding: 48, textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                <p style={{ color: "white", fontSize: 15, fontWeight: 600 }}>All caught up!</p>
                <p style={{ color: MUTED, fontSize: 14 }}>No pending submissions right now.</p>
              </div>
            )}
          </div>
        )}

        {tab === "all" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ color: "white", fontSize: 18, fontWeight: 700 }}>All businesses ({allBusinesses.length})</h2>
              <button onClick={exportCSV} style={{ background: PURPLE, color: "white", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Export CSV</button>
            </div>
            <div style={{ background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 20, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORDER}`, background: NAV }}>
                    {["Business", "Sector", "Location", "Size", "Rural", "Status"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "14px 20px", color: MUTED, fontWeight: 600, fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allBusinesses.map((b: any, i: number) => (
                    <tr key={b.id} style={{ borderBottom: i < allBusinesses.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                      <td style={{ padding: "14px 20px", color: "white", fontWeight: 600 }}>{b.name}</td>
                      <td style={{ padding: "14px 20px", color: MUTED }}>{b.sectors?.name}</td>
                      <td style={{ padding: "14px 20px", color: MUTED }}>{b.city_town}</td>
                      <td style={{ padding: "14px 20px", color: MUTED }}>{b.business_size === "sole_trader" ? "Sole trader" : b.business_size === "micro" ? "Micro" : "SME"}</td>
                      <td style={{ padding: "14px 20px", color: MUTED }}>{b.is_rural ? "Yes" : "No"}</td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ background: b.status === "approved" ? "rgba(34,197,94,0.15)" : b.status === "rejected" ? "rgba(239,68,68,0.15)" : "rgba(234,179,8,0.15)", color: b.status === "approved" ? "#86efac" : b.status === "rejected" ? "#fca5a5" : "#fde047", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "add" && (
          <div>
            <h2 style={{ color: "white", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Add a business manually</h2>
            <p style={{ color: MUTED, fontSize: 13, marginBottom: 24 }}>Use this when adding a business on someone&#39;s behalf.</p>
            <form onSubmit={submitAddBusiness} style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 700 }}>
              <div style={sec}>
                <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, paddingBottom: 14, borderBottom: `1px solid ${BORDER}` }}>Business details</h3>
                <div><label style={lbl}>Business name *</label><input required name="name" value={addForm.name} onChange={handleAddChange} style={inp} /></div>
                <div><label style={lbl}>Sector *</label>
                  <select required name="sector_id" value={addForm.sector_id} onChange={handleAddChange} style={inp}>
                    <option value="">Select a sector</option>
                    {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Short description * <span style={hint}>(max 300 characters)</span></label><textarea required name="description" value={addForm.description} onChange={handleAddChange} rows={3} maxLength={300} style={{ ...inp, resize: "vertical" }} /></div>
                <div><label style={lbl}>Services or products offered</label><textarea name="services" value={addForm.services} onChange={handleAddChange} rows={2} style={{ ...inp, resize: "vertical" }} /></div>
                <div><label style={lbl}>Business size *</label>
                  <select required name="business_size" value={addForm.business_size} onChange={handleAddChange} style={inp}>
                    <option value="">Select size</option>
                    <option value="sole_trader">Sole trader (just me)</option>
                    <option value="micro">Micro (2-9 employees)</option>
                    <option value="sme">SME (10-249 employees)</option>
                  </select>
                </div>
                <div><label style={lbl}>Years in operation</label><input type="number" name="years_in_operation" value={addForm.years_in_operation} onChange={handleAddChange} min="0" max="100" style={inp} /></div>
                <div><label style={lbl}>Target audience</label><input name="target_audience" value={addForm.target_audience} onChange={handleAddChange} style={inp} /></div>
              </div>

              <div style={sec}>
                <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, paddingBottom: 14, borderBottom: `1px solid ${BORDER}` }}>Contact details</h3>
                <div><label style={lbl}>Business email <span style={hint}>(optional)</span></label><input type="email" name="contact_email" value={addForm.contact_email} onChange={handleAddChange} style={inp} /></div>
                <div><label style={lbl}>Business phone <span style={hint}>(optional)</span></label><input type="tel" name="contact_phone" value={addForm.contact_phone} onChange={handleAddChange} style={inp} /></div>
              </div>

              <div style={sec}>
                <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, paddingBottom: 14, borderBottom: `1px solid ${BORDER}` }}>Location</h3>
                <div><label style={lbl}>Address line 1 <span style={hint}>(optional)</span></label><input name="address_line1" value={addForm.address_line1} onChange={handleAddChange} style={inp} /></div>
                <div><label style={lbl}>Address line 2 <span style={hint}>(optional)</span></label><input name="address_line2" value={addForm.address_line2} onChange={handleAddChange} style={inp} /></div>
                <div><label style={lbl}>City or town *</label><input required name="city_town" value={addForm.city_town} onChange={handleAddChange} style={inp} /></div>
                <div><label style={lbl}>Postcode *</label><input required name="postcode" value={addForm.postcode} onChange={handleAddChange} style={inp} /></div>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" name="is_rural" checked={addForm.is_rural} onChange={handleAddChange} />
                  <span style={{ color: "white", fontSize: 14 }}>This is a rural Lincolnshire business</span>
                </label>
              </div>

              <div style={sec}>
                <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, paddingBottom: 14, borderBottom: `1px solid ${BORDER}` }}>Online presence</h3>
                <div><label style={lbl}>Website</label><input type="url" name="website_url" value={addForm.website_url} onChange={handleAddChange} style={inp} /></div>
                <div><label style={lbl}>Instagram</label><input type="url" name="instagram_url" value={addForm.instagram_url} onChange={handleAddChange} style={inp} /></div>
                <div><label style={lbl}>LinkedIn</label><input type="url" name="linkedin_url" value={addForm.linkedin_url} onChange={handleAddChange} style={inp} /></div>
                <div><label style={lbl}>Facebook</label><input type="url" name="facebook_url" value={addForm.facebook_url} onChange={handleAddChange} style={inp} /></div>
                <div><label style={lbl}>TikTok</label><input type="url" name="tiktok_url" value={addForm.tiktok_url} onChange={handleAddChange} style={inp} /></div>
              </div>

              <div style={sec}>
                <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, paddingBottom: 14, borderBottom: `1px solid ${BORDER}` }}>Support needs <span style={hint}>(internal only)</span></h3>
                <textarea name="support_needs" value={addForm.support_needs} onChange={handleAddChange} rows={2} style={{ ...inp, resize: "vertical" }} />
              </div>

              <div style={sec}>
                <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, paddingBottom: 14, borderBottom: `1px solid ${BORDER}` }}>Listing status</h3>
                <select name="status" value={addForm.status} onChange={handleAddChange} style={inp}>
                  <option value="approved">Approved — go live immediately</option>
                  <option value="pending">Pending — needs review first</option>
                </select>
              </div>

              <div style={{ background: "rgba(141,130,196,0.1)", border: `1.5px solid ${PURPLE}`, borderRadius: 16, padding: 20 }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                  <input type="checkbox" name="admin_consent" checked={addForm.admin_consent} onChange={handleAddChange} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ color: "white", fontSize: 13, lineHeight: 1.7 }}>I confirm this business has given permission for Black Business Lincolnshire to list their details, including any contact details, on the public directory.</span>
                </label>
              </div>

              {addError && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", borderRadius: 10, padding: "12px 16px", color: "#fca5a5", fontSize: 13 }}>{addError}</div>}
              {addSuccess && <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid #22c55e", borderRadius: 10, padding: "12px 16px", color: "#86efac", fontSize: 13 }}>{addSuccess}</div>}

              <button type="submit" disabled={addLoading} style={{ background: PURPLE, color: "white", border: "none", borderRadius: 12, padding: "15px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                {addLoading ? "Adding..." : "Add business"}
              </button>
            </form>
          </div>
        )}

        {tab === "reports" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <h2 style={{ color: "white", fontSize: 18, fontWeight: 700 }}>Reports & breakdowns</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 20, padding: 24 }}>
                <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, marginBottom: 20 }}>By sector</h3>
                {sectorBreakdown.map(s => (
                  <div key={s.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ color: MUTED, fontSize: 13, fontWeight: 500 }}>{s.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 100, height: 6, background: "#1d1a35", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${(s.count / allBusinesses.length) * 100}%`, height: "100%", background: PURPLE, borderRadius: 3 }}></div>
                      </div>
                      <span style={{ color: "white", fontSize: 13, fontWeight: 700, minWidth: 20 }}>{s.count}</span>
                    </div>
                  </div>
                ))}
                {sectorBreakdown.length === 0 && <p style={{ color: "#8b87a8", fontSize: 13 }}>No data yet</p>}
              </div>
              <div style={{ background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 20, padding: 24 }}>
                <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, marginBottom: 20 }}>By location (top 10)</h3>
                {locationBreakdown.map(([town, count]: any) => (
                  <div key={town} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ color: MUTED, fontSize: 13, fontWeight: 500 }}>{town}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 100, height: 6, background: "#1d1a35", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${(count / allBusinesses.length) * 100}%`, height: "100%", background: "#60a5fa", borderRadius: 3 }}></div>
                      </div>
                      <span style={{ color: "white", fontSize: 13, fontWeight: 700, minWidth: 20 }}>{count}</span>
                    </div>
                  </div>
                ))}
                {locationBreakdown.length === 0 && <p style={{ color: "#8b87a8", fontSize: 13 }}>No data yet</p>}
              </div>
              <div style={{ background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 20, padding: 24 }}>
                <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, marginBottom: 20 }}>By business size</h3>
                {sizeBreakdown.map(s => (
                  <div key={s.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ color: MUTED, fontSize: 13, fontWeight: 500 }}>{s.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 100, height: 6, background: "#1d1a35", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: allBusinesses.length ? `${(s.count / allBusinesses.length) * 100}%` : "0%", height: "100%", background: "#c084fc", borderRadius: 3 }}></div>
                      </div>
                      <span style={{ color: "white", fontSize: 13, fontWeight: 700, minWidth: 20 }}>{s.count}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 20, padding: 24 }}>
                <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Overview</h3>
                {[
                  { label: "Total listings", value: allBusinesses.length },
                  { label: "Approved", value: approved },
                  { label: "Pending review", value: pending.length },
                  { label: "Rejected", value: rejected },
                  { label: "Rural businesses", value: allBusinesses.filter(b => b.is_rural).length },
                  { label: "Approval rate", value: allBusinesses.length ? Math.round((approved / allBusinesses.length) * 100) + "%" : "N/A" },
                ].map(s => (
                  <div key={s.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${BORDER}` }}>
                    <span style={{ color: MUTED, fontSize: 13 }}>{s.label}</span>
                    <span style={{ color: "white", fontSize: 14, fontWeight: 700 }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "sectors" && (
          <div>
            <h2 style={{ color: "white", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Sector management</h2>
            <div style={{ background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 20, padding: 24, marginBottom: 20 }}>
              <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Add new sector</h3>
              <div style={{ display: "flex", gap: 12 }}>
                <input type="text" value={newSectorName} onChange={e => setNewSectorName(e.target.value)} placeholder="e.g. Agriculture" style={{ flex: 1, background: "#1d1a35", border: `1.5px solid ${BORDER}`, borderRadius: 10, padding: "10px 14px", color: "white", fontSize: 14, outline: "none" }} />
                <button onClick={addSector} style={{ background: PURPLE, color: "white", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Add sector</button>
              </div>
              {sectorMsg && <p style={{ color: "#86efac", fontSize: 13, marginTop: 8, fontWeight: 500 }}>{sectorMsg}</p>}
            </div>
            <div style={{ background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 20, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORDER}`, background: NAV }}>
                    {["Sector", "Slug", "Businesses", "Status"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "14px 20px", color: MUTED, fontWeight: 600, fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sectors.map((s: any, i: number) => (
                    <tr key={s.id} style={{ borderBottom: i < sectors.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                      <td style={{ padding: "14px 20px", color: "white", fontWeight: 600 }}>{s.name}</td>
                      <td style={{ padding: "14px 20px", color: "#8b87a8", fontFamily: "monospace", fontSize: 12 }}>{s.slug}</td>
                      <td style={{ padding: "14px 20px", color: MUTED }}>{allBusinesses.filter(b => b.sector_id === s.id).length}</td>
                      <td style={{ padding: "14px 20px" }}>
                        <button onClick={() => toggleSector(s.id, s.is_active)} style={{ background: s.is_active ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: s.is_active ? "#86efac" : "#fca5a5", border: "none", borderRadius: 8, padding: "5px 14px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                          {s.is_active ? "Active" : "Disabled"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "audit" && (
          <div>
            <h2 style={{ color: "white", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Audit log (last 50 actions)</h2>
            <div style={{ background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 20, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORDER}`, background: NAV }}>
                    {["Action", "Actor", "Target", "When"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "14px 20px", color: MUTED, fontWeight: 600, fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.length > 0 ? auditLogs.map((log: any, i: number) => (
                    <tr key={log.id} style={{ borderBottom: i < auditLogs.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ background: log.action.includes("approve") ? "rgba(34,197,94,0.15)" : log.action.includes("reject") ? "rgba(239,68,68,0.15)" : "rgba(96,165,250,0.15)", color: log.action.includes("approve") ? "#86efac" : log.action.includes("reject") ? "#fca5a5" : "#93c5fd", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{log.action}</span>
                      </td>
                      <td style={{ padding: "14px 20px", color: MUTED, fontSize: 12 }}>{log.actor_email}</td>
                      <td style={{ padding: "14px 20px", color: MUTED, fontSize: 12 }}>{log.target_table}</td>
                      <td style={{ padding: "14px 20px", color: MUTED, fontSize: 12 }}>{new Date(log.created_at).toLocaleString("en-GB")}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} style={{ padding: "48px 20px", textAlign: "center", color: "#8b87a8" }}>No audit logs yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <footer style={{ background: NAV, padding: "32px 2rem", marginTop: 40, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 4, padding: "4px 10px" }}>
            <p style={{ color: "#111", fontWeight: 800, fontSize: 10, margin: 0 }}>BLACK BUSINESS LINCS</p>
          </div>
          <p style={{ color: "#8b87a8", fontSize: 11, margin: 0 }}>© 2025 Black Business Lincolnshire — Staff access only</p>
        </div>
      </footer>
    </main>
  )
}
