import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CART_API = import.meta.env.VITE_CART_API || "http://localhost:3003";
const ORDER_API = import.meta.env.VITE_ORDER_API || "http://localhost:3004";

function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  const fetchCart = () => {
    setLoading(true);
    axios
      .get(`${CART_API}/api/cart`, { headers })
      .then((r) => setCart(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchCart, []);

  const removeItem = async (cartItemId) => {
    await axios.delete(`${CART_API}/api/cart/${cartItemId}`, { headers });
    fetchCart();
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const { data } = await axios.post(
        `${ORDER_API}/api/orders`,
        {},
        { headers },
      );
      alert(
        `Order #${data.orderId} placed! Total: ₹${Number(data.total).toLocaleString()}`,
      );
      navigate("/orders");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <p style={{ padding: "40px" }}>Loading cart...</p>;

  return (
    <div style={styles.container}>
      <h1>Your Cart ({cart.itemCount} items)</h1>
      {cart.items.length === 0 ? (
        <div style={styles.empty}>
          <p>Your cart is empty.</p>
          <button onClick={() => navigate("/products")} style={styles.btn}>
            Browse Products
          </button>
        </div>
      ) : (
        <>
          {cart.items.map((item) => (
            <div key={item.cart_item_id} style={styles.item}>
              <img src={item.image_url} alt={item.name} style={styles.img} />
              <div style={styles.info}>
                <h3>{item.name}</h3>
                <p>
                  ₹{Number(item.price).toLocaleString()} × {item.quantity}
                </p>
                <p style={styles.subtotal}>
                  ₹{Number(item.subtotal).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.cart_item_id)}
                style={styles.removeBtn}
              >
                Remove
              </button>
            </div>
          ))}
          <div style={styles.summary}>
            <h2>Total: ₹{Number(cart.total).toLocaleString()}</h2>
            <button
              onClick={placeOrder}
              disabled={placing}
              style={styles.orderBtn}
            >
              {placing ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "800px", margin: "0 auto", padding: "20px" },
  item: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
    padding: "16px",
    background: "white",
    borderRadius: "8px",
    marginBottom: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  img: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "6px",
  },
  info: { flex: 1 },
  subtotal: { color: "#e94560", fontWeight: "bold" },
  removeBtn: {
    background: "#ff4444",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  summary: {
    textAlign: "right",
    padding: "24px",
    background: "white",
    borderRadius: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  orderBtn: {
    background: "#28a745",
    color: "white",
    border: "none",
    padding: "14px 32px",
    borderRadius: "6px",
    fontSize: "1.1rem",
    cursor: "pointer",
  },
  empty: { textAlign: "center", padding: "60px" },
  btn: {
    background: "#e94560",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Cart;