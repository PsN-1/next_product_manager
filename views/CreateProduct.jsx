"use client";
import { ProductForm } from "@/components";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const CreateProduct = () => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const createNewProduct = async ({ updatedProduct }) => {
		setIsLoading(true);
		const formData = new FormData();

		for (const key in updatedProduct) {
			if (key !== "newImage") {
				formData.append(key, updatedProduct[key]);
			}
		}

		const response = await fetch("/api/products/new", {
			method: "POST",
			body: formData,
		});

		if (response.ok) {
			router.push("/");
		} else {
			console.error("Error creating product:", response.statusText);
		}

		setIsLoading(false);
	};

	return (
		<ProductForm
			product={{ quantity: "0" }}
			onUpdateProduct={createNewProduct}
			isLoading={isLoading}
		/>
	);
};
