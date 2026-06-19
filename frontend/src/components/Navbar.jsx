import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🛒 CloudCart</Link>
      <div style={styles.links}>
        <Link to="/products" style={styles.link}>Products</Link>
        {user ? (
          <>
            <Link to="/cart" style={styles.link}>Cart</Link>
            <Link to="/orders" style={styles.link}>Orders</Link>
            <span style={styles.greeting}>Hi, {user.name}</span>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.btnLink}>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: { display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'12px 24px', background:'#1a1a2e', color:'white', position:'sticky', top:0, zIndex:1000 },
  brand: { color:'#e94560', fontWeight:'bold', fontSize:'1.4rem', textDecoration:'none' },
  links: { display:'flex', alignItems:'center', gap:'20px' },
  link: { color:'white', textDecoration:'none', fontSize:'0.95rem' },
  btn: { background:'#e94560', color:'white', border:'none', padding:'8px 16px',
    borderRadius:'4px', cursor:'pointer' },
  btnLink: { background:'#e94560', color:'white', textDecoration:'none',
    padding:'8px 16px', borderRadius:'4px' },
  greeting: { color:'#aaa', fontSize:'0.9rem' }
}

export default Navbar