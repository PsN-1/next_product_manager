"use client";
import { useEffect, useState } from "react";
import { getFormattedDate, paths } from "@/utils";
import { ProductForm } from "@/components";

export const ProductDetail = ({ id }) => {
  const [product, setProduct] = useState({});
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProduct = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`);
      const { data, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      return data[0];
    } catch (err) {
      console.error("Failed to fetch product:", err);
      throw err;
    }
  };

  const fetchLogs = async (id) => {
    try {
      const response = await fetch(`/api/logs/${id}`);
      const { data, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      return data.reverse();
    } catch (err) {
      console.error("Failed to fetch logs:", err);
      throw err;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      scrollToTop();
      setIsLoading(true);

      try {
        const [productData, logsData] = await Promise.all([
          fetchProduct(id),
          fetchLogs(id),
        ]);
        setProduct(productData);
        setLogs(logsData);
      } catch (err) {
        // Handle errors if necessary
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const updateProduct = async ({ updatedProduct }) => {
    if (updatedProduct === product) {
      return;
    }
    setIsLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user.id;
    const createLog = ({ abbreviation, old_value, new_value }) => {
      return {
        owner_id: userId,
        product_id: product.id,
        date: getFormattedDate(),
        abbreviation: abbreviation,
        old_value: old_value,
        new_value: new_value,
      };
    };

    if (updatedProduct.newImage) {
      updatedProduct.photo = await handleUploadPhoto({
        newPhoto: updatedProduct.newImage,
        oldPhoto: updatedProduct.photo,
        userId: userId,
      });
      delete updatedProduct.newImage;
    }

    // if new quantity add log
    if (updatedProduct.quantity !== product.quantity) {
      const log = createLog({
        abbreviation: "Qtd",
        old_value: product.quantity,
        new_value: updatedProduct.quantity,
      });

      const { error: quantityLogError } = await supabase
        .from("Logs")
        .insert(log);

      if (quantityLogError) {
        console.log("Failed to add log", quantityLogError.message);
      }
    }
    // if new description add log
    if (updatedProduct.description !== product.description) {
      const log = createLog({
        abbreviation: "Desc",
        old_value: product.description,
        new_value: updatedProduct.description,
      });

      const { error: descriptionLogError } = await supabase
        .from("Logs")
        .insert(log);

      if (descriptionLogError) {
        console.log("Failed to add log", descriptionLogError.message);
      }
    }
    // if new price add log

    if (updatedProduct.price !== product.price) {
      updatedProduct.lastPrice = getFormattedDate();

      const log = {
        owner_id: userId,
        product_id: product.id,
        date: getFormattedDate(),
        abbreviation: "Preço",
        old_value: product.price,
        new_value: updatedProduct.price,
      };

      const { error: priceLogError } = await supabase.from("Logs").insert(log);

      if (priceLogError) {
        console.log("Failed to add log", priceLogError.message);
      }
    }

    const { error } = await supabase
      .from("Products")
      .update(updatedProduct)
      .eq("id", product.id);

    if (error) {
      console.log("Failed to update products", error.message);
    }

    setIsLoading(false);
    navigate(paths.home);
  };

  const onMoveBox = async (selectedBox) => {
    if (!parseInt(selectedBox)) {
      return;
    }
    setIsLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user.id;

    if (selectedBox !== product.box) {
      const log = {
        owner_id: userId,
        product_id: product.id,
        date: getFormattedDate(),
        abbreviation: "Caixa",
        old_value: product.box,
        new_value: selectedBox,
      };

      const { error: descriptionLogError } = await supabase
        .from("Logs")
        .insert(log);

      if (descriptionLogError) {
        console.log("Failed to add log", descriptionLogError.message);
      }
    }

    const { error } = await supabase
      .from("Products")
      .update({ box: selectedBox })
      .eq("id", product.id);

    if (error) {
      console.log("Failed to update products", error.message);
    }

    setIsLoading(false);
    navigate(paths.home);
  };

  const handleUploadPhoto = async ({ newPhoto, oldPhoto, userId }) => {
    const uuid = crypto.randomUUID();
    const fileName = `photos/${userId}/${uuid}-${Date.now()}`;
    const storageRef = supabase.storage.from("products-manager");

    try {
      const { data, error } = await storageRef.upload(fileName, newPhoto);

      if (error) {
        console.error("File upload failed:", error.message);
        return;
      }

      const tenYears = 60 * 60 * 24 * 365 * 10;
      const { data: signedData, error: urlError } =
        await storageRef.createSignedUrl(data.path, tenYears);

      if (urlError) {
        console.error("Failed to get public URL:", urlError.message);
        return;
      }

      const { error: removeError } = await storageRef.remove([oldPhoto]);

      if (removeError) {
        console.log("Failed to remove old image: ", removeError.message);
      }

      return signedData.signedUrl;
    } catch (error) {
      console.error("File upload error:", error);
    }
  };

  const onDeleteProduct = async () => {
    setIsLoading(true);

    const { error } = await supabase
      .from("Products")
      .delete()
      .eq("id", product.id);

    if (error) {
      console.log("Failed to delete products", error.message);
    }

    const { error: logError } = await supabase
      .from("Logs")
      .delete()
      .eq("product_id", product.id);

    if (logError) {
      console.log("Failed to delete logs", logError.message);
    }

    setIsLoading(false);
    navigate(paths.home);
  };

  return (
    <ProductForm
      logs={logs}
      product={product}
      onUpdateProduct={updateProduct}
      isLoading={isLoading}
      onMoveBox={onMoveBox}
      onDeleteProduct={onDeleteProduct}
    />
  );
};
