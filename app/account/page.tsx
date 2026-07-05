import { createClient } from "../../utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

const DARK = "#19162e"
const NAV = "#221f3d"
const CARD = "#241f44"
const BORDER = "#3a3660"
const PURPLE = "#8d82c4"
const MUTED = "#b8b4d1"

function NoBusiness() {
  return (
    <div style={{ background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 20, padding: 48, textAlign: "center" }}>
      <div style={{ width: 64, height: 64, background: "rgba(141,130,196,0.15)", border: `1.5px solid ${PURPLE}`, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <span style={{ fontSize: 28 }}>🏢</span>
      </div>
      <h2 style={{ color: "white", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No listing yet</h2>
      <p style={{ color: MUTED, fontSize: 14, marginBottom: 28 }}>You have not submitted a business listing yet. It only takes about 5 minutes!</p>
      <a href="/submit" style={{ background: PURPLE, color: "white", padding: "13px 28px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>Submit your business</a>
    </div>
  )
}

function BusinessCard({ business }: { business: any }) {
  const badgeStyle: Record<string, React.CSSProperties> = {
    approved: { background: "rgba(34,197,94,0.15)", color: "#86efac", border: "1px solid #22c55e", fontSize: 12, fontWeight: 600, padding: "4px 14px", borderRadius: 20 },
    rejected: { background: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "1px solid #ef4444", fontSize: 12, fontWeight: 600, padding: "4px 14px", borderRadius: 20 },
    pending: { background: "rgba(234,179,8,0.15)", color: "#fde047", border: "1px solid #eab308", fontSize: 12, fontWeight: 600, padding: "4px 14px", borderRadius: 20 },
  }
  return (
    <div style={{ background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 20, padding: 32 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 52, height: 52, background: "rgba(141,130,196,0.15)", border: `1.5px solid ${PURPLE}`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#a89dd9", fontWeight: 800, fontSize: 22 }}>{business.name.charAt(0)}</span>
          </div>
          <div>
            <h2 style={{ color: "white", fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{business.name}</h2>
            <p style={{ color: MUTED, fontSize: 13 }}>{business.sectors?.name}</p>
          </div>
        </div>
        <span style={badgeStyle[business.status] || badgeStyle.pending}>{business.status}</span>
      </div>
      {business.status === "pending" && (
        <div style={{ background: "rgba(234,179,8,0.1)", border: "1px solid #eab308", borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <p style={{ color: "#fde047", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Under review</p>
          <p style={{ color: "#fef08a", fontSize: 13 }}>Our team will review your listing within 5 working days.</p>
        </div>
      )}
      {business.status === "approved" && (
        <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid #22c55e", borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <p style={{ color: "#86efac", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Your listing is live! 🎉</p>
          <p style={{ color: "#bbf7d0", fontSize: 13 }}>Your business is now visible on the public directory. <a href="/directory" style={{ color: "white", fontWeight: 600 }}>View the directory →</a></p>
        </div>
      )}
      {business.status === "rejected" && business.rejection_reason && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <p style={{ color: "#fca5a5", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Rejection reason:</p>
          <p style={{ color: "#fecaca", fontSize: 13, marginBottom: 12 }}>{business.rejection_reason}</p>
          <a href="/submit" style={{ color: "#fca5a5", fontSize: 13, fontWeight: 600, textDecoration: "underline" }}>Edit and resubmit →</a>
        </div>
      )}
      <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{business.description}</p>
      <div style={{ display: "flex", gap: 12, paddingTop: 20, borderTop: `1px solid ${BORDER}` }}>
        <a href="/submit" style={{ background: "#1d1a35", color: "white", border: `1px solid ${BORDER}`, padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Edit listing</a>
        {business.status === "approved" && <a href="/directory" style={{ background: PURPLE, color: "white", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>View in directory</a>}
      </div>
    </div>
  )
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { redirect("/login") }
  const { data: business } = await supabase.from("businesses").select("*, sectors(name)").eq("owner_account_id", user.id).single()

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
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Link href="/directory" style={{ color: "white", fontSize: 14, textDecoration: "none" }}>Directory</Link>
            <form action="/auth/signout" method="post">
              <button type="submit" style={{ background: "none", border: `1.5px solid ${BORDER}`, color: "white", fontSize: 13, fontWeight: 600, padding: "7px 16px", borderRadius: 8, cursor: "pointer" }}>Log out</button>
            </form>
          </div>
        </div>
      </nav>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 2rem" }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ color: "#a89dd9", fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>My account</p>
          <h1 style={{ color: "white", fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Your dashboard</h1>
          <p style={{ color: MUTED, fontSize: 14 }}>Logged in as {user.email}</p>
        </div>
        {business ? <BusinessCard business={business} /> : <NoBusiness />}
      </div>
      <footer style={{ background: NAV, padding: "24px 2rem", textAlign: "center", borderTop: `1px solid ${BORDER}` }}>
        <p style={{ color: "#8b87a8", fontSize: 11, margin: 0 }}>© 2025 Black Business Lincolnshire</p>
      </footer>
    </main>
  )
}
