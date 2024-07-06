"use client";
import { useEffect, useState } from "react";
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

    const response = await fetch(
      `/api/products?page=${page}&itemsPerPage=${itemsPerPage}`,
    );
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

    const response = await fetch(
      `/api/products?searchText=${searchText}&columnName=${columnName}&itemsPerPage=${itemsPerPage}`,
    );
    const { data, count } = await response.json();

    setProducts(data);
    setTotalCount(count);
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
      <div className="bg-white sm:mt-5">
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
