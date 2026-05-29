import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Search, Package, Plus, Trash2, Edit3, Loader2, Upload, X, Check } from "lucide-react";
import API from "../services/api";

// 🔹 ઇમેજ લોડ કરવા માટેનું હેલ્પર કોમ્પોનન્ટ (CORS અને CORP એરર હેન્ડલિંગ સાથે)
function ProductImage({ p }) {
  const path = p.imageUrl || p.image || p.productImage;
  const [imgSrc, setImgSrc] = useState("");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!path) {
      setHasError(true);
      return;
    }

    if (path.startsWith("http")) {
      setImgSrc(path);
      return;
    }

    const cleanPath = path.replace(/^\//, "");
    if (cleanPath.startsWith("uploads/") || cleanPath.startsWith("images/")) {
      setImgSrc(`http://localhost:5000/${cleanPath}`);
    } else {
      setImgSrc(`http://localhost:5000/uploads/${cleanPath}`);
    }
  }, [path]);

  if (hasError || !imgSrc) {
    return (
      <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
        <Package size={20} />
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={p.name}
      crossOrigin="anonymous" // 🔹 આ એટ્રિબ્યુટ ERR_BLOCKED_BY_RESPONSE ને રોકવા માટે ઉમેરેલ છે
      className="h-12 w-12 rounded-xl object-cover border border-slate-200"
      onError={() => {
        setHasError(true);
      }}
    />
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);

  // 🔹 પ્રોડક્ટ ક્રિએશન સ્ટેટ
  const [newProduct, setNewProduct] = useState({ name: "", stock: "", price: "" });
  const [imageFile, setImageFile] = useState(null);

  // 🔹 પ્રોડક્ટ અપડેટ મોડલ સ્ટેટ્સ
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updateForm, setUpdateForm] = useState({ name: "", stock: "", price: "" });
  const [updateImageFile, setUpdateImageFile] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/inventory/product");
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);

      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("stock", Number(newProduct.stock || 0));
      formData.append("price", Number(newProduct.price || 0));
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await API.post("/inventory/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewProduct({ name: "", stock: "", price: "" });
      setImageFile(null);
      fetchProducts();
      alert("Product added successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add product");
    } finally {
      setCreating(false);
    }
  };

  const openUpdateModal = (product) => {
    setSelectedProduct(product);
    setUpdateForm({
      name: product.name || "",
      stock: product.quantity || product.stock || 0,
      price: product.price || 0,
    });
    setUpdateImageFile(null);
    setShowUpdateModal(true);
  };

  const handleUpdateProductSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);

      const formData = new FormData();
      formData.append("name", updateForm.name);
      formData.append("stock", Number(updateForm.stock));
      formData.append("price", Number(updateForm.price));
      if (updateImageFile) {
        formData.append("image", updateImageFile);
      }

      await API.put(`/inventory/product/${selectedProduct._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product updated successfully!");
      setShowUpdateModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await API.delete(`/inventory/product/${id}`);
      fetchProducts();
      alert("Product deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight">Products Registry</h1>
        <p className="mt-2 text-indigo-100 text-sm">Manage, update, and monitor company-wide warehouse inventory.</p>
      </div>

      {/* CREATE NEW PRODUCT FORM */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Add New Product to Warehouse</h2>
        <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            required
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="h-11 rounded-xl border border-slate-300 px-4 outline-none focus:border-indigo-500 text-sm"
          />
          <input
            type="number"
            placeholder="Stock Quantity"
            required
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            className="h-11 rounded-xl border border-slate-300 px-4 outline-none focus:border-indigo-500 text-sm"
          />
          <input
            type="number"
            placeholder="Price per unit (INR)"
            required
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="h-11 rounded-xl border border-slate-300 px-4 outline-none focus:border-indigo-500 text-sm"
          />

          {/* Image Input */}
          <div className="md:col-span-3">
            <label className="h-11 border border-dashed border-slate-300 rounded-xl flex items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-white text-xs font-semibold text-slate-600 gap-2">
              <Upload size={16} /> {imageFile ? imageFile.name : "Select Product Image"}
              <input type="file" hidden accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            </label>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="md:col-span-3 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {creating ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus size={16} />}
            {creating ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-indigo-500 text-sm bg-slate-50/50 focus:bg-white"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
            <p className="mt-4 text-slate-500 font-semibold text-sm">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-20 text-center text-slate-400 space-y-4">
            <Package size={48} className="mx-auto text-slate-300" />
            <h3 className="text-xl font-bold text-slate-700">No Products Found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 border-b">
                <tr>
                  <th className="p-4 text-left">Product Image</th>
                  <th className="p-4 text-left">Product Name</th>
                  <th className="p-4 text-left">Current Stock</th>
                  <th className="p-4 text-left">Unit Price</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="border-b hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      {/* 🔹 NEW IMPLEMENTATION OF PRODUCT IMAGE */}
                      <ProductImage p={p} />
                    </td>
                    <td className="p-4 font-bold text-slate-800">{p.name}</td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-700">{(p.quantity !== undefined ? p.quantity : p.stock) || 0} units</span>
                    </td>
                    <td className="p-4 font-bold text-slate-700">₹{p.price?.toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openUpdateModal(p)}
                          className="h-9 px-3 rounded-lg bg-indigo-50 border text-indigo-600 font-bold text-xs flex items-center gap-1"
                        >
                          <Edit3 size={14} /> Update Product
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="h-9 w-9 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PREMIUM VIEWPORT CENTERED UPDATE MODAL USING PORTAL */}
      {showUpdateModal && createPortal(
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-32px)] max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-3 border-b">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Edit3 size={20} className="text-indigo-600" /> Update Product Details
              </h2>
              <button onClick={() => setShowUpdateModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            <form onSubmit={handleUpdateProductSubmit} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Product Name</label>
                <input
                  type="text"
                  required
                  value={updateForm.name}
                  onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 focus:bg-white outline-none focus:border-indigo-500"
                />
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Stock Quantity</label>
                <input
                  type="number"
                  required
                  value={updateForm.stock}
                  onChange={(e) => setUpdateForm({ ...updateForm, stock: e.target.value })}
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 focus:bg-white outline-none focus:border-indigo-500"
                />
              </div>

              {/* Unit Price */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Unit Price (INR)</label>
                <input
                  type="number"
                  required
                  value={updateForm.price}
                  onChange={(e) => setUpdateForm({ ...updateForm, price: e.target.value })}
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 focus:bg-white outline-none focus:border-indigo-500"
                />
              </div>

              {/* Product Image Section */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Product Image Preview</label>
                <div className="flex items-center gap-4 mb-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  {/* 🔹 CURRENT / PREVIEW IMAGE VIEWER */}
                  {(() => {
                    const currentPath = selectedProduct?.imageUrl || selectedProduct?.image || selectedProduct?.productImage;
                    let currentImgUrl = "";

                    if (updateImageFile) {
                      // જો યુઝરે નવો ફોટો સિલેક્ટ કર્યો હોય તો તેનું પ્રીવ્યૂ બતાવશે
                      currentImgUrl = URL.createObjectURL(updateImageFile);
                    } else if (currentPath) {
                      // નહીંતર જૂનો સેવ કરેલો ફોટો બતાવશે
                      const cleanPath = currentPath.replace(/^\//, "");
                      currentImgUrl = currentPath.startsWith("http")
                        ? currentPath
                        : (cleanPath.startsWith("uploads/") || cleanPath.startsWith("images/")
                          ? `http://localhost:5000/${cleanPath}`
                          : `http://localhost:5000/uploads/${cleanPath}`);
                    }

                    if (currentImgUrl) {
                      return (
                        <img
                          src={currentImgUrl}
                          alt="Preview"
                          crossOrigin="anonymous"
                          className="h-16 w-16 rounded-xl object-cover border border-slate-200 bg-white"
                          onError={(e) => {
                            if (!currentImgUrl.includes("/uploads/") && !updateImageFile) {
                              e.target.src = `http://localhost:5000/uploads/${currentPath.replace(/^\//, "")}`;
                            } else {
                              e.target.style.display = 'none';
                            }
                          }}
                        />
                      );
                    }
                    return (
                      <div className="h-16 w-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                        <Package size={24} />
                      </div>
                    );
                  })()}

                  {/* 🔹 FILE UPLOADER BUTTON */}
                  <div className="flex-1">
                    <label className="h-11 border border-dashed rounded-xl flex items-center justify-center cursor-pointer bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 gap-2">
                      <Upload size={16} /> {updateImageFile ? updateImageFile.name : "Select New Image"}
                      <input type="file" hidden accept="image/*" onChange={(e) => setUpdateImageFile(e.target.files[0])} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 h-11 border rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {updating ? <Loader2 className="animate-spin h-4 w-4" /> : <Check size={16} />}
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}