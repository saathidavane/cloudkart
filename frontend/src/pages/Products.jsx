import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_PRODUCT_API || "http://localhost:3002";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/products/categories`)
      .then((r) => setCategories(r.data.categories))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    axios
      .get(`${API_URL}/api/products`, { params })
      .then((r) => setProducts(r.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <div style={styles.container}>
      <h1>Products</h1>
      <div style={styles.filters}>
        <input
          style={styles.input}
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          style={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => (
            <Link
              to={`/products/${product.id}`}
              key={product.id}
              style={styles.cardLink}
            >
              <div style={styles.card}>
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={styles.img}
                />
                <div style={styles.cardBody}>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <p style={styles.category}>{product.category}</p>
                  <p style={styles.price}>
                    ₹{Number(product.price).toLocaleString()}
                  </p>
                  <p style={styles.stock}>
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "❌ Out of stock"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "1200px", margin: "0 auto", padding: "20px" },
  filters: { display: "flex", gap: "16px", marginBottom: "24px" },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "1rem",
  },
  select: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "24px",
  },
  cardLink: { textDecoration: "none", color: "inherit" },
  card: {
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
    overflow: "hidden",
    transition: "transform 0.2s",
    cursor: "pointer",
  },
  img: { width: "100%", height: "200px", objectFit: "cover" },
  cardBody: { padding: "16px" },
  productName: { margin: "0 0 4px", fontSize: "1rem", fontWeight: "bold" },
  category: { color: "#888", fontSize: "0.85rem", margin: "0 0 8px" },
  price: {
    color: "#e94560",
    fontSize: "1.2rem",
    fontWeight: "bold",
    margin: "0 0 4px",
  },
  stock: { color: "#666", fontSize: "0.85rem", margin: 0 },
};

export default Products;