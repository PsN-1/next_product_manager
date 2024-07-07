export default class LogService {
  constructor(supabase) {
    this.supabase = supabase;
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
