import Link from "next/link"

const DARK = "#19162e"
const NAV = "#221f3d"
const CARD = "#241f44"
const BORDER = "#3a3660"
const PURPLE_LIGHT = "#a89dd9"
const MUTED = "#b8b4d1"

export default function PrivacyPage() {
  const sections = [
    { title: "1. Who we are", content: "Black Business Lincolnshire is the data controller for all personal data collected through this website. Our registered address is 22 Claudius Road, North Hykeham, Lincoln, LN6 9PH. You can contact us at Hello@blackbusinesslincs.com or by calling +44 (0) 203 399 8699." },
    { title: "2. What data we collect", list: ["Account information: your full name, email address, and password (stored as a secure hash)", "Business listing information: business name, sector, description, services, location, website, social links, contact email, contact phone, years in operation, business size", "GDPR consent record: date, time, and IP address when you ticked the consent checkbox", "Usage data: login timestamps used for engagement reporting", "Any emails you send to us"] },
    { title: "3. How we use your data", list: ["To create and manage your account on the BBL directory", "To display your business listing on the public directory", "To contact you about your listing status", "To send a welcome email when you register", "To produce anonymised reporting on sector, location, and business size", "To comply with our legal obligations under UK GDPR"] },
    { title: "4. What is shown publicly", content: "The following may appear on the public directory if you provide it: business name, sector, description, services, target audience, city or town, address (if provided), business contact email, business contact phone, website URL, and social media links. Your personal name, personal email, and account password are never shown publicly." },
    { title: "5. Legal basis for processing", list: ["Consent: you give explicit consent when ticking the GDPR checkbox on the submission form", "Legitimate interests: we use basic account data to manage your access and send transactional emails", "Legal obligation: we retain certain records to comply with UK law"] },
    { title: "6. Your rights under UK GDPR", list: ["Right to access: view all data via your account or a Subject Access Request to Hello@blackbusinesslincs.com", "Right to rectification: update your listing and account details at any time", "Right to erasure: request deletion through your account settings — personal details anonymised within 30 days", "Right to object: contact us to remove your listing from the public directory", "Right to data portability: request a machine-readable copy of your data"] },
    { title: "7. Data retention", list: ["Approved listings retained until you request erasure", "Rejected listings inactive for 2 years are soft-deleted", "Pending listings inactive for 90 days are auto-rejected and the owner notified", "Audit logs retained permanently for GDPR accountability"] },
    { title: "8. Data security", content: "All data is stored on Supabase infrastructure with row-level security enforced at the database level. Passwords are hashed using bcrypt and never stored in plain text. All data is transmitted over HTTPS. Admin dashboard access is restricted to authorised BBL staff and all admin actions are logged." },
    { title: "9. Third party services", list: ["Supabase: database hosting and authentication — supabase.com/privacy", "Vercel: website hosting — vercel.com/legal/privacy-policy", "Resend: transactional email delivery — resend.com/privacy", "OpenStreetMap / Nominatim: map tiles and geocoding — openstreetmap.org/privacy"] },
    { title: "10. Cookies", content: "We use a single session cookie to keep you logged in. This is essential for the website to function and does not track you across other websites. We do not use advertising or third-party tracking cookies." },
    { title: "11. Changes to this policy", content: "We may update this Privacy Policy from time to time. When we do, we will update the date at the top of this page." },
  ]

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
          <Link href="/" style={{ color: "white", fontSize: 14, textDecoration: "none" }}>← Back to home</Link>
        </div>
      </nav>

      <div style={{ background: NAV, borderBottom: `1px solid ${BORDER}`, padding: "48px 2rem" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{ color: PURPLE_LIGHT, fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Legal</p>
          <h1 style={{ color: "white", fontSize: 36, fontWeight: 800, marginBottom: 8 }}>Privacy Policy</h1>
          <p style={{ color: MUTED, fontSize: 15 }}>Last updated: June 2025</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ background: "rgba(141,130,196,0.1)", border: `1.5px solid #8d82c4`, borderRadius: 16, padding: 24 }}>
            <p style={{ color: "white", fontSize: 14, lineHeight: 1.7, margin: 0 }}>This Privacy Policy explains how Black Business Lincolnshire collects, uses, and protects your personal data in accordance with UK GDPR and the Data Protection Act 2018. By using our website and submitting your business listing, you agree to the terms set out below.</p>
          </div>
          {sections.map(section => (
            <div key={section.title} style={{ background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 20, padding: 28 }}>
              <h2 style={{ color: "white", fontSize: 17, fontWeight: 700, marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${BORDER}` }}>{section.title}</h2>
              {section.content && <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.8, margin: 0 }}>{section.content}</p>}
              {section.list && (
                <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                  {section.list.map((item, i) => <li key={i} style={{ color: MUTED, fontSize: 14, lineHeight: 1.7 }}>{item}</li>)}
                </ul>
              )}
            </div>
          ))}
          <div style={{ background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 20, padding: 28 }}>
            <h2 style={{ color: "white", fontSize: 17, fontWeight: 700, marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${BORDER}` }}>Contact details</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="mailto:Hello@blackbusinesslincs.com" style={{ color: PURPLE_LIGHT, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>📧 Hello@blackbusinesslincs.com</a>
              <a href="tel:+4402033998699" style={{ color: PURPLE_LIGHT, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>📞 +44 (0) 203 399 8699</a>
              <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>📍 22 Claudius Road, North Hykeham, Lincoln, LN6 9PH</p>
            </div>
          </div>
          <div style={{ background: "rgba(141,130,196,0.1)", border: `1.5px solid #8d82c4`, borderRadius: 16, padding: 20, textAlign: "center" }}>
            <p style={{ color: "white", fontSize: 13, marginBottom: 12 }}>If you believe your data has been mishandled, you have the right to lodge a complaint with the ICO at ico.org.uk or by calling 0303 123 1113.</p>
            <Link href="/" style={{ color: PURPLE_LIGHT, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>← Back to Black Business Lincolnshire</Link>
          </div>
        </div>
      </div>

      <footer style={{ background: NAV, padding: "32px 2rem", borderTop: `1px solid ${BORDER}` }}>
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
