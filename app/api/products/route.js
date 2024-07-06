"use server";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
  const supabase = createClient();
  const user = supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from") || 0;
  const to = searchParams.get("to") || 19;

  const { data, error, count } = await supabase
    .from("Products")
    .select("*", { count: "exact" })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count }, { status: 200 });
}
