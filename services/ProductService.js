export default class ProductService {
  constructor(supabase) {
    this.supabase = supabase;
  }

  async getProducts({ searchText, columnName, itemsPerPage, page }) {
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    if (!searchText || searchText === "") {
      return this.fetchProducts(from, to);
    }

    if (columnName === "box") {
      return this.searchProductsByBox(searchText, from, to);
    }

    if (columnName === "logs") {
      return this.searchProductsByLogs(searchText, from, to);
    }

    return this.searchProductsByColumn(columnName, searchText, from, to);
  }

  async fetchProducts(from, to) {
    const { data, count, error } = await this.supabase
      .from("Products")
      .select("*", { count: "exact" })
      .range(from, to);

    if (error) {
      console.error("Error fetching products:", error);
      return { data: { data: [], count: 0 }, status: 200 };
    }

    return { data: { data, count }, status: 200 };
  }

  async searchProductsByBox(searchText, from, to) {
    const { data, count, error } = await this.supabase
      .from("Products")
      .select("*", { count: "exact" })
      .eq("box", searchText)
      .range(from, to);

    if (error) {
      console.error("Error searching products by box:", error);
      return { data: { data: [], count: 0 }, status: 200 };
    }

    return { data: { data, count }, status: 200 };
  }

  async searchProductsByLogs(searchText, from, to) {
    const { productData, productError } = await this.supabase
      .from("Logs")
      .select("product_id")
      .ilike("date", `%${searchText}%`);

    if (productError) {
      console.error("Error searching products by logs:", productError);
      return { data: { data: [], count: 0 }, status: 200 };
    }

    const productIds = productData.map((log) => log.product_id);
    const { data, count, error } = await this.supabase
      .from("Products")
      .select("*", { count: "exact" })
      .in("id", productIds)
      .range(from, to);

    if (error) {
      console.error("Error searching products by logs:", error);
      return { data: { data: [], count: 0 }, status: 200 };
    }

    return { data: { data, count }, status: 200 };
  }

  async searchProductsByColumn(columnName, searchText, from, to) {
    const { data, count, error } = await this.supabase
      .from("Products")
      .select("*", { count: "exact" })
      .ilike(columnName, `%${searchText}%`)
      .range(from, to);

    if (error) {
      console.error("Error searching products:", error);
      return { data: { data: [], count: 0 }, status: 200 };
    }

    return { data: { data, count }, status: 200 };
  }

  async getProductById(id) {
    const { data, error } = await this.supabase
      .from("Products")
      .select("*")
      .eq("id", id);

    if (error) {
      console.error("Error fetching product by ID:", error);
      return { data: { error: error.message }, status: 500 };
    }

    return { data: { data }, status: 200 };
  }
}
