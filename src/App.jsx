import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Products from './pages/Products';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Store from './pages/Store';
import VendorDashboard from './pages/VendorDashboard';
import TrackOrder from './pages/TrackOrder';
import { getAuthCode, isAuthenticated as checkAuth } from './auth/cognito';
import SplashScreen from './components/SplashScreen';
import Chatbot from './components/Chatbot';

// ─── 🛡️ Protected Route ─────────────────────────────────────────
// Renders children only if user has a valid session, otherwise → /login
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// ─── 🔀 Auth Guard for root "/" ──────────────────────────────────
// If authenticated go to the appropriate page, else go to /login
const RootRedirect = ({ role }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return role === "vendor"
    ? <Navigate to="/vendor-dashboard" replace />
    : <Navigate to="/products" replace />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(localStorage.getItem("role") || "buyer");

  const toggleRole = () => {
    const newRole = role === "buyer" ? "vendor" : "buyer";
    localStorage.setItem("role", newRole);
    setRole(newRole);
  };

  useEffect(() => {
    // ── Step 1: Handle Cognito redirect with ?code= ──────────────
    const code = getAuthCode();
    if (code) {
      // Store a session token (dummy until token exchange is wired up)
      localStorage.setItem("token", "cognito-session-" + Date.now());
      // Clean the URL so ?code= doesn't linger
      window.history.replaceState({}, document.title, "/products");
    }

    // ── Step 2: Read current session state ───────────────────────
    const authed = checkAuth();
    setIsAuthenticated(authed);
    setLoading(false);
  }, []);

  if (loading) return null;

  const defaultProducts = [
    { id:1,  name:"Organic Whole Milk",      price:3.15,   category:"Groceries",   expiryDays:2,   ownerName:"Platform Store", discountPercentage:30, location:{ lat:13.0827, lng:80.2707 } },
    { id:2,  name:"Artisan Sourdough Bread", price:4.20,   category:"Groceries",   expiryDays:1,   ownerName:"Platform Store", discountPercentage:30, location:{ lat:12.9716, lng:77.5946 } },
    { id:3,  name:"Avocado Pack",            price:3.85,   category:"Groceries",   expiryDays:3,   ownerName:"Platform Store", discountPercentage:30, location:{ lat:19.0760, lng:72.8777 } },
    { id:4,  name:"Fresh Carrots",           price:2.10,   category:"Groceries",   expiryDays:2,   ownerName:"Platform Store", discountPercentage:30, location:{ lat:13.0427, lng:80.2707 } },
    { id:5,  name:"Red Apples",              price:2.80,   category:"Groceries",   expiryDays:4,   ownerName:"Platform Store", discountPercentage:30, location:{ lat:12.9116, lng:77.5946 } },
    { id:6,  name:"Banana Bunch",            price:1.90,   category:"Groceries",   expiryDays:0,   ownerName:"Platform Store", discountPercentage:30, location:{ lat:19.0160, lng:72.8777 } },
    { id:7,  name:"Cheddar Cheese",          price:5.60,   category:"Groceries",   expiryDays:5,   ownerName:"Platform Store", discountPercentage:30, location:{ lat:13.0827, lng:80.2707 } },
    { id:8,  name:"Chocolate Bar",           price:2.50,   category:"Groceries",   expiryDays:10,  ownerName:"Platform Store", discountPercentage:30, location:{ lat:12.9716, lng:77.5946 } },
    { id:9,  name:"Orange Juice",            price:3.20,   category:"Groceries",   expiryDays:3,   ownerName:"Platform Store", discountPercentage:30, location:{ lat:19.0760, lng:72.8777 } },
    { id:10, name:"Wireless Headphones",     price:139.30, category:"Electronics", expiryDays:999, ownerName:"Platform Store", discountPercentage:30, location:{ lat:13.0827, lng:80.2707 } },
    { id:11, name:"Smart Fitness Watch",     price:82.30,  category:"Electronics", expiryDays:999, ownerName:"Platform Store", discountPercentage:30, location:{ lat:12.9716, lng:77.5946 } },
    { id:12, name:"Bluetooth Speaker",       price:84.00,  category:"Electronics", expiryDays:999, ownerName:"Platform Store", discountPercentage:30, location:{ lat:19.0760, lng:72.8777 } },
    { id:13, name:"Mechanical Keyboard",     price:120.00, category:"Electronics", expiryDays:999, ownerName:"Platform Store", discountPercentage:30, location:{ lat:13.0827, lng:80.2707 } },
    { id:14, name:"Smartphone",              price:700.00, category:"Electronics", expiryDays:999, ownerName:"Platform Store", discountPercentage:30, location:{ lat:12.9716, lng:77.5946 } },
    { id:15, name:"Wireless Earbuds",        price:59.99,  category:"Electronics", expiryDays:999, ownerName:"Platform Store", discountPercentage:30, location:{ lat:19.0760, lng:72.8777 } },
    { id:16, name:"Laptop Stand",            price:35.00,  category:"Electronics", expiryDays:999, ownerName:"Platform Store", discountPercentage:30, location:{ lat:13.0827, lng:80.2707 } },
  ];

  const vendorProducts = JSON.parse(localStorage.getItem("vendorProducts")) || [];
  const allProducts = [...defaultProducts, ...vendorProducts];

  return (
    <Router>
      <SplashScreen />
      <Chatbot products={allProducts} />
      <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} role={role} toggleRole={toggleRole} />
        <main style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 1rem', flex: 1 }}>
          <Routes>
            {/* ── Root: smart redirect based on auth + role ────────── */}
            <Route path="/" element={<RootRedirect role={role} />} />

            {/* ── Public ───────────────────────────────────────────── */}
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

            {/* ── Buyer protected pages ─────────────────────────────── */}
            <Route path="/products"         element={<PrivateRoute><Products isAuthenticated={isAuthenticated} /></PrivateRoute>} />
            <Route path="/cart"             element={<PrivateRoute><Cart /></PrivateRoute>} />
            <Route path="/orders"           element={<PrivateRoute><Orders /></PrivateRoute>} />
            <Route path="/track/:orderId"   element={<PrivateRoute><TrackOrder /></PrivateRoute>} />
            <Route path="/store/:storeName" element={<PrivateRoute><Store /></PrivateRoute>} />

            {/* ── Vendor protected page ─────────────────────────────── */}
            <Route path="/vendor-dashboard" element={<PrivateRoute><VendorDashboard /></PrivateRoute>} />

            {/* ── Catch-all → smart redirect ───────────────────────── */}
            <Route path="*" element={<RootRedirect role={role} />} />
          </Routes>
        </main>
        <footer style={{ padding: '2rem', textAlign: 'center', opacity: 0.5, fontSize: '0.875rem' }}>
          &copy; 2026 ECOMM LITE. Powered by Premium Design.
        </footer>
      </div>
    </Router>
  );
}

export default App;