import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, Upload, PlusCircle, ShieldCheck, Package } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import { formatCurrency } from "../utils/format";
import LoadingScreen from "../components/LoadingScreen";
import { uploadImage } from "../services/uploadImage";

const initialForm = {
  name: "",
  price: "",
  stock: "", // Thêm trường số lượng
  category: "Sữa rửa mặt",
  shortDescription: "",
  description: "",
  imageFile: null,
};

export default function Admin() {
  const { profile } = useAuth();
  const {
    products,
    loading,
    addProduct,
    updateProduct,
    removeProduct,
    canManageProducts,
  } = useProducts();

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const lower = search.trim().toLowerCase();
    if (!lower) return products;

    return products.filter((item) => {
      return (
        item.name?.toLowerCase().includes(lower) ||
        item.category?.toLowerCase().includes(lower) ||
        item.shortDescription?.toLowerCase().includes(lower)
      );
    });
  }, [products, search]);

  useEffect(() => {
    if (!form.imageFile) return undefined;

    const url = URL.createObjectURL(form.imageFile);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [form.imageFile]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setPreview("");
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFile = (file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh phải nhỏ hơn 5MB.");
      return;
    }

    handleChange("imageFile", file);
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      price: product.price || "",
      stock: product.stock !== undefined ? product.stock : "", // Lấy số lượng khi sửa
      category: product.category || "Sữa rửa mặt",
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      imageFile: null,
    });
    setPreview(product.imageUrl || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) return toast.error("Vui lòng nhập tên sản phẩm.");
    if (!form.price || Number(form.price) <= 0) {
      return toast.error("Giá phải lớn hơn 0.");
    }
    if (form.stock === "" || Number(form.stock) < 0) {
      return toast.error("Số lượng không hợp lệ.");
    }
    if (!form.description.trim()) {
      return toast.error("Vui lòng nhập mô tả chi tiết.");
    }
    if (!editingId && !form.imageFile) {
      return toast.error("Vui lòng chọn ảnh sản phẩm.");
    }

    setSaving(true);
    try {
      let imageUrl = preview;

      if (form.imageFile) {
        imageUrl = await uploadImage(form.imageFile);
      }

      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock), // Đẩy số lượng lên Context
        category: form.category.trim() || "Sữa rửa mặt",
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        imageUrl,
      };

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await addProduct(payload);
      }

      resetForm();
      toast.success(editingId ? "Cập nhật sản phẩm thành công." : "Thêm sản phẩm thành công.");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Thao tác thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    const ok = window.confirm(`Xóa sản phẩm "${product.name}"?`);
    if (!ok) return;

    setSaving(true);
    try {
      await removeProduct(product.id);
      toast.success("Đã xóa sản phẩm.");
    } catch (error) {
      toast.error(error.message || "Không thể xóa sản phẩm.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingScreen label="Đang tải trang quản trị..." />;

  if (!canManageProducts) {
    return (
      <section className="section-shell py-16">
        <div className="glass-card rounded-[2rem] p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            <ShieldCheck className="h-4 w-4" />
            Chế độ quản trị
          </div>
          <h1 className="mt-4 text-3xl font-black text-slate-900">
            Bạn chưa có quyền quản trị
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Trang này chỉ dành cho tài khoản có role <strong>seller</strong> hoặc{" "}
            <strong>admin</strong>. Hãy gán role trong collection{" "}
            <code>users/{profile?.uid || "uid"}</code> của Firestore.
          </p>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            Tài khoản hiện tại:{" "}
            <strong>{profile?.displayName || "Chưa có tên"}</strong> — role{" "}
            <strong>{profile?.role || "customer"}</strong>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-shell py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="page-title">Trang quản trị</h1>
          <p className="page-subtitle">
            Thêm, sửa, xóa sản phẩm và upload ảnh lên Cloudinary.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          <ShieldCheck className="h-4 w-4" />
          Role: {profile?.role || "customer"}
        </div>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-card rounded-[2rem] p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
              {editingId ? (
                <Pencil className="h-5 w-5" />
              ) : (
                <PlusCircle className="h-5 w-5" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {editingId ? "Sửa sản phẩm" : "Thêm sản phẩm"}
              </h2>
              <p className="text-sm text-slate-500">
                Điền thông tin sản phẩm rồi lưu để cập nhật lên Firestore.
              </p>
            </div>
          </div>

          <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="label-text">Tên sản phẩm</label>
                <input
                  className="input-field"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              <div>
                <label className="label-text">Giá</label>
                <input
                  type="number"
                  className="input-field"
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                />
              </div>
              <div>
                <label className="label-text">Kho</label>
                <input
                  type="number"
                  className="input-field"
                  value={form.stock}
                  onChange={(e) => handleChange("stock", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="label-text">Danh mục</label>
              <input
                className="input-field"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
              />
            </div>

            <div>
              <label className="label-text">Mô tả ngắn</label>
              <input
                className="input-field"
                value={form.shortDescription}
                onChange={(e) => handleChange("shortDescription", e.target.value)}
              />
            </div>

            <div>
              <label className="label-text">Mô tả chi tiết</label>
              <textarea
                rows="5"
                className="input-field"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            <div>
              <label className="label-text">Hình ảnh</label>
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-600">
                <Upload className="h-4 w-4" />
                <span>{form.imageFile ? form.imageFile.name : "Chọn ảnh để upload"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </label>
            </div>

            {preview ? (
              <div className="overflow-hidden rounded-3xl bg-slate-100">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-72 w-full object-cover"
                />
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="btn-primary" disabled={saving}>
                {saving
                  ? "Đang lưu..."
                  : editingId
                  ? "Cập nhật sản phẩm"
                  : "Thêm sản phẩm"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={resetForm}
                >
                  Hủy chỉnh sửa
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-[2rem] p-6">
            <label className="label-text">Tìm trong kho sản phẩm</label>
            <input
              className="input-field"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nhập tên hoặc danh mục..."
            />
          </div>

          <div className="glass-card rounded-[2rem] p-6">
            <h3 className="text-xl font-bold text-slate-900">
              Danh sách sản phẩm
            </h3>

            <div className="mt-4 space-y-4">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex gap-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-20 w-20 rounded-2xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-semibold text-slate-900">
                        {product.name}
                      </h4>
                      <p className="mt-1 text-sm text-slate-500">
                        Kho: <strong className={product.stock > 0 ? "text-emerald-600" : "text-rose-600"}>{product.stock || 0}</strong>
                      </p>
                      <p className="mt-2 text-sm font-bold text-sky-600">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                    {product.shortDescription}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <button
                      className="btn-secondary flex-1"
                      onClick={() => startEdit(product)}
                      type="button"
                    >
                      <Pencil className="h-4 w-4" />
                      Sửa
                    </button>
                    <button
                      className="btn-secondary flex-1 text-rose-600 hover:border-rose-200 hover:bg-rose-50"
                      onClick={() => handleDelete(product)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                      Xóa
                    </button>
                  </div>
                </div>
              ))}

              {!filtered.length ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                  Không có sản phẩm phù hợp.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
