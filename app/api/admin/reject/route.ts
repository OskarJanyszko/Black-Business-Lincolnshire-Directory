import { createClient } from "../../../../utils/supabase/server"
import { NextResponse } from "next/server"
import { sendRejectionEmail } from "../../../../utils/emails/index"

export async function POST(request: Request) {
  const supabase = await createClient()
  const formData = await request.formData()
  const id = formData.get("id") as string
  const reason = formData.get("reason") as string
  const { data: { user } } = await supabase.auth.getUser()
  const { data: business } = await supabase.from("businesses").select("*, owner_accounts(full_name, email)").eq("id", id).single()
  await supabase.from("businesses").update({ status: "rejected", rejection_reason: reason }).eq("id", id)
  if (user && business) {
    await supabase.from("audit_logs").insert({ actor_id: user.id, actor_type: "admin", actor_email: user.email, action: "reject_business", target_table: "businesses", target_id: id, ip_address: request.headers.get("x-forwarded-for") || "" })
    if (business.owner_accounts?.email) {
      await sendRejectionEmail(business.owner_accounts.email, business.owner_accounts.full_name?.split(" ")[0] || "there", business.name, reason)
    }
  }
  return NextResponse.redirect(new URL("/admin/dashboard", request.url))
}
