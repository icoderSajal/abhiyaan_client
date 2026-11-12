import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  Search,
  ShoppingBag,
  UserRound,
  Menu,
  Star,
  Truck,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Plus,
  Minus,
  Trash2,
  Package,
  LayoutDashboard,
  LogOut,
  X,
} from "lucide-react";
import api from "./api";

const Store = createContext(null);
const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const fallback =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900";
function useStore() {
  return useContext(Store);
}

function App() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("abhiyaan_user") || "null"),
  );
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (user)
      api
        .get("/cart")
        .then((r) =>
          setCartCount(r.data.items?.reduce((s, i) => s + i.quantity, 0) || 0),
        )
        .catch(() => {});
  }, [user]);
  const value = useMemo(
    () => ({
      user,
      setUser,
      cartCount,
      setCartCount,
      search,
      setSearch,
      login: (data) => {
        localStorage.setItem("abhiyaan_token", data.token);
        localStorage.setItem("abhiyaan_user", JSON.stringify(data.user));
        setUser(data.user);
      },
      logout: () => {
        localStorage.removeItem("abhiyaan_token");
        localStorage.removeItem("abhiyaan_user");
        setUser(null);
        setCartCount(0);
      },
    }),
    [user, cartCount, search],
  );
  return (
    <Store.Provider value={value}>
      <div className="min-h-screen bg-[#fbfcfa] text-ink">
        <div className="bg-ink text-white text-xs py-2 text-center tracking-wide">
          A better home starts with the right essentials · Delivery across
          serviceable pincodes
        </div>
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 h-[76px] flex items-center gap-5">
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu />
            </button>
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-brand text-white grid place-items-center font-black text-xl">
                A
              </div>
              <div>
                <div className="font-extrabold tracking-tight text-xl">
                  Abhiyaan<span className="text-brand">.</span>
                </div>
                <div className="text-[9px] uppercase tracking-[.2em] text-slate-500 -mt-1">
                  Home & Bathroom
                </div>
              </div>
            </Link>
            <form
              className="hidden md:flex flex-1 max-w-2xl bg-slate-100 rounded-xl px-4 py-3 items-center gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                location.href = `/shop?q=${encodeURIComponent(search)}`;
              }}
            >
              <Search size={18} className="text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none w-full text-sm"
                placeholder="Search pipes, taps, basins, bathroom essentials..."
              />
            </form>
            <div className="ml-auto flex items-center gap-4">
              {user ? (
                <div className="hidden sm:block text-right">
                  <div className="text-xs text-slate-500">Welcome back</div>
                  <div className="text-sm font-bold">{user.name}</div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-2 text-sm font-semibold"
                >
                  <UserRound size={19} /> Sign in
                </Link>
              )}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl hover:bg-slate-100"
              >
                <ShoppingBag size={21} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] rounded-full w-5 h-5 grid place-items-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
          <nav
            className={`${mobileOpen ? "block" : "hidden"} md:block border-t border-slate-100`}
          >
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex flex-col md:flex-row gap-4 md:gap-8 text-sm font-semibold text-slate-600">
              <NavLink to="/" className="hover:text-brand">
                Home
              </NavLink>
              <NavLink to="/shop" className="hover:text-brand">
                All products
              </NavLink>
              <NavLink
                to="/shop?category=Pipes%20%26%20Fittings"
                className="hover:text-brand"
              >
                Pipes & fittings
              </NavLink>
              <NavLink
                to="/shop?category=Taps%20%26%20Faucets"
                className="hover:text-brand"
              >
                Taps & faucets
              </NavLink>
              <NavLink
                to="/shop?category=Wash%20Basins"
                className="hover:text-brand"
              >
                Wash basins
              </NavLink>
              <NavLink
                to="/shop?category=Bathroom%20Accessories"
                className="hover:text-brand"
              >
                Accessories
              </NavLink>
              {user?.role === "admin" && (
                <NavLink to="/admin" className="md:ml-auto text-brand">
                  Admin dashboard
                </NavLink>
              )}
            </div>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth register />} />
          <Route path="/admin" element={<Admin />} />
          <Route
            path="*"
            element={
              <div className="py-28 text-center">
                <h1 className="text-3xl font-bold">Page not found</h1>
                <Link to="/" className="text-brand underline mt-4 inline-block">
                  Back to home
                </Link>
              </div>
            }
          />
        </Routes>
        <footer className="bg-ink text-white mt-20">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-14 grid md:grid-cols-4 gap-10">
            <div>
              <div className="font-extrabold text-2xl">abhiyaan.</div>
              <p className="text-slate-400 text-sm mt-3 leading-6">
                Thoughtful essentials for better homes. Shop sanitaryware,
                plumbing products and bathroom accessories.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Shop</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <p>Pipes & fittings</p>
                <p>Taps & faucets</p>
                <p>Wash basins</p>
                <p>Bathroom accessories</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Customer care</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <Link to="/orders" className="block">
                  Track orders
                </Link>
                <p>Shipping & delivery</p>
                <p>Returns & refunds</p>
                <p>Contact us</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Visit our store</h4>
              <p className="text-sm text-slate-400 leading-6">
                Sanjay Nagar, Durga Nagar
                <br />
                Bareilly, Uttar Pradesh
                <br />
                9205448629
              </p>
            </div>
          </div>
          <div className="border-t border-white/10 text-center text-xs text-slate-500 py-5">
            © {new Date().getFullYear()} Abhiyaan Sanitary & Plumber Service.
            All rights reserved.
          </div>
        </footer>
      </div>
    </Store.Provider>
  );
}

