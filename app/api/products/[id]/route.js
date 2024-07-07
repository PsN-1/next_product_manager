"use server";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import ProductService from "@/server/services/ProductService";

export async function GET(request, { params }) {
  const supabase = createClient();
  const user = supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  }

  const { id } = params;
  const productService = new ProductService(supabase);
  const response = await productService.getProductById(id);

  return NextResponse.json(response.data, { status: response.status });
}
