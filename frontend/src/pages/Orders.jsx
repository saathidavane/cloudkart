import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ORDER_API = import.meta.env.VITE_ORDER_API || "http://localhost:3004";

const statusColors = {
  pending: "#ff9800",
  confirmed: "#2196f3",
  shipped: "#9c27b0",
  delivered: "#4caf50",
  cancelled: "#f44336",
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    axios
      .get(`${ORDER_API}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setOrders(r.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: "40px" }}>Loading orders...</p>;

  return (
    <div style={styles.container}>
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet. Start shopping!</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={styles.card}>
            <div style={styles.header}>
              <span>Order #{order.id}</span>
              <span
                style={{
                  ...styles.status,
                  background: statusColors[order.status],
                }}
              >
                {order.status.toUpperCase()}
              </span>
            </div>
            <p>
              Total:{" "}
              <strong>₹{Number(order.total_amount).toLocaleString()}</strong>
            </p>
            <p>Items: {order.item_count}</p>
            <p style={styles.date}>
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "800px", margin: "0 auto", padding: "20px" },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  status: {
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "bold",
  },
  date: { color: "#888", fontSize: "0.9rem" },
};

export default Orders;