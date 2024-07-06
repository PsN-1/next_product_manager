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
  const columnName = searchParams.get("columnName");
  const itemsPerPage = searchParams.get("itemsPerPage");
  const page = searchParams.get("page") || 1;

  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  if (!searchText || searchText === "") {
    const { data, count, error } = await supabase
      .from("Products")
      .select("*", { count: "exact" })
      .range(from, to);
    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json({ data: [], count: 0 }, { status: 200 });
    }
    return NextResponse.json({ data, count }, { status: 200 });
  }

  if (columnName === "box") {
    const { data, count, error } = await supabase
      .from("Products")
      .select("*", { count: "exact" })
      .eq("box", searchText)
      .range(from, to);
    if (error) {
      console.error("Error searching products by box:", error);
      return NextResponse.json({ data: [], count: 0 }, { status: 200 });
    }
    return NextResponse.json({ data, count }, { status: 200 });
  }

  if (columnName === "logs") {
    const { productData, productError } = await supabase
      .from("Logs")
      .select("product_id")
      .ilike("date", `%${searchText}%`);

    if (error) {
      console.error("Error0 searching products by logs:", productError);
      return NextResponse.json({ data: [], count: 0 }, { status: 200 });
    }

    const productIds = productData.map((log) => log.product_id);
    const { data, count, error } = await supabase
      .from("Products")
      .select("*", { count: "exact" })
      .in("id", productIds)
      .range(from, to);

    if (error) {
      console.error("Error1 searching products by logs:", error);
      return NextResponse.json({ data: [], count: 0 }, { status: 200 });
    }

    return NextResponse.json({ data, count }, { status: 200 });
  }

  const { data, count, error } = await supabase
    .from("Products")
    .select("*", { count: "exact" })
    .ilike(columnName, `%${searchText}%`)
    .range(from, to);
  if (error) {
    console.error("Error searching products:", error);
    return NextResponse.json({ data: [], count: 0 }, { status: 200 });
  }

  return NextResponse.json({ data, count }, { status: 200 });
}
