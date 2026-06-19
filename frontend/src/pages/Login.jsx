import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_USER_API || "http://localhost:3001";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });
      login(data.user, data.token);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Login to CloudCart</h2>
        {error && <div style={styles.error}>{error}</div>}
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button style={styles.btn} type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p style={styles.link}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 64px)",
    background: "#f5f5f5",
  },
  form: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    width: "400px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  title: { textAlign: "center", marginBottom: "24px", color: "#1a1a2e" },
  input: {
    display: "block",
    width: "100%",
    padding: "12px",
    margin: "0 0 16px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  btn: {
    width: "100%",
    padding: "12px",
    background: "#e94560",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  error: {
    background: "#ffe0e0",
    color: "#cc0000",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "16px",
  },
  link: { textAlign: "center", marginTop: "16px", color: "#666" },
};

export default Login;