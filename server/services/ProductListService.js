import ProductListRepository from "@/server/resource/ProductListRepository";

export default class ProductListService {
  constructor() {
    this.productListRepository = new ProductListRepository();
  }

  async getProductsList({ searchText, itemsPerPage, page }) {
    return this.productListRepository.getProductsList({
      searchText,
      itemsPerPage,
      page,
    });
  }

  async createProduct({ name }) {
    return this.productListRepository.createProduct({ name });
  }
}
