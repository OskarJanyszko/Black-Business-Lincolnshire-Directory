import { sendWelcomeEmail } from "../../../../utils/emails/index"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, firstName } = await request.json()
    await sendWelcomeEmail(email, firstName)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Email API error:", error)
    return NextResponse.json({ success: false })
  }
}
