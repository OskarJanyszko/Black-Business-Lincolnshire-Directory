"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "../../../utils/supabase/client"
import Link from "next/link"

const DARK = "#19162e"
const NAV = "#221f3d"
const CARD = "#241f44"
const BORDER = "#3a3660"
const PURPLE = "#8d82c4"
const MUTED = "#b8b4d1"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleLogin(e: any) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError || !authData.user) { setError("Invalid email or password"); setLoading(false); return }
    const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", authData.user.email).eq("is_active", true).single()
    if (!adminUser) { setError("You do not have admin access"); await supabase.auth.signOut(); setLoading(false); return }
    router.push("/admin/dashboard")
    setLoading(false)
  }

  return (
    <main style={{ minHeight: "100vh", background: DARK, fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", flexDirection: "column" }}>
      <nav style={{ background: NAV, padding: "0 2rem", height: 76, display: "flex", alignItems: "center", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "flex", alignItems: "center" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ background: "white", borderRadius: 4, padding: "6px 14px" }}>
              <p style={{ color: "#111", fontWeight: 800, fontSize: 13, margin: 0, lineHeight: 1.2 }}>BLACK<br/>BUSINESS</p>
              <p style={{ color: "#6b7280", fontWeight: 500, fontSize: 9, letterSpacing: 1, margin: "2px 0 0" }}>LINCOLNSHIRE</p>
            </div>
          </Link>
        </div>
      </nav>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 60, height: 60, background: "rgba(141,130,196,0.15)", border: `1.5px solid ${PURPLE}`, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <span style={{ fontSize: 28 }}>🔐</span>
            </div>
            <h1 style={{ color: "white", fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Admin login</h1>
            <p style={{ color: MUTED, fontSize: 14 }}>BBL staff access only</p>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 32 }}>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ color: MUTED, fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" style={{ width: "100%", background: "#1d1a35", border: `1.5px solid ${BORDER}`, borderRadius: 10, padding: "12px 14px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" as const }} />
              </div>
              <div>
                <label style={{ color: MUTED, fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Password</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" style={{ width: "100%", background: "#1d1a35", border: `1.5px solid ${BORDER}`, borderRadius: 10, padding: "12px 14px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" as const }} />
              </div>
              {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", borderRadius: 10, padding: "10px 14px", color: "#fca5a5", fontSize: 13 }}>{error}</div>}
              <button type="submit" disabled={loading} style={{ background: PURPLE, color: "white", border: "none", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <footer style={{ background: NAV, padding: "24px 2rem", textAlign: "center", borderTop: `1px solid ${BORDER}` }}>
        <p style={{ color: "#8b87a8", fontSize: 11, margin: 0 }}>© 2025 Black Business Lincolnshire — Staff access only</p>
      </footer>
    </main>
  )
}
