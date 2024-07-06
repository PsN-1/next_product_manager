"use client";
import PropTypes from "prop-types";
import { paths } from "../../utils/index";
import { redirect, useRouter } from "next/navigation";

export const ProductCard = ({ product }) => {
  const router = useRouter();

  const handleOnClick = (e) => {
    e.preventDefault();
    router.push(paths.productDetail(product.id));
  };

  return (
    <div
      key={product.id}
      className="group relative flex flex-row sm:flex-col overflow-hidden rounded-lg border border-gray-200 bg-white h-40 sm:h-auto"
    >
      <div className="w-1/3 sm:w-auto bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-64 h-40 sm:aspect-h-4 sm:aspect-w-3">
        <img
          src={product.photo}
          className="h-full w-full object-cover sm:object-center sm:w-full sm:h-full"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4 truncate">
        <h3 className="text-base font-medium text-gray-900 truncate">
          <button onClick={handleOnClick}>
            <span aria-hidden="true" className="absolute inset-0" />
            Produto: {product.product}
          </button>
        </h3>
        <div className="flex flex-1 flex-col justify-end truncate">
          <p className="text-base text-gray-600 truncate">
            Descrição: {product.description}
          </p>
          <p className="text-base italic text-gray-600">Caixa: {product.box}</p>
          <p className="text-base italic text-gray-600">
            Quantidade: {product.quantity}
          </p>
          <p className="text-base italic text-gray-600">
            Preço: R${product.price}
          </p>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    product: PropTypes.string,
    description: PropTypes.string,
    box: PropTypes.string,
    quantity: PropTypes.string,
    price: PropTypes.string,
    photo: PropTypes.string,
  }),
};
