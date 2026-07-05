"use client"
import { useState } from "react"
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

export default function RegisterPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleRegister(e: any) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      try {
        await fetch("/api/email/welcome", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, firstName: fullName.split(" ")[0] }) })
      } catch {}
      router.push("/account")
    }
  }

  const inp: React.CSSProperties = { width: "100%", background: "#1d1a35", border: `1.5px solid ${BORDER}`, borderRadius: 10, padding: "12px 14px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }
  const lbl: React.CSSProperties = { color: MUTED, fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }

  return (
    <main style={{ minHeight: "100vh", background: DARK, fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", flexDirection: "column" }}>
      <nav style={{ background: NAV, padding: "0 2rem", height: 76, display: "flex", alignItems: "center", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ background: "white", borderRadius: 4, padding: "6px 14px" }}>
              <p style={{ color: "#111", fontWeight: 800, fontSize: 13, margin: 0, lineHeight: 1.2 }}>BLACK<br/>BUSINESS</p>
              <p style={{ color: "#6b7280", fontWeight: 500, fontSize: 9, letterSpacing: 1, margin: "2px 0 0" }}>LINCOLNSHIRE</p>
            </div>
          </Link>
          <Link href="/login" style={{ color: "white", fontSize: 14, textDecoration: "none" }}>Already registered? <span style={{ color: PURPLE_LIGHT, fontWeight: 700 }}>Log in</span></Link>
        </div>
      </nav>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{ color: "white", fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Create your account</h1>
            <p style={{ color: MUTED, fontSize: 14 }}>Join the Black Business Lincolnshire directory — it is free</p>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 32 }}>
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={lbl}>Full name</label>
                <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name" style={inp} />
              </div>
              <div>
                <label style={lbl}>Email address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inp} />
              </div>
              <div>
                <label style={lbl}>Password</label>
                <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" style={inp} />
              </div>
              {error && <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid #ef4444", borderRadius: 10, padding: "10px 14px", color: "#fca5a5", fontSize: 13 }}>{error}</div>}
              <button type="submit" disabled={loading} style={{ background: PURPLE, color: "white", border: "none", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
          </div>
          <p style={{ textAlign: "center", color: MUTED, fontSize: 13, marginTop: 20 }}>
            Already have an account? <Link href="/login" style={{ color: PURPLE_LIGHT, textDecoration: "none", fontWeight: 600 }}>Log in</Link>
          </p>
        </div>
      </div>
      <footer style={{ background: NAV, padding: "24px 2rem", textAlign: "center", borderTop: `1px solid ${BORDER}` }}>
        <p style={{ color: "#8b87a8", fontSize: 11, margin: 0 }}>© 2025 Black Business Lincolnshire</p>
      </footer>
    </main>
  )
}
