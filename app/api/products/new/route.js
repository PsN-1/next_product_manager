"use server";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getFormattedDate } from "@/utils";

export async function POST(request) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  }

    const userId = user.data.user.id;
  const uuid = crypto.randomUUID();
  const fileName = `photos/${userId}/${uuid}-${Date.now()}`;
  const storageRef = supabase.storage.from("product-manager");
  const url = await storageRef.createSignedUploadUrl(fileName);

  const { updatedProduct } = await request.json();

  console.log(updatedProduct);

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
    console.error("Error adding product:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    console.error("Error adding log:", descriptionLogError.message);
    return NextResponse.json(
      { error: descriptionLogError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({}, { status: 200 });
}

const handleUploadPhoto = async ({ newPhoto, userId }) => {
  const supabase = createClient();
  const uuid = crypto.randomUUID();
  const fileName = `photos/${userId}/${uuid}-${Date.now()}`;
  const storageRef = supabase.storage.from("product-manager");
  console.log(newPhoto);

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
