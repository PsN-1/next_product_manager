import { ProductDetail } from "@/views/ProductDetail";

export default function Page({ params }) {
  return <ProductDetail id={params.id} />;
}
