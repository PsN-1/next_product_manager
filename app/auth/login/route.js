"use server";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request) {
  const supabase = createClient();
  const { email, password } = await request.json();
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({}, { status: 200 });
}