function ProductCard({ p }) {
  const { user, setCartCount } = useStore();
  async function add(e) {
    e.preventDefault();
    if (!user) return alert("Please sign in to add items to your cart");
    try {
      const r = await api.post("/cart/items", {
        productId: p._id,
        quantity: 1,
      });
      setCartCount(r.data.items.reduce((s, i) => s + i.quantity, 0));
    } catch (err) {
      alert(err.response?.data?.message || "Could not add item");
    }
  }
  const discount =
    p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0;
  return (
    <article className="product-card group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-soft transition-all">
      <Link to={`/product/${p._id}`}>
        <div className="relative aspect-[1/1] bg-slate-50 overflow-hidden">
          <img
            src={p.images?.[0] || fallback}
            onError={(e) => (e.currentTarget.src = fallback)}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            alt={p.name}
          />
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-orange-100 text-orange-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
              {discount}% OFF
            </span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
          {p.category || "Home essentials"}
        </div>
        <Link to={`/product/${p._id}`}>
          <h3 className="font-bold mt-1.5 leading-snug min-h-10 hover:text-brand">
            {p.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 mt-2 text-xs">
          <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-1.5 py-1 rounded">
            <Star size={11} fill="currentColor" />
            {p.averageRating?.toFixed(1) || "New"}
          </span>
          <span className="text-slate-400">({p.reviewCount || 0} reviews)</span>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <b className="text-lg">{money(p.price)}</b>
          {p.mrp > p.price && (
            <del className="text-xs text-slate-400">{money(p.mrp)}</del>
          )}
        </div>
        <button
          onClick={add}
          className="w-full mt-4 bg-ink hover:bg-brand text-white rounded-xl py-2.5 text-xs font-bold transition"
        >
          ADD TO CART
        </button>
      </div>
    </article>
  );
}

function Home() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    api
      .get("/products?featured=true&limit=8")
      .then((r) => setProducts(r.data.products))
      .catch(() => {});
  }, []);
  const cats = [
    [
      "Pipes & Fittings",
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=500",
    ],
    [
      "Taps & Faucets",
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500",
    ],
    [
      "Wash Basins",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=500",
    ],
    [
      "Bathroom Accessories",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500",
    ],
  ];
  return (
    <main>
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-8">
        <div className="hero rounded-[28px] overflow-hidden min-h-[430px] flex items-center">
          <div className="relative z-10 max-w-xl p-8 md:p-14">
            <span className="inline-flex bg-white/15 text-white border border-white/20 rounded-full px-4 py-2 text-xs font-semibold tracking-wide">
              THE HOME ESSENTIALS EDIT
            </span>
            <h1 className="text-white text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mt-6">
              Make every
              <br />
              corner <span className="text-teal-200">better.</span>
            </h1>
            <p className="text-white/75 mt-5 leading-7 max-w-md">
              Quality sanitaryware, plumbing essentials and finishing touches
              for a home that works beautifully.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 bg-white text-ink px-6 py-3.5 rounded-xl font-bold text-sm mt-8 hover:bg-teal-100"
            >
              Explore collection <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-7">
          <div>
            <p className="eyebrow">SHOP BY CATEGORY</p>
            <h2 className="section-title">Find what your home needs</h2>
          </div>
          <Link to="/shop" className="text-sm font-bold text-brand">
            View all <ArrowRight className="inline" size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cats.map(([name, img]) => (
            <Link
              key={name}
              to={`/shop?category=${encodeURIComponent(name)}`}
              className="category-card rounded-2xl overflow-hidden relative aspect-[1.15]"
            >
              <img
                src={img}
                className="w-full h-full object-cover"
                alt={name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <h3 className="absolute bottom-4 left-4 text-white font-bold">
                {name}
              </h3>
            </Link>
          ))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pb-10">
        <div className="mb-7">
          <p className="eyebrow">CUSTOMER FAVOURITES</p>
          <h2 className="section-title">Popular picks for you</h2>
        </div>
        {products.length ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        ) : (
          <div className="p-10 rounded-2xl bg-slate-50 text-center text-slate-500">
            Add sample products using the seed command to see products here.
          </div>
        )}
      </section>
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-10 grid md:grid-cols-3 gap-4">
        {[
          [
            Truck,
            "Delivery support",
            "Shipping charges shown clearly at checkout",
          ],
          [
            ShieldCheck,
            "Quality essentials",
            "Carefully selected home and plumbing products",
          ],
          [Headphones, "Here to help", "Call us at 9205448629"],
        ].map(([Icon, title, desc]) => (
          <div
            className="flex gap-4 bg-white border border-slate-100 rounded-2xl p-6"
            key={title}
          >
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-brand grid place-items-center">
              <Icon />
            </div>
            <div>
              <h3 className="font-bold">{title}</h3>
              <p className="text-xs text-slate-500 mt-1">{desc}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

function Shop() {
  const params = new URLSearchParams(location.search);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState(params.get("category") || "");
  const [q, setQ] = useState(params.get("q") || "");
  useEffect(() => {
    setLoading(true);
    api
      .get("/products", { params: { q, category, sort, limit: 24 } })
      .then((r) => setProducts(r.data.products))
      .finally(() => setLoading(false));
  }, [q, category, sort]);
  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      <p className="eyebrow">THE COLLECTION</p>
      <div className="flex flex-wrap justify-between items-end gap-4">
        <h1 className="text-4xl font-black tracking-tight">
          Shop all products
        </h1>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input max-w-48"
        >
          <option value="newest">Newest first</option>
          <option value="price_low">Price: low to high</option>
          <option value="price_high">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-2 my-7">
        <input
          className="input max-w-xs"
          placeholder="Search products..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {[
          "",
          "Pipes & Fittings",
          "Taps & Faucets",
          "Wash Basins",
          "Bathroom Accessories",
          "Toilet Seats",
          "Water Tanks",
        ].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`chip ${category === c ? "chip-active" : ""}`}
          >
            {c || "All"}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="py-20 text-center">Loading collection...</p>
      ) : products.length ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-slate-500">
          No products found. Try another search.
        </div>
      )}
    </main>
  );
}

