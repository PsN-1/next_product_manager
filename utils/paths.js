export const paths = {
  login: "/login",
  signup: "/signup",

  // authenticated routes
  home: "/",
  createProduct: "/products/new",
  productDetail: (id) => `/products/${id}`,
};
