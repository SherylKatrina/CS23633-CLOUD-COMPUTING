import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, User, Store, MapPin, ChevronLeft } from 'lucide-react';

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // Load initial order state
    const fetchOrder = () => {
      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      const currentOrder = orders.find(o => o.id === orderId);
      if (currentOrder) {
        setOrder(currentOrder);
        setTimeLeft(currentOrder.estimatedTime || 20);
      }
    };
    fetchOrder();
  }, [orderId]);

  // 🔥 STEP 3: PROGRESS SIMULATION
  useEffect(() => {
    if (!order || order.status === 'delivered') return;

    const interval = setInterval(() => {
      setOrder(prev => {
        if (!prev || prev.status === 'delivered') return prev;

        let newProgress = prev.progress + 10;
        let newStatus =
          newProgress < 30 ? "placed" :
          newProgress < 60 ? "accepted" :
          newProgress < 90 ? "out_for_delivery" :
          "delivered";

        const updated = {
          ...prev,
          progress: Math.min(newProgress, 100),
          status: newStatus
        };

        // Sync for vendor dashboard
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const updatedOrders = orders.map(o => o.id === updated.id ? updated : o);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));

        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [order?.status, order?.id]); // Restart interval if status changes but not on every tick for safety

  // 🔥 STEP 6: ETA TIMER
  useEffect(() => {
    if (!order || order.status === 'delivered') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(prev - 1, 0));
    }, 60000);

    return () => clearInterval(timer);
  }, [order?.status]);

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-gray)' }}>
        Loading order details... Let's make sure it's valid.
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto', minHeight: '80vh' }}>
      <button 
        onClick={() => navigate('/orders')} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginBottom: '2rem', fontWeight: 'bold' }}
      >
        <ChevronLeft size={20} /> Back to Orders
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium" 
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Package color="var(--primary)" size={32} /> 
          Track Your Order
        </h1>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', color: 'var(--text-gray)', fontSize: '0.9rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
            <strong>Order ID:</strong> <span style={{ color: 'white' }}>{order.id}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
            <strong>Item:</strong> <span style={{ color: 'white' }}>{order.productName}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
            <strong>Vendor:</strong> <span style={{ color: 'white' }}>{order.vendorName}</span>
          </div>
        </div>

        {/* 🔥 STEP 8: BUYER → VENDOR → DELIVERY FLOW & STEP 7: ROUTE VISUALIZATION */}
        <div style={{ position: 'relative', width: '100%', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
          {/* Base Track */}
          <div style={{ position: 'absolute', top: '50%', left: '5%', right: '5%', height: '4px', background: 'rgba(255,255,255,0.1)', transform: 'translateY(-50%)', borderRadius: '2px', zIndex: 0 }} />
          
          {/* Active Route Line */}
          <div style={{ position: 'absolute', top: '50%', left: '5%', width: `${Math.min(90, Math.max(0, order.progress - 5))}%`, height: '4px', transform: 'translateY(-50%)', overflow: 'hidden', borderRadius: '2px', zIndex: 1, transition: 'width 0.5s ease' }}>
             <div className="route-line" style={{ width: '100%' }} />
          </div>

          <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '45px', height: '45px', background: order.progress >= 0 ? 'var(--primary)' : 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: order.progress >= 0 ? '0 0 15px rgba(124, 58, 237, 0.4)' : 'none', transition: 'all 0.3s' }}>
              <User size={20} color="white" />
            </div>
            <span style={{ fontSize: '0.85rem', color: order.progress >= 0 ? 'white' : 'var(--text-gray)', fontWeight: '600' }}>Buyer</span>
          </div>

          <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '45px', height: '45px', background: order.progress >= 50 ? 'var(--primary)' : 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: order.progress >= 50 ? '0 0 15px rgba(124, 58, 237, 0.4)' : 'none', transition: 'all 0.3s' }}>
              <Store size={20} color="white" />
              {order.status === "out_for_delivery" && (
                <div className="moving-dot" style={{ position: 'absolute', width: '14px', height: '14px', background: '#fbbf24', borderRadius: '50%', right: '-30px', boxShadow: '0 0 10px #fbbf24' }} />
              )}
            </div>
            <span style={{ fontSize: '0.85rem', color: order.progress >= 50 ? 'white' : 'var(--text-gray)', fontWeight: '600' }}>Vendor</span>
          </div>

          <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '45px', height: '45px', background: order.progress >= 100 ? '#4ade80' : 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: order.progress >= 100 ? '0 0 15px rgba(74, 222, 128, 0.4)' : 'none', transition: 'all 0.3s' }}>
              <MapPin size={20} color="white" />
            </div>
            <span style={{ fontSize: '0.85rem', color: order.progress >= 100 ? 'white' : 'var(--text-gray)', fontWeight: '600' }}>Delivery</span>
          </div>
        </div>

        {/* 🔥 STEP 4: VISUAL PROGRESS BAR */}
        <div className="progress-bar" style={{ background: 'rgba(255,255,255,0.05)', height: '16px', borderRadius: '8px', overflow: 'hidden', marginBottom: '2rem', border: '1px solid var(--glass-border)' }}>
          <div
            className="progress-fill"
            style={{ 
              width: order.progress + "%", 
              height: '100%', 
              background: order.progress === 100 ? '#4ade80' : 'var(--accent-gradient)',
              boxShadow: order.progress === 100 ? '0 0 10px #4ade80' : 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* 🔥 STEP 5: STATUS DISPLAY */}
          <motion.h2 
            key={order.status}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: order.status === 'delivered' ? '#4ade80' : 'white' }}
          >
            {order.status === "placed" && "🛒 Order Placed"}
            {order.status === "accepted" && "🏪 Vendor Accepted"}
            {order.status === "out_for_delivery" && "🚚 On the Way"}
            {order.status === "delivered" && "✅ Delivered"}
          </motion.h2>
          
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'var(--text-gray)', fontSize: '0.9rem', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Estimated Arrival</p>
            {order.status === 'delivered' ? (
              <p style={{ fontSize: '1.8rem', fontWeight: '800', color: '#4ade80' }}>Arrived</p>
            ) : (
              <p style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fbbf24' }}>
                {timeLeft} <span style={{ fontSize: '1rem' }}>mins</span>
              </p>
            )}
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default TrackOrder;
