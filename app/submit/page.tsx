"use client"
import { useState, useEffect } from "react"
import { createClient } from "../../utils/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

const DARK = "#19162e"
const NAV = "#221f3d"
const CARD = "#241f44"
const BORDER = "#3a3660"
const PURPLE = "#8d82c4"
const PURPLE_LIGHT = "#a89dd9"
const MUTED = "#b8b4d1"

export default function SubmitPage() {
  const router = useRouter()
  const [sectors, setSectors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [existingBusiness, setExistingBusiness] = useState<any>(null)
  const [form, setForm] = useState({ name: "", description: "", services: "", city_town: "", postcode: "", address_line1: "", address_line2: "", contact_email: "", contact_phone: "", website_url: "", instagram_url: "", linkedin_url: "", facebook_url: "", tiktok_url: "", years_in_operation: "", business_size: "", sector_id: "", target_audience: "", support_needs: "", is_rural: false, gdpr_consent: false })

  useEffect(() => {
    const supabase = createClient()
    supabase.from("sectors").select("*").order("display_order").then(({ data }) => { if (data) setSectors(data) })
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from("businesses").select("*").eq("owner_account_id", user.id).single().then(({ data }) => {
        if (data) {
          setExistingBusiness(data)
          setForm({ name: data.name || "", description: data.description || "", services: data.services || "", city_town: data.city_town || "", postcode: data.postcode || "", address_line1: data.address_line1 || "", address_line2: data.address_line2 || "", contact_email: data.contact_email || "", contact_phone: data.contact_phone || "", website_url: data.website_url || "", instagram_url: data.instagram_url || "", linkedin_url: data.linkedin_url || "", facebook_url: data.facebook_url || "", tiktok_url: data.tiktok_url || "", years_in_operation: data.years_in_operation?.toString() || "", business_size: data.business_size || "", sector_id: data.sector_id || "", target_audience: data.target_audience || "", support_needs: data.support_needs || "", is_rural: data.is_rural || false, gdpr_consent: false })
        }
      })
    })
  }, [])

  function handleChange(e: any) {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
    setForm(prev => ({ ...prev, [e.target.name]: value }))
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    if (!form.gdpr_consent) { setError("You must tick the GDPR consent box to submit."); return }
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/login"); return }
    if (existingBusiness) {
      if (existingBusiness.resubmission_count >= 3 && existingBusiness.status === "rejected") { setError("You have reached the maximum resubmissions. Please contact BBL directly."); setLoading(false); return }
      const isMaterial = form.name !== existingBusiness.name || form.sector_id !== existingBusiness.sector_id || form.postcode !== existingBusiness.postcode
      const newCount = existingBusiness.status === "rejected" ? (existingBusiness.resubmission_count || 0) + 1 : existingBusiness.resubmission_count
      const { error } = await supabase.from("businesses").update({ ...form, years_in_operation: form.years_in_operation ? parseInt(form.years_in_operation) : null, gdpr_consent_date: new Date().toISOString(), status: isMaterial ? "pending" : existingBusiness.status, resubmission_count: newCount }).eq("id", existingBusiness.id)
      if (error) { setError(error.message) } else { router.push("/account") }
    } else {
      const { error } = await supabase.from("businesses").insert({ ...form, owner_account_id: user.id, years_in_operation: form.years_in_operation ? parseInt(form.years_in_operation) : null, gdpr_consent_date: new Date().toISOString(), status: "pending" })
      if (error) { setError(error.message) } else { router.push("/account") }
    }
    setLoading(false)
  }

  const inp: React.CSSProperties = { width: "100%", background: "#1d1a35", border: `1.5px solid ${BORDER}`, borderRadius: 10, padding: "12px 14px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }
  const lbl: React.CSSProperties = { color: MUTED, fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }
  const hint: React.CSSProperties = { color: "#8b87a8", fontWeight: 400 }
  const sec: React.CSSProperties = { background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 20, padding: 28, display: "flex", flexDirection: "column", gap: 20 }
  const maxResubmissions = existingBusiness?.status === "rejected" && existingBusiness?.resubmission_count >= 3

  return (
    <main style={{ minHeight: "100vh", background: DARK, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <nav style={{ background: NAV, padding: "0 2rem", height: 76, display: "flex", alignItems: "center", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ background: "white", borderRadius: 4, padding: "6px 14px" }}>
              <p style={{ color: "#111", fontWeight: 800, fontSize: 13, margin: 0, lineHeight: 1.2 }}>BLACK<br/>BUSINESS</p>
              <p style={{ color: "#6b7280", fontWeight: 500, fontSize: 9, letterSpacing: 1, margin: "2px 0 0" }}>LINCOLNSHIRE</p>
            </div>
          </Link>
          <Link href="/account" style={{ color: "white", fontSize: 14, textDecoration: "none" }}>← Back to account</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 2rem" }}>
        <div style={{ marginBottom: 36 }}>
          <p style={{ color: PURPLE_LIGHT, fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{existingBusiness ? "Edit listing" : "Get listed"}</p>
          <h1 style={{ color: "white", fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{existingBusiness ? "Edit your listing" : "Submit your business"}</h1>
          <p style={{ color: MUTED, fontSize: 14 }}>{existingBusiness ? "Update your details below" : "Get your business in front of people across Lincolnshire"}</p>
          {existingBusiness?.status === "rejected" && (
            <div style={{ marginTop: 16, background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", borderRadius: 12, padding: 16 }}>
              <p style={{ color: "#fca5a5", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Your listing was rejected</p>
              <p style={{ color: "#fca5a5", fontSize: 13, marginBottom: 4 }}>Reason: {existingBusiness.rejection_reason}</p>
              <p style={{ color: MUTED, fontSize: 12 }}>Resubmissions used: {existingBusiness.resubmission_count || 0} / 3</p>
            </div>
          )}
        </div>

        {maxResubmissions ? (
          <div style={{ background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 20, padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✋</div>
            <p style={{ color: "white", fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Maximum resubmissions reached</p>
            <p style={{ color: MUTED, fontSize: 14, marginBottom: 24 }}>Please contact the BBL team directly for help.</p>
            <a href="mailto:Hello@blackbusinesslincs.com" style={{ background: PURPLE, color: "white", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Contact BBL</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={sec}>
              <h2 style={{ color: "white", fontSize: 16, fontWeight: 700, paddingBottom: 16, borderBottom: `1px solid ${BORDER}` }}>Business details</h2>
              <div><label style={lbl}>Business name *</label><input required name="name" value={form.name} onChange={handleChange} style={inp} placeholder="Your business name" /></div>
              <div><label style={lbl}>Sector *</label>
                <select required name="sector_id" value={form.sector_id} onChange={handleChange} style={inp}>
                  <option value="">Select a sector</option>
                  {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Short description * <span style={hint}>(max 300 characters)</span></label><textarea required name="description" value={form.description} onChange={handleChange} rows={3} maxLength={300} style={{ ...inp, resize: "vertical" }} placeholder="Describe your business in a few sentences" /></div>
              <div><label style={lbl}>Services or products offered</label><textarea name="services" value={form.services} onChange={handleChange} rows={2} style={{ ...inp, resize: "vertical" }} placeholder="What do you offer?" /></div>
              <div><label style={lbl}>Business size *</label>
                <select required name="business_size" value={form.business_size} onChange={handleChange} style={inp}>
                  <option value="">Select size</option>
                  <option value="sole_trader">Sole trader (just me)</option>
                  <option value="micro">Micro (2-9 employees)</option>
                  <option value="sme">SME (10-249 employees)</option>
                </select>
              </div>
              <div><label style={lbl}>Years in operation</label><input type="number" name="years_in_operation" value={form.years_in_operation} onChange={handleChange} min="0" max="100" style={inp} placeholder="e.g. 3" /></div>
              <div><label style={lbl}>Target audience</label><input name="target_audience" value={form.target_audience} onChange={handleChange} style={inp} placeholder="Who do you serve?" /></div>
            </div>

            <div style={sec}>
              <h2 style={{ color: "white", fontSize: 16, fontWeight: 700, paddingBottom: 16, borderBottom: `1px solid ${BORDER}` }}>Contact details <span style={hint}>(shown publicly)</span></h2>
              <div><label style={lbl}>Business email <span style={hint}>(optional)</span></label><input type="email" name="contact_email" value={form.contact_email} onChange={handleChange} style={inp} placeholder="hello@yourbusiness.com" /></div>
              <div><label style={lbl}>Business phone <span style={hint}>(optional)</span></label><input type="tel" name="contact_phone" value={form.contact_phone} onChange={handleChange} style={inp} placeholder="e.g. 07700 900000" /></div>
            </div>

            <div style={sec}>
              <h2 style={{ color: "white", fontSize: 16, fontWeight: 700, paddingBottom: 16, borderBottom: `1px solid ${BORDER}` }}>Location</h2>
              <div><label style={lbl}>Address line 1 <span style={hint}>(optional)</span></label><input name="address_line1" value={form.address_line1} onChange={handleChange} style={inp} placeholder="e.g. 10 High Street" /></div>
              <div><label style={lbl}>Address line 2 <span style={hint}>(optional)</span></label><input name="address_line2" value={form.address_line2} onChange={handleChange} style={inp} placeholder="e.g. City Centre" /></div>
              <div><label style={lbl}>City or town *</label><input required name="city_town" value={form.city_town} onChange={handleChange} style={inp} placeholder="e.g. Lincoln, Spalding, Grantham" /></div>
              <div><label style={lbl}>Postcode *</label><input required name="postcode" value={form.postcode} onChange={handleChange} style={inp} placeholder="e.g. LN1 1AA" /></div>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input type="checkbox" name="is_rural" checked={form.is_rural} onChange={handleChange} />
                <span style={{ color: "white", fontSize: 14 }}>This is a rural Lincolnshire business</span>
              </label>
            </div>

            <div style={sec}>
              <h2 style={{ color: "white", fontSize: 16, fontWeight: 700, paddingBottom: 16, borderBottom: `1px solid ${BORDER}` }}>Online presence</h2>
              <div><label style={lbl}>Website</label><input type="url" name="website_url" value={form.website_url} onChange={handleChange} style={inp} placeholder="https://yourwebsite.com" /></div>
              <div><label style={lbl}>Instagram</label><input type="url" name="instagram_url" value={form.instagram_url} onChange={handleChange} style={inp} placeholder="https://instagram.com/yourbusiness" /></div>
              <div><label style={lbl}>LinkedIn</label><input type="url" name="linkedin_url" value={form.linkedin_url} onChange={handleChange} style={inp} placeholder="https://linkedin.com/company/yourbusiness" /></div>
              <div><label style={lbl}>Facebook</label><input type="url" name="facebook_url" value={form.facebook_url} onChange={handleChange} style={inp} placeholder="https://facebook.com/yourbusiness" /></div>
              <div><label style={lbl}>TikTok</label><input type="url" name="tiktok_url" value={form.tiktok_url} onChange={handleChange} style={inp} placeholder="https://tiktok.com/@yourbusiness" /></div>
            </div>

            <div style={sec}>
              <h2 style={{ color: "white", fontSize: 16, fontWeight: 700, paddingBottom: 16, borderBottom: `1px solid ${BORDER}` }}>Support needs <span style={hint}>(internal only)</span></h2>
              <textarea name="support_needs" value={form.support_needs} onChange={handleChange} rows={2} style={{ ...inp, resize: "vertical" }} placeholder="Any support you are looking for from BBL" />
            </div>

            <div style={{ background: "rgba(141,130,196,0.1)", border: `1.5px solid ${PURPLE}`, borderRadius: 16, padding: 20 }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                <input type="checkbox" name="gdpr_consent" checked={form.gdpr_consent} onChange={handleChange} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ color: "white", fontSize: 13, lineHeight: 1.7 }}>I consent to Black Business Lincolnshire storing and displaying the information above in their business directory. I understand that any contact details I provide will be shown publicly on my listing. <Link href="/privacy" style={{ color: PURPLE_LIGHT, textDecoration: "none", fontWeight: 600 }}>Privacy Policy</Link></span>
              </label>
            </div>

            {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", borderRadius: 10, padding: "12px 16px", color: "#fca5a5", fontSize: 13 }}>{error}</div>}

            <button type="submit" disabled={loading} style={{ background: PURPLE, color: "white", border: "none", borderRadius: 12, padding: "15px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              {loading ? "Saving..." : existingBusiness ? "Save changes" : "Submit your business"}
            </button>
          </form>
        )}
      </div>

      <footer style={{ background: NAV, padding: "24px 2rem", textAlign: "center", borderTop: `1px solid ${BORDER}` }}>
        <p style={{ color: "#8b87a8", fontSize: 11, margin: 0 }}>© 2025 Black Business Lincolnshire</p>
      </footer>
    </main>
  )
}
