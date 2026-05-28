import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store as StoreIcon, Package, ArrowLeft, ShoppingBag } from 'lucide-react';

const Store = () => {
  const { storeName } = useParams();
  
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const storeOrders = orders.filter(o => o.store === storeName);

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Back to History
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '56px', height: '56px', background: 'var(--accent-gradient)', borderRadius: '16px', display: 'grid', placeItems: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.3)' }}>
            <StoreIcon size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>{storeName}</h1>
        </div>
        <p style={{ color: 'var(--text-gray)', marginTop: '0.5rem' }}>Partner Dashboard • Direct Vendor Fulfillment</p>
      </header>

      {storeOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid var(--glass-border)' }}>
          <ShoppingBag size={48} style={{ opacity: 0.1, marginBottom: '1.5rem', color: 'white' }} />
          <p style={{ color: 'var(--text-gray)' }}>No active orders for this store.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {storeOrders.map((order, index) => (
            <motion.div 
              key={order.id} 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: index * 0.1 }}
              style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: '24px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}
            >
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <div>
                   <p style={{ fontSize: '0.7rem', color: 'var(--text-gray)', textTransform: 'uppercase' }}>ID: #{String(order.id).substring(0,8)}</p>
                   <p style={{ fontSize: '0.9rem', fontWeight: '700' }}>{order.date}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: '800', color: '#4ade80' }}>${(order.totalAmount || 0).toFixed(2)}</p>
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                      <img src={item.image} style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} />
                      <span style={{ fontSize: '0.85rem' }}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Store;
