"use client";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import { classNames } from "../../utils/index";
import PropTypes from "prop-types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { SearchBar } from "../SearchBar.jsx";
import { LoadingSpinner } from "../LoadingSpinner.jsx";
import { createClient } from "../../utils/supabase/client";

export function RightPanel({ open, setOpen, onSelectedProductName }) {
  const [productNames, setProductNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Change this to set items per page
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");

  // const supabase = createClient();

  const handleSearch = async ({ searchText, page = 1 }) => {
    setCurrentPage(1);
    setSearch(searchText);
    await doSearch({ searchText, page });
  };

  const doSearch = async ({ searchText: query, page = 1 }) => {
    setIsLoading(true);
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const { data, count } = await supabase
      .from("ProductsList")
      .select("*", { count: "exact" })
      .ilike("name", `%${query}%`)
      .range(from, to);

    setProductNames(data);
    setTotalCount(count);
    setIsLoading(false);
  };

  const saveNewProductName = async () => {
    if (!newProductName) return;
    setIsLoading(true);
    await supabase.from("ProductsList").insert({ name: newProductName });
    const newProduct = newProductName;
    setNewProductName("");
    setIsLoading(false);
    setShowForm(false);

    await doSearch({ searchText: newProduct, page: currentPage });
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => {
      const newPage = prevPage + 1;
      doSearch({ searchText: search, page: newPage });
      return newPage;
    });
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => {
      const newPage = Math.max(prevPage - 1, 1);
      doSearch({ searchText: search, page: newPage });
      return newPage;
    });
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  useEffect(() => {
    if (open) {
      setSearch("");
      doSearch({ searchText: "", page: currentPage });
    }
    console.log(search);
  }, [open]);

  return (
    <Dialog className="relative z-10" open={open} onClose={setOpen}>
      <div className="fixed inset-0" />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                <div className="px-4 mt-6 sm:px-6">
                  <div className="mb-5 flex items-start justify-between">
                    <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                      Produtos
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => setOpen(false)}
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  {!showForm && (
                    <div>
                      <div className="mb-3">
                        <SearchBar onEnterPressed={handleSearch} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll">
                  <div
                    className={classNames(
                      showForm || isLoading ? "justify-center" : "",
                      "relative flex-1 px-4 sm:px-6 flex flex-col",
                    )}
                  >
                    {isLoading && (
                      <div className="mt-6 flex justify-center">
                        <LoadingSpinner w={10} h={10} />
                      </div>
                    )}
                    {!isLoading &&
                      !showForm &&
                      productNames.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => onSelectedProductName(product.name)}
                          className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          <span className="line-clamp-1">{product.name}</span>
                        </button>
                      ))}

                    {showForm && (
                      <div className="">
                        <p className="text-sm text-gray-500">
                          Criar novo nome de produto
                        </p>
                        <input
                          type="text"
                          className="mt-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={newProductName}
                          onChange={(e) => setNewProductName(e.target.value)}
                          disabled={isLoading}
                        />
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <div>
                            <button
                              type="button"
                              onClick={saveNewProductName}
                              disabled={isLoading}
                              className="inline-flex w-full bg-indigo-600 justify-center rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                            >
                              {isLoading && (
                                <svg
                                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                              )}
                              Cadastrar
                            </button>
                          </div>

                          <button
                            type="button"
                            disabled={isLoading}
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => setShowForm(false)}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {!showForm && (
                  <div>
                    <nav
                      className="flex items-center justify-between bg-white px-4 py-3 sm:px-6"
                      aria-label="Pagination"
                    >
                      <div className="hidden sm:block">
                        <p className="text-sm text-gray-700">
                          Página{" "}
                          <span className="font-medium">{currentPage}</span> de{" "}
                          <span className="font-medium">{totalPages}</span>{" "}
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

                    <div className="m-2 rounded flex items-center justify-between bg-gray-50 px-4 py-2.5 text-xs text-gray-700 gap-4">
                      <p>Não encontrou o produto desejado? </p>
                      <button
                        type="button"
                        className="hidden rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white sm:block"
                        onClick={() => setShowForm(true)}
                      >
                        Criar novo produto
                      </button>
                      <button
                        type="button"
                        className=" rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white sm:hidden"
                        onClick={() => setShowForm(true)}
                      >
                        Cadastrar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

RightPanel.propTypes = {
  productNames: PropTypes.array,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  onSelectedProductName: PropTypes.func,
};
