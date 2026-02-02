import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Layout from "../Partials/Layout";
import { getToken } from "../../api/client";
import { fetchProducts, deleteProduct, createProduct, updateProduct } from "../../api/products";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../../api/categories";
import { apiRequest } from "../../api/client";
import { fetchDashboardStats, fetchDashboardOverview } from "../../api/dashboard";
import { fetchPromotions, createPromotion, updatePromotion, deletePromotion, togglePromotionActive } from "../../api/promotions";
import { fetchAllNews, createNews, updateNews, deleteNews, toggleNewsActive } from "../../api/news";
import { fetchAllUsers } from "../../api/users";
import { fetchAllOrders, fetchOrderById, createOrderFromCart } from "../../api/orders";
import { fetchAllCarts } from "../../api/cart";
import { fetchAboutUs, updateAboutUs } from "../../api/appConfig";
import Spinner from "../Helpers/Spinner";

const LOGO_URL = `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo/jpeg`;

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Dashboard stats
  const [dashboardStats, setDashboardStats] = useState(null);
  
  // Promotions
  const [promotions, setPromotions] = useState([]);
  const [showPromotionForm, setShowPromotionForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [promotionForm, setPromotionForm] = useState({
    title: "",
    imageUrl: "",
    description: "",
    appearanceDate: "",
    closeDate: "",
  });
  
  // News
  const [news, setNews] = useState([]);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newsForm, setNewsForm] = useState({
    title: "",
    content: "",
    link: "",
    isActive: true,
    order: 0,
  });
  
  // Users
  const [users, setUsers] = useState([]);
  
  // Orders
  const [orders, setOrders] = useState([]);
  
  // Carts
  const [carts, setCarts] = useState([]);
  
  // About Us
  const [aboutUsContent, setAboutUsContent] = useState("");
  const [aboutUsLoading, setAboutUsLoading] = useState(false);

  // Form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Product form data
  const [productForm, setProductForm] = useState({
    title: "",
    name: "",
    description: "",
    note: "",
    quantity: 0,
    categoryId: "",
    sizes: [{ size: "", priceBeforeDiscount: "", priceAfterDiscount: "" }],
    images: [{ file: null, url: "", alt: "", order: 1 }],
  });
  
  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  // Category form data
  const [categoryForm, setCategoryForm] = useState({
    name: "",
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Load categories when component mounts and when needed
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        // Silently handle errors
      }
    };
    loadCategories();
  }, []);

  const loadAboutUs = async () => {
    setAboutUsLoading(true);
    setError("");
    try {
      const data = await fetchAboutUs();
      // API might return { aboutUs: "..." } or just a string
      const content = typeof data === 'string' 
        ? data 
        : (data?.aboutUs || data?.content || data || "");
      setAboutUsContent(content);
    } catch (err) {
      setError(err.message || "فشل في تحميل محتوى من نحن");
      // Silently handle errors
    } finally {
      setAboutUsLoading(false);
    }
  };

  const handleAboutUsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateAboutUs({ aboutUs: aboutUsContent });
      setSuccess("تم تحديث محتوى من نحن بنجاح");
    } catch (err) {
      setError(err.message || "فشل في تحديث محتوى من نحن");
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      if (activeTab === "dashboard") {
        const [stats, overview] = await Promise.all([
          fetchDashboardStats().catch(() => null),
          fetchDashboardOverview().catch(() => null),
        ]);
        setDashboardStats({ stats, overview });
      } else if (activeTab === "products") {
        const data = await fetchProducts();
        setProducts(Array.isArray(data) ? data : []);
      } else if (activeTab === "discountedProducts") {
        const data = await fetchProducts();
        // Filter products that have at least one size with a discount
        const discounted = Array.isArray(data) ? data.filter(product => {
          return product.sizes?.some(size => 
            size.priceBeforeDiscount && 
            size.priceBeforeDiscount > (size.priceAfterDiscount || size.price || 0)
          );
        }) : [];
        setProducts(discounted);
      } else if (activeTab === "categories") {
        const data = await fetchCategories();
        setCategories(Array.isArray(data) ? data : []);
      } else if (activeTab === "promotions") {
        const data = await fetchPromotions(true);
        setPromotions(Array.isArray(data) ? data : []);
      } else if (activeTab === "news") {
        const data = await fetchAllNews(true);
        setNews(Array.isArray(data) ? data : []);
      } else if (activeTab === "users") {
        const data = await fetchAllUsers();
        setUsers(Array.isArray(data) ? data : []);
      } else if (activeTab === "orders") {
        const data = await fetchAllOrders();
        setOrders(Array.isArray(data) ? data : []);
      } else if (activeTab === "carts") {
        const data = await fetchAllCarts();
        setCarts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError(err.message || "فشل في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = getToken();
      if (!token) {
        setError("يجب تسجيل الدخول أولاً");
        return;
      }

      const url = editingProduct
        ? `/products/${editingProduct.id}`
        : `/products`;

      const method = editingProduct ? "PATCH" : "POST";

      // Separate new images (with files) from existing images (with URLs only, not blob URLs)
      const newImages = productForm.images.filter(img => img.file !== null && img.file !== undefined);
      const existingImages = productForm.images.filter(img => !img.file && img.url && !img.url.startsWith('blob:'));

      // For new products, require at least one image
      if (!editingProduct && newImages.length === 0) {
        setError("يجب رفع صورة واحدة على الأقل");
        setLoading(false);
        return;
      }

      // For editing, require at least one image (either existing or new)
      if (editingProduct && newImages.length === 0 && existingImages.length === 0) {
        setError("يجب رفع صورة واحدة على الأقل");
        setLoading(false);
        return;
      }

      // Create FormData
      const formData = new FormData();

      // Add product data
      formData.append("title", productForm.title);
      formData.append("name", productForm.name);
      formData.append("description", productForm.description || "");
      formData.append("note", productForm.note || "");
      formData.append("quantity", (productForm.quantity === "" || productForm.quantity === null || productForm.quantity === undefined ? 0 : productForm.quantity).toString());
      formData.append("categoryId", productForm.categoryId);

      // Add sizes as JSON string
      const validSizes = productForm.sizes
        .filter(size => size.size.trim() !== "")
        .map(size => ({
          size: size.size,
          priceBeforeDiscount: size.priceBeforeDiscount ? parseFloat(size.priceBeforeDiscount) : null,
          priceAfterDiscount: parseFloat(size.priceAfterDiscount) || 0
        }));
      formData.append("sizes", JSON.stringify(validSizes));

      // Helper function to convert image URL to File
      const urlToFile = async (url, filename) => {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          return new File([blob], filename, { type: blob.type });
        } catch (error) {
          console.error("Error converting URL to File:", error);
          return null;
        }
      };

      // When editing, convert existing images to files and send ALL images (existing + new) as files
      if (editingProduct) {
        setLoading(true);
        setError("");
        
        try {
          // Convert existing image URLs to File objects
          const existingImageFiles = await Promise.all(
            existingImages.map(async (img, index) => {
              if (img.url && !img.url.startsWith('blob:')) {
                const filename = `existing_image_${index}.jpg`;
                return await urlToFile(img.url, filename);
              }
              return null;
            })
          );

          // Filter out any null values (failed conversions)
          const validExistingFiles = existingImageFiles.filter(file => file !== null);

          // Combine existing files (converted from URLs) and new files
          // Order matters - maintain the order from productForm.images
          const allImageFiles = [];
          for (const img of productForm.images) {
            if (img.file) {
              // New image with file
              allImageFiles.push(img.file);
            } else if (img.url && !img.url.startsWith('blob:')) {
              // Existing image - find the converted file
              const existingIndex = existingImages.findIndex(existing => existing.url === img.url);
              if (existingIndex >= 0 && validExistingFiles[existingIndex]) {
                allImageFiles.push(validExistingFiles[existingIndex]);
              }
            }
          }

          // Add all images as files - backend will replace all images with this set
          allImageFiles.forEach((file) => {
            formData.append("images", file);
          });
        } catch (error) {
          setError("فشل في تحميل الصور الموجودة. يرجى المحاولة مرة أخرى");
          setLoading(false);
          return;
        }
      } else {
        // For new products, only send new images
        newImages.forEach((img) => {
          formData.append("images", img.file);
        });
      }

      // FormData ready for submission

      // Use the new API functions for products
      let response;
      if (editingProduct) {
        response = await updateProduct(editingProduct.id, formData);
      } else {
        response = await createProduct(formData);
      }

      setSuccess(editingProduct ? "تم تحديث المنتج بنجاح" : "تم إضافة المنتج بنجاح");
      setShowProductForm(false);
      setEditingProduct(null);
      resetProductForm();
      loadData();
    } catch (err) {
      setError(err.message || "فشل في حفظ المنتج");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = getToken();
      if (!token) {
        setError("يجب تسجيل الدخول أولاً");
        return;
      }

      const url = editingCategory
        ? `/categories/${editingCategory.id}`
        : `/categories`;

      const method = editingCategory ? "PATCH" : "POST";

      // Use the new API functions
      let response;
      if (editingCategory) {
        response = await updateCategory(editingCategory.id, categoryForm);
      } else {
        response = await createCategory(categoryForm);
      }

      setSuccess(editingCategory ? "تم تحديث الفئة بنجاح" : "تم إضافة الفئة بنجاح");
      setShowCategoryForm(false);
      setEditingCategory(null);
      resetCategoryForm();
      loadData();
    } catch (err) {
      setError(err.message || "فشل في حفظ الفئة");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

    setLoading(true);
    setError("");
    try {
      await deleteProduct(id);
      setSuccess("تم حذف المنتج بنجاح");
      loadData();
    } catch (err) {
      setError(err.message || "فشل في حذف المنتج");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفئة؟")) return;

    setLoading(true);
    setError("");
    try {
      await deleteCategory(id);
      setSuccess("تم حذف الفئة بنجاح");
      loadData();
    } catch (err) {
      setError(err.message || "فشل في حذف الفئة");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title || "",
      name: product.name || "",
      description: product.description || "",
      note: product.note || "",
      quantity: product.quantity || 0,
      categoryId: product.categoryId || "",
      sizes: product.sizes?.length > 0 ? product.sizes.map(s => ({ 
        size: s.size, 
        priceBeforeDiscount: s.priceBeforeDiscount || "", 
        priceAfterDiscount: s.priceAfterDiscount || s.price || "" 
      })) : [{ size: "", priceBeforeDiscount: "", priceAfterDiscount: "" }],
      images: product.images?.length > 0 ? product.images.map(img => ({ file: null, url: img.url, alt: img.alt || "", order: img.order || 1, id: img.id || null })) : [{ file: null, url: "", alt: "", order: 1, id: null }],
    });
    setShowProductForm(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name || "",
    });
    setShowCategoryForm(true);
  };

  const resetProductForm = () => {
    // Clean up preview URLs
    productForm.images.forEach(img => {
      if (img.url && img.url.startsWith('blob:')) {
        URL.revokeObjectURL(img.url);
      }
    });
    
    setProductForm({
      title: "",
      name: "",
      description: "",
      note: "",
      quantity: 0,
      categoryId: "",
      sizes: [{ size: "", priceBeforeDiscount: "", priceAfterDiscount: "" }],
      images: [{ file: null, url: "", alt: "", order: 1 }],
    });
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: "",
    });
  };

  const addSizeField = () => {
    setProductForm({
      ...productForm,
      sizes: [...productForm.sizes, { size: "", priceBeforeDiscount: "", priceAfterDiscount: "" }],
    });
  };

  const removeSizeField = (index) => {
    setProductForm({
      ...productForm,
      sizes: productForm.sizes.filter((_, i) => i !== index),
    });
  };

  const updateSizeField = (index, field, value) => {
    const newSizes = [...productForm.sizes];
    if (field === "priceBeforeDiscount" || field === "priceAfterDiscount") {
      newSizes[index][field] = value === "" ? "" : Number(value);
    } else {
      newSizes[index][field] = value;
    }
    setProductForm({ ...productForm, sizes: newSizes });
  };

  const addImageField = () => {
    setProductForm({
      ...productForm,
      images: [...productForm.images, { url: "", alt: "", order: productForm.images.length + 1 }],
    });
  };

  const removeImageField = (index) => {
    setProductForm({
      ...productForm,
      images: productForm.images.filter((_, i) => i !== index),
    });
  };

  const updateImageField = (index, field, value) => {
    const newImages = [...productForm.images];
    newImages[index][field] = field === "order" ? Number(value) : value;
    setProductForm({ ...productForm, images: newImages });
  };

  const handleImageUpload = async (event, imageIndex) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("الرجاء اختيار ملف صورة صحيح");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }

    setUploadingImage(true);
    setError("");

    try {
      // Create preview URL for display
      const previewUrl = URL.createObjectURL(file);
      
      // Update the image with file object and preview URL
      const newImages = [...productForm.images];
      newImages[imageIndex] = {
        ...newImages[imageIndex],
        file: file,
        url: previewUrl,
      };
      setProductForm({ ...productForm, images: newImages });
      setUploadingImage(false);
    } catch (err) {
      setError("فشل في رفع الصورة");
      setUploadingImage(false);
    }
  };


  const isLoggedIn = !!getToken();

  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="container-x mx-auto py-10 text-center">
          <p className="text-lg text-qgray">يجب تسجيل الدخول للوصول إلى لوحة التحكم</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-x mx-auto py-4 sm:py-6 md:py-10 px-2 sm:px-4">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-qblack mb-2">
            لوحة التحكم الإدارية
          </h1>
          <p className="text-sm sm:text-base text-qgray">
            إدارة المنتجات والفئات
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-qgray-border overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setShowProductForm(false);
              setShowCategoryForm(false);
              setShowPromotionForm(false);
              setShowNewsForm(false);
            }}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "dashboard"
                ? "text-qyellow border-b-2 border-qyellow"
                : "text-qgray hover:text-qblack"
            }`}
          >
            الإحصائيات
          </button>
          <button
            onClick={() => {
              setActiveTab("products");
              setShowProductForm(false);
              setShowCategoryForm(false);
              setShowPromotionForm(false);
              setShowNewsForm(false);
            }}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "products"
                ? "text-qyellow border-b-2 border-qyellow"
                : "text-qgray hover:text-qblack"
            }`}
          >
            المنتجات
          </button>
          <button
            onClick={() => {
              setActiveTab("discountedProducts");
              setShowProductForm(false);
              setShowCategoryForm(false);
              setShowPromotionForm(false);
              setShowNewsForm(false);
            }}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "discountedProducts"
                ? "text-qyellow border-b-2 border-qyellow"
                : "text-qgray hover:text-qblack"
            }`}
          >
            المنتجات المخفضة
          </button>
          <button
            onClick={() => {
              setActiveTab("categories");
              setShowProductForm(false);
              setShowCategoryForm(false);
              setShowPromotionForm(false);
              setShowNewsForm(false);
            }}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "categories"
                ? "text-qyellow border-b-2 border-qyellow"
                : "text-qgray hover:text-qblack"
            }`}
          >
            الفئات
          </button>
          <button
            onClick={() => {
              setActiveTab("promotions");
              setShowProductForm(false);
              setShowCategoryForm(false);
              setShowPromotionForm(false);
              setShowNewsForm(false);
            }}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "promotions"
                ? "text-qyellow border-b-2 border-qyellow"
                : "text-qgray hover:text-qblack"
            }`}
          >
            العروض الترويجية
          </button>
          <button
            onClick={() => {
              setActiveTab("news");
              setShowProductForm(false);
              setShowCategoryForm(false);
              setShowPromotionForm(false);
              setShowNewsForm(false);
            }}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "news"
                ? "text-qyellow border-b-2 border-qyellow"
                : "text-qgray hover:text-qblack"
            }`}
          >
            الأخبار
          </button>
          <button
            onClick={() => {
              setActiveTab("users");
              setShowProductForm(false);
              setShowCategoryForm(false);
              setShowPromotionForm(false);
              setShowNewsForm(false);
            }}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "users"
                ? "text-qyellow border-b-2 border-qyellow"
                : "text-qgray hover:text-qblack"
            }`}
          >
            المستخدمون
          </button>
          <button
            onClick={() => {
              setActiveTab("orders");
              setShowProductForm(false);
              setShowCategoryForm(false);
              setShowPromotionForm(false);
              setShowNewsForm(false);
            }}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "orders"
                ? "text-qyellow border-b-2 border-qyellow"
                : "text-qgray hover:text-qblack"
            }`}
          >
            الطلبات
          </button>
          <button
            onClick={() => {
              setActiveTab("carts");
              setShowProductForm(false);
              setShowCategoryForm(false);
              setShowPromotionForm(false);
              setShowNewsForm(false);
            }}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "carts"
                ? "text-qyellow border-b-2 border-qyellow"
                : "text-qgray hover:text-qblack"
            }`}
          >
            السلات
          </button>
          <button
            onClick={() => {
              setActiveTab("aboutUs");
              setShowProductForm(false);
              setShowCategoryForm(false);
              setShowPromotionForm(false);
              setShowNewsForm(false);
              loadAboutUs();
            }}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "aboutUs"
                ? "text-qyellow border-b-2 border-qyellow"
                : "text-qgray hover:text-qblack"
            }`}
          >
            من نحن
          </button>
        </div>

        {/* Products Tab */}
        {(activeTab === "products" || activeTab === "discountedProducts") && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-qblack">
                {activeTab === "discountedProducts" ? "المنتجات المخفضة" : "جميع المنتجات"}
              </h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  resetProductForm();
                  setShowProductForm(true);
                }}
                className="px-4 py-2 bg-qyellow text-white rounded-md font-semibold hover:bg-opacity-90 transition-colors"
              >
                + إضافة منتج جديد
              </button>
            </div>

            {showProductForm && (
              <div className="bg-white border border-qgray-border rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-qblack mb-4">
                  {editingProduct ? "تعديل منتج" : "إضافة منتج جديد"}
                </h3>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-qblack mb-1">
                        العنوان (Title)
                      </label>
                      <input
                        type="text"
                        value={productForm.title}
                        onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                        className="w-full border border-qgray-border rounded-md px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-qblack mb-1">
                        الاسم (Name)
                      </label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full border border-qgray-border rounded-md px-3 py-2"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-qblack mb-1">
                      الوصف (Description)
                    </label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full border border-qgray-border rounded-md px-3 py-2"
                      rows="3"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-qblack mb-1">
                      ملاحظة (Note)
                    </label>
                    <input
                      type="text"
                      value={productForm.note}
                      onChange={(e) => setProductForm({ ...productForm, note: e.target.value })}
                      className="w-full border border-qgray-border rounded-md px-3 py-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-qblack mb-1">
                        الكمية (Quantity)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={productForm.quantity === 0 || productForm.quantity === "" || productForm.quantity === null || productForm.quantity === undefined ? "" : String(productForm.quantity)}
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          if (value === "" || /^\d+$/.test(value)) {
                            setProductForm({ ...productForm, quantity: value === "" ? "" : Number(value) });
                          }
                        }}
                        onBlur={(e) => {
                          const value = e.target.value.trim();
                          if (value === "" || isNaN(Number(value)) || Number(value) < 0) {
                            setProductForm({ ...productForm, quantity: 0 });
                          } else {
                            setProductForm({ ...productForm, quantity: Number(value) });
                          }
                        }}
                        className="w-full border border-qgray-border rounded-md px-3 py-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                        placeholder="0"
                        required
                        style={{ WebkitAppearance: 'none', MozAppearance: 'textfield', appearance: 'none' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-qblack mb-1">
                        الفئة (Category)
                      </label>
                      <select
                        value={productForm.categoryId}
                        onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                        className="w-full border border-qgray-border rounded-md px-3 py-2"
                        required
                      >
                        <option value="">اختر فئة</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-qblack">المقاسات والأسعار</label>
                      <button
                        type="button"
                        onClick={addSizeField}
                        className="text-sm text-qyellow hover:underline"
                      >
                        + إضافة مقاس
                      </button>
                    </div>
                    {productForm.sizes.map((size, index) => (
                      <div key={index} className="flex flex-col gap-2 mb-3 p-3 border border-gray-200 rounded-lg">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="المقاس"
                            value={size.size}
                            onChange={(e) => updateSizeField(index, "size", e.target.value)}
                            className="flex-1 border border-qgray-border rounded-md px-3 py-2"
                          />
                          {productForm.sizes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSizeField(index)}
                              className="px-3 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                            >
                              حذف
                            </button>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="السعر قبل الخصم (اختياري)"
                            value={size.priceBeforeDiscount || ""}
                            onChange={(e) => updateSizeField(index, "priceBeforeDiscount", e.target.value)}
                            className="flex-1 border border-qgray-border rounded-md px-3 py-2"
                            step="0.01"
                            min="0"
                          />
                          <input
                            type="number"
                            placeholder="السعر بعد الخصم"
                            value={size.priceAfterDiscount || ""}
                            onChange={(e) => updateSizeField(index, "priceAfterDiscount", e.target.value)}
                            className="flex-1 border border-qgray-border rounded-md px-3 py-2"
                            step="0.01"
                            min="0"
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Images */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-qblack">الصور</label>
                      <button
                        type="button"
                        onClick={addImageField}
                        className="text-sm text-qyellow hover:underline"
                      >
                        + إضافة صورة
                      </button>
                    </div>
                    {productForm.images.map((image, index) => (
                      <div key={index} className="flex flex-col gap-2 mb-4">
                        <div className="flex gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, index)}
                            className="flex-1 border border-qgray-border rounded-md px-3 py-2"
                            disabled={uploadingImage}
                          />
                        </div>
                        {image.url && (
                          <div className="flex items-center gap-2">
                            <img
                              src={image.url}
                              alt="Preview"
                              className="w-20 h-20 object-cover rounded border border-qgray-border"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                            <div className="flex-1 flex gap-2">
                              <input
                                type="text"
                                placeholder="النص البديل"
                                value={image.alt}
                                onChange={(e) => updateImageField(index, "alt", e.target.value)}
                                className="flex-1 border border-qgray-border rounded-md px-3 py-2"
                              />
                              <input
                                type="number"
                                placeholder="الترتيب"
                                value={image.order}
                                onChange={(e) => updateImageField(index, "order", e.target.value)}
                                className="w-24 border border-qgray-border rounded-md px-3 py-2"
                                min="1"
                              />
                              {productForm.images.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeImageField(index)}
                                  className="px-3 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                                >
                                  حذف
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                        {!image.url && (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="النص البديل"
                              value={image.alt}
                              onChange={(e) => updateImageField(index, "alt", e.target.value)}
                              className="flex-1 border border-qgray-border rounded-md px-3 py-2"
                            />
                            <input
                              type="number"
                              placeholder="الترتيب"
                              value={image.order}
                              onChange={(e) => updateImageField(index, "order", e.target.value)}
                              className="w-24 border border-qgray-border rounded-md px-3 py-2"
                              min="1"
                            />
                            {productForm.images.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeImageField(index)}
                                className="px-3 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                              >
                                حذف
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-qyellow text-white rounded-md font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50"
                    >
                      {loading ? <Spinner size="sm" className="text-white" /> : (editingProduct ? "تحديث" : "إضافة")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                        resetProductForm();
                      }}
                      className="px-6 py-2 bg-gray-200 text-qblack rounded-md font-semibold hover:bg-gray-300 transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading && !showProductForm ? (
              <div className="text-center py-10 flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : (
              <div className="bg-white border border-qgray-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">الصورة</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">الاسم</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">الفئة</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">الكمية</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">الحالة</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-4 py-8 text-center text-qgray">
                            لا توجد منتجات
                          </td>
                        </tr>
                      ) : (
                        products.map((product) => (
                          <tr key={product.id} className="border-t border-qgray-border hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <img
                                src={product.images?.[0]?.url || LOGO_URL}
                                alt={product.title}
                                className="w-16 h-16 object-cover rounded"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm text-qblack">{product.title || product.name}</td>
                            <td className="px-4 py-3 text-sm text-qgray">{product.category?.name || "-"}</td>
                            <td className="px-4 py-3 text-sm text-qblack">{product.quantity || 0}</td>
                            <td className="px-4 py-3">
                              {product.soldOut ? (
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">نفدت</span>
                              ) : (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">متوفر</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
                                >
                                  تعديل
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200"
                                >
                                  حذف
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-qblack">جميع الفئات</h2>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  resetCategoryForm();
                  setShowCategoryForm(true);
                }}
                className="px-4 py-2 bg-qyellow text-white rounded-md font-semibold hover:bg-opacity-90 transition-colors"
              >
                + إضافة فئة جديدة
              </button>
            </div>

            {showCategoryForm && (
              <div className="bg-white border border-qgray-border rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-qblack mb-4">
                  {editingCategory ? "تعديل فئة" : "إضافة فئة جديدة"}
                </h3>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-qblack mb-1">
                      اسم الفئة
                    </label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      className="w-full border border-qgray-border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-qyellow text-white rounded-md font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50"
                    >
                      {loading ? <Spinner size="sm" className="text-white" /> : (editingCategory ? "تحديث" : "إضافة")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCategoryForm(false);
                        setEditingCategory(null);
                        resetCategoryForm();
                      }}
                      className="px-6 py-2 bg-gray-200 text-qblack rounded-md font-semibold hover:bg-gray-300 transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading && !showCategoryForm ? (
              <div className="text-center py-10 flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : (
              <div className="bg-white border border-qgray-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">الاسم</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">تاريخ الإنشاء</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="px-4 py-8 text-center text-qgray">
                            لا توجد فئات
                          </td>
                        </tr>
                      ) : (
                        categories.map((category) => (
                          <tr key={category.id} className="border-t border-qgray-border hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-qblack font-semibold">{category.name}</td>
                            <td className="px-4 py-3 text-sm text-qgray">
                              {new Date(category.createdAt).toLocaleDateString("ar-SA")}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditCategory(category)}
                                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
                                >
                                  تعديل
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200"
                                >
                                  حذف
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-xl font-semibold text-qblack mb-4">الإحصائيات</h2>
            {loading ? (
              <div className="text-center py-10 flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : dashboardStats ? (
              <div className="space-y-6">
                {(() => {
                  // Get data from stats or overview
                  const statsData = dashboardStats.stats || {};
                  const overviewData = statsData.overview || dashboardStats.overview || {};
                  const productsData = statsData.products || {};
                  const usersData = statsData.users || {};
                  const cartData = statsData.cart || {};
                  
                  return (
                    <>
                      {/* Overview Cards */}
                      <div>
                        <h3 className="text-lg font-semibold text-qblack mb-3">نظرة عامة</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-white border border-qgray-border rounded-lg p-4">
                            <h4 className="text-sm text-qgray mb-2">إجمالي المستخدمين</h4>
                            <p className="text-2xl font-bold text-qblack">{overviewData.totalUsers || 0}</p>
                            {overviewData.totalRegularUsers !== undefined && (
                              <p className="text-xs text-qgray mt-1">عادي: {overviewData.totalRegularUsers} | أدمن: {overviewData.totalAdmins || 0}</p>
                            )}
                          </div>
                          <div className="bg-white border border-qgray-border rounded-lg p-4">
                            <h4 className="text-sm text-qgray mb-2">إجمالي المنتجات</h4>
                            <p className="text-2xl font-bold text-qblack">{overviewData.totalProducts || 0}</p>
                            {productsData.recentProducts !== undefined && (
                              <p className="text-xs text-qgray mt-1">حديثة: {productsData.recentProducts}</p>
                            )}
                          </div>
                          <div className="bg-white border border-qgray-border rounded-lg p-4">
                            <h4 className="text-sm text-qgray mb-2">إجمالي الفئات</h4>
                            <p className="text-2xl font-bold text-qblack">{overviewData.totalCategories || 0}</p>
                          </div>
                          <div className="bg-white border border-qgray-border rounded-lg p-4">
                            <h4 className="text-sm text-qgray mb-2">العروض الترويجية</h4>
                            <p className="text-2xl font-bold text-qblack">{overviewData.activePromotions || 0}</p>
                            {overviewData.totalPromotions !== undefined && (
                              <p className="text-xs text-qgray mt-1">من أصل {overviewData.totalPromotions} عرض</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Products Statistics */}
                      {productsData.lowStockProducts !== undefined && (
                        <div>
                          <h3 className="text-lg font-semibold text-qblack mb-3">إحصائيات المنتجات</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white border border-qgray-border rounded-lg p-4">
                              <h4 className="text-sm text-qgray mb-2">المنتجات الحديثة</h4>
                              <p className="text-2xl font-bold text-qblack">{productsData.recentProducts || 0}</p>
                            </div>
                            <div className="bg-white border border-qgray-border rounded-lg p-4">
                              <h4 className="text-sm text-qgray mb-2">منتجات قليلة المخزون</h4>
                              <p className="text-2xl font-bold text-red-600">{productsData.lowStockProducts || 0}</p>
                            </div>
                            {productsData.byCategory && productsData.byCategory.length > 0 && (
                              <div className="bg-white border border-qgray-border rounded-lg p-4">
                                <h4 className="text-sm text-qgray mb-2">المنتجات حسب الفئة</h4>
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                  {productsData.byCategory.map((cat, idx) => (
                                    <div key={idx} className="flex justify-between text-xs">
                                      <span className="text-qblack">{cat.categoryName}</span>
                                      <span className="font-semibold text-qblack">{cat.productCount}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Users Statistics */}
                      {usersData.recentUsers !== undefined && (
                        <div>
                          <h3 className="text-lg font-semibold text-qblack mb-3">إحصائيات المستخدمين</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white border border-qgray-border rounded-lg p-4">
                              <h4 className="text-sm text-qgray mb-2">المستخدمون الجدد</h4>
                              <p className="text-2xl font-bold text-qblack">{usersData.recentUsers || 0}</p>
                            </div>
                            <div className="bg-white border border-qgray-border rounded-lg p-4">
                              <h4 className="text-sm text-qgray mb-2">المديرون</h4>
                              <p className="text-2xl font-bold text-qblack">{usersData.totalAdmins || 0}</p>
                            </div>
                            <div className="bg-white border border-qgray-border rounded-lg p-4">
                              <h4 className="text-sm text-qgray mb-2">المستخدمون العاديون</h4>
                              <p className="text-2xl font-bold text-qblack">{usersData.totalRegularUsers || 0}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Cart Statistics */}
                      {cartData.totalCarts !== undefined && (
                        <div>
                          <h3 className="text-lg font-semibold text-qblack mb-3">إحصائيات السلات</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="bg-white border border-qgray-border rounded-lg p-4">
                              <h4 className="text-sm text-qgray mb-2">إجمالي السلات</h4>
                              <p className="text-2xl font-bold text-qblack">{cartData.totalCarts || 0}</p>
                            </div>
                            <div className="bg-white border border-qgray-border rounded-lg p-4">
                              <h4 className="text-sm text-qgray mb-2">إجمالي العناصر</h4>
                              <p className="text-2xl font-bold text-qblack">{cartData.totalCartItems || 0}</p>
                            </div>
                            <div className="bg-white border border-qgray-border rounded-lg p-4">
                              <h4 className="text-sm text-qgray mb-2">القيمة الإجمالية</h4>
                              <p className="text-2xl font-bold text-qblack">₪{cartData.totalCartValue?.toFixed(2) || 0}</p>
                            </div>
                            <div className="bg-white border border-qgray-border rounded-lg p-4">
                              <h4 className="text-sm text-qgray mb-2">متوسط قيمة السلة</h4>
                              <p className="text-2xl font-bold text-qblack">₪{cartData.averageCartValue?.toFixed(2) || 0}</p>
                            </div>
                            <div className="bg-white border border-qgray-border rounded-lg p-4">
                              <h4 className="text-sm text-qgray mb-2">متوسط العناصر/سلة</h4>
                              <p className="text-2xl font-bold text-qblack">{cartData.averageItemsPerCart?.toFixed(1) || 0}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-10 text-qgray">لا توجد بيانات</div>
            )}
          </div>
        )}

        {/* Promotions Tab */}
        {activeTab === "promotions" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-qblack">العروض الترويجية</h2>
              <button
                onClick={() => {
                  setEditingPromotion(null);
                  setPromotionForm({
                    title: "",
                    imageUrl: "",
                    description: "",
                    appearanceDate: "",
                    closeDate: "",
                  });
                  setShowPromotionForm(true);
                }}
                className="px-4 py-2 bg-qyellow text-white rounded-md font-semibold hover:bg-opacity-90 transition-colors"
              >
                + إضافة عرض ترويجي
              </button>
            </div>

            {showPromotionForm && (
              <div className="bg-white border border-qgray-border rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-qblack mb-4">
                  {editingPromotion ? "تعديل عرض ترويجي" : "إضافة عرض ترويجي جديد"}
                </h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    setLoading(true);
                    if (editingPromotion) {
                      await updatePromotion(editingPromotion.id, promotionForm);
                      setSuccess("تم تحديث العرض الترويجي بنجاح");
                    } else {
                      await createPromotion(promotionForm);
                      setSuccess("تم إضافة العرض الترويجي بنجاح");
                    }
                    setShowPromotionForm(false);
                    setEditingPromotion(null);
                    loadData();
                  } catch (err) {
                    setError(err.message || "فشل في حفظ العرض الترويجي");
                  } finally {
                    setLoading(false);
                  }
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-qblack mb-1">العنوان</label>
                    <input
                      type="text"
                      value={promotionForm.title}
                      onChange={(e) => setPromotionForm({ ...promotionForm, title: e.target.value })}
                      className="w-full border border-qgray-border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-qblack mb-1">رابط الصورة</label>
                    <input
                      type="text"
                      value={promotionForm.imageUrl}
                      onChange={(e) => setPromotionForm({ ...promotionForm, imageUrl: e.target.value })}
                      className="w-full border border-qgray-border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-qblack mb-1">الوصف</label>
                    <textarea
                      value={promotionForm.description}
                      onChange={(e) => setPromotionForm({ ...promotionForm, description: e.target.value })}
                      className="w-full border border-qgray-border rounded-md px-3 py-2"
                      rows="3"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-qblack mb-1">تاريخ البداية</label>
                      <input
                        type="datetime-local"
                        value={promotionForm.appearanceDate}
                        onChange={(e) => setPromotionForm({ ...promotionForm, appearanceDate: e.target.value })}
                        className="w-full border border-qgray-border rounded-md px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-qblack mb-1">تاريخ النهاية</label>
                      <input
                        type="datetime-local"
                        value={promotionForm.closeDate}
                        onChange={(e) => setPromotionForm({ ...promotionForm, closeDate: e.target.value })}
                        className="w-full border border-qgray-border rounded-md px-3 py-2"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-qyellow text-white rounded-md font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50"
                    >
                      {loading ? <Spinner size="sm" className="text-white" /> : (editingPromotion ? "تحديث" : "إضافة")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPromotionForm(false);
                        setEditingPromotion(null);
                      }}
                      className="px-6 py-2 bg-gray-200 text-qblack rounded-md font-semibold hover:bg-gray-300 transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading && !showPromotionForm ? (
              <div className="text-center py-10 flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : (
              <div className="bg-white border border-qgray-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">العنوان</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">الحالة</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promotions.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="px-4 py-8 text-center text-qgray">لا توجد عروض ترويجية</td>
                        </tr>
                      ) : (
                        promotions.map((promo) => (
                          <tr key={promo.id} className="border-t border-qgray-border hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-qblack">{promo.title}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs ${promo.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {promo.isActive ? 'نشط' : 'غير نشط'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={async () => {
                                    try {
                                      await togglePromotionActive(promo.id);
                                      loadData();
                                    } catch (err) {
                                      setError(err.message || "فشل في تغيير الحالة");
                                    }
                                  }}
                                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
                                >
                                  {promo.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingPromotion(promo);
                                    setPromotionForm({
                                      title: promo.title || "",
                                      imageUrl: promo.imageUrl || "",
                                      description: promo.description || "",
                                      appearanceDate: promo.appearanceDate ? new Date(promo.appearanceDate).toISOString().slice(0, 16) : "",
                                      closeDate: promo.closeDate ? new Date(promo.closeDate).toISOString().slice(0, 16) : "",
                                    });
                                    setShowPromotionForm(true);
                                  }}
                                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
                                >
                                  تعديل
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm("هل أنت متأكد من حذف هذا العرض الترويجي؟")) {
                                      try {
                                        await deletePromotion(promo.id);
                                        setSuccess("تم حذف العرض الترويجي بنجاح");
                                        loadData();
                                      } catch (err) {
                                        setError(err.message || "فشل في حذف العرض الترويجي");
                                      }
                                    }
                                  }}
                                  className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200"
                                >
                                  حذف
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* News Tab */}
        {activeTab === "news" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-qblack">الأخبار</h2>
              <button
                onClick={() => {
                  setEditingNews(null);
                  setNewsForm({
                    title: "",
                    content: "",
                    link: "",
                    isActive: true,
                    order: 0,
                  });
                  setShowNewsForm(true);
                }}
                className="px-4 py-2 bg-qyellow text-white rounded-md font-semibold hover:bg-opacity-90 transition-colors"
              >
                + إضافة خبر جديد
              </button>
            </div>

            {showNewsForm && (
              <div className="bg-white border border-qgray-border rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-qblack mb-4">
                  {editingNews ? "تعديل خبر" : "إضافة خبر جديد"}
                </h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    setLoading(true);
                    if (editingNews) {
                      await updateNews(editingNews.id, newsForm);
                      setSuccess("تم تحديث الخبر بنجاح");
                    } else {
                      await createNews(newsForm);
                      setSuccess("تم إضافة الخبر بنجاح");
                    }
                    setShowNewsForm(false);
                    setEditingNews(null);
                    loadData();
                  } catch (err) {
                    setError(err.message || "فشل في حفظ الخبر");
                  } finally {
                    setLoading(false);
                  }
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-qblack mb-1">العنوان</label>
                    <input
                      type="text"
                      value={newsForm.title}
                      onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                      className="w-full border border-qgray-border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-qblack mb-1">المحتوى</label>
                    <textarea
                      value={newsForm.content}
                      onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                      className="w-full border border-qgray-border rounded-md px-3 py-2"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-qblack mb-1">الرابط</label>
                    <input
                      type="text"
                      value={newsForm.link}
                      onChange={(e) => setNewsForm({ ...newsForm, link: e.target.value })}
                      className="w-full border border-qgray-border rounded-md px-3 py-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newsForm.isActive}
                          onChange={(e) => setNewsForm({ ...newsForm, isActive: e.target.checked })}
                          className="ml-2"
                        />
                        <span className="text-sm font-medium text-qblack">نشط</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-qblack mb-1">الترتيب</label>
                      <input
                        type="number"
                        value={newsForm.order}
                        onChange={(e) => setNewsForm({ ...newsForm, order: parseInt(e.target.value) || 0 })}
                        className="w-full border border-qgray-border rounded-md px-3 py-2"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-qyellow text-white rounded-md font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50"
                    >
                      {loading ? <Spinner size="sm" className="text-white" /> : (editingNews ? "تحديث" : "إضافة")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewsForm(false);
                        setEditingNews(null);
                      }}
                      className="px-6 py-2 bg-gray-200 text-qblack rounded-md font-semibold hover:bg-gray-300 transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading && !showNewsForm ? (
              <div className="text-center py-10 flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : (
              <div className="bg-white border border-qgray-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">العنوان</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">الحالة</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {news.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="px-4 py-8 text-center text-qgray">لا توجد أخبار</td>
                        </tr>
                      ) : (
                        news.map((item) => (
                          <tr key={item.id} className="border-t border-qgray-border hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-qblack">{item.title}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {item.isActive ? 'نشط' : 'غير نشط'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={async () => {
                                    try {
                                      await toggleNewsActive(item.id);
                                      loadData();
                                    } catch (err) {
                                      setError(err.message || "فشل في تغيير الحالة");
                                    }
                                  }}
                                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
                                >
                                  {item.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingNews(item);
                                    setNewsForm({
                                      title: item.title || "",
                                      content: item.content || "",
                                      link: item.link || "",
                                      isActive: item.isActive !== undefined ? item.isActive : true,
                                      order: item.order || 0,
                                    });
                                    setShowNewsForm(true);
                                  }}
                                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
                                >
                                  تعديل
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm("هل أنت متأكد من حذف هذا الخبر؟")) {
                                      try {
                                        await deleteNews(item.id);
                                        setSuccess("تم حذف الخبر بنجاح");
                                        loadData();
                                      } catch (err) {
                                        setError(err.message || "فشل في حذف الخبر");
                                      }
                                    }
                                  }}
                                  className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200"
                                >
                                  حذف
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <h2 className="text-xl font-semibold text-qblack mb-4">المستخدمون</h2>
            {loading ? (
              <div className="text-center py-10 flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : (
              <div className="bg-white border border-qgray-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">البريد الإلكتروني</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">رقم الهاتف</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">الدور</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">تاريخ التسجيل</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-4 py-8 text-center text-qgray">لا يوجد مستخدمون</td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id} className="border-t border-qgray-border hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-qblack">{user.email}</td>
                            <td className="px-4 py-3 text-sm text-qblack">{user.mobileNumber || "-"}</td>
                            <td className="px-4 py-3 text-sm text-qblack">{user.role === "ADMIN" ? "مدير" : "مستخدم"}</td>
                            <td className="px-4 py-3 text-sm text-qgray">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString("ar-SA") : "-"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-xl font-semibold text-qblack mb-4">الطلبات</h2>
            {loading ? (
              <div className="text-center py-10 flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : (
              <div className="bg-white border border-qgray-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">رقم الطلب</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">المستخدم</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">تاريخ الطلب</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-4 py-8 text-center text-qgray">لا توجد طلبات</td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id} className="border-t border-qgray-border hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-qblack">{order.id?.slice(0, 8) || "-"}</td>
                            <td className="px-4 py-3 text-sm text-qblack">{order.user?.email || "-"}</td>
                            <td className="px-4 py-3 text-sm text-qgray">
                              {order.createdAt ? new Date(order.createdAt).toLocaleDateString("ar-SA") : "-"}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => {
                                  navigate(`/admin/order/${order.id}`);
                                }}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
                              >
                                عرض التفاصيل
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* About Us Tab */}
        {activeTab === "aboutUs" && (
          <div>
            <h2 className="text-xl font-semibold text-qblack mb-4">تعديل محتوى من نحن</h2>
            <form onSubmit={handleAboutUsSubmit} className="bg-white border border-qgray-border rounded-lg p-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-qblack mb-2">
                  المحتوى
                </label>
                <textarea
                  value={aboutUsContent}
                  onChange={(e) => setAboutUsContent(e.target.value)}
                  className="w-full h-64 p-4 border border-qgray-border rounded-md text-right resize-y"
                  placeholder="أدخل محتوى صفحة من نحن..."
                  dir="rtl"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading || aboutUsLoading}
                  className="px-6 py-2 bg-qyellow text-white rounded-md font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Spinner size="sm" className="text-white" /> : "حفظ التغييرات"}
                </button>
                <button
                  type="button"
                  onClick={loadAboutUs}
                  disabled={aboutUsLoading}
                  className="px-6 py-2 bg-gray-200 text-qblack rounded-md font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {aboutUsLoading ? <Spinner size="sm" className="text-white" /> : "إعادة التحميل"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Carts Tab */}
        {activeTab === "carts" && (
          <div>
            <h2 className="text-xl font-semibold text-qblack mb-4">السلات</h2>
            {loading ? (
              <div className="text-center py-10 flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : (
              <div className="bg-white border border-qgray-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">المستخدم</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">عدد العناصر</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-qblack">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carts.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="px-4 py-8 text-center text-qgray">لا توجد سلات</td>
                        </tr>
                      ) : (
                        carts.map((cart) => (
                          <tr key={cart.id} className="border-t border-qgray-border hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-qblack">{cart.user?.email || "-"}</td>
                            <td className="px-4 py-3 text-sm text-qblack">{cart.items?.length || 0}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => {
                                  navigate(`/admin/cart/${cart.id}`);
                                }}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
                              >
                                عرض التفاصيل
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