function ProductPage() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { user, setCartCount } = useStore();
  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((r) => setP(r.data))
      .catch(() => setP(false));
  }, [id]);
  async function add() {
    if (!user) return alert("Please sign in first");
    try {
      const r = await api.post("/cart/items", { productId: id });
      setCartCount(r.data.items.reduce((s, i) => s + i.quantity, 0));
      alert("Added to cart");
    } catch (e) {
      alert(e.response?.data?.message || "Unable to add");
    }
  }
  async function review(e) {
    e.preventDefault();
    try {
      await api.post(`/products/${id}/reviews`, {
        rating: Number(rating),
        comment,
      });
      const r = await api.get(`/products/${id}`);
      setP(r.data);
      setComment("");
      alert("Thank you for your review");
    } catch (e) {
      alert(e.response?.data?.message || "Please sign in to review");
    }
  }
  if (p === false)
    return <div className="p-24 text-center">Product not found</div>;
  if (!p) return <div className="p-24 text-center">Loading product...</div>;
  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="rounded-3xl bg-slate-50 overflow-hidden">
          <img
            src={p.images?.[0] || fallback}
            className="w-full aspect-square object-cover"
            alt={p.name}
          />
        </div>
        <div className="py-4">
          <p className="eyebrow">
            {p.category} · {p.brand}
          </p>
          <h1 className="text-4xl font-black mt-3">{p.name}</h1>
          <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
            <span className="text-amber-500 flex">
              <Star fill="currentColor" size={16} />
            </span>
            {p.averageRating?.toFixed(1) || "No rating yet"} · {p.reviewCount}{" "}
            reviews
          </div>
          <div className="flex items-center gap-3 mt-7">
            <b className="text-3xl">{money(p.price)}</b>
            {p.mrp > p.price && (
              <del className="text-slate-400">{money(p.mrp)}</del>
            )}
          </div>
          <p className="text-slate-600 leading-7 mt-6">{p.description}</p>
          <p
            className={`text-sm mt-5 font-semibold ${p.stock > 0 ? "text-emerald-700" : "text-red-600"}`}
          >
            {p.stock > 0
              ? `${p.stock} items available`
              : "Currently out of stock"}
          </p>
          <button
            disabled={!p.stock}
            onClick={add}
            className="mt-7 w-full md:w-auto bg-brand text-white rounded-xl px-10 py-4 font-bold disabled:opacity-40"
          >
            Add to cart
          </button>
          <div className="mt-8 border-t pt-6">
            <h3 className="font-bold mb-3">Product details</h3>
            <div className="text-sm text-slate-600 space-y-2">
              <p>Brand: {p.brand || "Abhiyaan selection"}</p>
              <p>SKU: {p.sku || "Available on request"}</p>
              <p>Shipping: calculated at checkout</p>
            </div>
          </div>
        </div>
      </div>
      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-black">Ratings & reviews</h2>
        <form
          onSubmit={review}
          className="bg-white border rounded-2xl p-5 mt-5"
        >
          <label className="label">Your rating</label>
          <select
            className="input"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option value={n}>{n} stars</option>
            ))}
          </select>
          <label className="label mt-4">Your review</label>
          <textarea
            className="input min-h-24"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
          />
          <button className="btn-primary mt-3">Submit review</button>
        </form>
        <div className="mt-5 space-y-3">
          {p.reviews?.map((r) => (
            <div className="border-b py-4" key={r._id}>
              <div className="font-bold">
                {r.name}{" "}
                <span className="text-amber-500 ml-2">
                  {"★".repeat(r.rating)}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-2">{r.comment}</p>
              {r.verifiedPurchase && (
                <span className="text-xs text-emerald-700">
                  Verified purchase
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function CartPage() {
  const [cart, setCart] = useState(null);
  const { setCartCount } = useStore();
  async function load() {
    const r = await api.get("/cart");
    setCart(r.data);
  }
  useEffect(() => {
    load().catch(() => setCart({ items: [] }));
  }, []);
  async function update(id, quantity) {
    await api.patch(`/cart/items/${id}`, { quantity });
    await load();
    setCartCount((c) => Math.max(0, c + (quantity > 0 ? 0 : -1)));
  }
  if (!cart) return <div className="p-20 text-center">Loading cart...</div>;
  const items = cart.items || [];
  const subtotal = items.reduce(
    (s, i) => s + (i.product?.price || 0) * i.quantity,
    0,
  );
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black">Your shopping bag</h1>
      {!items.length ? (
        <div className="text-center py-24">
          <ShoppingBag size={42} className="mx-auto text-slate-300" />
          <h2 className="font-bold text-xl mt-4">Your cart is waiting</h2>
          <Link to="/shop" className="btn-primary inline-block mt-5">
            Explore products
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_340px] gap-8 mt-8">
          <div className="space-y-3">
            {items.map((i) => (
              <div
                key={i.product?._id}
                className="bg-white border rounded-2xl p-4 flex gap-4"
              >
                <img
                  src={i.product?.images?.[0] || fallback}
                  className="w-24 h-24 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <Link to={`/product/${i.product?._id}`} className="font-bold">
                    {i.product?.name}
                  </Link>
                  <p className="text-sm text-slate-500 mt-1">
                    {money(i.product?.price)}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => update(i.product._id, i.quantity - 1)}
                    >
                      <Minus size={16} />
                    </button>
                    {i.quantity}
                    <button
                      onClick={() => update(i.product._id, i.quantity + 1)}
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => update(i.product._id, 0)}
                      className="ml-3 text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <b>{money((i.product?.price || 0) * i.quantity)}</b>
              </div>
            ))}
          </div>
          <aside className="bg-white border rounded-2xl p-6 h-fit">
            <h3 className="font-bold text-lg">Order summary</h3>
            <div className="flex justify-between mt-5 text-sm">
              <span>Subtotal</span>
              <b>{money(subtotal)}</b>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Shipping calculated at checkout.
            </p>
            <div className="border-t mt-5 pt-5 flex justify-between font-black">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <Link to="/checkout" className="btn-primary block text-center mt-5">
              Proceed to checkout
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}

function Checkout() {
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "Bareilly",
    state: "Uttar Pradesh",
    pincode: "",
  });
  const [method, setMethod] = useState("COD");
  const [cart, setCart] = useState(null);
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  useEffect(() => {
    api
      .get("/cart")
      .then((r) => setCart(r.data))
      .catch(() => {});
  }, []);
  const subtotal =
    cart?.items?.reduce((s, i) => s + i.product.price * i.quantity, 0) || 0;
  const shipping = subtotal >= 1999 ? 0 : subtotal ? 79 : 0;
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await api.post("/orders", {
        shippingAddress: address,
        paymentMethod: method,
      });
      alert(`Order placed: ${r.data.order._id}`);
      nav("/orders");
    } catch (e) {
      alert(e.response?.data?.message || "Checkout failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black">Checkout</h1>
      <div className="grid md:grid-cols-[1fr_340px] gap-8 mt-8">
        <form onSubmit={submit} className="bg-white border rounded-2xl p-6">
          <h2 className="font-bold text-xl mb-5">Delivery address</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["name", "Full name"],
              ["phone", "Phone number"],
              ["line1", "House / street address"],
              ["line2", "Landmark (optional)"],
              ["city", "City"],
              ["state", "State"],
              ["pincode", "6-digit pincode"],
            ].map(([key, label]) => (
              <label className="text-xs font-semibold text-slate-600">
                {label}
                <input
                  required={!["line2"].includes(key)}
                  className="input mt-2"
                  value={address[key]}
                  onChange={(e) =>
                    setAddress({ ...address, [key]: e.target.value })
                  }
                />
              </label>
            ))}
          </div>
          <h2 className="font-bold text-xl mt-8 mb-4">Payment method</h2>
          <label className="flex gap-3 items-center border rounded-xl p-4">
            <input
              type="radio"
              checked={method === "COD"}
              onChange={() => setMethod("COD")}
            />{" "}
            Cash on Delivery
          </label>
          <p className="text-xs text-slate-500 mt-2">
            Online payment will be enabled after a payment gateway is
            configured.
          </p>
          <button
            disabled={busy || !cart?.items?.length}
            className="btn-primary mt-7"
          >
            {busy ? "Placing order..." : "Place order"}
          </button>
        </form>
        <aside className="bg-white border rounded-2xl p-6 h-fit">
          <h3 className="font-bold">Price details</h3>
          <div className="flex justify-between text-sm mt-5">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm mt-3">
            <span>Shipping</span>
            <span>{shipping ? money(shipping) : "FREE"}</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Free shipping on orders of ₹1,999 or more. Standard shipping ₹79
            below the threshold.
          </p>
          <div className="border-t mt-5 pt-5 flex justify-between font-black">
            <span>Total</span>
            <span>{money(subtotal + shipping)}</span>
          </div>
        </aside>
      </div>
    </main>
  );
}

function MyOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    api
      .get("/orders/my")
      .then((r) => setOrders(r.data))
      .catch(() => {});
  }, []);
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black">My orders</h1>
      <div className="space-y-4 mt-8">
        {orders.map((o) => (
          <div className="bg-white border rounded-2xl p-5" key={o._id}>
            <div className="flex flex-wrap justify-between gap-2">
              <b>Order #{o._id.slice(-8).toUpperCase()}</b>
              <span className="chip chip-active">{o.orderStatus}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {new Date(o.createdAt).toLocaleString("en-IN")}
            </p>
            <div className="mt-4 text-sm">
              {o.items.map((i) => (
                <p>
                  {i.name} × {i.quantity}
                </p>
              ))}
            </div>
            <div className="font-bold mt-4">Total: {money(o.total)}</div>
          </div>
        ))}
        {!orders.length && (
          <p className="text-slate-500 py-16 text-center">
            Your orders will appear here.
          </p>
        )}
      </div>
    </main>
  );
}

function Auth({ register = false }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const { login } = useStore();
  const nav = useNavigate();
  async function submit(e) {
    e.preventDefault();
    try {
      const r = await api.post(
        `/auth/${register ? "register" : "login"}`,
        form,
      );
      login(r.data);
      nav(r.data.user.role === "admin" ? "/admin" : "/");
    } catch (e) {
      alert(e.response?.data?.message || "Unable to continue");
    }
  }
  return (
    <main className="min-h-[65vh] grid place-items-center px-4 py-14">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white border rounded-3xl p-8 shadow-soft"
      >
        <div className="text-3xl font-black">
          {register ? "Create your account" : "Welcome back"}
        </div>
        <p className="text-sm text-slate-500 mt-2">
          {register
            ? "Join Abhiyaan and shop your home essentials."
            : "Sign in to manage your orders and cart."}
        </p>
        {register && (
          <>
            <label className="label mt-7">Full name</label>
            <input
              required
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <label className="label mt-4">Phone</label>
            <input
              className="input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </>
        )}
        <label className="label mt-6">Email</label>
        <input
          required
          type="email"
          className="input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <label className="label mt-4">Password</label>
        <input
          required
          type="password"
          minLength="8"
          className="input"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn-primary w-full mt-7">
          {register ? "Create account" : "Sign in"}
        </button>
        <p className="text-sm text-center text-slate-500 mt-5">
          {register ? "Already registered? " : "New here? "}
          <Link
            className="text-brand font-bold"
            to={register ? "/login" : "/register"}
          >
            {register ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </form>
    </main>
  );
}

function Admin() {
  const { user, logout } = useStore();
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [tab, setTab] = useState("overview");
  const [form, setForm] = useState({
    name: "",
    category: "Pipes & Fittings",
    brand: "",
    price: "",
    mrp: "",
    stock: "",
    description: "",
    images: "",
  });
  async function load() {
    const [d, o, p] = await Promise.all([
      api.get("/admin/dashboard"),
      api.get("/admin/orders"),
      api.get("/admin/products"),
    ]);
    setData(d.data);
    setOrders(o.data);
    setProducts(p.data);
  }
  useEffect(() => {
    if (user?.role === "admin") load().catch(() => {});
  }, [user]);
  if (!user)
    return (
      <div className="p-24 text-center">
        Please{" "}
        <Link className="text-brand underline" to="/login">
          sign in
        </Link>{" "}
        as an administrator.
      </div>
    );
  if (user.role !== "admin")
    return <div className="p-24 text-center">Admin access required.</div>;
  async function addProduct(e) {
    e.preventDefault();
    try {
      await api.post("/admin/products", {
        ...form,
        price: Number(form.price),
        mrp: Number(form.mrp),
        stock: Number(form.stock),
        images: form.images
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      });
      setForm({
        name: "",
        category: "Pipes & Fittings",
        brand: "",
        price: "",
        mrp: "",
        stock: "",
        description: "",
        images: "",
      });
      await load();
      alert("Product added");
    } catch (e) {
      alert(e.response?.data?.message || "Could not add product");
    }
  }
  async function status(id, orderStatus) {
    await api.patch(`/admin/orders/${id}`, { orderStatus });
    await load();
  }
  async function archive(id) {
    if (confirm("Archive this product?")) {
      await api.delete(`/admin/products/${id}`);
      await load();
    }
  }
  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <p className="eyebrow">STORE CONTROL CENTER</p>
          <h1 className="text-3xl font-black">Admin dashboard</h1>
        </div>
        <button
          onClick={() => {
            logout();
            location.href = "/";
          }}
          className="chip"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto py-7">
        {["overview", "products", "orders", "add product"].map((t) => (
          <button
            onClick={() => setTab(t)}
            className={`chip capitalize ${tab === t ? "chip-active" : ""}`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "overview" && data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ["Total sales", money(data.revenue)],
              ["Orders", data.orders],
              ["Customers", data.customers],
              ["Products", data.products],
            ].map(([k, v]) => (
              <div className="bg-white border rounded-2xl p-5">
                <p className="text-xs text-slate-500">{k}</p>
                <p className="text-2xl font-black mt-2">{v}</p>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white border rounded-2xl p-5">
              <h3 className="font-bold mb-4">Recent orders</h3>
              {data.recentOrders.map((o) => (
                <div className="py-3 border-t flex justify-between text-sm">
                  <span>{o.user?.name || "Customer"}</span>
                  <b>{money(o.total)}</b>
                </div>
              ))}
            </div>
            <div className="bg-white border rounded-2xl p-5">
              <h3 className="font-bold mb-4">Low stock alerts</h3>
              {data.lowStock.map((p) => (
                <div className="py-3 border-t flex justify-between text-sm">
                  <span>{p.name}</span>
                  <b className="text-orange-600">{p.stock} left</b>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {tab === "products" && (
        <div className="bg-white border rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-slate-50">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr className="border-t">
                  <td className="p-4 font-semibold">{p.name}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4">{money(p.price)}</td>
                  <td className="p-4">{p.stock}</td>
                  <td className="p-4">
                    <button
                      onClick={() => archive(p._id)}
                      className="text-red-600"
                    >
                      Archive
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "orders" && (
        <div className="bg-white border rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-slate-50">
                <th className="p-4">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr className="border-t">
                  <td className="p-4">#{o._id.slice(-8)}</td>
                  <td className="p-4">{o.user?.name}</td>
                  <td className="p-4">{money(o.total)}</td>
                  <td className="p-4">{o.orderStatus}</td>
                  <td className="p-4">
                    <select
                      className="input"
                      value={o.orderStatus}
                      onChange={(e) => status(o._id, e.target.value)}
                    >
                      {[
                        "PLACED",
                        "CONFIRMED",
                        "PACKED",
                        "SHIPPED",
                        "DELIVERED",
                        "CANCELLED",
                      ].map((s) => (
                        <option>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "add product" && (
        <form
          onSubmit={addProduct}
          className="bg-white border rounded-2xl p-6 max-w-3xl grid sm:grid-cols-2 gap-4"
        >
          {[
            ["name", "Product name"],
            ["brand", "Brand"],
            ["price", "Selling price"],
            ["mrp", "MRP"],
            ["stock", "Stock quantity"],
            ["images", "Image URLs (comma separated)"],
          ].map(([k, l]) => (
            <label className="label">
              {l}
              <input
                required={["name", "price", "stock"].includes(k)}
                className="input mt-2"
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            </label>
          ))}
          <label className="label">
            Category
            <select
              className="input mt-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {[
                "Pipes & Fittings",
                "Taps & Faucets",
                "Wash Basins",
                "Bathroom Accessories",
                "Toilet Seats",
                "Water Tanks",
                "Motors",
              ].map((c) => (
                <option>{c}</option>
              ))}
            </select>
          </label>
          <label className="label sm:col-span-2">
            Description
            <textarea
              className="input mt-2 min-h-24"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </label>
          <button className="btn-primary sm:col-span-2">Save product</button>
        </form>
      )}
    </main>
  );
}
export default App;
