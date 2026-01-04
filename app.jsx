import { useState, useMemo, useEffect } from "react";

const PRODUCTS = [
  { id: 1, name: "iPhone 14", price: 70000, category: "Electronics", stock: 5 },
  { id: 2, name: "MacBook Air", price: 110000, category: "Electronics", stock: 3 },
  { id: 3, name: "Headphones", price: 3000, category: "Accessories", stock: 10 },
  { id: 4, name: "Shoes", price: 2500, category: "Fashion", stock: 0 },
  { id: 5, name: "T-Shirt", price: 999, category: "Fashion", stock: 8 },
  { id: 6, name: "Backpack", price: 1800, category: "Accessories", stock: 6 },
  { id: 7, name: "Keyboard", price: 2200, category: "Electronics", stock: 4 },
  { id: 8, name: "Mouse", price: 800, category: "Electronics", stock: 9 },
  { id: 9, name: "Jeans", price: 2000, category: "Fashion", stock: 7 },
  { id: 10, name: "Smart Watch", price: 5000, category: "Electronics", stock: 2 },
  { id: 11, name: "Sunglasses", price: 1200, category: "Accessories", stock: 5 },
  { id: 12, name: "Power Bank", price: 1500, category: "Electronics", stock: 6 },
  { id: 13, name: "Jacket", price: 3500, category: "Fashion", stock: 4 },
  { id: 14, name: "Earbuds", price: 2500, category: "Electronics", stock: 8 },
  { id: 15, name: "Wallet", price: 700, category: "Accessories", stock: 0 }
];

export default function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = useMemo(() => {
    let data = [...PRODUCTS];

    if (search) {
      data = data.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      data = data.filter(p => p.category === category);
    }

    if (sort === "low") data.sort((a, b) => a.price - b.price);
    if (sort === "high") data.sort((a, b) => b.price - a.price);

    return data;
  }, [search, category, sort]);

  const addToCart = product => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        if (existing.quantity < product.stock) {
          return prev.map(p =>
            p.id === product.id
              ? { ...p, quantity: p.quantity + 1 }
              : p
          );
        }
        return prev;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = id => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const updateQuantity = (id, qty, stock) => {
    if (qty < 1 || qty > stock) return;
    setCart(prev =>
      prev.map(p => (p.id === id ? { ...p, quantity: qty } : p))
    );
  };

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Mini E-Commerce</h2>

      {/* Filters */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Search by name"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Accessories">Accessories</option>
        </select>

        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="">Sort by price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>

        <button onClick={() => {
          setSearch("");
          setCategory("");
          setSort("");
        }}>
          Clear
        </button>
      </div>

      {/* Products */}
      {filteredProducts.length === 0 && <p>No products found</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
        {filteredProducts.map(product => (
          <div key={product.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
            <h4>{product.name}</h4>
            <p>₹{product.price}</p>
            <p>{product.category}</p>
            <p>{product.stock > 0 ? "In Stock" : "Out of Stock"}</p>
            <button
              disabled={product.stock === 0}
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div style={{ marginTop: "30px" }}>
        <h3>Cart</h3>

        {cart.length === 0 && <p>Cart is empty</p>}

        {cart.map(item => (
          <div key={item.id}>
            {item.name}
            <input
              type="number"
              value={item.quantity}
              onChange={e =>
                updateQuantity(item.id, +e.target.value, item.stock)
              }
            />
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ))}

        {cart.length > 0 && (
          <>
            <p>Total Items: {totalItems}</p>
            <p>Total Price: ₹{totalPrice}</p>
          </>
        )}
      </div>
    </div>
  );
}
