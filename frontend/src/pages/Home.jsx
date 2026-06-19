import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Welcome to CloudCart</h1>
        <p style={styles.subtitle}>
          Your one-stop shop for everything you need
        </p>
        <Link to="/products" style={styles.ctaBtn}>
          Shop Now →
        </Link>
      </div>
      <div style={styles.features}>
        {[
          "🚀 Fast Delivery",
          "🔒 Secure Payments",
          "↩️ Easy Returns",
          "⭐ Top Brands",
        ].map((f) => (
          <div key={f} style={styles.featureCard}>
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "1200px", margin: "0 auto", padding: "20px" },
  hero: {
    textAlign: "center",
    padding: "80px 20px",
    background: "linear-gradient(135deg, #1a1a2e, #16213e)",
    borderRadius: "12px",
    color: "white",
    marginBottom: "40px",
  },
  title: { fontSize: "3rem", margin: "0 0 16px" },
  subtitle: { fontSize: "1.2rem", color: "#aaa", margin: "0 0 32px" },
  ctaBtn: {
    background: "#e94560",
    color: "white",
    padding: "14px 32px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "1.1rem",
    fontWeight: "bold",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "20px",
  },
  featureCard: {
    background: "white",
    padding: "24px",
    borderRadius: "8px",
    textAlign: "center",
    fontSize: "1.1rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
};

export default Home;