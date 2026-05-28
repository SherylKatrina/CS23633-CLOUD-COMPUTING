import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Zap, Timer, Store, Tag } from 'lucide-react';
import { getProductImage } from '../pages/Products';

const ProductModal = ({ product, isOpen, onClose, onAddToCart }) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ 
          position: 'fixed', inset: 0, zIndex: 2000, 
          display: 'flex', setItems: 'center', justifyContent: 'center', 
          padding: '2rem', backdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.7)' 
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{ 
              background: 'rgba(15, 23, 42, 0.95)', 
              border: '1px solid var(--glass-border)', 
              borderRadius: '32px', 
              maxWidth: '900px', 
              width: '100%', 
              overflow: 'hidden', 
              position: 'relative',
              boxShadow: '0 32px 64px rgba(0,0,0,0.8)',
              display: 'flex',
              flexDirection: window.innerWidth < 768 ? 'column' : 'row'
            }}
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              style={{ 
                position: 'absolute', top: '24px', right: '24px', zIndex: 10,
                background: 'rgba(255,255,255,0.05)', border: 'none', 
                width: '40px', height: '40px', borderRadius: '12px', color: 'white', 
                cursor: 'pointer', display: 'grid', placeItems: 'center' 
              }}
            >
              <X size={24} />
            </button>

            {/* Left side: Image */}
            <div style={{ width: window.innerWidth < 768 ? '100%' : '50%', height: '450px', position: 'relative' }}>
              <img 
                src={getProductImage(product)} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = "https://via.placeholder.com/300"; }}
              />
              <div style={{ 
                position: 'absolute', bottom: '24px', left: '24px', 
                background: 'var(--accent-gradient)', padding: '8px 16px', borderRadius: '14px',
                fontSize: '0.9rem', fontWeight: '800', boxShadow: '0 8px 16px rgba(0,0,0,0.4)'
              }}>
                SAVE {product.discountPercentage}%
              </div>
            </div>

            {/* Right side: Details */}
            <div style={{ width: window.innerWidth < 768 ? '100%' : '50%', padding: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '100%', overflowY: 'auto' }}>
              <div>
                <p style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Tag size={14} /> {product.category}
                </p>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1rem' }}>{product.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: '800', color: 'white' }}>${product.price}</span>
                  <span style={{ fontSize: '1.25rem', color: 'var(--text-gray)', textDecoration: 'line-through' }}>${product.originalPrice}</span>
                </div>
              </div>

              <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', background: 'var(--primary)', borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                  <Store size={24} />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-gray)', marginBottom: '2px' }}>Sold & Fulfilled by</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: '700' }}>{product.storeName}</p>
                </div>
              </div>

              <p style={{ color: 'var(--text-gray)', fontSize: '1rem', lineHeight: '1.7' }}>
                {product.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f87171', fontSize: '0.95rem', fontWeight: '600' }}>
                <Timer size={18} />
                <span>Urgent: Sustainability clearance expires on {new Date(product.expiryDate).toLocaleDateString()}</span>
              </div>

              <button 
                onClick={() => {
                  onAddToCart(product.id);
                  onClose();
                }}
                className="btn-premium" 
                style={{ height: '60px', fontSize: '1.1rem', marginTop: 'auto' }}
              >
                <ShoppingBag size={22} /> Claim this Surplus Item
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
