import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  return NextResponse.json({}, { status: 200 });
}
