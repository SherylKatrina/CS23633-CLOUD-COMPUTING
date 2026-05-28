import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Store, CreditCard, ExternalLink, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getProductImage } from './Products';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(stored);
    } catch {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromCart = (productId) => {
    const updated = cartItems.filter(item => item.id !== productId);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // 🔥 FEATURE 2: GROUP CART BY STORE / VENDOR
  const groupByVendor = (items) => {
    return items.reduce((acc, item) => {
      const vendor = item.ownerName || "General Store";
      if (!acc[vendor]) acc[vendor] = [];
      acc[vendor].push(item);
      return acc;
    }, {});
  };

  const groupedCart = groupByVendor(cartItems);

  // 🔥 FEATURE 5: SMART VENDOR PRIORITY (Sort by lowest vendor total)
  const sortedVendors = Object.entries(groupedCart).sort(([, a], [, b]) => {
    const totalA = a.reduce((sum, item) => sum + item.price, 0);
    const totalB = b.reduce((sum, item) => sum + item.price, 0);
    return totalA - totalB;
  });

  const navigate = useNavigate();

  const handleStoreRedirect = (storeName) => {
    try {
      navigate(`/store/${storeName}`);
    } catch (err) {
      console.error("Navigation error:", err);
    }
  };

  // 🔥 FEATURE 6: VENDOR NOTIFICATION TRIGGER
  function notifyVendor(product) {
    try {
      const notifications = JSON.parse(localStorage.getItem("vendorNotifications")) || [];
      notifications.unshift({
        productName: product.name,
        owner: product.ownerName || "General Store",
        price: product.price,
        time: new Date().toISOString()
      });
      localStorage.setItem("vendorNotifications", JSON.stringify(notifications));
      console.log("Vendor notified:", product.ownerName);
    } catch (err) {
      console.error("Notification error:", err);
    }
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    try {
      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      const newOrders = [];
      
      sortedVendors.forEach(([store, items]) => {
        const total = items.reduce((sum, i) => sum + i.price, 0);
        const trackingId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const vendorOrder = {
          orderId: `VEN-${Date.now()}-${store.substring(0,3).toUpperCase()}`,
          id: trackingId,
          store,
          items,
          totalAmount: total,
          date: new Date().toLocaleString(),
          
          // Tracking Fields
          productName: items.length === 1 ? items[0].name : `${items.length} Rescued Items`,
          vendorName: store,
          buyerName: "User", // Fallback for simulation
          status: "placed", 
          createdAt: new Date().toISOString(),
          estimatedTime: 20,
          progress: 0
        };
        newOrders.unshift(vendorOrder);
        orders.unshift(vendorOrder);
      });

      // FIRE NOTIFICATIONS
      cartItems.forEach(item => notifyVendor(item));

      localStorage.setItem("orders", JSON.stringify(orders));
      localStorage.removeItem("cart");
      setCartItems([]);

      alert("Order placed! Vendor has been notified 📩");

      if (newOrders.length > 0) {
        // 🔥 STEP 10: AUTO NAVIGATION AFTER ORDER
        navigate(`/track/${newOrders[0].id}`);
      }
    } catch (err) {
      console.error("Checkout failed", err);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading your bag...</div>;

  const grandTotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ShoppingBag size={32} color="var(--primary)" />
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Multi-Vendor Bag</h1>
      </header>

      {cartItems.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
          <p style={{ color: 'var(--text-gray)', fontSize: '1.2rem', marginBottom: '2rem' }}>Your Bag is Empty.</p>
          <Link to="/" className="btn-premium" style={{ display: 'inline-flex', padding: '12px 32px', textDecoration: 'none' }}>Back to Marketplace</Link>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* 🔥 FEATURE 4: DISPLAY GROUPED STORE UI */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {sortedVendors.map(([store, items], vIdx) => (
              <div key={store} style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Store size={22} color="var(--primary)" />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{store}</h2>
                    {vIdx === 0 && (
                      <span style={{ fontSize: '0.7rem', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '4px 8px', borderRadius: '6px', fontWeight: '700' }}>
                        BEST VALUE VENDOR
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-gray)' }}>
                    {items.length} item(s) • Subtotal: ${items.reduce((s,i) => s+i.price, 0).toFixed(2)}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {items.map((item) => (
                    <motion.div key={item.id} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '18px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <img src={getProductImage(item)} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} onError={(e) => { e.target.src = "https://via.placeholder.com/300"; }} />
                      <div style={{ flexGrow: 1 }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>{item.name}</h3>
                        <p style={{ color: 'var(--text-gray)', fontSize: '0.8rem' }}>Rescued from waste</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '800', marginBottom: '0.25rem' }}>${item.price.toFixed(2)}</div>
                        <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <footer style={{ marginTop: '2rem', padding: '2.5rem', background: 'var(--accent-gradient)', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', position: 'sticky', bottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <div>
                <p style={{ opacity: 0.8, fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>ORDER TOTAL ({cartItems.length} ITEMS)</p>
                <h2 style={{ fontSize: '3rem', fontWeight: '800' }}>${grandTotal.toFixed(2)}</h2>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontSize: '0.85rem' }}>
                  <Zap size={14} /> Multi-Store Checkout Active
                </div>
              </div>
            </div>
            <button onClick={handleCheckout} className="btn-premium" style={{ width: '100%', height: '65px', background: 'white', color: 'black', fontSize: '1.2rem', fontWeight: '900', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
              Complete Multi-Store Checkout
            </button>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Cart;
