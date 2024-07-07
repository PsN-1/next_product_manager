export default class ProductListService {
  constructor(supabase) {
    this.supabase = supabase;
  }

  async getProductsList({ searchText, itemsPerPage, page }) {
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const { data, count, error } = await this.supabase
      .from("ProductsList")
      .select("*", { count: "exact" })
      .ilike("name", `%${searchText}%`)
      .range(from, to);

    if (error) {
      console.error("Error fetching products:", error);
      return { data: { data: [], count: 0 }, status: 200 };
    }

    return { data: { data, count }, status: 200 };
  }

  async createProduct({ name }) {
    const { data, error } = await this.supabase
      .from("ProductsList")
      .insert({ name });

    if (error) {
      console.error("Error creating product:", error);
      return { data: { error: error.message }, status: 500 };
    }

    return { data: { data }, status: 200 };
  }
}
