"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";
import { classNames, paths } from "../../utils/index";
import { RightPanel } from "./RightPanel.jsx";
import { useEffect, useState } from "react";
import { AlertDialog, HistoryLogs, MoveBoxDialog } from "@/components";
import { ProductField } from "./ProductField.jsx";
import { ImageField } from "./ImageField.jsx";
import { useRouter } from "next/navigation";

export const ProductForm = ({
  product,
  logs,
  onUpdateProduct,
  isLoading,
  onMoveBox,
  onDeleteProduct,
}) => {
  const router = useRouter();

  const [openSearch, setOpenSearch] = useState(false);
  const [openMoveBox, setOpenMoveBox] = useState(false);
  const [openConfirmMoveBox, setOpenConformMoveBox] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);
  const [newBox, setNewBox] = useState(null);

  const handleSelectedProductName = (productName) => {
    setEditedProduct({ ...editedProduct, product: productName });
    setOpenSearch(false);
  };

  useEffect(() => {
    setEditedProduct(product);
  }, [product]);

  const savePressed = (e) => {
    e.preventDefault();
    onUpdateProduct({ updatedProduct: editedProduct });
  };
  const handleOpenMoveBox = (e) => {
    e.preventDefault();
    setOpenMoveBox(true);
  };

  const handleDeleteProduct = (e) => {
    e.preventDefault();
    onDeleteProduct({ product: editedProduct });
  };

  return (
    <>
      <head>
        <title>{product.product}</title>
        <meta name="description" content={`${editedProduct.description}`} />

        <meta property="og:title" content={`${editedProduct.product}`} />
        <meta
          property="og:description"
          content={`${editedProduct.description}`}
        />
        <meta property="og:image" content={`${editedProduct.photo}`} />
        <meta
          property="og:url"
          content={`https://pm2.pedrosn.com/produto/${editedProduct.id}`}
        />
        <meta property="og:type" content="product" />
        <meta property="product:availability" content="in stock" />
      </head>

      <MoveBoxDialog
        open={openMoveBox}
        setOpen={setOpenMoveBox}
        onConfirm={(boxNumber) => {
          setNewBox(boxNumber);
          setOpenMoveBox(false);
          setOpenConformMoveBox(true);
        }}
      />
      <AlertDialog
        title="Mover Produto de Caixa"
        subtitle="Você tem certeza que deseja move esse produto de caixa?"
        textButton="Mover produto"
        open={openConfirmMoveBox}
        setOpen={setOpenConformMoveBox}
        onConfirm={() => {
          setOpenConformMoveBox(false);
          onMoveBox(newBox);
        }}
      />
      <AlertDialog
        title="Apagar Produto"
        subtitle="Essa ação NÃO pode ser desfeita, você tem certeza disso?"
        textButton="Apagar produto"
        open={openAlert}
        setOpen={setOpenAlert}
        onConfirm={handleDeleteProduct}
      />
      <RightPanel
        setOpen={setOpenSearch}
        open={openSearch}
        onSelectedProductName={handleSelectedProductName}
      />

      <div className="bg-gray-50 min-h-screen min-w-full">
        <div className="mx-auto px-4 pt-4 sm:pt-10 pb-20 lg:max-w-7xl lg:px-8">
          <form className="sm:grid sm:grid-cols-12 gap-x-12">
            <div className="col-span-12 md:col-span-8">
              <p className="text-base font-semibold leading-7 mb-5 ">
                {logs ? "Editar Produto" : "Criar Produto"}
              </p>
              {isLoading && (
                <div
                  className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                  id="loading-overlay"
                >
                  <svg
                    className="animate-spin h-20 w-20 text-white"
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
                </div>
              )}
              <div className="">
                <ImageField
                  oldPhoto={editedProduct.photo}
                  onPhotoSelected={(value) =>
                    setEditedProduct({ ...editedProduct, newImage: value })
                  }
                />
                <div className="mt-4 flex flex-col gap-y-6  md:gap-x-4 ">
                  {!logs && (
                    <ProductField
                      onClick={() => setOpenSearch(true)}
                      readOnly
                      field="Nome"
                      value={editedProduct.product}
                    />
                  )}
                  {logs && (
                    <ProductField
                      field="Nome"
                      disabled={true}
                      value={editedProduct.product}
                      onChange={(value) =>
                        setEditedProduct({ ...editedProduct, product: value })
                      }
                    />
                  )}
                  <ProductField
                    field="Descrição"
                    value={editedProduct.description}
                    onChange={(value) =>
                      setEditedProduct({
                        ...editedProduct,
                        description: value,
                      })
                    }
                  />

                  <div className="flex gap-5 items-end">
                    <div className="grow">
                      <ProductField
                        field="Caixa"
                        value={editedProduct.box}
                        disabled={logs}
                        onChange={(value) =>
                          setEditedProduct({ ...editedProduct, box: value })
                        }
                      />
                    </div>
                    {logs && (
                      <button
                        onClick={handleOpenMoveBox}
                        className="h-10 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Mover
                      </button>
                    )}
                  </div>

                  <div className="flex gap-5">
                    <div className="grow">
                      <ProductField
                        field="Preço"
                        value={editedProduct.price}
                        onChange={(value) =>
                          setEditedProduct({ ...editedProduct, price: value })
                        }
                      />
                    </div>
                    {logs && (
                      <ProductField
                        field="Última Atualização"
                        disabled={true}
                        value={product.lastPrice}
                      />
                    )}
                  </div>

                  <div className="flex flex-row justify-between sm:col-span-2">
                    <div>
                      <label
                        htmlFor="Quantidade"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Quantidade
                      </label>
                      <div className="mt-1 flex">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setEditedProduct({
                              ...editedProduct,
                              quantity: (
                                parseInt(editedProduct.quantity) - 1
                              ).toString(),
                            });
                          }}
                          className="inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeftIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </button>
                        <input
                          onChange={(e) =>
                            setEditedProduct({
                              ...editedProduct,
                              quantity: e.target.value,
                            })
                          }
                          type="text"
                          name="Quantidade"
                          value={editedProduct.quantity}
                          id="Quantidade"
                          className="text-center border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm w-16"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setEditedProduct({
                              ...editedProduct,
                              quantity: (
                                parseInt(editedProduct.quantity) + 1
                              ).toString(),
                            });
                          }}
                          className="inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRightIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-end ">
                      {logs && editedProduct.quantity === "0" && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenAlert(true);
                          }}
                          type="button"
                          className="inline-flex w-full rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto"
                        >
                          APAGAR PRODUTO
                        </button>
                      )}
                    </div>
                    <div
                      className={classNames(
                        "transition-opacity text-end ease-in-out delay-150 duration-200",
                        logs && product.quantity !== editedProduct.quantity
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    >
                      <label className="block text-sm font-medium text-gray-700">
                        Valor anterior
                      </label>
                      <p className="mt-3 text-red-500">{product.quantity}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 justify-end items-center flex">
                  <div className="flex justify-end gap-x-6">
                    <button
                      onClick={() => router.push(paths.home)}
                      type="button"
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={savePressed}
                      className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={classNames(
                logs && "md:border-l border-slate-200",
                "col-span-12 pt-20 md:pt-0  md:pl-5 md:col-span-4 ",
              )}
            >
              {logs && <HistoryLogs activity={logs} />}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

ProductForm.propTypes = {
  product: PropTypes.shape({
    product: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.string,
    box: PropTypes.string,
    quantity: PropTypes.string,
    photo: PropTypes.string,
    lastPrice: PropTypes.string,
  }),
  logs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      abbreviation: PropTypes.string,
      old_value: PropTypes.string,
      new_value: PropTypes.string,
      date: PropTypes.string,
    }),
  ),
  onUpdateProduct: PropTypes.func,
  productNames: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  ),
  isLoading: PropTypes.bool,
  onMoveBox: PropTypes.func,
  onDeleteProduct: PropTypes.func,
};
