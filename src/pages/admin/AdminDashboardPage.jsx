import { BarChart3, Boxes, PackageSearch, Pencil, Plus, TicketPercent, Trash2, UploadCloud } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PageTransition from '../../components/common/PageTransition';
import SeoMeta from '../../components/common/SeoMeta';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import { normalizeProduct } from '../../lib/normalizers';
import { formatPrice } from '../../data/store';

const initialProductForm = {
  title: '',
  sku: '',
  category: 'Jhumkas',
  mrp: 0,
  salePrice: 0,
  description: '',
  images: '',
  tags: 'newArrival,trending',
  sizes: 'One Size',
  badge: 'New',
  stock: 24,
};

const productCategories = [
  'Jhumkas',
  'Oxidised Earrings',
  'Necklaces',
  'Rings',
  'Bangles',
  'Bridal Collection',
  'Korean Jewelry',
  'Gift Boxes',
];

const initialCouponForm = {
  code: '',
  description: '',
  type: 'percentage',
  value: 10,
  minOrderValue: 1499,
  maxDiscount: 400,
};

export default function AdminDashboardPage() {
  const { isAdmin } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [productForm, setProductForm] = useState(initialProductForm);
  const [couponForm, setCouponForm] = useState(initialCouponForm);
  const [uploading, setUploading] = useState(false);
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [submittingCoupon, setSubmittingCoupon] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  const loadAdminData = async () => {
    const [dashboardResponse, productsResponse, ordersResponse, couponsResponse] = await Promise.all([
      apiRequest('/analytics/dashboard'),
      apiRequest('/products', { params: { limit: 60, adminView: true } }),
      apiRequest('/orders'),
      apiRequest('/coupons'),
    ]);

    setDashboard(dashboardResponse.dashboard);
    setProducts((productsResponse.products || []).map(normalizeProduct));
    setOrders(ordersResponse.orders || []);
    setCoupons(couponsResponse.coupons || []);
  };

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    loadAdminData().catch((error) => console.error(error));
  }, [isAdmin]);

  const lowStockProducts = useMemo(
    () => dashboard?.lowStockProducts || products.filter((product) => (product.inventory?.total || 0) <= 8).slice(0, 6),
    [dashboard, products],
  );

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await apiRequest('/uploads/image', {
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setProductForm((current) => ({
        ...current,
        images: current.images ? `${current.images},${response.file.url}` : response.file.url,
      }));
    } finally {
      setUploading(false);
    }
  };

  const buildProductPayload = () => {
    const sizeLabels = productForm.sizes
      .split(',')
      .map((label) => label.trim())
      .filter(Boolean);

    return {
      title: productForm.title,
      sku: productForm.sku,
      category: productForm.category,
      mrp: Number(productForm.mrp),
      salePrice: Number(productForm.salePrice),
      description: productForm.description,
      badge: productForm.badge,
      tags: productForm.tags.split(',').map((item) => item.trim()).filter(Boolean),
      collections: productForm.tags.split(',').map((item) => item.trim()).filter(Boolean),
      images: productForm.images.split(',').map((item) => item.trim()).filter(Boolean),
      inventory: {
        sizes: sizeLabels.map((label) => ({
          label,
          stock: Math.max(1, Math.floor(Number(productForm.stock) / Math.max(sizeLabels.length, 1))),
        })),
      },
    };
  };

  const handleSaveProduct = async () => {
    setSubmittingProduct(true);

    try {
      await apiRequest(editingProductId ? `/products/${editingProductId}` : '/products', {
        method: editingProductId ? 'PATCH' : 'POST',
        data: buildProductPayload(),
      });

      setProductForm(initialProductForm);
      setEditingProductId(null);
      await loadAdminData();
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);
    setProductForm({
      title: product.title,
      sku: product.sku || '',
      category: product.category,
      mrp: product.mrp,
      salePrice: product.salePrice,
      description: product.description,
      images: product.images?.join(',') || '',
      tags: product.tags?.join(',') || '',
      sizes: product.inventory?.sizes?.map((size) => size.label).join(',') || 'One Size',
      badge: product.badge || 'New',
      stock: product.inventory?.total || 12,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (productId) => {
    setDeletingProductId(productId);

    try {
      await apiRequest(`/products/${productId}`, {
        method: 'DELETE',
      });
      if (editingProductId === productId) {
        setEditingProductId(null);
        setProductForm(initialProductForm);
      }
      await loadAdminData();
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleCreateCoupon = async () => {
    setSubmittingCoupon(true);

    try {
      await apiRequest('/coupons', {
        method: 'POST',
        data: {
          ...couponForm,
          value: Number(couponForm.value),
          minOrderValue: Number(couponForm.minOrderValue),
          maxDiscount: Number(couponForm.maxDiscount),
        },
      });

      setCouponForm(initialCouponForm);
      await loadAdminData();
    } finally {
      setSubmittingCoupon(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    await apiRequest(`/orders/${orderId}/status`, {
      method: 'PATCH',
      data: { status },
    });

    await loadAdminData();
  };

  if (!isAdmin) {
    return (
      <PageTransition>
        <main className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-[34px] border border-luxe-cocoa/10 bg-white/80 p-10 text-center shadow-luxe dark:border-white/10 dark:bg-white/5">
            <p className="text-xs uppercase tracking-[0.32em] text-luxe-mocha/70 dark:text-luxe-ink/55">Admin Dashboard</p>
            <h1 className="mt-3 font-display text-5xl text-luxe-espresso dark:text-luxe-ink">Admin access required</h1>
            <p className="mt-4 text-sm leading-7 text-luxe-cocoa/75 dark:text-luxe-ink/65">
              Sign in with an approved admin account to manage catalog uploads, orders, inventory, coupons, and analytics.
            </p>
          </div>
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <SeoMeta
        title="Admin Dashboard | Sayan Trendz"
        description="Manage jewelry products, orders, coupons, inventory, and analytics for the Sayan Trendz premium commerce platform."
      />

      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.32em] text-luxe-mocha/70 dark:text-luxe-ink/55">Production Admin Suite</p>
          <h1 className="mt-3 font-display text-5xl text-luxe-espresso dark:text-luxe-ink">Analytics, jewelry catalog, and order control</h1>

          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {[
              { label: 'Revenue', value: formatPrice(dashboard?.stats?.revenue || 0), icon: BarChart3 },
              { label: 'Orders', value: dashboard?.stats?.orderCount || 0, icon: PackageSearch },
              { label: 'Products', value: dashboard?.stats?.productCount || 0, icon: Boxes },
              { label: 'Active Coupons', value: dashboard?.stats?.activeCoupons || 0, icon: TicketPercent },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-soft dark:border-white/10 dark:bg-white/5"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-luxe-sand/35 text-luxe-cocoa dark:bg-white/10 dark:text-luxe-ink">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-xs uppercase tracking-[0.24em] text-luxe-mocha/65 dark:text-luxe-ink/55">{item.label}</p>
                  <p className="mt-2 font-display text-4xl text-luxe-espresso dark:text-luxe-ink">{item.value}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_1fr]">
            <section className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <Plus className="h-5 w-5 text-luxe-cocoa dark:text-luxe-ink" />
                <h2 className="font-display text-4xl text-luxe-espresso dark:text-luxe-ink">Add / Edit Jewelry Products</h2>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ['title', 'Title'],
                  ['sku', 'SKU'],
                  ['category', 'Category'],
                  ['mrp', 'MRP'],
                  ['salePrice', 'Sale Price'],
                  ['badge', 'Badge'],
                  ['tags', 'Tags (comma separated)', true],
                  ['sizes', 'Sizes (comma separated)', true],
                  ['images', 'Image URLs (comma separated)', true],
                  ['description', 'Description', true],
                ].map(([field, label, wide]) => (
                  <label key={field} className={wide ? 'sm:col-span-2' : ''}>
                    <span className="text-xs uppercase tracking-[0.26em] text-luxe-mocha/70 dark:text-luxe-ink/55">{label}</span>
                    {field === 'category' ? (
                      <select
                        value={productForm[field]}
                        onChange={(event) => setProductForm((current) => ({ ...current, [field]: event.target.value }))}
                        className="mt-3 w-full rounded-[18px] border border-luxe-cocoa/10 bg-luxe-mist px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-white/8 dark:text-luxe-ink"
                      >
                        {productCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    ) : field === 'description' ? (
                      <textarea
                        value={productForm[field]}
                        onChange={(event) => setProductForm((current) => ({ ...current, [field]: event.target.value }))}
                        className="mt-3 h-28 w-full rounded-[18px] border border-luxe-cocoa/10 bg-luxe-mist px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-white/8 dark:text-luxe-ink"
                      />
                    ) : (
                      <input
                        type="text"
                        value={productForm[field]}
                        onChange={(event) => setProductForm((current) => ({ ...current, [field]: event.target.value }))}
                        className="mt-3 w-full rounded-[18px] border border-luxe-cocoa/10 bg-luxe-mist px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-white/8 dark:text-luxe-ink"
                      />
                    )}
                  </label>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-luxe-cocoa/10 bg-luxe-sand/35 px-5 py-3 text-sm font-semibold text-luxe-charcoal dark:border-white/10 dark:bg-white/8 dark:text-luxe-ink">
                  <UploadCloud className="h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <button
                  type="button"
                  onClick={handleSaveProduct}
                  className="rounded-full bg-luxe-charcoal px-5 py-3 text-sm font-semibold text-white dark:bg-luxe-ink dark:text-luxe-midnight"
                >
                  {submittingProduct ? (editingProductId ? 'Saving...' : 'Creating...') : editingProductId ? 'Save Changes' : 'Create Product'}
                </button>
                {editingProductId ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProductId(null);
                      setProductForm(initialProductForm);
                    }}
                    className="rounded-full border border-luxe-cocoa/10 bg-white px-5 py-3 text-sm font-semibold text-luxe-charcoal dark:border-white/10 dark:bg-white/8 dark:text-luxe-ink"
                  >
                    Cancel Edit
                  </button>
                ) : null}
              </div>
            </section>

            <section className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <TicketPercent className="h-5 w-5 text-luxe-cocoa dark:text-luxe-ink" />
                <h2 className="font-display text-4xl text-luxe-espresso dark:text-luxe-ink">Coupon System</h2>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ['code', 'Coupon Code'],
                  ['description', 'Description'],
                  ['type', 'Type'],
                  ['value', 'Value'],
                  ['minOrderValue', 'Min Order'],
                  ['maxDiscount', 'Max Discount'],
                ].map(([field, label]) => (
                  <label key={field}>
                    <span className="text-xs uppercase tracking-[0.26em] text-luxe-mocha/70 dark:text-luxe-ink/55">{label}</span>
                    {field === 'type' ? (
                      <select
                        value={couponForm[field]}
                        onChange={(event) => setCouponForm((current) => ({ ...current, [field]: event.target.value }))}
                        className="mt-3 w-full rounded-[18px] border border-luxe-cocoa/10 bg-luxe-mist px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-white/8 dark:text-luxe-ink"
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={couponForm[field]}
                        onChange={(event) => setCouponForm((current) => ({ ...current, [field]: event.target.value }))}
                        className="mt-3 w-full rounded-[18px] border border-luxe-cocoa/10 bg-luxe-mist px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-white/8 dark:text-luxe-ink"
                      />
                    )}
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={handleCreateCoupon}
                className="mt-5 rounded-full bg-luxe-charcoal px-5 py-3 text-sm font-semibold text-white dark:bg-luxe-ink dark:text-luxe-midnight"
              >
                {submittingCoupon ? 'Creating...' : 'Create Coupon'}
              </button>

              <div className="mt-6 space-y-3">
                {coupons.slice(0, 4).map((coupon) => (
                  <div
                    key={coupon._id}
                    className="rounded-[20px] border border-luxe-cocoa/10 bg-luxe-mist px-4 py-3 text-sm dark:border-white/10 dark:bg-white/8"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-luxe-charcoal dark:text-luxe-ink">{coupon.code}</span>
                      <span className="text-luxe-cocoa/70 dark:text-luxe-ink/65">
                        {coupon.type === 'percentage' ? `${coupon.value}%` : formatPrice(coupon.value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-8 rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-luxe-mocha/65 dark:text-luxe-ink/55">Reusable Product Structure</p>
                <h2 className="mt-2 font-display text-4xl text-luxe-espresso dark:text-luxe-ink">Product Library</h2>
              </div>
              <p className="max-w-md text-sm text-luxe-cocoa/70 dark:text-luxe-ink/65">
                Edit or delete jewelry products quickly while keeping the catalog structure clean and scalable.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {products.slice(0, 12).map((product) => (
                <article
                  key={product._id}
                  className="rounded-[24px] border border-luxe-cocoa/10 bg-luxe-mist p-4 dark:border-white/10 dark:bg-white/8"
                >
                  <img
                    src={product.primaryImage}
                    alt={product.title}
                    className="aspect-[0.82] w-full rounded-[18px] object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <p className="mt-4 text-xs uppercase tracking-[0.24em] text-luxe-mocha/65 dark:text-luxe-ink/55">{product.category}</p>
                  <h3 className="mt-2 font-semibold text-luxe-charcoal dark:text-luxe-ink">{product.title}</h3>
                  <p className="mt-1 text-sm text-luxe-cocoa/70 dark:text-luxe-ink/65">{formatPrice(product.salePrice)}</p>
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEditProduct(product)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-luxe-charcoal px-4 py-3 text-sm font-semibold text-white dark:bg-luxe-ink dark:text-luxe-midnight"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(product._id)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-luxe-cocoa/10 bg-white px-4 py-3 text-sm font-semibold text-luxe-charcoal dark:border-white/10 dark:bg-white/5 dark:text-luxe-ink"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingProductId === product._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
              <h2 className="font-display text-4xl text-luxe-espresso dark:text-luxe-ink">Order Management</h2>
              <div className="mt-6 space-y-4">
                {orders.slice(0, 8).map((order) => (
                  <article
                    key={order._id}
                    className="rounded-[24px] border border-luxe-cocoa/10 bg-luxe-mist p-4 dark:border-white/10 dark:bg-white/8"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="font-semibold text-luxe-charcoal dark:text-luxe-ink">{order.orderNumber}</p>
                        <p className="text-sm text-luxe-cocoa/70 dark:text-luxe-ink/65">
                          {order.user?.name || order.user?.email || 'Customer'} · {order.items.length} items
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-semibold text-luxe-charcoal dark:text-luxe-ink">{formatPrice(order.total)}</span>
                        <select
                          value={order.status}
                          onChange={(event) => handleUpdateOrderStatus(order._id, event.target.value)}
                          className="rounded-full border border-luxe-cocoa/10 bg-white px-4 py-2 text-sm outline-none dark:border-white/10 dark:bg-white/5 dark:text-luxe-ink"
                        >
                          {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
                <h2 className="font-display text-4xl text-luxe-espresso dark:text-luxe-ink">Inventory Tracking</h2>
                <div className="mt-6 space-y-3">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product._id || product.id}
                      className="flex items-center justify-between rounded-[22px] border border-luxe-cocoa/10 bg-luxe-mist px-4 py-3 dark:border-white/10 dark:bg-white/8"
                    >
                      <div>
                        <p className="font-semibold text-luxe-charcoal dark:text-luxe-ink">{product.title}</p>
                        <p className="text-sm text-luxe-cocoa/70 dark:text-luxe-ink/65">Remaining stock: {product.inventory?.total}</p>
                      </div>
                      <span className="rounded-full bg-luxe-charcoal px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white dark:bg-luxe-ink dark:text-luxe-midnight">
                        Low
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
                <h2 className="font-display text-4xl text-luxe-espresso dark:text-luxe-ink">AI Recommendations Feed</h2>
                <div className="mt-6 space-y-3">
                  {products.slice(0, 5).map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center gap-3 rounded-[22px] border border-luxe-cocoa/10 bg-luxe-mist p-3 dark:border-white/10 dark:bg-white/8"
                    >
                      <img src={product.primaryImage} alt={product.title} className="h-16 w-16 rounded-[16px] object-cover" />
                      <div>
                        <p className="font-semibold text-luxe-charcoal dark:text-luxe-ink">{product.title}</p>
                        <p className="text-sm text-luxe-cocoa/70 dark:text-luxe-ink/65">High potential in premium recommendation slots</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
