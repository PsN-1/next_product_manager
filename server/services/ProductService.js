import ProductRepository from "@/server/resource/ProductRepository";

export default class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getProducts({ searchText, columnName, itemsPerPage, page }) {
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    if (!searchText || searchText === "") {
      return this.productRepository.fetchProducts(from, to);
    }

    if (columnName === "box") {
      return this.productRepository.searchProductsByBox(searchText, from, to);
    }

    if (columnName === "logs") {
      return this.productRepository.searchProductsByLogs(searchText, from, to);
    }

    return this.productRepository.searchProductsByColumn(
      columnName,
      searchText,
      from,
      to,
    );
  }

  async getProductById(id) {
    return this.productRepository.fetchProductById(id);
  }
}
