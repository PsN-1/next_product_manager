"use server";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import ProductListService from "@/services/ProductListService";

export async function GET(request) {
  const supabase = createClient();
  const user = supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const searchText = searchParams.get("searchText");
  const itemsPerPage = parseInt(searchParams.get("itemsPerPage"), 10);
  const page = parseInt(searchParams.get("page"), 10) || 1;

  const productListService = new ProductListService(supabase);
  const response = await productListService.getProductsList({
    searchText,
    itemsPerPage,
    page,
  });

  return NextResponse.json(response.data, { status: response.status });
}

export async function POST(request) {
  const supabase = createClient();
  const user = supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  }

  const { name } = await request.json();

  const productListService = new ProductListService(supabase);
  const response = await productListService.createProduct({ name });

  return NextResponse.json(response.data, { status: response.status });
}
