import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, ShoppingBag, History, Sparkles } from 'lucide-react';
import { logout } from '../auth/cognito';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const [role, setRole] = useState("buyer");

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem("role") || "buyer";
      setRole(savedRole);
    } catch (err) {
      console.error("Role load error:", err);
    }
  }, []);

  const switchRole = (newRole) => {
    try {
      localStorage.setItem("role", newRole);
      setRole(newRole);
      // Navigate to the appropriate page for the new role
      navigate(newRole === "vendor" ? "/vendor-dashboard" : "/products");
    } catch (err) {
      console.error("Role switch error:", err);
    }
  };

  const handleLogout = () => {
    // cognito.js logout() removes localStorage token + redirects to Cognito logout endpoint
    // which then bounces back to /login (no navigate needed here)
    setIsAuthenticated(false);
    logout(); // handles localStorage.removeItem("token") + window.location.href
  };

  return (
    <nav className="glass-morphism" style={{ 
      margin: '1.5rem', 
      padding: '0.8rem 2.5rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'sticky',
      top: '1rem',
      zIndex: 1000,
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ 
          width: '38px', 
          height: '38px', 
          background: 'var(--accent-gradient)', 
          borderRadius: '12px', 
          display: 'grid', 
          placeItems: 'center',
          boxShadow: '0 0 15px var(--primary-glow)'
        }}>
          <Sparkles size={22} color="white" />
        </div>
        <span style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '1.5px', color: 'white' }}>SURPLUS LITE</span>
      </Link>

      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'var(--text-gray)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Explore
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/cart" style={{ color: 'white', position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <div style={{ position: 'relative' }}>
                <ShoppingBag size={24} />
              </div>
              <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Bag</span>
            </Link>
            <Link to="/orders" style={{ color: 'var(--text-gray)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={20} /> Impact
            </Link>
            
            <button 
              onClick={() => switchRole("buyer")} 
              style={{ 
                background: role === "buyer" ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--glass-border)', 
                padding: '8px 16px',
                borderRadius: '12px',
                color: 'white', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              Buyer Mode
            </button>

            <button 
              onClick={() => switchRole("vendor")} 
              style={{ 
                background: role === "vendor" ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--glass-border)', 
                padding: '8px 16px',
                borderRadius: '12px',
                color: 'white', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              Vendor Mode
            </button>

            <button 
              onClick={handleLogout} 
              style={{ 
                background: 'rgba(244, 63, 94, 0.1)', 
                border: '1px solid rgba(244, 63, 94, 0.2)', 
                padding: '8px 16px',
                borderRadius: '99px',
                color: '#fb7185', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.2)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)'}
            >
              <LogOut size={18} />
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-premium" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>Join Marketplace</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
