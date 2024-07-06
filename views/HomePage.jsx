"use client";
import { useEffect, useState } from "react";
import { paths } from "@/utils";
import {
  BlueButton,
  LoadingSpinner,
  ProductCard,
  SearchBar,
} from "@/components/";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const tabs = {
    product: "Produto",
    description: "Descrição",
    box: "Caixa",
    logs: "Histórico",
  };
  const tabsArray = Object.values(tabs);

  async function getProducts(page = 1) {
    setIsLoading(true);
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const response = await fetch(`/api/products?from=${from}&to=${to}`);
    const { data, count } = await response.json();
    setProducts(data || []);
    setTotalCount(count);
    setIsLoading(false);
  }

  useEffect(() => {
    getProducts(currentPage);
  }, [currentPage]);

  const handleSearch = async ({ searchText, selectedTab }) => {
    setIsLoading(true);
    const columnName = Object.keys(tabs).find(
      (key) => tabs[key] === selectedTab,
    );
    const products = await getProductsFiltered({
      searchText,
      columnName,
      itemsPerPage,
    });
    setProducts(products.data);
    setTotalCount(products.count);
    setIsLoading(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const handleNextPage = () => {
    scrollToTop();
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    scrollToTop();
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <>
      <div className="bg-white mt-5">
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="my-5 sm:flex flex-row justify-between">
            <div>
              <SearchBar onEnterPressed={handleSearch} tabs={tabsArray} />
            </div>
            <div className="text-right">
              <BlueButton
                // onClick={() => navigate(paths.createProduct)}
                text="Novo produto"
              />
            </div>
          </div>
          {isLoading && (
            <div className="flex justify-center mt-24">
              <LoadingSpinner h={10} w={10} />
            </div>
          )}
          {!isLoading && (
            <>
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
                {products.map((product) => (
                  <ProductCard product={product} key={product.id} />
                ))}
              </div>

              <nav
                className=" mt-10 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
                aria-label="Pagination"
              >
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-700">
                    Mostrando página{" "}
                    <span className="font-medium">{currentPage}</span> de{" "}
                    <span className="font-medium">{totalPages}</span> dos{" "}
                    <span className="font-medium">{totalCount}</span>{" "}
                    resultados.
                  </p>
                </div>
                <div className="flex flex-1 justify-between sm:justify-end">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                  >
                    Próximo
                  </button>
                </div>
              </nav>
            </>
          )}
        </div>
      </div>
    </>
  );
}

async function getProductsFiltered({
  searchText,
  columnName,
  page = 1,
  itemsPerPage,
}) {
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  if (!searchText || searchText === "") {
    const { data, count, error } = await supabase
      .from("Products")
      .select("*", { count: "exact" })
      .range(from, to);
    if (error) {
      console.error("Error fetching products:", error);
      return { data: [], count: 0 };
    }
    return { data, count };
  }

  if (columnName === "box") {
    const { data, count, error } = await supabase
      .from("Products")
      .select("*", { count: "exact" })
      .eq("box", searchText)
      .range(from, to);
    if (error) {
      console.error("Error searching products by box:", error);
      return { data: [], count: 0 };
    }
    return { data, count };
  }

  if (columnName === "logs") {
    const { productData, productError } = await supabase
      .from("Logs")
      .select("product_id")
      .ilike("date", `%${searchText}%`);

    if (error) {
      console.error("Error0 searching products by logs:", productError);
      return { data: [], count: 0 };
    }

    const productIds = productData.map((log) => log.product_id);
    const { data, count, error } = await supabase
      .from("Products")
      .select("*", { count: "exact" })
      .in("id", productIds)
      .range(from, to);

    if (error) {
      console.error("Error1 searching products by logs:", error);
      return { data: [], count: 0 };
    }

    return { data, count };
  }

  const { data, count, error } = await supabase
    .from("Products")
    .select("*", { count: "exact" })
    .ilike(columnName, `%${searchText}%`)
    .range(from, to);
  if (error) {
    console.error("Error searching products:", error);
    return { data: [], count: 0 };
  }

  return { data, count };
}
