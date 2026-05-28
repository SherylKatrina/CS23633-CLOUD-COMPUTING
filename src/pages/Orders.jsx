import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Calendar, Store, ChevronRight, ShoppingBag, ExternalLink, Zap } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("orders")) || [];
      setOrders(stored);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-gray)' }}>Accessing vendor history...</div>;

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Package size={32} color="var(--primary)" />
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Multi-Vendor History</h1>
          <p style={{ color: 'var(--text-gray)' }}>Tracking your impact across partner stores</p>
        </div>
      </header>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid var(--glass-border)' }}>
          <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '1.5rem', color: 'white' }} />
          <p style={{ color: 'var(--text-gray)', fontSize: '1.2rem' }}>No vendor transactions found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {orders.map((order, index) => (
            <motion.div 
              key={order.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.1 }}
              style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: '24px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}
            >
              {/* Order Header */}
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                    <Store size={20} color="white" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase' }}>{order.store || order.ownerName}</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-gray)' }}>{order.orderId}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '4px' }}>Vendor Total</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: '800', color: '#4ade80' }}>${(order.totalAmount || 0).toFixed(2)}</p>
                </div>
              </div>
              
              {/* Order Items */}
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {order.items?.map((item, i) => (
                    <div key={`${order.id}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                      <img src={item?.image} alt={item?.name} style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }} />
                      <div style={{ flexGrow: 1 }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: '700' }}>{item?.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-gray)' }}>${(item?.price || 0).toFixed(2)}</p>
                      </div>
                      <ExternalLink size={16} style={{ opacity: 0.3 }} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Order Footer */}
              <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-gray)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <Calendar size={14} /> Purchased: {order.date}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24' }}>
                   <Zap size={14} fill="#fbbf24" /> {order.status || 'Vendor Synchronized'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
