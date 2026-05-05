import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../config";

const categoryOptions = ["women"];
const subCategoryOptions = [
  "topwear",
  "bottomwear",
  "winterwear",
  "ethnic",
  "dress",
];

const emptyEditForm = {
  id: "",
  image: "",
  name: "",
  description: "",
  category: "women",
  subCategory: "topwear",
  price: "",
};

const List = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState("");
  const [updating, setUpdating] = useState(false);
  const [editForm, setEditForm] = useState(emptyEditForm);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/list`);

      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (product) => {
    setEditForm({
      id: product._id,
      image: product.image?.[0] || "",
      name: product.name || "",
      description: product.description || "",
      category: product.category || "women",
      subCategory: product.subCategory || product.subcategory || "topwear",
      price: product.price || "",
    });
  };

  const closeEditModal = () => {
    setEditForm(emptyEditForm);
  };

  const updateEditForm = (field, value) => {
    setEditForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateProduct = async (event) => {
    event.preventDefault();

    if (!editForm.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!editForm.description.trim()) {
      toast.error("Product description is required");
      return;
    }

    if (!editForm.price || Number(editForm.price) <= 0) {
      toast.error("Please enter a valid product price");
      return;
    }

    try {
      setUpdating(true);
      const response = await axios.post(
        `${backendUrl}/api/product/update`,
        {
          id: editForm.id,
          name: editForm.name.trim(),
          description: editForm.description.trim(),
          category: editForm.category,
          subCategory: editForm.subCategory,
          price: editForm.price,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        closeEditModal();
        await fetchProducts();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setUpdating(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      setRemovingId(id);
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchProducts();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setRemovingId("");
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 0);
    return () => clearTimeout(timer);
  }, []);

  const inputClass =
    "w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500";
  const hasEditModal = Boolean(editForm.id);

  if (loading) {
    return <p className="text-gray-600">Loading products...</p>;
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-gray-800">
          All Products List
        </h1>
        <button
          type="button"
          onClick={fetchProducts}
          className="w-full rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 sm:w-auto"
        >
          Refresh
        </button>
      </div>

      {products.length === 0 ? (
        <div className="rounded border border-gray-200 bg-white p-5 text-gray-600">
          No products found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="hidden min-w-[980px] border border-gray-200 text-sm lg:block">
            <div className="grid grid-cols-[80px_2fr_1fr_1fr_100px_190px] bg-gray-100 px-3 py-3 font-medium text-gray-800">
              <p>Image</p>
              <p>Name</p>
              <p>Category</p>
              <p>Subcategory</p>
              <p>Price</p>
              <p className="text-center">Action</p>
            </div>

            {products.map((product) => (
              <div
                key={product._id}
                className="grid grid-cols-[80px_2fr_1fr_1fr_100px_190px] items-center gap-2 border-t border-gray-200 bg-white px-3 py-3 text-gray-700"
              >
                <img
                  src={product.image?.[0]}
                  alt={product.name}
                  className="h-14 w-12 rounded object-cover"
                />
                <p className="pr-4">{product.name}</p>
                <p>{product.category}</p>
                <p>{product.subCategory || product.subcategory}</p>
                <p>₹{product.price}</p>
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(product)}
                    className="rounded border border-gray-300 px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={removingId === product._id}
                    onClick={() => removeProduct(product._id)}
                    className="rounded border border-red-200 px-3 py-2 text-xs text-red-600 hover:bg-red-50 disabled:text-gray-400"
                  >
                    {removingId === product._id ? "Deleting" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 lg:hidden">
            {products.map((product) => (
              <div
                key={product._id}
                className="rounded border border-gray-200 bg-white p-3"
              >
                <div className="grid grid-cols-[72px_1fr] gap-3">
                  <img
                    src={product.image?.[0]}
                    alt={product.name}
                    className="h-20 w-16 rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-800">
                      {product.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Category: {product.category}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Subcategory: {product.subCategory || product.subcategory}
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-800">
                      ₹{product.price}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => openEditModal(product)}
                    className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={removingId === product._id}
                    onClick={() => removeProduct(product._id)}
                    className="rounded border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:text-gray-400"
                  >
                    {removingId === product._id ? "Deleting" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <form
            onSubmit={updateProduct}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded bg-white p-5 shadow-lg"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Edit Product
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update product details
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            {editForm.image && (
              <img
                src={editForm.image}
                alt={editForm.name}
                className="mb-4 h-24 w-20 rounded object-cover"
              />
            )}

            <div className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product name
                </label>
                <input
                  value={editForm.name}
                  onChange={(event) =>
                    updateEditForm("name", event.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(event) =>
                    updateEditForm("description", event.target.value)
                  }
                  rows={4}
                  className={`${inputClass} resize-y`}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(event) =>
                      updateEditForm("category", event.target.value)
                    }
                    className={inputClass}
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Subcategory
                  </label>
                  <select
                    value={editForm.subCategory}
                    onChange={(event) =>
                      updateEditForm("subCategory", event.target.value)
                    }
                    className={inputClass}
                  >
                    {subCategoryOptions.map((subCategory) => (
                      <option key={subCategory} value={subCategory}>
                        {subCategory}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    value={editForm.price}
                    onChange={(event) =>
                      updateEditForm("price", event.target.value)
                    }
                    type="number"
                    min="1"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded border border-gray-300 px-5 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="rounded bg-gray-800 px-5 py-2 text-sm text-white hover:bg-gray-700 disabled:bg-gray-500"
              >
                {updating ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default List;
