import { createClient } from "@/utils/supabase/server";

export default class LogRepository {
  constructor() {
    this.supabase = createClient();
  }

  async getLogsByProductId(productId) {
    const { data, error } = await this.supabase
      .from("Logs")
      .select("*")
      .eq("product_id", productId);

    if (error) {
      return { data: { error: error.message }, status: 500 };
    }

    return { data: { data }, status: 200 };
  }
}
