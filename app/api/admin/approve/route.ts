import { createClient } from "../../../../utils/supabase/server"
import { NextResponse } from "next/server"
import { sendApprovalEmail } from "../../../../utils/emails/index"

export async function POST(request: Request) {
  const supabase = await createClient()
  const formData = await request.formData()
  const id = formData.get("id") as string
  const { data: { user } } = await supabase.auth.getUser()
  const { data: business } = await supabase.from("businesses").select("*, owner_accounts(full_name, email)").eq("id", id).single()
  await supabase.from("businesses").update({ status: "approved", approved_at: new Date().toISOString() }).eq("id", id)
  if (user && business) {
    await supabase.from("audit_logs").insert({ actor_id: user.id, actor_type: "admin", actor_email: user.email, action: "approve_business", target_table: "businesses", target_id: id, ip_address: request.headers.get("x-forwarded-for") || "" })
    if (business.owner_accounts?.email) {
      await sendApprovalEmail(business.owner_accounts.email, business.owner_accounts.full_name?.split(" ")[0] || "there", business.name)
    }
  }
  return NextResponse.redirect(new URL("/admin/dashboard", request.url))
}
