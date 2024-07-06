"use server";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request, { params }) {
  const supabase = createClient();
  const user = supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  }

  const { id } = params;
  const { data, error } = await supabase
    .from("Logs")
    .select()
    .eq("product_id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
