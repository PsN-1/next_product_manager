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
  const searchText = searchParams.get("searchText");
  const itemsPerPage = searchParams.get("itemsPerPage");
  const page = searchParams.get("page") || 1;

  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const { data, count, error } = await supabase
    .from("ProductsList")
    .select("*", { count: "exact" })
    .ilike("name", `%${searchText}%`)
    .range(from, to);

  if (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ data: [], count: 0 }, { status: 200 });
  }

  return NextResponse.json({ data, count }, { status: 200 });
}

export async function POST(request) {
  const supabase = createClient();
  const user = supabase.auth.getUser();
  console.log("hi");
  if (!user) {
    return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  }

  console.log("Request", request);
  const { name } = await request.json();
  console.log(name);

  const { data, error } = await supabase.from("ProductsList").insert({ name });

  if (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
