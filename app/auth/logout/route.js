import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const supabase = createClient();
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const { error } = await supabase.auth.signOut();

  return NextResponse.json({}, { status: 200 });
}
