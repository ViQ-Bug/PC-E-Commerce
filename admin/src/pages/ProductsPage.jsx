import React from "react";
import { useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  XIcon,
  ImageIcon,
  TrashIcon,
  Trash2Icon,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../lib/api.js";
import { formatCurrency, getStockStatusBadge } from "../lib/utils.js";

function ProductsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    description: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAll,
  });

  // CRUD data
  const createProductMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
  const updateProductMutation = useMutation({
    mutationFn: productApi.update,
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
  const deleteProductMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      price: 0,
      stock: 0,
      description: "",
    });
    setImages([]);
    setImagePreviews([]);
  };
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
    });
    setImagePreviews(product.images);
    setShowModal(true);
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) return alert("Maximum 3 images allowed");

    imagePreviews.forEach((url) => {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    });

    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!editingProduct && imagePreviews.length === 0) {
      return alert("Please upload at least one image");
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("category", formData.category);

    if (images.length > 0)
      images.forEach((image) => formDataToSend.append("images", image));

    if (editingProduct) {
      updateProductMutation.mutate({
        id: editingProduct._id,
        formData: formDataToSend,
      });
    } else {
      createProductMutation.mutate(formDataToSend);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sản Phẩm</h1>
          <p className="text-base-content/70 mt-1"> Danh sách sản phẩm</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary gap-2"
        >
          <PlusIcon className="size-5" />
          Tạo sản phẩm
        </button>
      </div>

      {/* Product*/}
      <div className="grid grid-cols-1 gap-4">
        {products?.map((product) => {
          const status = getStockStatusBadge(product.stock);

          return (
            <div key={product._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-6">
                  <div className="avatar">
                    <div className="w-20 rounded-xl">
                      <img src={product.images[0]} alt={product.name} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="card-title">{product.name}</h3>
                        <p className="text-base-content/70 text-sm">
                          {product.category}
                        </p>
                      </div>
                      <div className={`badge ${status.class}`}>
                        {status.text}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 mt-4">
                      <div>
                        <p className="text-xs text-base-content/70">Giá</p>
                        <p className="font-bold text-lg">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">
                          Số lượng tồn
                        </p>
                        <p className="font-bold text-lg">{product.stock}</p>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => handleEdit(product)}
                    >
                      <PencilIcon className="size-5" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost text-error"
                      onClick={() => deleteProductMutation.mutate(product._id)}
                    >
                      {deleteProductMutation.isPending ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        <Trash2Icon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Product */}
      <input type="checkbox" className="modal-toggle" checked={showModal} />

      <div className="modal">
        <div className="modal-box max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-2xl">
              {editingProduct ? "Chỉnh sửa" : "Thêm mới"}
            </h3>
            <button
              onClick={closeModal}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <XIcon className="size-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span>Tên sản phẩm</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên sản phẩm"
                  className="input input-bordered"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span>Danh mục</span>
                </label>

                <select
                  className="select select-bordered"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                >
                  <option value="">Chọn danh mục</option>
                  <option value="PC">PC</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Linh kiện máy tính">Linh kiện máy tính</option>
                  <option value="Màn hình">Màn hình</option>
                  <option value="Phụ kiện">Phụ kiện</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span>Giá (VND)</span>
                </label>
                <input
                  type="number"
                  step="1000"
                  placeholder="100000"
                  className="input input-bordered"
                  value={formData.price === 0 ? "" : formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price:
                        e.target.value === "" ? 0 : parseInt(e.target.value),
                    })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span>Tồn kho</span>
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="input input-bordered"
                  value={formData.stock === 0 ? "" : formData.stock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-control flex flex-col gap-4">
              <div className="form-control">
                <label className="label">
                  <span>Mô tả sản phẩm</span>
                </label>
                <textarea
                  placeholder="Nhập vào mô tả của sản phẩm"
                  className="textarea textarea-bordered h-36 w-full"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base flex items-center gap-2">
                  <ImageIcon className="size-5" />
                  Ảnh sản phẩm
                </span>
                <span className="label-text-alt text-xs opacity-60">
                  Tối đa 3 ảnh
                </span>
              </label>
              <div className="bg-base-200 rounded-xl p-4 border-2 border-dashed border-base-300 hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="file-input file-input-bordered file-input-primary w-full"
                  required={!editingProduct}
                />

                {editingProduct && (
                  <p className="text-xs text-base-content/60 mt-2 text-center">
                    Bỏ trống để giữ lại hình ảnh cũ
                  </p>
                )}

                {imagePreviews.length > 0 ? (
                  <div className="flex gap-2 mt-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="avatar">
                        <div className="w-20 rounded-lg border border-red-500">
                          {" "}
                          <img src={preview} alt={`Preview ${index + 1}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Không có ảnh nào được chọn.</p>
                )}
              </div>
            </div>

            <div className="modal-action">
              <button
                type="button"
                onClick={closeModal}
                className="btn"
                disabled={
                  createProductMutation.isPending ||
                  updateProductMutation.isPending
                }
              >
                Huỷ
              </button>
              <button
                type="sumbit"
                className="btn btn-primary"
                disabled={
                  createProductMutation.isPending ||
                  updateProductMutation.isPending
                }
              >
                {createProductMutation.isPending ||
                updateProductMutation.isPending ? (
                  <span className="loading loading-spinner"></span>
                ) : editingProduct ? (
                  "Câp nhật"
                ) : (
                  "Tạo"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
