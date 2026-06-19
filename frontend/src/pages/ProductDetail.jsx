import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const PRODUCT_API = import.meta.env.VITE_PRODUCT_API || "http://localhost:3002";
const CART_API = import.meta.env.VITE_CART_API || "http://localhost:3003";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${PRODUCT_API}/api/products/${id}`)
      .then((r) => setProduct(r.data.product))
      .catch(() => navigate("/products"))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      await axios.post(
        `${CART_API}/api/cart`,
        { productId: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Added to cart!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>;
  if (!product) return null;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.back}>
        ← Back
      </button>
      <div style={styles.detail}>
        <img src={product.image_url} alt={product.name} style={styles.img} />
        <div style={styles.info}>
          <span style={styles.category}>{product.category}</span>
          <h1>{product.name}</h1>
          <p style={styles.description}>{product.description}</p>
          <p style={styles.price}>₹{Number(product.price).toLocaleString()}</p>
          <p style={styles.stock}>
            {product.stock > 0
              ? `✅ ${product.stock} in stock`
              : "❌ Out of stock"}
          </p>
          <button
            onClick={addToCart}
            disabled={product.stock === 0 || adding}
            style={{ ...styles.addBtn, opacity: product.stock === 0 ? 0.5 : 1 }}
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "1000px", margin: "0 auto", padding: "20px" },
  back: {
    background: "none",
    border: "none",
    color: "#e94560",
    cursor: "pointer",
    fontSize: "1rem",
    marginBottom: "20px",
  },
  detail: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "40px",
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  img: { width: "100%", borderRadius: "8px", objectFit: "cover" },
  info: {},
  category: {
    color: "#888",
    fontSize: "0.9rem",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  description: { color: "#555", lineHeight: 1.6, margin: "16px 0" },
  price: {
    fontSize: "2rem",
    color: "#e94560",
    fontWeight: "bold",
    margin: "16px 0",
  },
  stock: { color: "#444", marginBottom: "24px" },
  addBtn: {
    background: "#e94560",
    color: "white",
    border: "none",
    padding: "14px 32px",
    borderRadius: "8px",
    fontSize: "1.1rem",
    cursor: "pointer",
    width: "100%",
  },
};

export default ProductDetail;