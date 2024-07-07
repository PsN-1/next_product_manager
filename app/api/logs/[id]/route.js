"use server";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import LogService from "@/server/services/LogService";

export async function GET(request, { params }) {
  const supabase = createClient();
  const user = supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  }

  const { id } = params;
  const logService = new LogService(supabase);
  const response = await logService.getLogsByProductId(id);

  return NextResponse.json(response.data, { status: response.status });
}
