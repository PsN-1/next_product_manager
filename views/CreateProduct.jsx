import { ProductForm } from "../../product-manager-web/src/Components";
import {
  getFormattedDate,
  paths,
  supabase,
} from "../../product-manager-web/src/Util";
import { useState } from "react";

export const CreateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createNewProduct = async ({ updatedProduct }) => {
    setIsLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user.id;

    if (updatedProduct.newImage) {
      updatedProduct.photo = await handleUploadPhoto({
        newPhoto: updatedProduct.newImage,
        userId: userId,
      });
      delete updatedProduct.newImage;
    }

    updatedProduct.lastPrice = getFormattedDate();

    const { data, error } = await supabase
      .from("Products")
      .insert(updatedProduct)
      .select();

    if (error) {
      console.error(error);
      setIsLoading(false);
      return;
    }

    const productId = data[0].id;

    const log = {
      owner_id: userId,
      product_id: productId,
      date: getFormattedDate(),
      abbreviation: "Obs",
      old_value: "",
      new_value: "Produto Criado.",
    };

    const { error: descriptionLogError } = await supabase
      .from("Logs")
      .insert(log);

    if (descriptionLogError) {
      console.log("Failed to add log", descriptionLogError.message);
    }

    setIsLoading(false);
    navigate(paths.home);
  };

  const handleUploadPhoto = async ({ newPhoto, userId }) => {
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

      return signedData.signedUrl;
    } catch (error) {
      console.error("File upload error:", error);
    }
  };

  return (
    <ProductForm
      product={{ quantity: "0" }}
      onUpdateProduct={createNewProduct}
      isLoading={isLoading}
    />
  );
};
