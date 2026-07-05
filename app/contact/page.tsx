"use client"
import Link from "next/link"

const DARK = "#19162e"
const NAV = "#221f3d"
const CARD = "#241f44"
const BORDER = "#3a3660"
const PURPLE = "#8d82c4"
const PURPLE_LIGHT = "#a89dd9"
const MUTED = "#b8b4d1"

export default function ContactPage() {
  return (
    <main style={{ minHeight: "100vh", background: DARK, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <nav style={{ background: NAV, padding: "0 2rem", height: 76, display: "flex", alignItems: "center", position: "sticky", top: 0, zIndex: 100, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ background: "white", borderRadius: 4, padding: "6px 14px" }}>
              <p style={{ color: "#111", fontWeight: 800, fontSize: 13, margin: 0, lineHeight: 1.2 }}>BLACK<br/>BUSINESS</p>
              <p style={{ color: "#6b7280", fontWeight: 500, fontSize: 9, letterSpacing: 1, margin: "2px 0 0" }}>LINCOLNSHIRE</p>
            </div>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Link href="/directory" style={{ color: "white", fontSize: 13, fontWeight: 700, textTransform: "uppercase", textDecoration: "none" }}>Directory</Link>
            <Link href="/register" style={{ background: "white", color: "#19162e", padding: "11px 20px", borderRadius: 8, fontSize: 12, fontWeight: 800, textTransform: "uppercase", textDecoration: "none" }}>Add Your Business</Link>
          </div>
        </div>
      </nav>

      <div style={{ background: `radial-gradient(circle at 70% 0%, rgba(141,130,196,0.2) 0%, transparent 50%), ${NAV}`, padding: "64px 2rem 56px", textAlign: "center", borderBottom: `1px solid ${BORDER}` }}>
        <p style={{ color: PURPLE_LIGHT, fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>We would love to hear from you</p>
        <h1 style={{ color: "white", fontSize: 40, fontWeight: 800, marginBottom: 12 }}>Get in touch</h1>
        <p style={{ color: MUTED, fontSize: 16, maxWidth: 480, margin: "0 auto" }}>Whether you have a question about the directory, need support with your listing, or just want to say hello — we are here.</p>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "56px 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <div style={{ background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 20, padding: 32 }}>
            <div style={{ width: 52, height: 52, background: "rgba(141,130,196,0.15)", border: `1.5px solid ${PURPLE}`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <span style={{ fontSize: 24 }}>📧</span>
            </div>
            <h2 style={{ color: "white", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Email us</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <p style={{ color: "#8b87a8", fontSize: 11, fontWeight: 600, marginBottom: 4, textTransform: "uppercase" }}>General enquiries</p>
                <a href="mailto:Hello@blackbusinesslincs.com" style={{ color: PURPLE_LIGHT, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Hello@blackbusinesslincs.com</a>
              </div>
              <div>
                <p style={{ color: "#8b87a8", fontSize: 11, fontWeight: 600, marginBottom: 4, textTransform: "uppercase" }}>Catherine</p>
                <a href="mailto:catherine@blackbusinesslincs.com" style={{ color: PURPLE_LIGHT, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>catherine@blackbusinesslincs.com</a>
              </div>
              <div>
                <p style={{ color: "#8b87a8", fontSize: 11, fontWeight: 600, marginBottom: 4, textTransform: "uppercase" }}>Anastasia</p>
                <a href="mailto:anastasia@blackbusinesslincs.com" style={{ color: PURPLE_LIGHT, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>anastasia@blackbusinesslincs.com</a>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 20, padding: 28, flex: 1 }}>
              <div style={{ width: 52, height: 52, background: "rgba(141,130,196,0.15)", border: `1.5px solid ${PURPLE}`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 24 }}>📞</span>
              </div>
              <h2 style={{ color: "white", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Call us</h2>
              <a href="tel:+4402033998699" style={{ color: PURPLE_LIGHT, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>+44 (0) 203 399 8699</a>
            </div>
            <div style={{ background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 20, padding: 28, flex: 1 }}>
              <div style={{ width: 52, height: 52, background: "rgba(141,130,196,0.15)", border: `1.5px solid ${PURPLE}`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 24 }}>📍</span>
              </div>
              <h2 style={{ color: "white", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Visit us</h2>
              <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.7, margin: 0 }}>22 Claudius Road<br />North Hykeham<br />Lincoln LN6 9PH</p>
            </div>
          </div>
        </div>

        <div style={{ background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 20, padding: 32 }}>
          <h2 style={{ color: "white", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Follow us on social media</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="https://www.instagram.com/black_business_lincs/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, background: "#1d1a35", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "12px 20px", textDecoration: "none" }}>
              <span style={{ fontSize: 20 }}>📸</span>
              <span style={{ color: "white", fontSize: 14, fontWeight: 500 }}>@black_business_lincs</span>
            </a>
            <a href="https://www.linkedin.com/company/black-business-lincolnshire" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, background: "#1d1a35", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "12px 20px", textDecoration: "none" }}>
              <span style={{ fontSize: 20 }}>💼</span>
              <span style={{ color: "white", fontSize: 14, fontWeight: 500 }}>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>

      <footer style={{ background: NAV, padding: "32px 2rem", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 4, padding: "4px 10px" }}>
            <p style={{ color: "#111", fontWeight: 800, fontSize: 10, margin: 0 }}>BLACK BUSINESS LINCS</p>
          </div>
          <p style={{ color: "#8b87a8", fontSize: 11, margin: 0 }}>22 Claudius Road, North Hykeham, Lincoln LN6 9PH</p>
          <p style={{ color: "#8b87a8", fontSize: 12, margin: 0 }}>© 2025 Black Business Lincolnshire</p>
        </div>
      </footer>
    </main>
  )
}
