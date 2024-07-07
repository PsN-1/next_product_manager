"use server";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import ProductService from "@/services/ProductService";

export async function GET(request) {
  const supabase = createClient();
  const user = supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const searchText = searchParams.get("searchText");
  const columnName = searchParams.get("columnName");
  const itemsPerPage = parseInt(searchParams.get("itemsPerPage"), 10);
  const page = parseInt(searchParams.get("page"), 10) || 1;

  const productService = new ProductService(supabase);
  const response = await productService.getProducts({
    searchText,
    columnName,
    itemsPerPage,
    page,
  });

  return NextResponse.json(response.data, { status: response.status });
}
