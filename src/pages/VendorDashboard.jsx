import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Trash2, Store, CreditCard, Tag, Clock, Sparkles, Bell } from 'lucide-react';

const INR = (usd) => Math.round((usd || 0) * 83);

const VendorDashboard = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [expiryDays, setExpiryDays] = useState('5');
  const [vendorDetails, setVendorDetails] = useState({
    name: localStorage.getItem("vendorName") || '',
    shopName: '',
    phone: '',
    description: ''
  });
  const [vendorLocation, setVendorLocation] = useState('T Nagar');
  const [notifications, setNotifications] = useState([]);

  const chennaiLocations = [
    { name: "T Nagar", lat: 13.0418, lng: 80.2341 },
    { name: "Velachery", lat: 12.9755, lng: 80.2207 },
    { name: "Adyar", lat: 13.0012, lng: 80.2565 },
    { name: "Anna Nagar", lat: 13.0850, lng: 80.2101 },
    { name: "Tambaram", lat: 12.9249, lng: 80.1000 },
    { name: "Porur", lat: 13.0356, lng: 80.1582 },
    { name: "OMR", lat: 12.9165, lng: 80.2290 }
  ];

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("vendorProducts")) || [];
      setProducts(stored);
      
      const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
      setNotifications(allOrders); // reusing notifications state to hold orders for demo
    } catch {
      setProducts([]);
      setNotifications([]);
    }
  }, []);

  // 🔥 STEP 9: VENDOR COMPLETION BUTTON
  function completeOrder(id) {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    
    const updated = orders.map(o => 
      o.id === id ? { ...o, status: "delivered", progress: 100 } : o
    );
    
    localStorage.setItem("orders", JSON.stringify(updated));
    setNotifications(updated); // Sync state
  }

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!name || !price || !expiryDays) {
      alert("Please fill in all fields to rescue this inventory! 🌳");
      return;
    }

    try {
      const selectedLocation = chennaiLocations.find(l => l.name === vendorLocation) || chennaiLocations[0];
      
      const newProduct = {
        id: Date.now(),
        name,
        price: parseFloat(price),
        category,
        expiryDays: parseInt(expiryDays),
        ownerName: vendorDetails.name || 'Platform Store',
        shopName: vendorDetails.shopName,
        phone: vendorDetails.phone,
        vendorDescription: vendorDetails.description,
        location: selectedLocation,
        locationName: selectedLocation.name,
        description: "Fresh surplus stock from local vendors. High quality, nearing expiry for discounted pricing.",
        expiryDate: new Date(Date.now() + parseInt(expiryDays) * 86400000).toISOString(),
        discountPercentage: Math.floor(Math.random() * 30) + 20,
        createdAt: new Date().toISOString()
      };

      const existing = JSON.parse(localStorage.getItem("vendorProducts")) || [];
      const updated = [newProduct, ...existing];

      localStorage.setItem("vendorProducts", JSON.stringify(updated));
      localStorage.setItem("vendorName", vendorDetails.name);
      setProducts(updated);

      // Reset Form
      setName('');
      setPrice('');
      alert("Inventory shared successfully! It is now live in the marketplace. 🚀");
    } catch (err) {
      console.error(err);
      alert("Failed to sync inventory.");
    }
  };

  const deleteProduct = (id) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem("vendorProducts", JSON.stringify(updated));
  };

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1300px', margin: '0 auto' }}>
      <style>{`
        .notif-card {
          background: rgba(168, 85, 247, 0.1);
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 16px;
          padding: 1.25rem;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }
        .notif-card:hover {
          background: rgba(168, 85, 247, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(168, 85, 247, 0.2);
        }
      `}</style>
      <header style={{ marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '64px', height: '64px', background: 'var(--accent-gradient)', borderRadius: '18px', display: 'grid', placeItems: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>
          <Store size={32} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Vendor Dashboard</h1>
          <p style={{ color: 'var(--text-gray)' }}>Clearing surplus inventory to achieve zero waste</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 800 ? '1fr' : '380px 1fr 300px', gap: '2rem', alignItems: 'start' }}>

        {/* Upload Form */}
        <section className="glass-morphism" style={{ padding: '2rem', borderRadius: '32px', border: '1px solid var(--glass-border)', background: 'rgba(15, 23, 42, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <Plus size={24} color="var(--primary)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Share Surplus</h2>
          </div>

          <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: '700' }}>Inventory Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Organic Avocados"
                style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', outline: 'none' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: '700' }}>Rescue Price ($)</label>
                <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="4.50"
                  style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: '700' }}>Expiry (Days)</label>
                <input type="number" value={expiryDays} onChange={(e) => setExpiryDays(e.target.value)} placeholder="3"
                  style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', outline: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: '700' }}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'black', outline: 'none', cursor: 'pointer' }}>
                <option value="Groceries">Groceries</option>
                <option value="Electronics">Electronics</option>
                <option value="Essentials">Essentials</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: '700' }}>Vendor Name</label>
                <input value={vendorDetails.name} onChange={(e) => setVendorDetails({...vendorDetails, name: e.target.value})} placeholder="Owner Name"
                  style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: '700' }}>Shop Name</label>
                <input value={vendorDetails.shopName} onChange={(e) => setVendorDetails({...vendorDetails, shopName: e.target.value})} placeholder="ABC Store"
                  style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', outline: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: '700' }}>Pickup Location</label>
                <select value={vendorLocation} onChange={(e) => setVendorLocation(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'black', outline: 'none', cursor: 'pointer' }}>
                  {chennaiLocations.map(loc => (
                    <option key={loc.name} value={loc.name}>{loc.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: '700' }}>Phone Number</label>
                <input value={vendorDetails.phone} onChange={(e) => setVendorDetails({...vendorDetails, phone: e.target.value})} placeholder="+91 999..."
                  style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', outline: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: '700' }}>Shop Description (Optional)</label>
              <textarea value={vendorDetails.description} onChange={(e) => setVendorDetails({...vendorDetails, description: e.target.value})} placeholder="Tell users about your surplus items..."
                style={{ width: '100%', height: '80px', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', outline: 'none', resize: 'none' }} />
            </div>

            <button type="submit" className="btn-premium" style={{ height: '56px', marginTop: '1rem', background: 'var(--accent-gradient)', color: 'white', fontWeight: '800' }}>
              Publish Inventory 🚀
            </button>
          </form>
        </section>

        {/* Inventory List */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <Package size={24} color="var(--primary)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Your Live Surplus ({products.length})</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <AnimatePresence>
              {products.map((p, idx) => (
                <motion.div key={p.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: idx * 0.05 }}
                  style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '24px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', display: 'grid', placeItems: 'center' }}>
                    <Tag size={24} color="var(--primary)" />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{p.name}</h3>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-gray)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={12} />{p.expiryDays} days left</span>
                      <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: '700' }}>₹{INR(p.price)}</span>
                    </div>
                  </div>
                  <button onClick={() => deleteProduct(p.id)} style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.1)', border: 'none', color: '#fb7185', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {products.length === 0 && (
              <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.3 }}>
                <Sparkles size={48} style={{ marginBottom: '1rem' }} />
                <p>No inventory rescued yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Notifications */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <Bell size={24} color="#f43f5e" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Live Orders ({notifications.length})</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <AnimatePresence>
              {notifications.slice().map((n, idx) => (
                <motion.div key={n.id || idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className="notif-card">
                  <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'white', marginBottom: '0.25rem' }}>🛍 {n.productName || n.product || 'Items'}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                    Buyer: {n.buyerName || n.buyer || 'User'} 
                    {n.status && ` • Status: ${n.status.replace('_', ' ').toUpperCase()}`}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#f43f5e', fontWeight: '700', marginBottom: '0.5rem' }}>ID: {n.id || n.orderId}</p>
                  
                  {/* 🔥 STEP 9: VENDOR COMPLETION BUTTON */}
                  {n.status && n.status !== "delivered" && (
                    <button 
                      onClick={() => completeOrder(n.id)}
                      className="btn-premium"
                      style={{ fontSize: '0.8rem', padding: '6px 16px', background: '#4ade80', color: 'black', width: '100%' }}
                    >
                      Mark as Delivered
                    </button>
                  )}
                  {n.status === "delivered" && (
                    <span style={{ fontSize: '0.8rem', color: '#4ade80', fontWeight: '700' }}>✅ Completed</span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {notifications.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.3, background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                <p style={{ fontSize: '0.8rem' }}>No orders yet.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default VendorDashboard;
